# Character Models for UrbanPulse

## Model Requirements

### File Structure
```
assets/models/characters/
├── male/
│   ├── male.glb          # Main model file
│   ├── male_diffuse.jpg  # Skin texture
│   └── male_normal.jpg   # Normal map
├── female/
│   ├── female.glb
│   └── female_diffuse.jpg
├── police/
│   ├── police.glb
│   └── police_diffuse.jpg
└── civilian/
    ├── civilian.glb
    └── civilian_diffuse.jpg
```

## Model Specifications

### 1. Male Character
- **Style**: Adult male character
- **Polygons**: 5,000-10,000 triangles
- **Features**: 
  - Detailed head with facial features
  - Proper body proportions
  - Separate body parts for animation
  - Casual clothing
  - Realistic skin texture

### 2. Female Character
- **Style**: Adult female character
- **Polygons**: 5,000-10,000 triangles
- **Features**:
  - Detailed head with facial features
  - Proper body proportions
  - Separate body parts for animation
  - Casual clothing
  - Realistic skin texture

### 3. Police Officer
- **Style**: Law enforcement character
- **Polygons**: 5,000-10,000 triangles
- **Features**:
  - Police uniform
  - Badge and equipment
  - Professional appearance
  - Authority stance

### 4. Civilian
- **Style**: Generic civilian character
- **Polygons**: 5,000-10,000 triangles
- **Features**:
  - Casual clothing
  - Neutral appearance
  - Versatile design
  - Common citizen look

## Model Requirements

### Essential Body Parts
Each character model should include:
- **Head**: Detailed face with eyes, nose, mouth
- **Torso**: Upper body with clothing
- **Arms**: Left and right arms with hands
- **Legs**: Left and right legs with feet
- **Hands**: Detailed hands with fingers
- **Feet**: Shoes or boots

### Animation Support
- **Walking Animation**: Arm and leg movement
- **Running Animation**: Faster movement
- **Idle Animation**: Subtle breathing
- **Jump Animation**: Crouch and leap
- **Vehicle Entry**: Climbing into vehicles

### Clothing Variations
- **Casual**: T-shirts, jeans, casual wear
- **Formal**: Suits, dresses, business attire
- **Sport**: Athletic wear, tracksuits
- **Police**: Uniform with badge and equipment

## Model Sources

### Free Sources
1. **Mixamo** (https://mixamo.com)
   - Adobe's free character service
   - High-quality models with animations
   - Easy to download and use

2. **Sketchfab** (https://sketchfab.com)
   - Search: "human character", "person model"
   - Filter by: Free, Downloadable, GLB format

3. **TurboSquid** (https://turbosquid.com)
   - Search: "human character", "person model"
   - Filter by: Free, GLB/GLTF format

### Recommended Free Models
1. **Mixamo Characters** - Professional quality
2. **Low Poly Human Pack** - Game optimized
3. **Simple Character Collection** - Basic but effective

## Model Optimization

### For Web Performance
- **Polygon Count**: Keep under 10,000 triangles per character
- **Texture Size**: 1024x1024 or 2048x2048 maximum
- **LOD Levels**: Create 3 detail levels
- **Compression**: Use compressed textures

### Export Settings
- **Format**: GLB (recommended) or GLTF
- **Include**: Meshes, materials, textures, animations
- **Optimize**: Enable mesh optimization
- **Compression**: Enable texture compression

## Implementation Notes

### Model Loading
- Models are loaded asynchronously
- Fallback to detailed primitive models if loading fails
- Support for different character types
- Clothing and appearance customization

### Physics Integration
- Capsule collision for realistic movement
- Proper mass and friction values
- Collision detection with environment

### Animation Support
- Walking/running animations
- Idle breathing animation
- Vehicle interaction animations
- Custom animation blending

## Testing Models

### Before Adding to Game
1. **File Size**: Should be under 3MB per model
2. **Load Time**: Should load in under 2 seconds
3. **Performance**: Should maintain 60 FPS with multiple characters
4. **Compatibility**: Test in different browsers

### Quality Checklist
- [ ] Model loads without errors
- [ ] Textures display correctly
- [ ] Physics collision works
- [ ] Animations function properly
- [ ] Performance is acceptable
- [ ] File size is reasonable
- [ ] Character proportions look realistic

## Character Customization

### Appearance Options
- **Skin Color**: Multiple skin tone variations
- **Hair Style**: Different hair types and colors
- **Clothing**: Various clothing styles and colors
- **Accessories**: Hats, glasses, jewelry

### Clothing System
- **Casual**: T-shirts, jeans, sneakers
- **Formal**: Suits, dresses, formal shoes
- **Sport**: Athletic wear, running shoes
- **Police**: Uniform, badge, equipment

### Animation States
- **Idle**: Standing, breathing, looking around
- **Walking**: Normal walking animation
- **Running**: Fast movement animation
- **Jumping**: Crouch and leap animation
- **Vehicle Entry**: Climbing into vehicles
- **Vehicle Exit**: Getting out of vehicles

## Usage in Game

### Player Characters
- **Main Player**: Detailed character with full customization
- **Other Players**: Simplified versions for performance
- **NPCs**: Various character types for immersion

### Multiplayer Support
- **Character Sync**: Position and animation syncing
- **Appearance Sync**: Clothing and appearance updates
- **Performance**: Optimized for multiple players

### Character Progression
- **Unlockable Characters**: Different character types
- **Customization**: Clothing and appearance options
- **Special Characters**: Police, civilians, etc. 