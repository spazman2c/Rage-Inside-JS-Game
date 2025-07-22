# Vehicle Models Guide

## Required Model Types

### 1. Car Models (Primary)
- **Sedan**: 4-door family car (Toyota Camry, Honda Accord style)
- **Sports Car**: 2-door performance car (Porsche 911, Ferrari style)
- **SUV**: Large utility vehicle (Jeep, Range Rover style)
- **Truck**: Pickup truck (Ford F-150, Chevrolet Silverado style)
- **Police Car**: Law enforcement vehicle
- **Taxi**: Commercial passenger vehicle

### 2. Model Specifications
Each vehicle model should include:
- **Main Body**: High-poly detailed mesh
- **Wheels**: Separate wheel models (4 per vehicle)
- **Interior**: Dashboard, seats, steering wheel
- **Lights**: Headlights, taillights, turn signals
- **Details**: Mirrors, door handles, grilles

### 3. File Formats
- **Primary**: `.glb` or `.gltf` (recommended for web)
- **Alternative**: `.fbx`, `.obj` with textures
- **Textures**: `.jpg` or `.png` for diffuse, normal, specular maps

### 4. Model Sources
- **Free Sources**: 
  - Sketchfab (free models)
  - TurboSquid (some free models)
  - CGTrader (free section)
- **Paid Sources**:
  - TurboSquid
  - CGTrader
  - Unity Asset Store

### 5. Recommended Model Structure
```
assets/models/vehicles/
├── sedan/
│   ├── sedan.glb
│   ├── sedan_diffuse.jpg
│   └── sedan_normal.jpg
├── sports/
│   ├── sports.glb
│   └── sports_diffuse.jpg
├── suv/
│   ├── suv.glb
│   └── suv_diffuse.jpg
└── truck/
    ├── truck.glb
    └── truck_diffuse.jpg
```

### 6. Model Requirements
- **Polygon Count**: 5,000-20,000 triangles per vehicle
- **Texture Resolution**: 1024x1024 or 2048x2048
- **LOD**: Multiple detail levels for performance
- **Animation**: Wheel rotation, suspension movement
- **Physics**: Proper collision meshes

### 7. Implementation Notes
- Models should be optimized for web delivery
- Include collision meshes for physics
- Support for different paint colors
- Modular parts for customization 