const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const GameState = require('./gameState');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;
const gameState = new GameState();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    // Add player to game state
    const player = gameState.addPlayer(socket.id);
    
    // Send current game state to new player
    socket.emit('gameState', {
        players: gameState.getPlayers(),
        vehicles: gameState.getVehicles(),
        npcs: gameState.getNPCs(),
        missions: gameState.getMissions()
    });
    
    // Broadcast new player to all other players
    socket.broadcast.emit('playerJoined', player);
    
    // Handle player movement
    socket.on('playerMove', (data) => {
        gameState.updatePlayerPosition(socket.id, data.position, data.rotation);
        socket.broadcast.emit('playerMoved', {
            id: socket.id,
            position: data.position,
            rotation: data.rotation
        });
    });
    
    // Handle vehicle entry/exit
    socket.on('enterVehicle', (vehicleId) => {
        const result = gameState.enterVehicle(socket.id, vehicleId);
        if (result.success) {
            io.emit('vehicleEntered', {
                playerId: socket.id,
                vehicleId: vehicleId
            });
        }
    });
    
    socket.on('exitVehicle', () => {
        const result = gameState.exitVehicle(socket.id);
        if (result.success) {
            io.emit('vehicleExited', {
                playerId: socket.id,
                vehicleId: result.vehicleId
            });
        }
    });
    
    // Handle vehicle movement
    socket.on('vehicleMove', (data) => {
        gameState.updateVehiclePosition(data.vehicleId, data.position, data.rotation);
        socket.broadcast.emit('vehicleMoved', {
            vehicleId: data.vehicleId,
            position: data.position,
            rotation: data.rotation
        });
    });
    
    // Handle mission interactions
    socket.on('startMission', (missionId) => {
        const result = gameState.startMission(socket.id, missionId);
        if (result.success) {
            socket.emit('missionStarted', result.mission);
            socket.broadcast.emit('missionUpdated', {
                missionId: missionId,
                status: 'started',
                playerId: socket.id
            });
        }
    });
    
    socket.on('completeMission', (missionId) => {
        const result = gameState.completeMission(socket.id, missionId);
        if (result.success) {
            socket.emit('missionCompleted', result.reward);
            socket.broadcast.emit('missionUpdated', {
                missionId: missionId,
                status: 'completed',
                playerId: socket.id
            });
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        gameState.removePlayer(socket.id);
        socket.broadcast.emit('playerLeft', socket.id);
    });
});

// Game loop for server-side updates
setInterval(() => {
    gameState.update();
    io.emit('gameUpdate', {
        npcs: gameState.getNPCs(),
        time: Date.now()
    });
}, 1000 / 30); // 30 FPS

server.listen(PORT, () => {
    console.log(`UrbanPulse server running on port ${PORT}`);
    console.log(`Client available at http://localhost:${PORT}`);
}); 