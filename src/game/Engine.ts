import { Fish } from './Fish';
import { audio } from './Audio';
import { Vector2 } from './Vector2';

export class Engine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  parent: HTMLDivElement;
  
  fishes: Fish[] = [];
  animationId: number = 0;
  
  cursorX: number = -1000;
  cursorY: number = -1000;
  
  width: number = 0;
  height: number = 0;

  // Environment elements
  bubbles: { x: number, y: number, size: number, speed: number, offset: number }[] = [];
  foods: { id: number, x: number, y: number, color: string, eaten: boolean }[] = [];
  foodIdCounter = 0;
  
  // Cat visitor interactions
  catRippleRadius = 0;
  catRippleMax = 300;
  catRippleActive = false;
  catTapX = 0;
  catTapY = 0;

  constructor(canvas: HTMLCanvasElement, parent: HTMLDivElement) {
    this.canvas = canvas;
    this.parent = parent;
    
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error("Could not get 2D context");
    this.ctx = context;
    
    this.handleResize = this.handleResize.bind(this);
    this.loop = this.loop.bind(this);
    
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    
    this.initEnvironment();
    this.initEvents();
  }

  initEnvironment() {
    // Generate environment bubbles
    for (let i = 0; i < 20; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  initEvents() {
    window.addEventListener('aquarium:add_fish', ((e: CustomEvent) => {
      if (this.fishes.length >= 10) return;
      this.fishes.push(new Fish(Math.random() * this.width, Math.random() * this.height, this.fishes.length, e.detail.type));
    }) as EventListener);

    window.addEventListener('aquarium:add_timer_fish', ((e: CustomEvent) => {
      // Timer fish have no maximum limit!
      this.fishes.push(new Fish(0, Math.random() * (this.height - 100) + 50, this.fishes.length, e.detail.type, true));
      window.dispatchEvent(new Event('aquarium:cat_notice'));
      audio.init();
      audio.playChime();
    }) as EventListener);

    window.addEventListener('aquarium:cat_tap', () => {
      // Align ripple roughly where the DOM Cat's paw hits the glass (left-top)
      this.catTapX = this.width * 0.25;
      this.catTapY = this.height * 0.2; // Top of the tank!
      this.catRippleRadius = 10;
      this.catRippleActive = true;
      audio.init();
      audio.playMeow();

      // Scatter fishes violently
      for(let fish of this.fishes) {
          let diff = Vector2.sub(fish.position, new Vector2(this.catTapX, this.catTapY));
          diff.normalize();
          diff.mult(fish.maxSpeed * 30); // huge burst
          fish.applyForce(diff);
      }
    });
  }

  handleResize() {
    const rect = this.parent.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    
    this.ctx.scale(dpr, dpr);
  }

  updateCursor(x: number, y: number) {
    this.cursorX = x;
    this.cursorY = y;
  }

  dropFood() {
    audio.init();
    audio.playBubble();
    for(let i = 0; i < 3; i++) {
        this.foods.push({
            id: this.foodIdCounter++,
            x: Math.random() * (this.width - 100) + 50,
            y: -10 + Math.random() * -20,
            color: '#f8d95b',
            eaten: false
        });
    }
  }

  start() {
    if (!this.animationId) {
      this.loop(performance.now());
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
    window.removeEventListener('resize', this.handleResize);
  }

  // --- DRAWING ENVIRONMENT ---

  drawDecorations(time: number) {
    const ctx = this.ctx;

    // 1. Draw sand hills in background
    ctx.fillStyle = 'rgba(232, 207, 166, 0.4)'; // darker sand
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, this.height - 60);
    ctx.quadraticCurveTo(this.width * 0.3, this.height - 120, this.width * 0.6, this.height - 80);
    ctx.quadraticCurveTo(this.width * 0.8, this.height - 60, this.width, this.height - 90);
    ctx.lineTo(this.width, this.height);
    ctx.fill();

    // 2. Draw Rocks
    ctx.fillStyle = '#6a7882';
    ctx.beginPath(); ctx.ellipse(this.width * 0.8, this.height - 30, 60, 40, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5c6770';
    ctx.beginPath(); ctx.ellipse(this.width * 0.85, this.height - 15, 50, 30, 0, 0, Math.PI*2); ctx.fill();

    // 3. Draw Vallisneria (Swaying plants)
    ctx.strokeStyle = '#4e9a5c';
    ctx.lineCap = 'round';
    for(let i=0; i<8; i++) {
      ctx.lineWidth = 6 - (i%3);
      ctx.beginPath();
      const stX = 50 + i * 15;
      const stY = this.height - 20;
      ctx.moveTo(stX, stY);
      
      const wave = Math.sin(time * 0.001 + i) * 20;
      ctx.quadraticCurveTo(stX + wave, stY - 60, stX + wave * 1.5, stY - 150 - (i%2)*20);
      ctx.stroke();
    }

    // 4. Draw Driftwood Arch
    ctx.fillStyle = '#4a3424';
    ctx.beginPath();
    ctx.moveTo(this.width * 0.3, this.height - 20);
    ctx.quadraticCurveTo(this.width * 0.4, this.height - 180, this.width * 0.55, this.height - 20);
    ctx.quadraticCurveTo(this.width * 0.5, this.height - 140, this.width * 0.35, this.height - 20);
    ctx.fill();

    // Moss on arch
    ctx.fillStyle = '#3a5a24';
    ctx.beginPath();
    ctx.ellipse(this.width * 0.42, this.height - 120, 20, 10, -Math.PI/6, 0, Math.PI*2);
    ctx.fill();

    // 5. Foreground Sand Floor
    ctx.fillStyle = '#e8cfa6';
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, this.height - 40);
    ctx.quadraticCurveTo(this.width * 0.25, this.height - 60, this.width * 0.5, this.height - 30);
    ctx.quadraticCurveTo(this.width * 0.75, this.height - 10, this.width, this.height - 45);
    ctx.lineTo(this.width, this.height);
    ctx.fill();

    // 6. Treasure chest opening/closing
    const openAngle = Math.abs(Math.sin(time * 0.0005));
    ctx.save();
    ctx.translate(this.width * 0.2, this.height - 45);
    ctx.fillStyle = '#6b4d3a';
    ctx.fillRect(-25, -20, 50, 30); // base
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-20, -15, 40, 20); // gold
    ctx.fillStyle = '#8c6a51';
    ctx.rotate(-openAngle);
    ctx.beginPath();
    ctx.arc(0, -20, 25, Math.PI, 0); // lid
    ctx.fill();
    ctx.restore();
  }

  drawEnvironment(time: number) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // God rays
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'overlay';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.beginPath();
    this.ctx.moveTo(this.width * 0.1, 0);
    this.ctx.lineTo(this.width * 0.3, 0);
    this.ctx.lineTo(this.width * 0.5 + Math.sin(time * 0.001) * 60, this.height);
    this.ctx.lineTo(this.width * 0.0 + Math.sin(time * 0.001) * 30, this.height);
    this.ctx.fill();
    this.ctx.restore();

    this.drawDecorations(time);

    // Draw bubbles
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let bubble of this.bubbles) {
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(time * 0.002 + bubble.offset) * 0.5;
      
      if (bubble.y < -10) {
        bubble.y = this.height + 10;
        // respawn near treasure chest or rocks
        bubble.x = Math.random() > 0.5 ? this.width * 0.2 + Math.random() * 20 : this.width * 0.8 + Math.random() * 40;
      }

      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawRipple() {
    if(!this.catRippleActive) return;

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - (this.catRippleRadius / this.catRippleMax)})`;
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(this.catTapX, this.catTapY, this.catRippleRadius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.catRippleRadius += 5;
    if (this.catRippleRadius > this.catRippleMax) {
        this.catRippleActive = false;
    }
  }

  loop(time: number) {
    this.drawEnvironment(time);

    // Update and draw foods
    this.ctx.fillStyle = '#f8d95b'; // yellow food color
    for (let food of this.foods) {
        food.y += 1; // sink slowly
        this.ctx.beginPath();
        this.ctx.arc(food.x, food.y, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    this.foods = this.foods.filter(f => !f.eaten && f.y < this.height - 20);

    // Update and draw fishes
    for (let fish of this.fishes) {
      fish.avoidCursor(this.cursorX, this.cursorY);
      fish.seekFood(this.foods);
      fish.checkEdges(this.width, this.height);
      fish.update();
      fish.draw(this.ctx);
    }

    this.drawRipple();

    this.animationId = requestAnimationFrame(this.loop);
  }
}
