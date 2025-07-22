# UrbanPulse - 3D Open World Multiplayer Game

A Babylon.js-based 3D open world multiplayer game with procedurally generated cities, vehicles, NPCs, and missions.

## Features

### Core Gameplay
- **3D Open World**: Procedurally generated city with urban, industrial, and rural zones
- **Realistic Human Characters**: Detailed 3D character models with proper proportions
- **Third-Person Player**: WASD movement with third-person camera follow
- **Walking Animations**: Realistic arm and leg movement while walking
- **Driveable Vehicles**: Enter/exit vehicles with physics-based driving mechanics
- **NPCs with AI**: Civilian and police NPCs with basic behavior patterns
- **Mission System**: Dynamic missions with triggers, progress tracking, and rewards
- **Minimap HUD**: Real-time minimap showing player position and mission markers

### Multiplayer Features
- **Real-time Multiplayer**: Socket.IO-based multiplayer with multiple players
- **Synced Game State**: Player positions, vehicle states, and mission progress
- **Shared World**: All players interact in the same procedurally generated world
- **Unique Avatars**: Each player has a unique character representation
- **Character Customization**: Clothing and appearance options for players

### Technical Features
- **Babylon.js Rendering**: High-performance 3D graphics engine
- **Physics Engine**: Cannon.js for realistic vehicle and object physics
- **Procedural Generation**: Randomly generated world layout each session
- **Responsive UI**: Modern HUD with minimap and notifications

## Tech Stack

- **Frontend**: Babylon.js, Socket.IO Client, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Physics**: Cannon.js
- **Development**: ES6+ JavaScript

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UrbanPulse
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

This will start both the server (port 3001) and client (port 3000) simultaneously.

## Game Controls

### Player Movement
- **WASD** or **Arrow Keys**: Move character
- **Space**: Jump
- **Mouse**: Look around (camera control)

### Vehicle Controls
- **E**: Enter nearby vehicle
- **F**: Exit current vehicle
- **WASD**: Drive vehicle (when in vehicle)
- **Space**: Brake

### Mission Interaction
- **E**: Interact with mission markers
- **F**: Complete missions (when in range)

## Game Features

### World Generation
The game generates a unique city layout each session with:
- **Urban Zones**: High-density buildings and shops
- **Industrial Zones**: Factories and warehouses
- **Rural Zones**: Open areas with vegetation
- **Road Network**: Grid-based road system with traffic logic

### Vehicles
- **Multiple Vehicle Types**: Sedan, Sports Car, SUV, Truck, Police Car, Taxi
- **Realistic 3D Models**: Detailed vehicle models with proper textures and materials
- **Physics-Based Driving**: Realistic vehicle physics and handling
- **Multiplayer Sync**: Vehicle positions and states synced across players
- **Entry/Exit Mechanics**: Seamless vehicle interaction
- **Wheel Animation**: Realistic wheel rotation based on speed
- **Vehicle Customization**: Color and type variations

### NPCs
- **Civilian NPCs**: Random walking and idle behavior
- **Police NPCs**: Special behavior patterns
- **AI States**: Idle, patrol, flee, and chase behaviors
- **Multiplayer Sync**: NPC positions and states shared across clients

### Missions
- **Dynamic Mission Types**: Delivery, chase, and theft missions
- **Proximity Triggers**: Missions activate when players approach
- **Progress Tracking**: Real-time mission status updates
- **Rewards System**: Monetary rewards for completed missions

### Multiplayer
- **Real-time Sync**: Player positions and actions synced instantly
- **Shared Vehicles**: All players can interact with the same vehicles
- **Mission Collaboration**: Multiple players can participate in missions
- **Player Avatars**: Unique visual representation for each player

## Development

### Project Structure
```
/urbanpulse
├── /client          # Frontend application
│   ├── index.html   # Main HTML file
│   ├── main.js      # Game entry point
│   ├── world.js     # World generation
│   ├── player.js    # Player controls
│   ├── vehicle.js   # Vehicle mechanics
│   ├── mission.js   # Mission system
│   └── ui.js        # HUD and UI
├── /server          # Backend server
│   ├── server.js    # Express server
│   └── gameState.js # Game state management
├── /assets          # Game assets
└── package.json     # Dependencies
```

### Running in Development
```bash
# Start both server and client
npm run dev

# Start only server
npm run server

# Start only client
npm run client
```

### Building for Production
```bash
# Build client
npm run build

# Start production server
npm start
```

## Customization

### World Generation
Modify `client/world.js` to change:
- Zone types and properties
- Building generation rules
- Road network layout
- Environment details

### Vehicle Physics
Adjust vehicle parameters in `client/vehicle.js`:
- Speed and acceleration
- Turn radius and handling
- Physics properties

### Mission System
Customize missions in `client/mission.js`:
- Mission types and objectives
- Reward systems
- Interaction mechanics

## Performance

### Optimization Tips
- Reduce draw distance for better performance
- Limit number of active NPCs
- Optimize vehicle physics calculations
- Use LOD (Level of Detail) for distant objects

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Babylon.js team for the excellent 3D engine
- Socket.IO for real-time communication
- Cannon.js for physics simulation 