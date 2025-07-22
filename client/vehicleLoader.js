import * as BABYLON from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders';

export class VehicleLoader {
    constructor(scene) {
        this.scene = scene;
        this.vehicleModels = new Map();
        this.loadedModels = new Map();
        this.vehicleTypes = {
            sedan: { model: 'sedan.glb', scale: 1.0, wheelRadius: 0.35 },
            sports: { model: 'sports.glb', scale: 1.0, wheelRadius: 0.4 },
            suv: { model: 'suv.glb', scale: 1.2, wheelRadius: 0.45 },
            truck: { model: 'truck.glb', scale: 1.3, wheelRadius: 0.5 },
            police: { model: 'police.glb', scale: 1.0, wheelRadius: 0.35 },
            taxi: { model: 'taxi.glb', scale: 1.0, wheelRadius: 0.35 }
        };
        
        this.init();
    }
    
    async init() {
        // Preload all vehicle models
        await this.preloadVehicleModels();
    }
    
    async preloadVehicleModels() {
        const loadPromises = [];
        
        for (const [type, config] of Object.entries(this.vehicleTypes)) {
            loadPromises.push(this.loadVehicleModel(type, config));
        }
        
        try {
            await Promise.all(loadPromises);
            console.log('All vehicle models loaded successfully');
        } catch (error) {
            console.error('Error loading vehicle models:', error);
        }
    }
    
    async loadVehicleModel(type, config) {
        try {
            const modelPath = `/assets/models/vehicles/${type}/${config.model}`;
            
            // Load the GLB model
            const result = await SceneLoader.ImportAsync('', modelPath, this.scene);
            
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
                
                console.log(`Loaded vehicle model: ${type}`);
            }
        } catch (error) {
            console.warn(`Failed to load vehicle model ${type}:`, error);
            // Create a fallback box model
            this.createFallbackModel(type, config);
        }
    }
    
    createFallbackModel(type, config) {
        // Create a simple box-based vehicle as fallback
        const rootMesh = new BABYLON.Mesh(`fallback_${type}`, this.scene);
        
        // Create body
        const body = BABYLON.MeshBuilder.CreateBox(`body_${type}`, {
            width: 2 * config.scale,
            height: 1.5 * config.scale,
            depth: 4 * config.scale
        }, this.scene);
        body.parent = rootMesh;
        body.position.y = 0.75 * config.scale;
        
        // Create wheels
        const wheelPositions = [
            { x: -0.8 * config.scale, y: config.wheelRadius, z: -1.5 * config.scale },
            { x: 0.8 * config.scale, y: config.wheelRadius, z: -1.5 * config.scale },
            { x: -0.8 * config.scale, y: config.wheelRadius, z: 1.5 * config.scale },
            { x: 0.8 * config.scale, y: config.wheelRadius, z: 1.5 * config.scale }
        ];
        
        const wheels = [];
        wheelPositions.forEach((pos, index) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
                `wheel_${type}_${index}`,
                { height: 0.3 * config.scale, diameter: config.wheelRadius * 2 },
                this.scene
            );
            wheel.parent = rootMesh;
            wheel.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheels.push(wheel);
        });
        
        // Create materials
        const bodyMaterial = new BABYLON.StandardMaterial(`bodyMat_${type}`, this.scene);
        bodyMaterial.diffuseColor = this.getVehicleColor(type);
        body.material = bodyMaterial;
        
        const wheelMaterial = new BABYLON.StandardMaterial(`wheelMat_${type}`, this.scene);
        wheelMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        wheels.forEach(wheel => wheel.material = wheelMaterial);
        
        this.loadedModels.set(type, {
            meshes: [rootMesh, body, ...wheels],
            rootMesh: rootMesh,
            config: config,
            animations: [],
            wheels: wheels
        });
        
        // Hide the fallback model
        rootMesh.setEnabled(false);
    }
    
    getVehicleColor(type) {
        const colors = {
            sedan: new BABYLON.Color3(0.8, 0.2, 0.2), // Red
            sports: new BABYLON.Color3(0.2, 0.2, 0.8), // Blue
            suv: new BABYLON.Color3(0.2, 0.8, 0.2),   // Green
            truck: new BABYLON.Color3(0.8, 0.8, 0.2), // Yellow
            police: new BABYLON.Color3(0.2, 0.2, 0.2), // Dark gray
            taxi: new BABYLON.Color3(1, 1, 0)          // Yellow
        };
        return colors[type] || new BABYLON.Color3(0.5, 0.5, 0.5);
    }
    
    createVehicleInstance(type, position, rotation) {
        const modelData = this.loadedModels.get(type);
        if (!modelData) {
            console.error(`Vehicle type ${type} not found`);
            return null;
        }
        
        // Clone the model
        const clonedMeshes = [];
        const rootMesh = modelData.rootMesh.clone(`vehicle_${type}_${Date.now()}`);
        
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
        let physicsImpostor = null;
        try {
            physicsImpostor = new BABYLON.PhysicsImpostor(
                rootMesh,
                BABYLON.PhysicsImpostor.BoxImpostor,
                { mass: 1000, restitution: 0.3, friction: 0.8 },
                this.scene
            );
        } catch (error) {
            console.warn('Physics not available for vehicle instance:', error);
        }
        
        return {
            rootMesh: rootMesh,
            meshes: clonedMeshes,
            physicsImpostor: physicsImpostor,
            type: type,
            config: modelData.config,
            wheels: clonedMeshes.filter(mesh => mesh.name.includes('wheel'))
        };
    }
    
    updateWheels(vehicleInstance, speed) {
        if (!vehicleInstance.wheels) return;
        
        vehicleInstance.wheels.forEach(wheel => {
            // Rotate wheels based on speed
            if (Math.abs(speed) > 0.1) {
                wheel.rotation.z += speed * 0.1;
            }
        });
    }
    
    setVehicleColor(vehicleInstance, color) {
        if (!vehicleInstance.meshes) return;
        
        // Find the body mesh and change its color
        const bodyMesh = vehicleInstance.meshes.find(mesh => 
            mesh.name.includes('body') || mesh.name.includes('Body')
        );
        
        if (bodyMesh && bodyMesh.material) {
            bodyMesh.material.diffuseColor = color;
        }
    }
    
    getAvailableTypes() {
        return Object.keys(this.vehicleTypes);
    }
    
    getVehicleConfig(type) {
        return this.vehicleTypes[type];
    }
} 