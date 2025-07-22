import * as BABYLON from '@babylonjs/core';

export class Player {
    constructor(scene, socket) {
        this.scene = scene;
        this.socket = socket;
        this.mesh = null;
        this.camera = null;
        this.controls = {};
        this.movementSpeed = 0.2;
        this.rotationSpeed = 0.05;
        this.inVehicle = false;
        this.currentVehicle = null;
        this.lastPosition = { x: 0, y: 0, z: 0 };
        this.lastRotation = { y: 0 };
        
        this.init();
    }
    
    init() {
        this.createPlayerMesh();
        this.setupControls();
        this.setupCamera();
    }
    
    createPlayerMesh() {
        // Create player character
        this.mesh = BABYLON.MeshBuilder.CreateBox('player', { height: 2, width: 1, depth: 1 }, this.scene);
        this.mesh.position = new BABYLON.Vector3(0, 1, 0);
        this.mesh.rotation = new BABYLON.Vector3(0, 0, 0); // Ensure correct initial rotation
        
        // Create player material
        const playerMaterial = new BABYLON.StandardMaterial('playerMat', this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.mesh.material = playerMaterial;
        
        // Add physics to player
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.9 },
            this.scene
        );
    }
    
    setupControls() {
        // Initialize control states
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            enterVehicle: false,
            exitVehicle: false
        };
        
        // Keyboard event listeners
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }
    
    handleKeyDown(event) {
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
                this.controls.jump = true;
                break;
            case 'KeyE':
                this.controls.enterVehicle = true;
                break;
            case 'KeyF':
                this.controls.exitVehicle = true;
                break;
        }
    }
    
    handleKeyUp(event) {
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
                this.controls.jump = false;
                break;
            case 'KeyE':
                this.controls.enterVehicle = false;
                break;
            case 'KeyF':
                this.controls.exitVehicle = false;
                break;
        }
    }
    
    setupCamera() {
        // Get the camera from the scene
        this.camera = this.scene.getCameraByName('camera');
        if (this.camera) {
            this.camera.lockedTarget = this.mesh;
        }
    }
    
    update() {
        if (!this.mesh || this.inVehicle) return;
        
        this.handleMovement();
        this.handleVehicleInteraction();
        this.syncPosition();
    }
    
    handleMovement() {
        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
        const moveSpeed = this.movementSpeed * deltaTime * 60;
        const rotSpeed = this.rotationSpeed * deltaTime * 60;
        
        let moved = false;
        
        // Handle rotation
        if (this.controls.left) {
            this.mesh.rotation.y += rotSpeed;
            moved = true;
        }
        if (this.controls.right) {
            this.mesh.rotation.y -= rotSpeed;
            moved = true;
        }
        
        // Handle movement
        if (this.controls.forward) {
            // Move in the direction the player is facing
            const forward = this.mesh.forward.scale(moveSpeed);
            this.mesh.position.addInPlace(forward);
            moved = true;
        }
        if (this.controls.backward) {
            // Move opposite to the direction the player is facing
            const backward = this.mesh.forward.scale(-moveSpeed);
            this.mesh.position.addInPlace(backward);
            moved = true;
        }
        
        // Handle jumping
        if (this.controls.jump && this.mesh.position.y <= 1.1) {
            this.mesh.physicsImpostor.applyImpulse(
                new BABYLON.Vector3(0, 10, 0),
                this.mesh.getAbsolutePosition()
            );
        }
        
        // Apply gravity
        if (this.mesh.position.y > 1) {
            this.mesh.position.y -= 0.1;
        } else {
            this.mesh.position.y = 1;
        }
    }
    
    handleVehicleInteraction() {
        if (this.controls.enterVehicle && !this.inVehicle) {
            this.tryEnterVehicle();
        }
        
        if (this.controls.exitVehicle && this.inVehicle) {
            this.exitVehicle();
        }
    }
    
    tryEnterVehicle() {
        // Find nearby vehicles
        const nearbyVehicles = this.findNearbyVehicles();
        
        if (nearbyVehicles.length > 0) {
            const closestVehicle = nearbyVehicles[0];
            this.socket.emit('enterVehicle', closestVehicle.id);
        }
    }
    
    findNearbyVehicles() {
        // This would need to be implemented with access to the vehicles list
        // For now, we'll return an empty array
        return [];
    }
    
    enterVehicle(vehicleId) {
        this.inVehicle = true;
        this.currentVehicle = vehicleId;
        
        // Hide player mesh
        if (this.mesh) {
            this.mesh.setEnabled(false);
        }
        
        // Switch camera to vehicle view
        this.setupVehicleCamera();
    }
    
    exitVehicle() {
        this.inVehicle = false;
        this.currentVehicle = null;
        
        // Show player mesh
        if (this.mesh) {
            this.mesh.setEnabled(true);
        }
        
        // Switch back to player camera
        this.setupCamera();
        
        this.socket.emit('exitVehicle');
    }
    
    setupVehicleCamera() {
        // Adjust camera for vehicle view
        if (this.camera) {
            this.camera.radius = 15;
            this.camera.heightOffset = 5;
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
            this.socket.emit('playerMove', {
                position: currentPosition,
                rotation: currentRotation
            });
        }
    }
    
    getPosition() {
        return this.mesh ? this.mesh.position : new BABYLON.Vector3(0, 0, 0);
    }
    
    setPosition(position) {
        if (this.mesh) {
            this.mesh.position = new BABYLON.Vector3(position.x, position.y, position.z);
        }
    }
    
    getRotation() {
        return this.mesh ? this.mesh.rotation : new BABYLON.Vector3(0, 0, 0);
    }
    
    setRotation(rotation) {
        if (this.mesh) {
            this.mesh.rotation = new BABYLON.Vector3(rotation.x || 0, rotation.y || 0, rotation.z || 0);
        }
    }
} 