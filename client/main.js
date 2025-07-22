import * as BABYLON from '@babylonjs/core';
import { io } from 'socket.io-client';
import { World } from './world.js';
import { Player } from './player.js';
import { Vehicle } from './vehicle.js';
import { VehicleLoader } from './vehicleLoader.js';
import { PlayerLoader } from './playerLoader.js';
import { Mission } from './mission.js';
import { UI } from './ui.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null;
        this.socket = null;
        
        this.world = null;
        this.player = null;
        this.vehicleLoader = null;
        this.playerLoader = null;
        this.vehicles = new Map();
        this.otherPlayers = new Map();
        this.npcs = new Map();
        this.missions = new Map();
        this.ui = null;
        
        this.isConnected = false;
        this.lastFrameTime = 0;
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize Socket.IO
            this.socket = io('http://localhost:3001');
            this.setupSocketHandlers();
            
            // Initialize Babylon.js scene
            this.scene = new BABYLON.Scene(this.engine);
            this.setupScene();
            
            // Initialize game components
            this.world = new World(this.scene);
            this.vehicleLoader = new VehicleLoader(this.scene);
            this.playerLoader = new PlayerLoader(this.scene);
            this.player = new Player(this.scene, this.socket, this.playerLoader);
            this.ui = new UI();
            
            // Make game instance globally accessible
            window.game = this;
            
            // Start render loop
            this.engine.runRenderLoop(() => {
                this.render();
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            // Hide loading screen
            document.getElementById('loading').classList.add('hidden');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
    
    setupScene() {
        // Create camera
        this.camera = new BABYLON.FollowCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.radius = 10;
        this.camera.heightOffset = 3;
        this.camera.rotationOffset = 0;
        this.camera.cameraAcceleration = 0.05;
        this.camera.maxCameraSpeed = 10;
        
        // Create lighting
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        
        const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), this.scene);
        dirLight.position = new BABYLON.Vector3(20, 40, 20);
        dirLight.intensity = 0.5;
        
        // Enable physics
        this.scene.enablePhysics();
        
        // Add fog for atmosphere
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        this.scene.fogDensity = 0.01;
        this.scene.fogColor = new BABYLON.Color3(0.5, 0.6, 0.7);
    }
    
    setupSocketHandlers() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
        });
        
        this.socket.on('gameState', (data) => {
            this.handleGameState(data);
        });
        
        this.socket.on('playerJoined', (player) => {
            this.addOtherPlayer(player);
        });
        
        this.socket.on('playerLeft', (playerId) => {
            this.removeOtherPlayer(playerId);
        });
        
        this.socket.on('playerMoved', (data) => {
            this.updateOtherPlayer(data);
        });
        
        this.socket.on('vehicleEntered', (data) => {
            this.handleVehicleEntered(data);
        });
        
        this.socket.on('vehicleExited', (data) => {
            this.handleVehicleExited(data);
        });
        
        this.socket.on('vehicleMoved', (data) => {
            this.updateVehicle(data);
        });
        
        this.socket.on('missionStarted', (mission) => {
            this.ui.showNotification(`Mission started: ${mission.title}`);
        });
        
        this.socket.on('missionCompleted', (reward) => {
            this.ui.showNotification(`Mission completed! Reward: $${reward}`);
        });
        
        this.socket.on('gameUpdate', (data) => {
            this.updateNPCs(data.npcs);
        });
    }
    
    handleGameState(data) {
        // Initialize vehicles
        data.vehicles.forEach(vehicleData => {
            const vehicle = new Vehicle(this.scene, vehicleData, this.vehicleLoader);
            this.vehicles.set(vehicleData.id, vehicle);
        });
        
        // Initialize NPCs
        data.npcs.forEach(npcData => {
            this.addNPC(npcData);
        });
        
        // Initialize missions
        data.missions.forEach(missionData => {
            const mission = new Mission(this.scene, missionData);
            this.missions.set(missionData.id, mission);
        });
        
        // Initialize other players
        data.players.forEach(playerData => {
            if (playerData.id !== this.socket.id) {
                this.addOtherPlayer(playerData);
            }
        });
    }
    
    addOtherPlayer(playerData) {
        const playerMesh = BABYLON.MeshBuilder.CreateBox('player_' + playerData.id, { height: 2, width: 1, depth: 1 }, this.scene);
        playerMesh.position = new BABYLON.Vector3(playerData.position.x, playerData.position.y, playerData.position.z);
        playerMesh.rotation.y = playerData.rotation.y;
        
        const playerMaterial = new BABYLON.StandardMaterial('playerMat_' + playerData.id, this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        playerMesh.material = playerMaterial;
        
        this.otherPlayers.set(playerData.id, {
            mesh: playerMesh,
            data: playerData
        });
    }
    
    removeOtherPlayer(playerId) {
        const player = this.otherPlayers.get(playerId);
        if (player) {
            player.mesh.dispose();
            this.otherPlayers.delete(playerId);
        }
    }
    
    updateOtherPlayer(data) {
        const player = this.otherPlayers.get(data.id);
        if (player) {
            player.mesh.position = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
            player.mesh.rotation.y = data.rotation.y;
            player.data.position = data.position;
            player.data.rotation = data.rotation;
        }
    }
    
    addNPC(npcData) {
        const npcMesh = BABYLON.MeshBuilder.CreateBox('npc_' + npcData.id, { height: 2, width: 1, depth: 1 }, this.scene);
        npcMesh.position = new BABYLON.Vector3(npcData.position.x, npcData.position.y, npcData.position.z);
        npcMesh.rotation.y = npcData.rotation.y;
        
        const npcMaterial = new BABYLON.StandardMaterial('npcMat_' + npcData.id, this.scene);
        npcMaterial.diffuseColor = npcData.type === 'police' ? new BABYLON.Color3(0, 0, 1) : new BABYLON.Color3(0.5, 0.5, 0.5);
        npcMesh.material = npcMaterial;
        
        this.npcs.set(npcData.id, {
            mesh: npcMesh,
            data: npcData
        });
    }
    
    updateNPCs(npcsData) {
        npcsData.forEach(npcData => {
            const npc = this.npcs.get(npcData.id);
            if (npc) {
                npc.mesh.position = new BABYLON.Vector3(npcData.position.x, npcData.position.y, npcData.position.z);
                npc.mesh.rotation.y = npcData.rotation.y;
                npc.data = npcData;
            }
        });
    }
    
    handleVehicleEntered(data) {
        if (data.playerId === this.socket.id) {
            this.player.enterVehicle(data.vehicleId);
        }
    }
    
    handleVehicleExited(data) {
        if (data.playerId === this.socket.id) {
            this.player.exitVehicle();
        }
    }
    
    updateVehicle(data) {
        const vehicle = this.vehicles.get(data.vehicleId);
        if (vehicle) {
            vehicle.updatePosition(data.position, data.rotation);
        }
    }
    
    render() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update player
        if (this.player) {
            this.player.update();
        }
        
        // Update vehicles
        this.vehicles.forEach(vehicle => {
            vehicle.update();
        });
        
        // Update missions
        this.missions.forEach(mission => {
            if (this.player && this.player.mesh) {
                mission.update(this.player.mesh.position);
            }
        });
        
        // Update FPS counter
        this.ui.updateFPS(Math.round(1000 / deltaTime));
        
        // Update player count
        this.ui.updatePlayerCount(this.otherPlayers.size + 1);
        
        // Update minimap
        if (this.player && this.player.mesh) {
            this.ui.updateMinimap(this.player.mesh.position, this.vehicles, this.missions);
        }
        
        this.scene.render();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 