#!/usr/bin/env node

/**
 * Debug script to check model loading status
 */

const fs = require('fs');
const path = require('path');

function debugModelLoading() {
    console.log('🔍 Debugging Model Loading\n');
    
    // Check if model files exist
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
    }
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Start server: npm run server');
    console.log('2. Start client: cd client && npm run dev');
    console.log('3. Open browser console to see model loading logs');
    console.log('4. Check for any error messages');
}

if (require.main === module) {
    debugModelLoading();
}

module.exports = { debugModelLoading }; 