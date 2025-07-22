export class UI {
    constructor() {
        this.minimap = document.getElementById('minimap');
        this.playerCountElement = document.getElementById('playerCount');
        this.fpsElement = document.getElementById('fps');
        this.notifications = [];
        
        this.init();
    }
    
    init() {
        this.createMinimap();
        this.setupNotifications();
    }
    
    createMinimap() {
        // Create canvas for minimap
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.borderRadius = '50%';
        
        this.minimap.appendChild(canvas);
        this.minimapCanvas = canvas;
        this.minimapContext = canvas.getContext('2d');
    }
    
    updateFPS(fps) {
        if (this.fpsElement) {
            this.fpsElement.textContent = fps;
        }
    }
    
    updatePlayerCount(count) {
        if (this.playerCountElement) {
            this.playerCountElement.textContent = count;
        }
    }
    
    updateMinimap(playerPosition, vehicles, missions) {
        if (!this.minimapContext || !playerPosition) return;
        
        const ctx = this.minimapContext;
        const canvas = this.minimapCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scale (world coordinates to minimap pixels)
        const worldSize = 1000; // World size in units
        const minimapSize = 180; // Minimap size in pixels
        const scale = minimapSize / worldSize;
        
        // Center point
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw player position
        const playerX = centerX + (playerPosition.x * scale);
        const playerY = centerY + (playerPosition.z * scale);
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw vehicles
        if (vehicles) {
            vehicles.forEach(vehicle => {
                const vehicleX = centerX + (vehicle.mesh.position.x * scale);
                const vehicleY = centerY + (vehicle.mesh.position.z * scale);
                
                ctx.fillStyle = vehicle.data.occupied ? '#888888' : '#00ff00';
                ctx.fillRect(vehicleX - 2, vehicleY - 2, 4, 4);
            });
        }
        
        // Draw missions
        if (missions) {
            missions.forEach(mission => {
                const missionX = centerX + (mission.data.position.x * scale);
                const missionY = centerY + (mission.data.position.z * scale);
                
                let color = '#ffff00'; // Default yellow
                switch (mission.data.status) {
                    case 'available':
                        color = '#00ff00'; // Green
                        break;
                    case 'in_progress':
                        color = '#ffff00'; // Yellow
                        break;
                    case 'completed':
                        color = '#888888'; // Gray
                        break;
                }
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(missionX, missionY, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Draw compass indicator
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 60);
        ctx.lineTo(centerX, centerY - 50);
        ctx.stroke();
        
        // Draw north indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('N', centerX, centerY - 45);
    }
    
    setupNotifications() {
        // Create notification container
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(this.notificationContainer);
    }
    
    showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            margin: 5px 0;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            text-align: center;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        this.notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        this.notifications.push(notification);
    }
    
    showMissionInfo(mission) {
        const info = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                z-index: 1001;
                min-width: 300px;
            ">
                <h3 style="margin: 0 0 10px 0; color: #00ff00;">${mission.title}</h3>
                <p style="margin: 0 0 15px 0;">${mission.description}</p>
                <p style="margin: 0 0 15px 0; color: #ffff00;">Reward: $${mission.reward}</p>
                <div style="text-align: center;">
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: #00ff00;
                        color: black;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Accept Mission</button>
                </div>
            </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = info;
        document.body.appendChild(tempDiv.firstElementChild);
    }
    
    showControls() {
        const controls = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 1000;
            ">
                <h4 style="margin: 0 0 10px 0;">Controls</h4>
                <div>WASD - Move</div>
                <div>Space - Jump</div>
                <div>E - Enter Vehicle</div>
                <div>F - Exit Vehicle</div>
                <div>Mouse - Look Around</div>
            </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = controls;
        document.body.appendChild(tempDiv.firstElementChild);
    }
    
    showLoadingScreen() {
        const loading = document.createElement('div');
        loading.id = 'loadingScreen';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        
        loading.innerHTML = `
            <h2>Loading UrbanPulse...</h2>
            <div style="margin-top: 20px;">
                <div style="
                    width: 200px;
                    height: 4px;
                    background: #333;
                    border-radius: 2px;
                    overflow: hidden;
                ">
                    <div id="loadingBar" style="
                        width: 0%;
                        height: 100%;
                        background: #00ff00;
                        transition: width 0.3s ease;
                    "></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loading);
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    if (loading.parentNode) {
                        loading.parentNode.removeChild(loading);
                    }
                }, 500);
            }
            
            const bar = document.getElementById('loadingBar');
            if (bar) {
                bar.style.width = progress + '%';
            }
        }, 100);
    }
    
    hideLoadingScreen() {
        const loading = document.getElementById('loadingScreen');
        if (loading && loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
    }
    
    updateHealth(health) {
        // Create health bar if it doesn't exist
        if (!this.healthBar) {
            this.healthBar = document.createElement('div');
            this.healthBar.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                width: 200px;
                height: 20px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 10px;
                overflow: hidden;
            `;
            
            this.healthFill = document.createElement('div');
            this.healthFill.style.cssText = `
                width: 100%;
                height: 100%;
                background: #00ff00;
                transition: width 0.3s ease;
            `;
            
            this.healthBar.appendChild(this.healthFill);
            document.body.appendChild(this.healthBar);
        }
        
        // Update health fill
        this.healthFill.style.width = (health * 100) + '%';
        
        // Change color based on health
        if (health > 0.6) {
            this.healthFill.style.background = '#00ff00';
        } else if (health > 0.3) {
            this.healthFill.style.background = '#ffff00';
        } else {
            this.healthFill.style.background = '#ff0000';
        }
    }
    
    destroy() {
        // Clean up notifications
        this.notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
        // Remove notification container
        if (this.notificationContainer && this.notificationContainer.parentNode) {
            this.notificationContainer.parentNode.removeChild(this.notificationContainer);
        }
        
        // Remove health bar
        if (this.healthBar && this.healthBar.parentNode) {
            this.healthBar.parentNode.removeChild(this.healthBar);
        }
    }
} 