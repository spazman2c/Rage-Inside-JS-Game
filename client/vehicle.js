import * as BABYLON from '@babylonjs/core';
import { VehicleLoader } from './vehicleLoader.js';

export class Vehicle {
    constructor(scene, vehicleData, vehicleLoader = null) {
        this.scene = scene;
        this.data = vehicleData;
        this.vehicleLoader = vehicleLoader;
        this.mesh = null;
        this.physicsImpostor = null;
        this.engine = null;
        this.wheels = [];
        this.controls = {};
        this.speed = 0;
        this.maxSpeed = 50;
        this.acceleration = 0.5;
        this.braking = 0.8;
        this.turnSpeed = 0.03;
        this.lastPosition = { x: 0, y: 0, z: 0 };
        this.lastRotation = { y: 0 };
        this.vehicleInstance = null;
        
        this.init();
    }
    
    async init() {
        if (this.vehicleLoader) {
            await this.createRealisticVehicle();
        } else {
            this.createVehicleMesh();
        }
        this.setupPhysics();
        this.setupControls();
    }
    
    async createRealisticVehicle() {
        // Determine vehicle type based on data or random selection
        const vehicleTypes = this.vehicleLoader.getAvailableTypes();
        const vehicleType = this.data.type || vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        
        // Create vehicle instance using the loader
        this.vehicleInstance = this.vehicleLoader.createVehicleInstance(
            vehicleType,
            { x: this.data.position.x, y: this.data.position.y + 0.75, z: this.data.position.z },
            { y: this.data.rotation.y }
        );
        
        if (this.vehicleInstance) {
            this.mesh = this.vehicleInstance.rootMesh;
            this.wheels = this.vehicleInstance.wheels || [];
            this.physicsImpostor = this.vehicleInstance.physicsImpostor;
        } else {
            // Fallback to simple mesh
            this.createVehicleMesh();
        }
    }
    
    createVehicleMesh() {
        // Create vehicle body
        this.mesh = BABYLON.MeshBuilder.CreateBox(
            `vehicle_${this.data.id}`,
            { width: 2, height: 1.5, depth: 4 },
            this.scene
        );
        
        this.mesh.position = new BABYLON.Vector3(
            this.data.position.x,
            this.data.position.y + 0.75,
            this.data.position.z
        );
        this.mesh.rotation.y = this.data.rotation.y;
        
        // Create vehicle material
        const vehicleMaterial = new BABYLON.StandardMaterial(`vehicleMat_${this.data.id}`, this.scene);
        vehicleMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
        this.mesh.material = vehicleMaterial;
        
        // Create wheels
        this.createWheels();
    }
    
    createWheels() {
        const wheelPositions = [
            { x: -0.8, y: -0.5, z: -1.5 }, // Front left
            { x: 0.8, y: -0.5, z: -1.5 },  // Front right
            { x: -0.8, y: -0.5, z: 1.5 },  // Back left
            { x: 0.8, y: -0.5, z: 1.5 }    // Back right
        ];
        
        wheelPositions.forEach((pos, index) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
                `wheel_${this.data.id}_${index}`,
                { height: 0.3, diameter: 0.8 },
                this.scene
            );
            
            wheel.position = new BABYLON.Vector3(
                this.mesh.position.x + pos.x,
                this.mesh.position.y + pos.y,
                this.mesh.position.z + pos.z
            );
            wheel.rotation.z = Math.PI / 2;
            
            const wheelMaterial = new BABYLON.StandardMaterial(`wheelMat_${this.data.id}_${index}`, this.scene);
            wheelMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            wheel.material = wheelMaterial;
            
            this.wheels.push(wheel);
        });
    }
    
    setupPhysics() {
        // Add physics to vehicle body
        this.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1000, restitution: 0.3, friction: 0.8 },
            this.scene
        );
        
        // Add physics to wheels
        this.wheels.forEach(wheel => {
            wheel.physicsImpostor = new BABYLON.PhysicsImpostor(
                wheel,
                BABYLON.PhysicsImpostor.CylinderImpostor,
                { mass: 50, restitution: 0.3, friction: 0.8 },
                this.scene
            );
        });
    }
    
    setupControls() {
        // Initialize control states
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            brake: false
        };
        
        // Keyboard event listeners for vehicle controls
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }
    
    handleKeyDown(event) {
        if (!this.isPlayerDriving()) return;
        
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.controls.backward = true; // Swapped with S
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.controls.forward = true; // Swapped with W
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.controls.right = true; // Swapped with D
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.controls.left = true; // Swapped with A
                break;
            case 'Space':
                this.controls.brake = true;
                break;
        }
    }
    
    handleKeyUp(event) {
        if (!this.isPlayerDriving()) return;
        
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.controls.backward = false; // Swapped with S
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.controls.forward = false; // Swapped with W
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.controls.right = false; // Swapped with D
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.controls.left = false; // Swapped with A
                break;
            case 'Space':
                this.controls.brake = false;
                break;
        }
    }
    
    isPlayerDriving() {
        // Check if the current player is driving this vehicle
        return this.data.driver && this.data.driver === window.game?.socket?.id;
    }
    
    update() {
        if (!this.mesh) return;
        
        if (this.isPlayerDriving()) {
            this.handleDriving();
        }
        
        this.updateWheels();
        this.syncPosition();
    }
    
    handleDriving() {
        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
        
        // Handle acceleration
        if (this.controls.forward) {
            this.speed = Math.min(this.speed + this.acceleration * deltaTime * 60, this.maxSpeed);
        } else if (this.controls.backward) {
            this.speed = Math.max(this.speed - this.acceleration * deltaTime * 60, -this.maxSpeed / 2);
        } else {
            // Natural deceleration
            this.speed *= 0.95;
        }
        
        // Handle braking
        if (this.controls.brake) {
            this.speed *= this.braking;
        }
        
        // Handle steering
        if (this.controls.left) {
            this.mesh.rotation.y += this.turnSpeed * deltaTime * 60 * Math.sign(this.speed);
        }
        if (this.controls.right) {
            this.mesh.rotation.y -= this.turnSpeed * deltaTime * 60 * Math.sign(this.speed);
        }
        
        // Apply movement
        if (Math.abs(this.speed) > 0.1) {
            const forward = this.mesh.forward.scale(this.speed * deltaTime * 60);
            this.mesh.position.addInPlace(forward);
        }
        
        // Apply gravity and ground collision
        if (this.mesh.position.y > 0.75) {
            this.mesh.position.y -= 0.1;
        } else {
            this.mesh.position.y = 0.75;
        }
    }
    
    updateWheels() {
        if (this.vehicleInstance && this.vehicleLoader) {
            // Use the vehicle loader's wheel update method
            this.vehicleLoader.updateWheels(this.vehicleInstance, this.speed);
        } else {
            // Fallback wheel update for simple meshes
            const wheelPositions = [
                { x: -0.8, y: -0.5, z: -1.5 },
                { x: 0.8, y: -0.5, z: -1.5 },
                { x: -0.8, y: -0.5, z: 1.5 },
                { x: 0.8, y: -0.5, z: 1.5 }
            ];
            
            this.wheels.forEach((wheel, index) => {
                const pos = wheelPositions[index];
                wheel.position = new BABYLON.Vector3(
                    this.mesh.position.x + pos.x,
                    this.mesh.position.y + pos.y,
                    this.mesh.position.z + pos.z
                );
                wheel.rotation.y = this.mesh.rotation.y;
                
                // Rotate wheels based on speed
                if (Math.abs(this.speed) > 0.1) {
                    wheel.rotation.z += this.speed * 0.1;
                }
            });
        }
    }
    
    syncPosition() {
        if (!this.mesh) return;
        
        const currentPosition = {
            x: this.mesh.position.x,
            y: this.mesh.position.y,
            z: this.mesh.position.z
        };
        
        const currentRotation = {
            y: this.mesh.rotation.y
        };
        
        // Check if position has changed significantly
        const positionChanged = 
            Math.abs(currentPosition.x - this.lastPosition.x) > 0.1 ||
            Math.abs(currentPosition.y - this.lastPosition.y) > 0.1 ||
            Math.abs(currentPosition.z - this.lastPosition.z) > 0.1;
        
        const rotationChanged = Math.abs(currentRotation.y - this.lastRotation.y) > 0.01;
        
        if (positionChanged || rotationChanged) {
            this.lastPosition = currentPosition;
            this.lastRotation = currentRotation;
            
            // Send position update to server
            if (window.game?.socket) {
                window.game.socket.emit('vehicleMove', {
                    vehicleId: this.data.id,
                    position: currentPosition,
                    rotation: currentRotation
                });
            }
        }
    }
    
    updatePosition(position, rotation) {
        if (!this.mesh) return;
        
        this.mesh.position = new BABYLON.Vector3(position.x, position.y, position.z);
        this.mesh.rotation.y = rotation.y;
        
        this.lastPosition = position;
        this.lastRotation = rotation;
    }
    
    setDriver(driverId) {
        this.data.driver = driverId;
        this.data.occupied = !!driverId;
    }
    
    getPosition() {
        return this.mesh ? this.mesh.position : new BABYLON.Vector3(0, 0, 0);
    }
    
    getSpeed() {
        return this.speed;
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    destroy() {
        if (this.mesh) {
            this.mesh.dispose();
        }
        
        this.wheels.forEach(wheel => {
            if (wheel) {
                wheel.dispose();
            }
        });
    }
} 