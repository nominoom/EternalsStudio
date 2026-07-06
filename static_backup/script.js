// ============================================================================
// QUADTREE IMPLEMENTATION (for efficient spatial lookups)
// ============================================================================
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    contains(point) {
        return point.x >= this.x - this.w &&
               point.x <= this.x + this.w &&
               point.y >= this.y - this.h &&
               point.y <= this.y + this.h;
    }
    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
                 range.x + range.w < this.x - this.w ||
                 range.y - range.h > this.y + this.h ||
                 range.y + range.h < this.y - this.h);
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        this.northeast = new QuadTree(new Rectangle(x + w, y - h, w, h), this.capacity);
        this.northwest = new QuadTree(new Rectangle(x - w, y - h, w, h), this.capacity);
        this.southeast = new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity);
        this.southwest = new QuadTree(new Rectangle(x - w, y + h, w, h), this.capacity);
        this.divided = true;
    }
    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            return this.northeast.insert(point) || this.northwest.insert(point) ||
                   this.southeast.insert(point) || this.southwest.insert(point);
        }
    }
    query(range, found = []) {
        if (!this.boundary.intersects(range)) {
            return found;
        }
        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }
        return found;
    }
}

// ============================================================================
// BUBBLE CLASS (Nominoom-style drift physics)
// ============================================================================
class Bubble {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.baseX = x; // Drift center
        this.baseY = y;
        this.size = size;
        this.color = color;
        
        // Drift properties (nominoom-style)
        this.driftAngle = Math.random() * Math.PI * 2;
        this.driftSpeed = Math.random() * 0.2 + 0.1;
        this.driftChangeTimer = Math.random() * 100;
    }

    update(canvasWidth, canvasHeight, speedMultiplier) {
        // Update drift angle periodically
        if (this.driftChangeTimer++ > 120) {
            this.driftAngle += (Math.random() - 0.5) * Math.PI / 2;
            this.driftChangeTimer = 0;
        }

        // Move drift center
        this.baseX += Math.cos(this.driftAngle) * this.driftSpeed * speedMultiplier;
        this.baseY += Math.sin(this.driftAngle) * this.driftSpeed * speedMultiplier;

        // Wrap around edges - keep x and y with their drift center to prevent zooming
        if (this.baseX < 0) {
            this.baseX = canvasWidth;
            this.x = canvasWidth;
        }
        if (this.baseX > canvasWidth) {
            this.baseX = 0;
            this.x = 0;
        }
        if (this.baseY < 0) {
            this.baseY = canvasHeight;
            this.y = canvasHeight;
        }
        if (this.baseY > canvasHeight) {
            this.baseY = 0;
            this.y = 0;
        }

        // Gently pull bubble towards drift center
        let homeX = this.baseX - this.x;
        let homeY = this.baseY - this.y;
        this.x += homeX / 50;
        this.y += homeY / 50;
    }

    draw(ctx) {
        // Grey translucent fill
        ctx.fillStyle = 'rgba(150, 150, 150, 0.1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Colored outline
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// ============================================================================
// BUBBLE BACKGROUND SYSTEM
// ============================================================================
class BubbleBackground {
    constructor(containerId, config = {}) {
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }
        
        // Configuration
        this.config = {
            density: config.density || 1.1,
            speedMultiplier: config.speedMultiplier || 1,
            minSize: config.minSize || 10,
            maxSize: config.maxSize || 40,
            connectionDistance: config.connectionDistance || 10,
            connectionLineWidth: config.connectionLineWidth || 1,
            outlineColors: config.outlineColors || [
                { r: 64, g: 224, b: 208 },
                { r: 138, g: 127, b: 214 }
            ],
            trailOpacity: config.trailOpacity || 0.05
        };
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('bubble-canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        
        if (!this.ctx) {
            console.error('Failed to get canvas 2d context');
            return;
        }
        
        this.bubbles = [];
        this.animationFrame = null;
        this.resizeTimeout = null;
        
        // Bind handlers
        this.resizeHandler = () => this.handleResize();
        window.addEventListener('resize', this.resizeHandler);
        
        // Initialize
        this.resize();
        this.init();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    calculateBubbleCount() {
        const area = this.canvas.width * this.canvas.height;
        const areaUnit = 10000; // 100px x 100px
        return Math.floor((area / areaUnit) * this.config.density);
    }
    
    getRandomColor() {
        const colors = this.config.outlineColors;
        if (colors.length === 1) return colors[0];
        
        const t = Math.random();
        const c1 = colors[0];
        const c2 = colors[colors.length - 1];
        
        return {
            r: Math.floor(c1.r + (c2.r - c1.r) * t),
            g: Math.floor(c1.g + (c2.g - c1.g) * t),
            b: Math.floor(c1.b + (c2.b - c1.b) * t)
        };
    }
    
    init() {
        this.bubbles = [];
        const count = this.calculateBubbleCount();
        
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize;
            const color = this.getRandomColor();
            
            this.bubbles.push(new Bubble(x, y, size, color));
        }
    }
    
    animate() {
        // Clear the canvas completely
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Build quadtree for efficient spatial queries
        const boundary = new Rectangle(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        const quadtree = new QuadTree(boundary, 4);
        
        // Update and insert bubbles into quadtree
        for (let bubble of this.bubbles) {
            bubble.update(this.canvas.width, this.canvas.height, this.config.speedMultiplier);
            quadtree.insert(bubble);
        }
        
        // Draw connections using quadtree
        const connectionRadiusSquared = this.config.connectionDistance * this.config.connectionDistance;
        this.ctx.lineWidth = this.config.connectionLineWidth;
        
        for (let bubble of this.bubbles) {
            const range = new Rectangle(
                bubble.x,
                bubble.y,
                this.config.connectionDistance,
                this.config.connectionDistance
            );
            const nearby = quadtree.query(range);
            
            for (let other of nearby) {
                if (bubble === other) continue;
                
                const dx = bubble.x - other.x;
                const dy = bubble.y - other.y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < connectionRadiusSquared) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - (dist / this.config.connectionDistance)) * 0.3;
                    
                    // Average color
                    const avgR = (bubble.color.r + other.color.r) >> 1;
                    const avgG = (bubble.color.g + other.color.g) >> 1;
                    const avgB = (bubble.color.b + other.color.b) >> 1;
                    
                    this.ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(bubble.x, bubble.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw bubbles on top
        for (let bubble of this.bubbles) {
            bubble.draw(this.ctx);
        }
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const oldWidth = this.canvas.width;
            const oldHeight = this.canvas.height;
            this.resize();
            
            // Scale existing bubbles instead of recreating them
            const scaleX = this.canvas.width / oldWidth;
            const scaleY = this.canvas.height / oldHeight;
            
            for (let bubble of this.bubbles) {
                bubble.x *= scaleX;
                bubble.y *= scaleY;
                bubble.baseX *= scaleX;
                bubble.baseY *= scaleY;
            }
            
            // Adjust bubble count based on new size
            const targetCount = this.calculateBubbleCount();
            while (this.bubbles.length < targetCount) {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                const size = Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize;
                const color = this.getRandomColor();
                this.bubbles.push(new Bubble(x, y, size, color));
            }
            while (this.bubbles.length > targetCount) {
                this.bubbles.pop();
            }
        }, 250);
    }
    
    // Public API
    setSpeed(speed) {
        if (typeof speed === 'number' && speed > 0) {
            this.config.speedMultiplier = speed;
        }
    }
    
    setDensity(density) {
        if (typeof density === 'number' && density > 0) {
            this.config.density = density;
            this.init();
        }
    }
    
    setConnectionDistance(distance) {
        if (typeof distance === 'number' && distance >= 0) {
            this.config.connectionDistance = distance;
        }
    }
    
    setOutlineColors(colors) {
        if (Array.isArray(colors) && colors.length > 0) {
            const valid = colors.every(c => c && typeof c.r === 'number' && typeof c.g === 'number' && typeof c.b === 'number');
            if (valid) {
                this.config.outlineColors = colors;
                this.init();
            }
        }
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        window.removeEventListener('resize', this.resizeHandler);
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.bubbles = [];
        this.canvas = null;
        this.ctx = null;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const bubbleBackground = new BubbleBackground('bubbleContainer', {
        density: 0.8,
        speedMultiplier: 1,
        minSize: 3,
        maxSize: 8,
        connectionDistance: 150,
        connectionLineWidth: 1,
        trailOpacity: 0.05,
        outlineColors: [
            { r: 64, g: 224, b: 208 },   // Teal
            { r: 138, g: 127, b: 214 }   // Purple
        ]
    });
    
    window.bubbleBackground = bubbleBackground;
    
    // Examples:
    // window.bubbleBackground.setSpeed(2);
    // window.bubbleBackground.setDensity(2.0);
    // window.bubbleBackground.setConnectionDistance(200);
    // window.bubbleBackground.setOutlineColors([
    //     { r: 255, g: 100, b: 100 },
    //     { r: 100, g: 100, b: 255 }
    // ]);
});
