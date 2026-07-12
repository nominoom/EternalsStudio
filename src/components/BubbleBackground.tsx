'use client';

import React, { useEffect, useRef } from 'react';

// ============================================================================
// QUADTREE IMPLEMENTATION (for efficient spatial lookups)
// ============================================================================
class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point: { x: number; y: number }): boolean {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  intersects(range: Rectangle): boolean {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class QuadTree {
  boundary: Rectangle;
  capacity: number;
  points: Bubble[];
  divided: boolean;
  northeast?: QuadTree;
  northwest?: QuadTree;
  southeast?: QuadTree;
  southwest?: QuadTree;

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w / 2;
    const h = this.boundary.h / 2;

    this.northeast = new QuadTree(new Rectangle(x + w, y - h, w, h), this.capacity);
    this.northwest = new QuadTree(new Rectangle(x - w, y - h, w, h), this.capacity);
    this.southeast = new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity);
    this.southwest = new QuadTree(new Rectangle(x - w, y + h, w, h), this.capacity);
    this.divided = true;
  }

  insert(bubble: Bubble): boolean {
    if (!this.boundary.contains(bubble)) {
      return false;
    }
    if (this.points.length < this.capacity) {
      this.points.push(bubble);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      return (
        this.northeast!.insert(bubble) ||
        this.northwest!.insert(bubble) ||
        this.southeast!.insert(bubble) ||
        this.southwest!.insert(bubble)
      );
    }
  }

  query(range: Rectangle, found: Bubble[] = []): Bubble[] {
    if (!this.boundary.intersects(range)) {
      return found;
    }
    for (const p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.northeast!.query(range, found);
      this.northwest!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
    }
    return found;
  }
}

// ============================================================================
// BUBBLE CLASS (Drift physics)
// ============================================================================
interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

class Bubble {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: ColorRGB;
  driftAngle: number;
  driftSpeed: number;
  driftChangeTimer: number;

  constructor(x: number, y: number, size: number, color: ColorRGB) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.size = size;
    this.color = color;
    this.driftAngle = Math.random() * Math.PI * 2;
    this.driftSpeed = Math.random() * 0.2 + 0.1;
    this.driftChangeTimer = Math.random() * 100;
  }

  update(canvasWidth: number, canvasHeight: number, speedMultiplier: number) {
    if (this.driftChangeTimer++ > 120) {
      this.driftAngle += (Math.random() - 0.5) * Math.PI / 2;
      this.driftChangeTimer = 0;
    }

    this.baseX += Math.cos(this.driftAngle) * this.driftSpeed * speedMultiplier;
    this.baseY += Math.sin(this.driftAngle) * this.driftSpeed * speedMultiplier;

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

    const homeX = this.baseX - this.x;
    const homeY = this.baseY - this.y;
    this.x += homeX / 50;
    this.y += homeY / 50;
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    // Semi-transparent bubble fill depending on theme
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Colored outline
    ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${isDark ? '0.35' : '0.25'})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// ============================================================================
// REACT COMPONENT
// ============================================================================
export default function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let bubbles: Bubble[] = [];
    
    // Performance configurations based on screen size (Mobile optimization)
    const isMobile = window.innerWidth < 768;
    const density = isMobile ? 0.35 : 0.75;
    const connectionDistance = isMobile ? 100 : 150;
    const speedMultiplier = 1;
    const minSize = 3;
    const maxSize = 8;
    const connectionLineWidth = 1;

    // Dark & Light Mode Color Palettes
    const darkColors: ColorRGB[] = [
      { r: 64, g: 224, b: 208 },  // Teal
      { r: 138, g: 127, b: 214 }  // Purple
    ];

    const lightColors: ColorRGB[] = [
      { r: 13, g: 148, b: 136 },  // Teal-600
      { r: 79, g: 70, b: 229 }    // Indigo-600
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getRandomColor = (isDark: boolean) => {
      const colors = isDark ? darkColors : lightColors;
      const t = Math.random();
      const c1 = colors[0];
      const c2 = colors[colors.length - 1];

      return {
        r: Math.floor(c1.r + (c2.r - c1.r) * t),
        g: Math.floor(c1.g + (c2.g - c1.g) * t),
        b: Math.floor(c1.b + (c2.b - c1.b) * t)
      };
    };

    const initBubbles = (isDark: boolean) => {
      const area = canvas.width * canvas.height;
      const areaUnit = 10000; // 100px x 100px
      const count = Math.floor((area / areaUnit) * density);

      bubbles = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * (maxSize - minSize) + minSize;
        const color = getRandomColor(isDark);
        bubbles.push(new Bubble(x, y, size, color));
      }
    };

    // Listen for theme transitions to update bubble colors smoothly
    let lastThemeIsDark = document.documentElement.classList.contains('dark');

    resizeCanvas();
    initBubbles(lastThemeIsDark);

    const handleResize = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      resizeCanvas();

      // Recalculate bubble counts and scale positions appropriately
      const scaleX = canvas.width / oldWidth;
      const scaleY = canvas.height / oldHeight;

      const isCurrentlyMobile = window.innerWidth < 768;
      const currentDensity = isCurrentlyMobile ? 0.35 : 0.75;
      const area = canvas.width * canvas.height;
      const targetCount = Math.floor((area / 10000) * currentDensity);

      const isDark = document.documentElement.classList.contains('dark');

      // Adjust positions of existing bubbles
      for (const bubble of bubbles) {
        bubble.baseX *= scaleX;
        bubble.baseY *= scaleY;
        bubble.x *= scaleX;
        bubble.y *= scaleY;
      }

      // Add or remove bubbles depending on size changes
      if (bubbles.length < targetCount) {
        const toAdd = targetCount - bubbles.length;
        for (let i = 0; i < toAdd; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * (maxSize - minSize) + minSize;
          const color = getRandomColor(isDark);
          bubbles.push(new Bubble(x, y, size, color));
        }
      } else if (bubbles.length > targetCount) {
        bubbles.splice(targetCount);
      }
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark');

      // If theme toggled, update colors of existing bubbles to match current theme
      if (isDark !== lastThemeIsDark) {
        for (const bubble of bubbles) {
          bubble.color = getRandomColor(isDark);
        }
        lastThemeIsDark = isDark;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const boundary = new Rectangle(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        canvas.height / 2
      );
      const quadtree = new QuadTree(boundary, 4);

      for (const bubble of bubbles) {
        bubble.update(canvas.width, canvas.height, speedMultiplier);
        quadtree.insert(bubble);
      }

      const connectionRadiusSquared = connectionDistance * connectionDistance;
      ctx.lineWidth = connectionLineWidth;

      // Draw node connections
      for (const bubble of bubbles) {
        const range = new Rectangle(
          bubble.x,
          bubble.y,
          connectionDistance,
          connectionDistance
        );
        const nearby = quadtree.query(range);

        for (const other of nearby) {
          if (bubble === other) continue;

          const dx = bubble.x - other.x;
          const dy = bubble.y - other.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionRadiusSquared) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / connectionDistance) * (isDark ? 0.25 : 0.18);

            const avgR = (bubble.color.r + other.color.r) >> 1;
            const avgG = (bubble.color.g + other.color.g) >> 1;
            const avgB = (bubble.color.b + other.color.b) >> 1;

            ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(bubble.x, bubble.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // Draw bubbles
      for (const bubble of bubbles) {
        bubble.draw(ctx, isDark);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none transition-colors duration-300"
      style={{ display: 'block' }}
    />
  );
}
