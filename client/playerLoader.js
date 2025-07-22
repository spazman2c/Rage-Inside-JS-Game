import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

export class PlayerLoader {
    constructor(scene) {
        this.scene = scene;
        this.playerModels = new Map();
        this.loadedModels = new Map();
        this.playerTypes = {
            male: { model: 'male.glb', scale: 1.0, height: 1.8 },
            female: { model: 'female.glb', scale: 1.0, height: 1.7 },
            police: { model: 'police.glb', scale: 1.0, height: 1.8 },
            civilian: { model: 'civilian.glb', scale: 1.0, height: 1.75 }
        };
        
        this.init();
    }
    
    async init() {
        // Preload all player models
        await this.preloadPlayerModels();
    }
    
    async preloadPlayerModels() {
        const loadPromises = [];
        
        for (const [type, config] of Object.entries(this.playerTypes)) {
            loadPromises.push(this.loadPlayerModel(type, config));
        }
        
        try {
            await Promise.all(loadPromises);
            console.log('All player models loaded successfully');
        } catch (error) {
            console.error('Error loading player models:', error);
        }
    }
    
    async loadPlayerModel(type, config) {
        try {
            const modelPath = `/assets/models/characters/${type}/${config.model}`;
            
            // Load the GLB model
            const result = await BABYLON.SceneLoader.ImportAsync('', modelPath, this.scene);
            
            if (result.meshes.length > 0) {
                // Store the root mesh and configuration
                this.loadedModels.set(type, {
                    meshes: result.meshes,
                    rootMesh: result.meshes[0],
                    config: config,
                    animations: result.animationGroups || []
                });
                
                // Hide the original model (we'll clone it for instances)
                result.meshes[0].setEnabled(false);
                
                console.log(`Loaded player model: ${type}`);
            }
        } catch (error) {
            console.warn(`Failed to load player model ${type}:`, error);
            // Create a fallback human model
            this.createFallbackModel(type, config);
        }
    }
    
    createFallbackModel(type, config) {
        // Create a detailed human model using primitives
        const rootMesh = new BABYLON.Mesh(`fallback_${type}`, this.scene);
        
        // Create head
        const head = BABYLON.MeshBuilder.CreateSphere(`head_${type}`, {
            diameter: 0.25 * config.scale
        }, this.scene);
        head.parent = rootMesh;
        head.position.y = 1.6 * config.scale;
        
        // Create torso
        const torso = BABYLON.MeshBuilder.CreateBox(`torso_${type}`, {
            width: 0.5 * config.scale,
            height: 0.8 * config.scale,
            depth: 0.3 * config.scale
        }, this.scene);
        torso.parent = rootMesh;
        torso.position.y = 1.1 * config.scale;
        
        // Create arms
        const leftArm = BABYLON.MeshBuilder.CreateBox(`leftArm_${type}`, {
            width: 0.15 * config.scale,
            height: 0.7 * config.scale,
            depth: 0.15 * config.scale
        }, this.scene);
        leftArm.parent = rootMesh;
        leftArm.position = new BABYLON.Vector3(-0.325 * config.scale, 1.1 * config.scale, 0);
        
        const rightArm = BABYLON.MeshBuilder.CreateBox(`rightArm_${type}`, {
            width: 0.15 * config.scale,
            height: 0.7 * config.scale,
            depth: 0.15 * config.scale
        }, this.scene);
        rightArm.parent = rootMesh;
        rightArm.position = new BABYLON.Vector3(0.325 * config.scale, 1.1 * config.scale, 0);
        
        // Create legs
        const leftLeg = BABYLON.MeshBuilder.CreateBox(`leftLeg_${type}`, {
            width: 0.2 * config.scale,
            height: 0.8 * config.scale,
            depth: 0.2 * config.scale
        }, this.scene);
        leftLeg.parent = rootMesh;
        leftLeg.position = new BABYLON.Vector3(-0.15 * config.scale, 0.4 * config.scale, 0);
        
        const rightLeg = BABYLON.MeshBuilder.CreateBox(`rightLeg_${type}`, {
            width: 0.2 * config.scale,
            height: 0.8 * config.scale,
            depth: 0.2 * config.scale
        }, this.scene);
        rightLeg.parent = rootMesh;
        rightLeg.position = new BABYLON.Vector3(0.15 * config.scale, 0.4 * config.scale, 0);
        
        // Create hands
        const leftHand = BABYLON.MeshBuilder.CreateSphere(`leftHand_${type}`, {
            diameter: 0.1 * config.scale
        }, this.scene);
        leftHand.parent = rootMesh;
        leftHand.position = new BABYLON.Vector3(-0.325 * config.scale, 0.75 * config.scale, 0);
        
        const rightHand = BABYLON.MeshBuilder.CreateSphere(`rightHand_${type}`, {
            diameter: 0.1 * config.scale
        }, this.scene);
        rightHand.parent = rootMesh;
        rightHand.position = new BABYLON.Vector3(0.325 * config.scale, 0.75 * config.scale, 0);
        
        // Create feet
        const leftFoot = BABYLON.MeshBuilder.CreateBox(`leftFoot_${type}`, {
            width: 0.25 * config.scale,
            height: 0.1 * config.scale,
            depth: 0.3 * config.scale
        }, this.scene);
        leftFoot.parent = rootMesh;
        leftFoot.position = new BABYLON.Vector3(-0.15 * config.scale, 0.05 * config.scale, 0.05 * config.scale);
        
        const rightFoot = BABYLON.MeshBuilder.CreateBox(`rightFoot_${type}`, {
            width: 0.25 * config.scale,
            height: 0.1 * config.scale,
            depth: 0.3 * config.scale
        }, this.scene);
        rightFoot.parent = rootMesh;
        rightFoot.position = new BABYLON.Vector3(0.15 * config.scale, 0.05 * config.scale, 0.05 * config.scale);
        
        // Create materials based on type
        const skinMaterial = new BABYLON.StandardMaterial(`skinMat_${type}`, this.scene);
        skinMaterial.diffuseColor = this.getSkinColor(type);
        head.material = skinMaterial;
        leftHand.material = skinMaterial;
        rightHand.material = skinMaterial;
        
        const clothingMaterial = new BABYLON.StandardMaterial(`clothingMat_${type}`, this.scene);
        clothingMaterial.diffuseColor = this.getClothingColor(type);
        torso.material = clothingMaterial;
        leftArm.material = clothingMaterial;
        rightArm.material = clothingMaterial;
        leftLeg.material = clothingMaterial;
        rightLeg.material = clothingMaterial;
        
        const shoeMaterial = new BABYLON.StandardMaterial(`shoeMat_${type}`, this.scene);
        shoeMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Black shoes
        leftFoot.material = shoeMaterial;
        rightFoot.material = shoeMaterial;
        
        this.loadedModels.set(type, {
            meshes: [rootMesh, head, torso, leftArm, rightArm, leftLeg, rightLeg, leftHand, rightHand, leftFoot, rightFoot],
            rootMesh: rootMesh,
            config: config,
            animations: [],
            bodyParts: {
                head: head,
                torso: torso,
                leftArm: leftArm,
                rightArm: rightArm,
                leftLeg: leftLeg,
                rightLeg: rightLeg,
                leftHand: leftHand,
                rightHand: rightHand,
                leftFoot: leftFoot,
                rightFoot: rightFoot
            }
        });
        
        // Hide the fallback model
        rootMesh.setEnabled(false);
    }
    
    getSkinColor(type) {
        const skinColors = {
            male: new BABYLON.Color3(0.8, 0.6, 0.5),     // Light brown
            female: new BABYLON.Color3(0.9, 0.7, 0.6),   // Lighter skin
            police: new BABYLON.Color3(0.8, 0.6, 0.5),   // Light brown
            civilian: new BABYLON.Color3(0.7, 0.5, 0.4)  // Medium brown
        };
        return skinColors[type] || new BABYLON.Color3(0.8, 0.6, 0.5);
    }
    
    getClothingColor(type) {
        const clothingColors = {
            male: new BABYLON.Color3(0.2, 0.4, 0.8),    // Blue shirt
            female: new BABYLON.Color3(0.8, 0.3, 0.6),   // Pink shirt
            police: new BABYLON.Color3(0.2, 0.2, 0.2),   // Dark uniform
            civilian: new BABYLON.Color3(0.6, 0.6, 0.6)  // Gray shirt
        };
        return clothingColors[type] || new BABYLON.Color3(0.5, 0.5, 0.5);
    }
    
    createPlayerInstance(type, position, rotation) {
        const modelData = this.loadedModels.get(type);
        if (!modelData) {
            console.error(`Player type ${type} not found`);
            return null;
        }
        
        // Clone the model
        const clonedMeshes = [];
        const rootMesh = modelData.rootMesh.clone(`player_${type}_${Date.now()}`);
        
        // Clone all child meshes
        modelData.meshes.forEach(mesh => {
            if (mesh !== modelData.rootMesh) {
                const clonedMesh = mesh.clone(`cloned_${mesh.name}_${Date.now()}`);
                clonedMesh.parent = rootMesh;
                clonedMeshes.push(clonedMesh);
            }
        });
        
        // Set position and rotation
        rootMesh.position = new BABYLON.Vector3(position.x, position.y, position.z);
        rootMesh.rotation = new BABYLON.Vector3(rotation.x || 0, rotation.y || 0, rotation.z || 0);
        
        // Add physics
        const physicsImpostor = new BABYLON.PhysicsImpostor(
            rootMesh,
            BABYLON.PhysicsImpostor.CapsuleImpostor,
            { mass: 70, restitution: 0.1, friction: 0.8 },
            this.scene
        );
        
        return {
            rootMesh: rootMesh,
            meshes: clonedMeshes,
            physicsImpostor: physicsImpostor,
            type: type,
            config: modelData.config,
            bodyParts: modelData.bodyParts ? this.cloneBodyParts(modelData.bodyParts, rootMesh) : null
        };
    }
    
    cloneBodyParts(bodyParts, parentMesh) {
        const clonedParts = {};
        Object.keys(bodyParts).forEach(partName => {
            const originalPart = bodyParts[partName];
            const clonedPart = originalPart.clone(`cloned_${originalPart.name}_${Date.now()}`);
            clonedPart.parent = parentMesh;
            clonedParts[partName] = clonedPart;
        });
        return clonedParts;
    }
    
    updatePlayerAnimation(playerInstance, isMoving, isRunning) {
        if (!playerInstance.bodyParts) return;
        
        const { leftArm, rightArm, leftLeg, rightLeg } = playerInstance.bodyParts;
        const time = Date.now() * 0.01;
        
        if (isMoving) {
            // Walking/running animation
            const speed = isRunning ? 0.3 : 0.15;
            const amplitude = isRunning ? 0.3 : 0.2;
            
            // Arm swing
            leftArm.rotation.z = Math.sin(time * speed) * amplitude;
            rightArm.rotation.z = -Math.sin(time * speed) * amplitude;
            
            // Leg movement
            leftLeg.rotation.z = Math.sin(time * speed) * amplitude;
            rightLeg.rotation.z = -Math.sin(time * speed) * amplitude;
        } else {
            // Idle animation - subtle breathing
            const breathing = Math.sin(time * 0.5) * 0.02;
            torso.rotation.z = breathing;
        }
    }
    
    setPlayerClothing(playerInstance, clothingType) {
        if (!playerInstance.meshes) return;
        
        const clothingColors = {
            casual: new BABYLON.Color3(0.2, 0.4, 0.8),   // Blue
            formal: new BABYLON.Color3(0.1, 0.1, 0.1),    // Black
            sport: new BABYLON.Color3(0.8, 0.2, 0.2),     // Red
            police: new BABYLON.Color3(0.2, 0.2, 0.2)     // Dark gray
        };
        
        const color = clothingColors[clothingType] || clothingColors.casual;
        
        // Find torso and arm meshes and change their color
        playerInstance.meshes.forEach(mesh => {
            if (mesh.name.includes('torso') || mesh.name.includes('Arm') || mesh.name.includes('Leg')) {
                if (mesh.material) {
                    mesh.material.diffuseColor = color;
                }
            }
        });
    }
    
    getAvailableTypes() {
        return Object.keys(this.playerTypes);
    }
    
    getPlayerConfig(type) {
        return this.playerTypes[type];
    }
} 