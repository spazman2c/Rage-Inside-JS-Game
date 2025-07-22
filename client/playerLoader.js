import * as BABYLON from '@babylonjs/core';

export class PlayerLoader {
    constructor(scene) {
        this.scene = scene;
        this.playerModels = new Map();
        this.loadedModels = new Map();
        this.playerTypes = {
            male: { model: 'male.glb', scale: 1.0, height: 1.8, hasAnimations: true },
            female: { model: 'male.glb', scale: 1.0, height: 1.7, hasAnimations: true }, // Use male model
            police: { model: 'male.glb', scale: 1.0, height: 1.8, hasAnimations: true }, // Use male model
            civilian: { model: 'male.glb', scale: 1.0, height: 1.75, hasAnimations: true } // Use male model
        };
        
        this.init();
    }
    
    async init() {
        // Preload all player models
        await this.preloadPlayerModels();
    }
    
    async preloadPlayerModels() {
        console.log(`🚀 Starting to preload ${Object.keys(this.playerTypes).length} player models...`);
        const loadPromises = [];
        
        for (const [type, config] of Object.entries(this.playerTypes)) {
            console.log(`📥 Queueing load for type: ${type} (${config.model})`);
            loadPromises.push(this.loadPlayerModel(type, config));
        }
        
        try {
            await Promise.all(loadPromises);
            console.log('✅ All player models loaded successfully');
            console.log(`📋 Final loaded models:`, Array.from(this.loadedModels.keys()));
        } catch (error) {
            console.error('❌ Error loading player models:', error);
        }
    }
    
    async loadPlayerModel(type, config) {
        try {
            // All models are now in the male directory - use absolute server URL
            const modelPath = `http://localhost:3001/assets/models/characters/male/${config.model}`;
            console.log(`🎯 Loading player model from: ${modelPath}`);
            
            // Load the GLB model
            console.log(`🔧 Trying to load model with SceneLoader...`);
            console.log(`🔧 SceneLoader available:`, typeof BABYLON.SceneLoader);
            console.log(`🔧 SceneLoader methods:`, Object.getOwnPropertyNames(BABYLON.SceneLoader));
            
            // Try to use a different approach - check if we can load the model directly
            let result;
            try {
                // Try using the standard SceneLoader approach
                result = await BABYLON.SceneLoader.ImportAsync('', modelPath, this.scene);
            } catch (error) {
                console.log(`🔧 SceneLoader.ImportAsync failed, trying alternative...`);
                // Try using a different method or check if the loaders are available
                console.log(`🔧 Available BABYLON methods:`, Object.getOwnPropertyNames(BABYLON));
                throw new Error('SceneLoader.ImportAsync is not available - loaders may not be imported correctly');
            }
            
            console.log(`📦 Model load result:`, result);
            console.log(`📦 Meshes count:`, result.meshes.length);
            console.log(`🎬 Animations count:`, result.animationGroups?.length || 0);
            
            if (result.meshes.length > 0) {
                // Store the root mesh and configuration
                this.loadedModels.set(type, {
                    meshes: result.meshes,
                    rootMesh: result.meshes[0],
                    config: config,
                    animations: result.animationGroups || [],
                    hasAnimations: config.hasAnimations
                });
                
                // Hide the original model (we'll clone it for instances)
                result.meshes[0].setEnabled(false);
                
                console.log(`✅ Loaded player model: ${type} with ${result.meshes.length} meshes and ${result.animationGroups?.length || 0} animations`);
            } else {
                console.error(`❌ No meshes found in model for type: ${type}`);
                this.createFallbackModel(type, config);
            }
        } catch (error) {
            console.error(`❌ Failed to load player model ${type}:`, error);
            console.error(`🔍 Error details:`, {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            console.error(`📁 Model path was: http://localhost:3001/assets/models/characters/male/${config.model}`);
            // Create a fallback human model
            this.createFallbackModel(type, config);
        }
    }
    
    createFallbackModel(type, config) {
        console.log(`🔧 Creating fallback model for type: ${type}`);
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
        clothingMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color for fallback models
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
        console.log(`🎮 Creating player instance for type: ${type}`);
        console.log(`📋 Available loaded models:`, Array.from(this.loadedModels.keys()));
        
        const modelData = this.loadedModels.get(type);
        if (!modelData) {
            console.error(`❌ Player type ${type} not found in loaded models`);
            console.error(`📋 Available types:`, Array.from(this.loadedModels.keys()));
            return null;
        }
        
        console.log(`✅ Found model data for type: ${type}`);
        console.log(`📦 Model data:`, modelData);
        
        // Clone the model
        const clonedMeshes = [];
        const rootMesh = modelData.rootMesh.clone(`player_${type}_${Date.now()}`);
        
        console.log(`🔧 Cloning model for player instance`);
        console.log(`📦 Original meshes count:`, modelData.meshes.length);
        
        // Clone all child meshes
        modelData.meshes.forEach(mesh => {
            if (mesh !== modelData.rootMesh) {
                const clonedMesh = mesh.clone(`cloned_${mesh.name}_${Date.now()}`);
                clonedMesh.parent = rootMesh;
                clonedMeshes.push(clonedMesh);
            }
        });
        
        console.log(`📦 Cloned meshes count:`, clonedMeshes.length);
        
        // Set position and rotation
        rootMesh.position = new BABYLON.Vector3(position.x, position.y, position.z);
        rootMesh.rotation = new BABYLON.Vector3(rotation.x || 0, rotation.y || 0, rotation.z || 0);
        // Ensure the mesh is enabled
        rootMesh.setEnabled(true);
        // Return the full player instance object
        return {
            rootMesh: rootMesh,
            meshes: clonedMeshes,
            type: type,
            config: modelData.config,
            bodyParts: modelData.bodyParts || null,
            animations: modelData.animations ? this.cloneAnimations(modelData.animations, rootMesh) : [],
            hasAnimations: modelData.hasAnimations
        };
    }
}