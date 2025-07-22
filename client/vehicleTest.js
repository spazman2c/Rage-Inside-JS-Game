import * as BABYLON from '@babylonjs/core';

/**
 * Test script to demonstrate realistic vehicle models
 * This creates a more detailed vehicle using Babylon.js primitives
 */

export class VehicleTest {
    constructor(scene) {
        this.scene = scene;
    }
    
    createDetailedSedan(position = new BABYLON.Vector3(0, 0, 0)) {
        const rootMesh = new BABYLON.Mesh('detailed_sedan', this.scene);
        
        // Create main body
        const body = BABYLON.MeshBuilder.CreateBox('sedan_body', {
            width: 2,
            height: 1.2,
            depth: 4.5
        }, this.scene);
        body.parent = rootMesh;
        body.position.y = 0.6;
        
        // Create roof
        const roof = BABYLON.MeshBuilder.CreateBox('sedan_roof', {
            width: 1.8,
            height: 0.8,
            depth: 2.5
        }, this.scene);
        roof.parent = rootMesh;
        roof.position.y = 1.4;
        roof.position.z = -0.3;
        
        // Create hood
        const hood = BABYLON.MeshBuilder.CreateBox('sedan_hood', {
            width: 1.9,
            height: 0.1,
            depth: 1.2
        }, this.scene);
        hood.parent = rootMesh;
        hood.position.y = 0.65;
        hood.position.z = 1.8;
        
        // Create trunk
        const trunk = BABYLON.MeshBuilder.CreateBox('sedan_trunk', {
            width: 1.9,
            height: 0.1,
            depth: 1.2
        }, this.scene);
        trunk.parent = rootMesh;
        trunk.position.y = 0.65;
        trunk.position.z = -1.8;
        
        // Create wheels
        const wheelPositions = [
            { x: -0.9, y: 0.35, z: -1.5 }, // Front left
            { x: 0.9, y: 0.35, z: -1.5 },  // Front right
            { x: -0.9, y: 0.35, z: 1.5 },  // Back left
            { x: 0.9, y: 0.35, z: 1.5 }    // Back right
        ];
        
        const wheels = [];
        wheelPositions.forEach((pos, index) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
                `sedan_wheel_${index}`,
                { height: 0.3, diameter: 0.7 },
                this.scene
            );
            wheel.parent = rootMesh;
            wheel.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheels.push(wheel);
        });
        
        // Create headlights
        const headlightLeft = BABYLON.MeshBuilder.CreateSphere('headlight_left', {
            diameter: 0.3
        }, this.scene);
        headlightLeft.parent = rootMesh;
        headlightLeft.position = new BABYLON.Vector3(-0.6, 0.7, 2.1);
        
        const headlightRight = BABYLON.MeshBuilder.CreateSphere('headlight_right', {
            diameter: 0.3
        }, this.scene);
        headlightRight.parent = rootMesh;
        headlightRight.position = new BABYLON.Vector3(0.6, 0.7, 2.1);
        
        // Create taillights
        const taillightLeft = BABYLON.MeshBuilder.CreateSphere('taillight_left', {
            diameter: 0.25
        }, this.scene);
        taillightLeft.parent = rootMesh;
        taillightLeft.position = new BABYLON.Vector3(-0.6, 0.7, -2.1);
        
        const taillightRight = BABYLON.MeshBuilder.CreateSphere('taillight_right', {
            diameter: 0.25
        }, this.scene);
        taillightRight.parent = rootMesh;
        taillightRight.position = new BABYLON.Vector3(0.6, 0.7, -2.1);
        
        // Create side mirrors
        const mirrorLeft = BABYLON.MeshBuilder.CreateBox('mirror_left', {
            width: 0.1,
            height: 0.3,
            depth: 0.2
        }, this.scene);
        mirrorLeft.parent = rootMesh;
        mirrorLeft.position = new BABYLON.Vector3(-1.1, 1.0, 0.5);
        
        const mirrorRight = BABYLON.MeshBuilder.CreateBox('mirror_right', {
            width: 0.1,
            height: 0.3,
            depth: 0.2
        }, this.scene);
        mirrorRight.parent = rootMesh;
        mirrorRight.position = new BABYLON.Vector3(1.1, 1.0, 0.5);
        
        // Create materials
        const bodyMaterial = new BABYLON.StandardMaterial('sedan_body_mat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2); // Red
        body.material = bodyMaterial;
        roof.material = bodyMaterial;
        hood.material = bodyMaterial;
        trunk.material = bodyMaterial;
        
        const wheelMaterial = new BABYLON.StandardMaterial('sedan_wheel_mat', this.scene);
        wheelMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Dark gray
        wheels.forEach(wheel => wheel.material = wheelMaterial);
        
        const headlightMaterial = new BABYLON.StandardMaterial('headlight_mat', this.scene);
        headlightMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0.8); // Light yellow
        headlightMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
        headlightMaterial.emissiveIntensity = 0.3;
        headlightLeft.material = headlightMaterial;
        headlightRight.material = headlightMaterial;
        
        const taillightMaterial = new BABYLON.StandardMaterial('taillight_mat', this.scene);
        taillightMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
        taillightMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        taillightMaterial.emissiveIntensity = 0.2;
        taillightLeft.material = taillightMaterial;
        taillightRight.material = taillightMaterial;
        
        const mirrorMaterial = new BABYLON.StandardMaterial('mirror_mat', this.scene);
        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Light gray
        mirrorLeft.material = mirrorMaterial;
        mirrorRight.material = mirrorMaterial;
        
        // Set position
        rootMesh.position = position;
        
        return {
            rootMesh: rootMesh,
            wheels: wheels,
            body: body,
            roof: roof,
            hood: hood,
            trunk: trunk,
            headlights: [headlightLeft, headlightRight],
            taillights: [taillightLeft, taillightRight],
            mirrors: [mirrorLeft, mirrorRight]
        };
    }
    
    createSportsCar(position = new BABYLON.Vector3(5, 0, 0)) {
        const rootMesh = new BABYLON.Mesh('detailed_sports', this.scene);
        
        // Create low-profile body
        const body = BABYLON.MeshBuilder.CreateBox('sports_body', {
            width: 1.8,
            height: 0.8,
            depth: 4.2
        }, this.scene);
        body.parent = rootMesh;
        body.position.y = 0.4;
        
        // Create aerodynamic roof
        const roof = BABYLON.MeshBuilder.CreateBox('sports_roof', {
            width: 1.6,
            height: 0.6,
            depth: 2.0
        }, this.scene);
        roof.parent = rootMesh;
        roof.position.y = 1.0;
        roof.position.z = -0.2;
        
        // Create spoiler
        const spoiler = BABYLON.MeshBuilder.CreateBox('sports_spoiler', {
            width: 1.4,
            height: 0.1,
            depth: 0.3
        }, this.scene);
        spoiler.parent = rootMesh;
        spoiler.position.y = 1.3;
        spoiler.position.z = -1.8;
        
        // Create large wheels
        const wheelPositions = [
            { x: -0.8, y: 0.4, z: -1.4 },
            { x: 0.8, y: 0.4, z: -1.4 },
            { x: -0.8, y: 0.4, z: 1.4 },
            { x: 0.8, y: 0.4, z: 1.4 }
        ];
        
        const wheels = [];
        wheelPositions.forEach((pos, index) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
                `sports_wheel_${index}`,
                { height: 0.4, diameter: 0.8 },
                this.scene
            );
            wheel.parent = rootMesh;
            wheel.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheels.push(wheel);
        });
        
        // Create aggressive grille
        const grille = BABYLON.MeshBuilder.CreateBox('sports_grille', {
            width: 1.2,
            height: 0.3,
            depth: 0.1
        }, this.scene);
        grille.parent = rootMesh;
        grille.position = new BABYLON.Vector3(0, 0.3, 2.1);
        
        // Create materials
        const bodyMaterial = new BABYLON.StandardMaterial('sports_body_mat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8); // Blue
        body.material = bodyMaterial;
        roof.material = bodyMaterial;
        spoiler.material = bodyMaterial;
        
        const wheelMaterial = new BABYLON.StandardMaterial('sports_wheel_mat', this.scene);
        wheelMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Dark gray
        wheels.forEach(wheel => wheel.material = wheelMaterial);
        
        const grilleMaterial = new BABYLON.StandardMaterial('grille_mat', this.scene);
        grilleMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Black
        grille.material = grilleMaterial;
        
        // Set position
        rootMesh.position = position;
        
        return {
            rootMesh: rootMesh,
            wheels: wheels,
            body: body,
            roof: roof,
            spoiler: spoiler,
            grille: grille
        };
    }
    
    createSUV(position = new BABYLON.Vector3(-5, 0, 0)) {
        const rootMesh = new BABYLON.Mesh('detailed_suv', this.scene);
        
        // Create tall body
        const body = BABYLON.MeshBuilder.CreateBox('suv_body', {
            width: 2.2,
            height: 1.8,
            depth: 4.8
        }, this.scene);
        body.parent = rootMesh;
        body.position.y = 0.9;
        
        // Create roof rack
        const roofRack = BABYLON.MeshBuilder.CreateBox('suv_roof_rack', {
            width: 1.8,
            height: 0.1,
            depth: 3.0
        }, this.scene);
        roofRack.parent = rootMesh;
        roofRack.position.y = 1.9;
        
        // Create large wheels
        const wheelPositions = [
            { x: -1.0, y: 0.45, z: -1.6 },
            { x: 1.0, y: 0.45, z: -1.6 },
            { x: -1.0, y: 0.45, z: 1.6 },
            { x: 1.0, y: 0.45, z: 1.6 }
        ];
        
        const wheels = [];
        wheelPositions.forEach((pos, index) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
                `suv_wheel_${index}`,
                { height: 0.5, diameter: 0.9 },
                this.scene
            );
            wheel.parent = rootMesh;
            wheel.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheels.push(wheel);
        });
        
        // Create materials
        const bodyMaterial = new BABYLON.StandardMaterial('suv_body_mat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Green
        body.material = bodyMaterial;
        roofRack.material = bodyMaterial;
        
        const wheelMaterial = new BABYLON.StandardMaterial('suv_wheel_mat', this.scene);
        wheelMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Dark gray
        wheels.forEach(wheel => wheel.material = wheelMaterial);
        
        // Set position
        rootMesh.position = position;
        
        return {
            rootMesh: rootMesh,
            wheels: wheels,
            body: body,
            roofRack: roofRack
        };
    }
} 