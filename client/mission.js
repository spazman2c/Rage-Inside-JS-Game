import * as BABYLON from '@babylonjs/core';

export class Mission {
    constructor(scene, missionData) {
        this.scene = scene;
        this.data = missionData;
        this.mesh = null;
        this.marker = null;
        this.interactionRange = 10;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.createMissionMarker();
        this.createInteractionZone();
    }
    
    createMissionMarker() {
        // Create mission marker (floating icon)
        this.mesh = BABYLON.MeshBuilder.CreateCylinder(
            `mission_${this.data.id}`,
            { height: 0.1, diameter: 2 },
            this.scene
        );
        
        this.mesh.position = new BABYLON.Vector3(
            this.data.position.x,
            this.data.position.y + 5,
            this.data.position.z
        );
        
        // Create material based on mission type
        const markerMaterial = new BABYLON.StandardMaterial(`missionMat_${this.data.id}`, this.scene);
        
        switch (this.data.type) {
            case 'delivery':
                markerMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // Green
                break;
            case 'chase':
                markerMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
                break;
            case 'theft':
                markerMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow
                break;
            default:
                markerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue
        }
        
        markerMaterial.emissiveColor = markerMaterial.diffuseColor;
        markerMaterial.emissiveIntensity = 0.3;
        this.mesh.material = markerMaterial;
        
        // Add floating animation
        this.addFloatingAnimation();
    }
    
    createInteractionZone() {
        // Create invisible interaction zone
        this.interactionZone = BABYLON.MeshBuilder.CreateSphere(
            `interaction_${this.data.id}`,
            { diameter: this.interactionRange * 2 },
            this.scene
        );
        
        this.interactionZone.position = new BABYLON.Vector3(
            this.data.position.x,
            this.data.position.y,
            this.data.position.z
        );
        
        // Make it invisible
        this.interactionZone.setEnabled(false);
    }
    
    addFloatingAnimation() {
        // Create floating animation
        const animation = new BABYLON.Animation(
            `missionFloat_${this.data.id}`,
            'position.y',
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        
        const keyFrames = [];
        keyFrames.push({
            frame: 0,
            value: this.mesh.position.y
        });
        keyFrames.push({
            frame: 30,
            value: this.mesh.position.y + 2
        });
        keyFrames.push({
            frame: 60,
            value: this.mesh.position.y
        });
        
        animation.setKeys(keyFrames);
        this.mesh.animations.push(animation);
        
        // Start the animation
        this.scene.beginAnimation(this.mesh, 0, 60, true);
    }
    
    update(playerPosition) {
        if (!this.mesh || this.data.status !== 'available') return;
        
        // Check if player is in interaction range
        const distance = BABYLON.Vector3.Distance(
            playerPosition,
            new BABYLON.Vector3(this.data.position.x, this.data.position.y, this.data.position.z)
        );
        
        if (distance <= this.interactionRange) {
            this.showInteractionPrompt();
        } else {
            this.hideInteractionPrompt();
        }
    }
    
    showInteractionPrompt() {
        if (!this.isActive) {
            this.isActive = true;
            
            // Create interaction prompt
            this.createInteractionPrompt();
            
            // Add keyboard listener for interaction
            this.setupInteractionListener();
        }
    }
    
    hideInteractionPrompt() {
        if (this.isActive) {
            this.isActive = false;
            
            // Remove interaction prompt
            this.removeInteractionPrompt();
            
            // Remove keyboard listener
            this.removeInteractionListener();
        }
    }
    
    createInteractionPrompt() {
        // Create 3D text for interaction prompt
        const promptMesh = BABYLON.MeshBuilder.CreatePlane(
            `prompt_${this.data.id}`,
            { width: 4, height: 1 },
            this.scene
        );
        
        promptMesh.position = new BABYLON.Vector3(
            this.data.position.x,
            this.data.position.y + 8,
            this.data.position.z
        );
        
        // Make it face the camera
        promptMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        
        // Create material with text
        const promptMaterial = new BABYLON.StandardMaterial(`promptMat_${this.data.id}`, this.scene);
        promptMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        promptMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        promptMesh.material = promptMaterial;
        
        this.interactionPrompt = promptMesh;
    }
    
    removeInteractionPrompt() {
        if (this.interactionPrompt) {
            this.interactionPrompt.dispose();
            this.interactionPrompt = null;
        }
    }
    
    setupInteractionListener() {
        this.interactionKeyHandler = (event) => {
            if (event.code === 'KeyE') {
                this.startMission();
            }
        };
        
        document.addEventListener('keydown', this.interactionKeyHandler);
    }
    
    removeInteractionListener() {
        if (this.interactionKeyHandler) {
            document.removeEventListener('keydown', this.interactionKeyHandler);
            this.interactionKeyHandler = null;
        }
    }
    
    startMission() {
        // Emit mission start event
        if (window.game && window.game.socket) {
            window.game.socket.emit('startMission', this.data.id);
        }
        
        // Update mission status
        this.data.status = 'in_progress';
        
        // Change marker appearance
        this.updateMarkerAppearance();
    }
    
    completeMission() {
        // Emit mission complete event
        if (window.game && window.game.socket) {
            window.game.socket.emit('completeMission', this.data.id);
        }
        
        // Update mission status
        this.data.status = 'completed';
        
        // Change marker appearance
        this.updateMarkerAppearance();
    }
    
    updateMarkerAppearance() {
        if (!this.mesh) return;
        
        const markerMaterial = this.mesh.material;
        
        switch (this.data.status) {
            case 'available':
                markerMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
                markerMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
                break;
            case 'in_progress':
                markerMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
                markerMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
                break;
            case 'completed':
                markerMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                markerMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
                break;
        }
    }
    
    getPosition() {
        return this.mesh ? this.mesh.position : new BABYLON.Vector3(0, 0, 0);
    }
    
    getData() {
        return this.data;
    }
    
    destroy() {
        if (this.mesh) {
            this.mesh.dispose();
        }
        
        if (this.interactionZone) {
            this.interactionZone.dispose();
        }
        
        this.removeInteractionPrompt();
        this.removeInteractionListener();
    }
} 