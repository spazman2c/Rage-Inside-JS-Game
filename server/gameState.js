class GameState {
    constructor() {
        this.players = new Map();
        this.vehicles = new Map();
        this.npcs = new Map();
        this.missions = new Map();
        this.nextId = 1;
        
        this.initializeWorld();
    }
    
    initializeWorld() {
        // Generate random vehicles
        const vehicleTypes = ['sedan', 'sports', 'suv', 'truck', 'police', 'taxi'];
        for (let i = 0; i < 20; i++) {
            const vehicle = {
                id: `vehicle_${this.nextId++}`,
                type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
                position: {
                    x: (Math.random() - 0.5) * 1000,
                    y: 0,
                    z: (Math.random() - 0.5) * 1000
                },
                rotation: { y: Math.random() * Math.PI * 2 },
                occupied: false,
                driver: null
            };
            this.vehicles.set(vehicle.id, vehicle);
        }
        
        // Generate NPCs
        for (let i = 0; i < 50; i++) {
            const npc = {
                id: `npc_${this.nextId++}`,
                type: Math.random() > 0.8 ? 'police' : 'civilian',
                position: {
                    x: (Math.random() - 0.5) * 1000,
                    y: 0,
                    z: (Math.random() - 0.5) * 1000
                },
                rotation: { y: Math.random() * Math.PI * 2 },
                state: 'idle',
                target: null,
                lastUpdate: Date.now()
            };
            this.npcs.set(npc.id, npc);
        }
        
        // Generate missions
        for (let i = 0; i < 10; i++) {
            const mission = {
                id: `mission_${this.nextId++}`,
                type: ['delivery', 'chase', 'theft'][Math.floor(Math.random() * 3)],
                title: `Mission ${i + 1}`,
                description: `Complete this mission for rewards`,
                position: {
                    x: (Math.random() - 0.5) * 1000,
                    y: 0,
                    z: (Math.random() - 0.5) * 1000
                },
                reward: Math.floor(Math.random() * 1000) + 100,
                status: 'available',
                assignedTo: null
            };
            this.missions.set(mission.id, mission);
        }
    }
    
    addPlayer(socketId) {
        const playerTypes = ['male', 'female', 'police', 'civilian'];
        const player = {
            id: socketId,
            type: 'male', // Default to male to use the Animation_Walking_withSkin model
            position: {
                x: (Math.random() - 0.5) * 100,
                y: 0,
                z: (Math.random() - 0.5) * 100
            },
            rotation: { y: 0 },
            inVehicle: false,
            currentVehicle: null,
            missions: [],
            money: 1000
        };
        
        this.players.set(socketId, player);
        return player;
    }
    
    removePlayer(socketId) {
        // Exit vehicle if in one
        const player = this.players.get(socketId);
        if (player && player.inVehicle) {
            this.exitVehicle(socketId);
        }
        
        this.players.delete(socketId);
    }
    
    updatePlayerPosition(socketId, position, rotation) {
        const player = this.players.get(socketId);
        if (player) {
            player.position = position;
            player.rotation = rotation;
        }
    }
    
    enterVehicle(socketId, vehicleId) {
        const player = this.players.get(socketId);
        const vehicle = this.vehicles.get(vehicleId);
        
        if (!player || !vehicle || vehicle.occupied) {
            return { success: false, message: 'Vehicle not available' };
        }
        
        // Check if player is close enough to vehicle
        const distance = Math.sqrt(
            Math.pow(player.position.x - vehicle.position.x, 2) +
            Math.pow(player.position.z - vehicle.position.z, 2)
        );
        
        if (distance > 5) {
            return { success: false, message: 'Too far from vehicle' };
        }
        
        vehicle.occupied = true;
        vehicle.driver = socketId;
        player.inVehicle = true;
        player.currentVehicle = vehicleId;
        
        return { success: true };
    }
    
    exitVehicle(socketId) {
        const player = this.players.get(socketId);
        if (!player || !player.inVehicle) {
            return { success: false, message: 'Not in vehicle' };
        }
        
        const vehicle = this.vehicles.get(player.currentVehicle);
        if (vehicle) {
            vehicle.occupied = false;
            vehicle.driver = null;
        }
        
        player.inVehicle = false;
        const vehicleId = player.currentVehicle;
        player.currentVehicle = null;
        
        return { success: true, vehicleId };
    }
    
    updateVehiclePosition(vehicleId, position, rotation) {
        const vehicle = this.vehicles.get(vehicleId);
        if (vehicle) {
            vehicle.position = position;
            vehicle.rotation = rotation;
        }
    }
    
    startMission(socketId, missionId) {
        const player = this.players.get(socketId);
        const mission = this.missions.get(missionId);
        
        if (!player || !mission || mission.status !== 'available') {
            return { success: false, message: 'Mission not available' };
        }
        
        // Check if player is close enough to mission
        const distance = Math.sqrt(
            Math.pow(player.position.x - mission.position.x, 2) +
            Math.pow(player.position.z - mission.position.z, 2)
        );
        
        if (distance > 10) {
            return { success: false, message: 'Too far from mission' };
        }
        
        mission.status = 'in_progress';
        mission.assignedTo = socketId;
        player.missions.push(missionId);
        
        return { success: true, mission };
    }
    
    completeMission(socketId, missionId) {
        const player = this.players.get(socketId);
        const mission = this.missions.get(missionId);
        
        if (!player || !mission || mission.assignedTo !== socketId) {
            return { success: false, message: 'Mission not assigned to player' };
        }
        
        mission.status = 'completed';
        player.money += mission.reward;
        
        // Remove mission from player's list
        const missionIndex = player.missions.indexOf(missionId);
        if (missionIndex > -1) {
            player.missions.splice(missionIndex, 1);
        }
        
        return { success: true, reward: mission.reward };
    }
    
    update() {
        // Update NPC behavior
        this.npcs.forEach(npc => {
            const now = Date.now();
            if (now - npc.lastUpdate > 5000) { // Update every 5 seconds
                npc.lastUpdate = now;
                
                // Simple AI: random movement
                if (Math.random() < 0.3) {
                    npc.position.x += (Math.random() - 0.5) * 10;
                    npc.position.z += (Math.random() - 0.5) * 10;
                    npc.rotation.y = Math.random() * Math.PI * 2;
                }
            }
        });
    }
    
    getPlayers() {
        return Array.from(this.players.values());
    }
    
    getVehicles() {
        return Array.from(this.vehicles.values());
    }
    
    getNPCs() {
        return Array.from(this.npcs.values());
    }
    
    getMissions() {
        return Array.from(this.missions.values());
    }
}

module.exports = GameState; 