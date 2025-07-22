# Vehicle Models for UrbanPulse

## Model Requirements

### File Structure
```
assets/models/vehicles/
├── sedan/
│   ├── sedan.glb          # Main model file
│   ├── sedan_diffuse.jpg  # Color texture
│   ├── sedan_normal.jpg   # Normal map
│   └── sedan_specular.jpg # Specular map
├── sports/
│   ├── sports.glb
│   └── sports_diffuse.jpg
├── suv/
│   ├── suv.glb
│   └── suv_diffuse.jpg
├── truck/
│   ├── truck.glb
│   └── truck_diffuse.jpg
├── police/
│   ├── police.glb
│   └── police_diffuse.jpg
└── taxi/
    ├── taxi.glb
    └── taxi_diffuse.jpg
```

## Model Specifications

### 1. Sedan (Family Car)
- **Style**: 4-door sedan (Toyota Camry, Honda Accord)
- **Polygons**: 8,000-12,000 triangles
- **Features**: 
  - Detailed body with chrome accents
  - Separate wheel models
  - Interior dashboard
  - Headlights and taillights
  - Side mirrors

### 2. Sports Car
- **Style**: 2-door coupe (Porsche 911, Ferrari)
- **Polygons**: 10,000-15,000 triangles
- **Features**:
  - Low-profile aerodynamic body
  - Large wheels with performance tires
  - Spoiler and side skirts
  - Aggressive front grille
  - Sport interior

### 3. SUV
- **Style**: Large utility vehicle (Jeep, Range Rover)
- **Polygons**: 12,000-18,000 triangles
- **Features**:
  - Tall body with high ground clearance
  - Large wheels with off-road tires
  - Roof rack or cargo area
  - Rugged exterior details
  - Spacious interior

### 4. Truck
- **Style**: Pickup truck (Ford F-150, Chevrolet Silverado)
- **Polygons**: 15,000-20,000 triangles
- **Features**:
  - Large cargo bed
  - High ground clearance
  - Heavy-duty wheels
  - Tow hitch
  - Work lights

### 5. Police Car
- **Style**: Law enforcement vehicle
- **Polygons**: 8,000-12,000 triangles
- **Features**:
  - Emergency lights (red/blue)
  - Police markings
  - Push bar
  - Spotlights
  - Radio equipment

### 6. Taxi
- **Style**: Commercial passenger vehicle
- **Polygons**: 8,000-12,000 triangles
- **Features**:
  - Taxi markings and signs
  - Meter display
  - Passenger-friendly interior
  - Yellow/checker pattern

## Model Sources

### Free Sources
1. **Sketchfab** (https://sketchfab.com)
   - Search: "car", "vehicle", "automobile"
   - Filter by: Free, Downloadable
   - Popular models: "Low Poly Car Pack", "Simple Car Models"

2. **TurboSquid** (https://turbosquid.com)
   - Search: "low poly car", "game car model"
   - Filter by: Free, GLB/GLTF format

3. **CGTrader** (https://cgtrader.com)
   - Search: "vehicle", "car model"
   - Filter by: Free, Game ready

### Recommended Free Models
1. **Low Poly Car Pack** - Multiple vehicle types
2. **Simple Car Collection** - Basic but effective
3. **Game Vehicle Pack** - Optimized for games

## Model Optimization

### For Web Performance
- **Polygon Count**: Keep under 20,000 triangles per vehicle
- **Texture Size**: 1024x1024 or 2048x2048 maximum
- **LOD Levels**: Create 3 detail levels
- **Compression**: Use compressed textures (DDS, KTX)

### Export Settings
- **Format**: GLB (recommended) or GLTF
- **Include**: Meshes, materials, textures
- **Optimize**: Enable mesh optimization
- **Compression**: Enable texture compression

## Implementation Notes

### Model Loading
- Models are loaded asynchronously
- Fallback to simple boxes if loading fails
- Support for different vehicle types
- Color customization per vehicle

### Physics Integration
- Separate collision meshes
- Proper mass and friction values
- Wheel physics for realistic driving

### Animation Support
- Wheel rotation
- Suspension movement
- Door opening (future)
- Light effects (future)

## Testing Models

### Before Adding to Game
1. **File Size**: Should be under 5MB per model
2. **Load Time**: Should load in under 2 seconds
3. **Performance**: Should maintain 60 FPS with multiple vehicles
4. **Compatibility**: Test in different browsers

### Quality Checklist
- [ ] Model loads without errors
- [ ] Textures display correctly
- [ ] Physics collision works
- [ ] Wheel rotation functions
- [ ] Performance is acceptable
- [ ] File size is reasonable 