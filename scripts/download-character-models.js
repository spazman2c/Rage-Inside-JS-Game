#!/usr/bin/env node

/**
 * Character Model Download Helper Script
 * This script helps you find and prepare character models for UrbanPulse
 */

const fs = require('fs');
const path = require('path');

// Character model sources and recommendations
const MODEL_SOURCES = {
    mixamo: {
        url: 'https://mixamo.com',
        description: 'Adobe\'s free character service with high-quality models and animations',
        searchTerms: ['human character', 'person model', 'animated character'],
        filters: ['Free', 'Downloadable', 'GLB format', 'With animations']
    },
    sketchfab: {
        url: 'https://sketchfab.com',
        description: 'Large collection of 3D models',
        searchTerms: ['human character', 'person model', 'game character'],
        filters: ['Free', 'Downloadable', 'GLB format']
    },
    turbosquid: {
        url: 'https://turbosquid.com',
        description: 'Professional 3D model marketplace',
        searchTerms: ['human character', 'person model', 'game ready'],
        filters: ['Free', 'GLB/GLTF format', 'Game ready']
    }
};

// Required character types
const CHARACTER_TYPES = [
    {
        name: 'male',
        description: 'Adult male character',
        features: ['Detailed head', 'Proper body proportions', 'Separate body parts', 'Casual clothing'],
        polygonTarget: '5,000-10,000 triangles',
        clothing: 'Casual wear (t-shirt, jeans)',
        skinTone: 'Light to medium brown'
    },
    {
        name: 'female',
        description: 'Adult female character',
        features: ['Detailed head', 'Proper body proportions', 'Separate body parts', 'Casual clothing'],
        polygonTarget: '5,000-10,000 triangles',
        clothing: 'Casual wear (blouse, pants)',
        skinTone: 'Light to medium brown'
    },
    {
        name: 'police',
        description: 'Law enforcement character',
        features: ['Police uniform', 'Badge and equipment', 'Professional appearance', 'Authority stance'],
        polygonTarget: '5,000-10,000 triangles',
        clothing: 'Police uniform with badge',
        skinTone: 'Various skin tones'
    },
    {
        name: 'civilian',
        description: 'Generic civilian character',
        features: ['Casual clothing', 'Neutral appearance', 'Versatile design', 'Common citizen look'],
        polygonTarget: '5,000-10,000 triangles',
        clothing: 'Generic casual clothing',
        skinTone: 'Various skin tones'
    }
];

function printHeader() {
    console.log('👤 UrbanPulse Character Model Helper');
    console.log('=====================================\n');
}

function printCharacterRequirements() {
    console.log('📋 Required Character Models:\n');
    
    CHARACTER_TYPES.forEach((character, index) => {
        console.log(`${index + 1}. ${character.name.toUpperCase()}`);
        console.log(`   Description: ${character.description}`);
        console.log(`   Features: ${character.features.join(', ')}`);
        console.log(`   Target Polygons: ${character.polygonTarget}`);
        console.log(`   Clothing: ${character.clothing}`);
        console.log(`   Skin Tone: ${character.skinTone}`);
        console.log('');
    });
}

function printModelSources() {
    console.log('🔍 Model Sources:\n');
    
    Object.entries(MODEL_SOURCES).forEach(([source, info]) => {
        console.log(`${source.toUpperCase()}:`);
        console.log(`   URL: ${info.url}`);
        console.log(`   Description: ${info.description}`);
        console.log(`   Search Terms: ${info.searchTerms.join(', ')}`);
        console.log(`   Filters: ${info.filters.join(', ')}`);
        console.log('');
    });
}

function printDownloadInstructions() {
    console.log('📥 Download Instructions:\n');
    console.log('1. Visit Mixamo (recommended) or other model sources');
    console.log('2. Search for human character models using the provided terms');
    console.log('3. Download models in GLB format (preferred) or GLTF');
    console.log('4. Ensure models are under 3MB and optimized for web');
    console.log('5. Place models in the appropriate folders:\n');
    
    CHARACTER_TYPES.forEach(character => {
        console.log(`   assets/models/characters/${character.name}/`);
        console.log(`   ├── ${character.name}.glb`);
        console.log(`   └── ${character.name}_diffuse.jpg`);
        console.log('');
    });
}

function printOptimizationTips() {
    console.log('⚡ Optimization Tips:\n');
    console.log('• Keep polygon count under 10,000 per character');
    console.log('• Use 1024x1024 or 2048x2048 texture resolution');
    console.log('• Enable texture compression');
    console.log('• Test loading times (should be under 2 seconds)');
    console.log('• Verify performance (60 FPS with multiple characters)');
    console.log('• Ensure proper body proportions');
    console.log('');
}

function printFileStructure() {
    console.log('📁 Expected File Structure:\n');
    console.log('assets/models/characters/');
    console.log('├── male/');
    console.log('│   ├── male.glb');
    console.log('│   └── male_diffuse.jpg');
    console.log('├── female/');
    console.log('│   ├── female.glb');
    console.log('│   └── female_diffuse.jpg');
    console.log('├── police/');
    console.log('│   ├── police.glb');
    console.log('│   └── police_diffuse.jpg');
    console.log('└── civilian/');
    console.log('    ├── civilian.glb');
    console.log('    └── civilian_diffuse.jpg');
    console.log('');
}

function checkExistingModels() {
    console.log('🔍 Checking for existing models...\n');
    
    const charactersDir = path.join(__dirname, '../assets/models/characters');
    
    if (!fs.existsSync(charactersDir)) {
        console.log('❌ Characters directory not found. Creating...');
        fs.mkdirSync(charactersDir, { recursive: true });
    }
    
    CHARACTER_TYPES.forEach(character => {
        const characterDir = path.join(charactersDir, character.name);
        const modelFile = path.join(characterDir, `${character.name}.glb`);
        
        if (fs.existsSync(modelFile)) {
            console.log(`✅ ${character.name}: Model found`);
        } else {
            console.log(`❌ ${character.name}: Model missing`);
            if (!fs.existsSync(characterDir)) {
                fs.mkdirSync(characterDir, { recursive: true });
            }
        }
    });
    console.log('');
}

function printMixamoInstructions() {
    console.log('🎯 Mixamo Instructions (Recommended):\n');
    console.log('1. Go to https://mixamo.com');
    console.log('2. Sign in with Adobe account (free)');
    console.log('3. Browse character models or create custom character');
    console.log('4. Select a character and download in GLB format');
    console.log('5. Choose appropriate animations (idle, walk, run)');
    console.log('6. Download with skin and animations included');
    console.log('7. Place in appropriate character folder');
    console.log('');
}

function printAnimationRequirements() {
    console.log('🎭 Animation Requirements:\n');
    console.log('Essential Animations:');
    console.log('• Idle - Standing, breathing, subtle movement');
    console.log('• Walk - Normal walking animation');
    console.log('• Run - Fast movement animation');
    console.log('• Jump - Crouch and leap animation');
    console.log('• Vehicle Entry - Climbing into vehicles');
    console.log('• Vehicle Exit - Getting out of vehicles');
    console.log('');
    console.log('Animation Tips:');
    console.log('• Use GLB format to include animations');
    console.log('• Ensure animations are properly rigged');
    console.log('• Test animations in the game engine');
    console.log('• Optimize animation data for web');
    console.log('');
}

function printNextSteps() {
    console.log('🎯 Next Steps:\n');
    console.log('1. Download character models from Mixamo or other sources');
    console.log('2. Place them in the appropriate folders');
    console.log('3. Test the models in the game');
    console.log('4. Optimize if needed for performance');
    console.log('5. Add custom clothing and appearance options');
    console.log('6. Test animations and interactions');
    console.log('');
    console.log('💡 Tip: Start with one character type and test it thoroughly before adding more!');
    console.log('💡 Tip: Mixamo is the easiest source for high-quality character models with animations!');
}

// Main execution
if (require.main === module) {
    printHeader();
    printCharacterRequirements();
    printModelSources();
    printMixamoInstructions();
    printDownloadInstructions();
    printAnimationRequirements();
    printOptimizationTips();
    printFileStructure();
    checkExistingModels();
    printNextSteps();
}

module.exports = {
    CHARACTER_TYPES,
    MODEL_SOURCES
}; 