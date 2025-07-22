import * as BABYLON from '@babylonjs/core';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.buildings = [];
        this.roads = [];
        this.zones = [];
        
        this.generateWorld();
    }
    
    generateWorld() {
        // Create ground
        this.createGround();
        
        // Generate city zones
        this.generateZones();
        
        // Generate roads
        this.generateRoads();
        
        // Generate buildings
        this.generateBuildings();
        
        // Add environment details
        this.addEnvironmentDetails();
    }
    
    createGround() {
        // Create main ground plane
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 2000, height: 2000 }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0.1);
        ground.material = groundMaterial;
        
        // Add physics to ground
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.9 }, 
            this.scene
        );
    }
    
    generateZones() {
        // Define zone types and their properties
        const zoneTypes = [
            { name: 'urban', color: new BABYLON.Color3(0.3, 0.3, 0.3), density: 0.8 },
            { name: 'industrial', color: new BABYLON.Color3(0.4, 0.2, 0.1), density: 0.6 },
            { name: 'rural', color: new BABYLON.Color3(0.1, 0.4, 0.1), density: 0.3 }
        ];
        
        // Create zones in a grid pattern
        const zoneSize = 200;
        const zonesPerSide = 5;
        
        for (let x = 0; x < zonesPerSide; x++) {
            for (let z = 0; z < zonesPerSide; z++) {
                const zoneType = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
                const zoneX = (x - zonesPerSide / 2) * zoneSize;
                const zoneZ = (z - zonesPerSide / 2) * zoneSize;
                
                this.createZone(zoneX, zoneZ, zoneSize, zoneType);
            }
        }
    }
    
    createZone(x, z, size, zoneType) {
        // Create zone marker (invisible)
        const zone = {
            x: x,
            z: z,
            size: size,
            type: zoneType.name,
            density: zoneType.density
        };
        
        this.zones.push(zone);
        
        // Add zone-specific ground texture
        const zoneGround = BABYLON.MeshBuilder.CreateGround(
            `zone_${x}_${z}`, 
            { width: size, height: size }, 
            this.scene
        );
        zoneGround.position = new BABYLON.Vector3(x, 0.01, z);
        
        const zoneMaterial = new BABYLON.StandardMaterial(`zoneMat_${x}_${z}`, this.scene);
        zoneMaterial.diffuseColor = zoneType.color;
        zoneMaterial.alpha = 0.3;
        zoneGround.material = zoneMaterial;
    }
    
    generateRoads() {
        // Create main roads in a grid pattern
        const roadWidth = 8;
        const roadLength = 1000;
        
        // Horizontal roads
        for (let i = -2; i <= 2; i++) {
            const road = this.createRoad(
                new BABYLON.Vector3(0, 0.1, i * 200),
                new BABYLON.Vector3(roadLength, 0.2, roadWidth),
                'horizontal'
            );
            this.roads.push(road);
        }
        
        // Vertical roads
        for (let i = -2; i <= 2; i++) {
            const road = this.createRoad(
                new BABYLON.Vector3(i * 200, 0.1, 0),
                new BABYLON.Vector3(roadWidth, 0.2, roadLength),
                'vertical'
            );
            this.roads.push(road);
        }
    }
    
    createRoad(position, size, direction) {
        const road = BABYLON.MeshBuilder.CreateBox(
            `road_${direction}_${position.x}_${position.z}`,
            { width: size.x, height: size.y, depth: size.z },
            this.scene
        );
        road.position = position;
        
        const roadMaterial = new BABYLON.StandardMaterial(`roadMat_${direction}_${position.x}_${position.z}`, this.scene);
        roadMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        road.material = roadMaterial;
        
        // Add road markings
        this.addRoadMarkings(road, direction);
        
        return road;
    }
    
    addRoadMarkings(road, direction) {
        const markingMaterial = new BABYLON.StandardMaterial('markingMat', this.scene);
        markingMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        
        if (direction === 'horizontal') {
            // Add center line
            const centerLine = BABYLON.MeshBuilder.CreateBox(
                'centerLine',
                { width: 0.2, height: 0.21, depth: road.getBoundingInfo().boundingBox.maximumWorld.y * 2 },
                this.scene
            );
            centerLine.position = road.position;
            centerLine.material = markingMaterial;
        } else {
            // Add center line for vertical roads
            const centerLine = BABYLON.MeshBuilder.CreateBox(
                'centerLine',
                { width: road.getBoundingInfo().boundingBox.maximumWorld.x * 2, height: 0.21, depth: 0.2 },
                this.scene
            );
            centerLine.position = road.position;
            centerLine.material = markingMaterial;
        }
    }
    
    generateBuildings() {
        // Generate buildings based on zone density
        this.zones.forEach(zone => {
            const buildingCount = Math.floor(zone.density * 20);
            
            for (let i = 0; i < buildingCount; i++) {
                const buildingX = zone.x + (Math.random() - 0.5) * zone.size * 0.8;
                const buildingZ = zone.z + (Math.random() - 0.5) * zone.size * 0.8;
                
                // Check if position is not on a road
                if (!this.isOnRoad(buildingX, buildingZ)) {
                    this.createBuilding(buildingX, buildingZ, zone.type);
                }
            }
        });
    }
    
    isOnRoad(x, z) {
        // Simple road detection
        const roadPositions = [-400, -200, 0, 200, 400];
        return roadPositions.includes(Math.round(x / 200) * 200) || 
               roadPositions.includes(Math.round(z / 200) * 200);
    }
    
    createBuilding(x, z, zoneType) {
        const buildingHeight = zoneType === 'urban' ? 10 + Math.random() * 20 : 
                              zoneType === 'industrial' ? 5 + Math.random() * 15 : 
                              2 + Math.random() * 8;
        
        const buildingWidth = 5 + Math.random() * 15;
        const buildingDepth = 5 + Math.random() * 15;
        
        const building = BABYLON.MeshBuilder.CreateBox(
            `building_${x}_${z}`,
            { width: buildingWidth, height: buildingHeight, depth: buildingDepth },
            this.scene
        );
        
        building.position = new BABYLON.Vector3(x, buildingHeight / 2, z);
        
        // Create building material based on zone type
        const buildingMaterial = new BABYLON.StandardMaterial(`buildingMat_${x}_${z}`, this.scene);
        
        switch (zoneType) {
            case 'urban':
                buildingMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.7);
                break;
            case 'industrial':
                buildingMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.3);
                break;
            case 'rural':
                buildingMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.5, 0.3);
                break;
        }
        
        building.material = buildingMaterial;
        
        // Add physics to building
        building.physicsImpostor = new BABYLON.PhysicsImpostor(
            building,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.9 },
            this.scene
        );
        
        this.buildings.push(building);
    }
    
    addEnvironmentDetails() {
        // Add street lights
        this.addStreetLights();
        
        // Add trees and vegetation
        this.addVegetation();
        
        // Add skybox
        this.createSkybox();
    }
    
    addStreetLights() {
        const roadPositions = [-400, -200, 0, 200, 400];
        
        roadPositions.forEach(x => {
            roadPositions.forEach(z => {
                if (Math.random() < 0.3) { // 30% chance for street light
                    this.createStreetLight(x, z);
                }
            });
        });
    }
    
    createStreetLight(x, z) {
        // Light pole
        const pole = BABYLON.MeshBuilder.CreateCylinder(
            `pole_${x}_${z}`,
            { height: 8, diameter: 0.3 },
            this.scene
        );
        pole.position = new BABYLON.Vector3(x, 4, z);
        
        const poleMaterial = new BABYLON.StandardMaterial('poleMat', this.scene);
        poleMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        pole.material = poleMaterial;
        
        // Light
        const light = new BABYLON.PointLight(
            `streetLight_${x}_${z}`,
            new BABYLON.Vector3(x, 7, z),
            this.scene
        );
        light.intensity = 0.5;
        light.range = 20;
        light.diffuse = new BABYLON.Color3(1, 1, 0.8);
    }
    
    addVegetation() {
        // Add trees randomly in rural zones
        this.zones.filter(zone => zone.type === 'rural').forEach(zone => {
            for (let i = 0; i < 10; i++) {
                const treeX = zone.x + (Math.random() - 0.5) * zone.size * 0.6;
                const treeZ = zone.z + (Math.random() - 0.5) * zone.size * 0.6;
                
                if (!this.isOnRoad(treeX, treeZ)) {
                    this.createTree(treeX, treeZ);
                }
            }
        });
    }
    
    createTree(x, z) {
        // Tree trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
            `trunk_${x}_${z}`,
            { height: 3, diameter: 0.5 },
            this.scene
        );
        trunk.position = new BABYLON.Vector3(x, 1.5, z);
        
        const trunkMaterial = new BABYLON.StandardMaterial('trunkMat', this.scene);
        trunkMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
        trunk.material = trunkMaterial;
        
        // Tree foliage
        const foliage = BABYLON.MeshBuilder.CreateSphere(
            `foliage_${x}_${z}`,
            { diameter: 4 },
            this.scene
        );
        foliage.position = new BABYLON.Vector3(x, 4, z);
        
        const foliageMaterial = new BABYLON.StandardMaterial('foliageMat', this.scene);
        foliageMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1);
        foliage.material = foliageMaterial;
    }
    
    createSkybox() {
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 1000 }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMat', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('', this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }
} 