#!/usr/bin/env node

/**
 * Vehicle Model Download Helper Script
 * This script helps you find and prepare vehicle models for UrbanPulse
 */

const fs = require('fs');
const path = require('path');

// Vehicle model sources and recommendations
const MODEL_SOURCES = {
    sketchfab: {
        url: 'https://sketchfab.com',
        searchTerms: ['low poly car', 'vehicle model', 'game car'],
        filters: ['Free', 'Downloadable', 'GLB format']
    },
    turbosquid: {
        url: 'https://turbosquid.com',
        searchTerms: ['low poly vehicle', 'game car model'],
        filters: ['Free', 'GLB/GLTF format']
    },
    cgtrader: {
        url: 'https://cgtrader.com',
        searchTerms: ['vehicle', 'car model', 'game ready'],
        filters: ['Free', 'Game ready']
    }
};

// Required vehicle types
const VEHICLE_TYPES = [
    {
        name: 'sedan',
        description: '4-door family car (Toyota Camry, Honda Accord style)',
        features: ['Detailed body', 'Chrome accents', 'Separate wheels', 'Interior dashboard'],
        polygonTarget: '8,000-12,000 triangles'
    },
    {
        name: 'sports',
        description: '2-door performance car (Porsche 911, Ferrari style)',
        features: ['Low-profile body', 'Large wheels', 'Spoiler', 'Aggressive grille'],
        polygonTarget: '10,000-15,000 triangles'
    },
    {
        name: 'suv',
        description: 'Large utility vehicle (Jeep, Range Rover style)',
        features: ['Tall body', 'High ground clearance', 'Large wheels', 'Roof rack'],
        polygonTarget: '12,000-18,000 triangles'
    },
    {
        name: 'truck',
        description: 'Pickup truck (Ford F-150, Chevrolet Silverado style)',
        features: ['Cargo bed', 'High ground clearance', 'Heavy-duty wheels', 'Tow hitch'],
        polygonTarget: '15,000-20,000 triangles'
    },
    {
        name: 'police',
        description: 'Law enforcement vehicle',
        features: ['Emergency lights', 'Police markings', 'Push bar', 'Spotlights'],
        polygonTarget: '8,000-12,000 triangles'
    },
    {
        name: 'taxi',
        description: 'Commercial passenger vehicle',
        features: ['Taxi markings', 'Meter display', 'Yellow/checker pattern'],
        polygonTarget: '8,000-12,000 triangles'
    }
];

function printHeader() {
    console.log('🚗 UrbanPulse Vehicle Model Helper');
    console.log('=====================================\n');
}

function printVehicleRequirements() {
    console.log('📋 Required Vehicle Models:\n');
    
    VEHICLE_TYPES.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.name.toUpperCase()}`);
        console.log(`   Description: ${vehicle.description}`);
        console.log(`   Features: ${vehicle.features.join(', ')}`);
        console.log(`   Target Polygons: ${vehicle.polygonTarget}`);
        console.log('');
    });
}

function printModelSources() {
    console.log('🔍 Model Sources:\n');
    
    Object.entries(MODEL_SOURCES).forEach(([source, info]) => {
        console.log(`${source.toUpperCase()}:`);
        console.log(`   URL: ${info.url}`);
        console.log(`   Search Terms: ${info.searchTerms.join(', ')}`);
        console.log(`   Filters: ${info.filters.join(', ')}`);
        console.log('');
    });
}

function printDownloadInstructions() {
    console.log('📥 Download Instructions:\n');
    console.log('1. Visit the model sources listed above');
    console.log('2. Search for each vehicle type using the provided terms');
    console.log('3. Download models in GLB format (preferred) or GLTF');
    console.log('4. Ensure models are under 5MB and optimized for web');
    console.log('5. Place models in the appropriate folders:\n');
    
    VEHICLE_TYPES.forEach(vehicle => {
        console.log(`   assets/models/vehicles/${vehicle.name}/`);
        console.log(`   ├── ${vehicle.name}.glb`);
        console.log(`   └── ${vehicle.name}_diffuse.jpg`);
        console.log('');
    });
}

function printOptimizationTips() {
    console.log('⚡ Optimization Tips:\n');
    console.log('• Keep polygon count under 20,000 per vehicle');
    console.log('• Use 1024x1024 or 2048x2048 texture resolution');
    console.log('• Enable texture compression');
    console.log('• Test loading times (should be under 2 seconds)');
    console.log('• Verify performance (60 FPS with multiple vehicles)');
    console.log('');
}

function printFileStructure() {
    console.log('📁 Expected File Structure:\n');
    console.log('assets/models/vehicles/');
    console.log('├── sedan/');
    console.log('│   ├── sedan.glb');
    console.log('│   └── sedan_diffuse.jpg');
    console.log('├── sports/');
    console.log('│   ├── sports.glb');
    console.log('│   └── sports_diffuse.jpg');
    console.log('├── suv/');
    console.log('│   ├── suv.glb');
    console.log('│   └── suv_diffuse.jpg');
    console.log('├── truck/');
    console.log('│   ├── truck.glb');
    console.log('│   └── truck_diffuse.jpg');
    console.log('├── police/');
    console.log('│   ├── police.glb');
    console.log('│   └── police_diffuse.jpg');
    console.log('└── taxi/');
    console.log('    ├── taxi.glb');
    console.log('    └── taxi_diffuse.jpg');
    console.log('');
}

function checkExistingModels() {
    console.log('🔍 Checking for existing models...\n');
    
    const vehiclesDir = path.join(__dirname, '../assets/models/vehicles');
    
    if (!fs.existsSync(vehiclesDir)) {
        console.log('❌ Vehicles directory not found. Creating...');
        fs.mkdirSync(vehiclesDir, { recursive: true });
    }
    
    VEHICLE_TYPES.forEach(vehicle => {
        const vehicleDir = path.join(vehiclesDir, vehicle.name);
        const modelFile = path.join(vehicleDir, `${vehicle.name}.glb`);
        
        if (fs.existsSync(modelFile)) {
            console.log(`✅ ${vehicle.name}: Model found`);
        } else {
            console.log(`❌ ${vehicle.name}: Model missing`);
            if (!fs.existsSync(vehicleDir)) {
                fs.mkdirSync(vehicleDir, { recursive: true });
            }
        }
    });
    console.log('');
}

function printNextSteps() {
    console.log('🎯 Next Steps:\n');
    console.log('1. Download vehicle models from the sources above');
    console.log('2. Place them in the appropriate folders');
    console.log('3. Test the models in the game');
    console.log('4. Optimize if needed for performance');
    console.log('5. Add custom colors and variations');
    console.log('');
    console.log('💡 Tip: Start with one vehicle type and test it thoroughly before adding more!');
}

// Main execution
if (require.main === module) {
    printHeader();
    printVehicleRequirements();
    printModelSources();
    printDownloadInstructions();
    printOptimizationTips();
    printFileStructure();
    checkExistingModels();
    printNextSteps();
}

module.exports = {
    VEHICLE_TYPES,
    MODEL_SOURCES
}; 