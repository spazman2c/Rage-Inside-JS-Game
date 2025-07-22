import * as BABYLON from '@babylonjs/core';

async function testModelLoading() {
    console.log('🔍 Starting model loading debug...');
    
    // Create a simple scene
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    
    // Create camera
    const camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    // Create light
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    
    // Test model loading
    const modelPath = 'http://localhost:3001/assets/models/characters/male/male.glb';
    console.log(`🎯 Attempting to load model from: ${modelPath}`);
    
    try {
        const result = await BABYLON.SceneLoader.ImportAsync('', modelPath, scene);
        console.log('✅ Model loaded successfully!');
        console.log('📦 Meshes:', result.meshes.length);
        console.log('🎬 Animations:', result.animationGroups?.length || 0);
        console.log('📁 Skeletons:', result.skeletons?.length || 0);
        
        if (result.meshes.length > 0) {
            const rootMesh = result.meshes[0];
            console.log('🏠 Root mesh:', rootMesh.name);
            console.log('📍 Position:', rootMesh.position);
            console.log('🔄 Rotation:', rootMesh.rotation);
            console.log('📏 Scaling:', rootMesh.scaling);
            
            // Make the model visible
            rootMesh.setEnabled(true);
            
            // Play animation if available
            if (result.animationGroups && result.animationGroups.length > 0) {
                result.animationGroups[0].play();
                console.log('▶️ Playing animation:', result.animationGroups[0].name);
            }
        }
        
    } catch (error) {
        console.error('❌ Failed to load model:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
    }
    
    // Render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
    
    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Run the test
testModelLoading(); 