#!/usr/bin/env node

/**
 * Verify model setup is correct
 */

const fs = require('fs');
const path = require('path');

function verifyModelSetup() {
    console.log('🔍 Verifying Model Setup\n');
    
    // Check if model files exist in the correct location
    const modelPath = path.join(__dirname, '../assets/models/characters/male/male.glb');
    const runningModelPath = path.join(__dirname, '../assets/models/characters/male/male_running.glb');
    
    console.log('📁 Model Files:');
    if (fs.existsSync(modelPath)) {
        const stats = fs.statSync(modelPath);
        console.log(`✅ male.glb: ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
    } else {
        console.log('❌ male.glb: Not found');
    }
    
    if (fs.existsSync(runningModelPath)) {
        const stats = fs.statSync(runningModelPath);
        console.log(`✅ male_running.glb: ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
    } else {
        console.log('❌ male_running.glb: Not found');
    }
    
    // Check server configuration
    console.log('\n🌐 Server Configuration:');
    const serverFile = path.join(__dirname, '../server/server.js');
    if (fs.existsSync(serverFile)) {
        const serverContent = fs.readFileSync(serverFile, 'utf8');
        if (serverContent.includes('/assets')) {
            console.log('✅ Assets route configured');
        } else {
            console.log('❌ Assets route not configured');
        }
    }
    
    // Check client configuration
    console.log('\n🎮 Client Configuration:');
    const playerLoaderFile = path.join(__dirname, '../client/playerLoader.js');
    if (fs.existsSync(playerLoaderFile)) {
        const loaderContent = fs.readFileSync(playerLoaderFile, 'utf8');
        if (loaderContent.includes('male.glb')) {
            console.log('✅ Player loader configured for male.glb');
        } else {
            console.log('❌ Player loader not configured for male.glb');
        }
        
        if (loaderContent.includes('http://localhost:3001')) {
            console.log('✅ Player loader using correct server URL');
        } else {
            console.log('❌ Player loader not using correct server URL');
        }
    }
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Open the game: http://localhost:3004');
    console.log('2. Check browser console for model loading messages');
    console.log('3. Look for realistic human character instead of blue square');
    console.log('4. Move around with WASD to see animations');
    
    console.log('\n🔧 If still seeing blue square:');
    console.log('1. Check browser console for errors');
    console.log('2. Verify server is running on port 3001');
    console.log('3. Check network tab for model loading requests');
}

if (require.main === module) {
    verifyModelSetup();
}

module.exports = { verifyModelSetup }; 