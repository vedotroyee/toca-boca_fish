import { Vector2 } from './Vector2';

export class Fish {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  maxForce: number = 0.05;
  maxSpeed: number = 2;
  size: number = 15;
  
  // Appearance
  color: string = '#ff9d76';
  finColor: string = '#ffa785';
  eyeColor: string = '#3e505b';
  type: string;
  
  id: number;
  
  cursorAvoidanceRadius: number = 90;
  cursorAvoidanceForce: number = 0.2;

  // Hunger state
  hunger: number = Math.random() * 50; 
  lastEatTime: number = performance.now();

  // Pufferfish specific
  isInflated: boolean = false;
  inflationSize: number = 0;

  // Segmented Body Wiggle mechanics
  segments: { pos: Vector2, angle: number }[] = [];
  numSegments: number = 5;
  segmentHistory: Vector2[] = [];

  // Timer Focus Arrival
  isArrival: boolean = false;
  arrivalTime: number = 0;

  constructor(x: number, y: number, id: number, type: string = 'Clownfish', isTimerFish: boolean = false) {
    this.acceleration = new Vector2();
    this.id = id;
    this.type = type;
    
    if (isTimerFish) {
       this.position = new Vector2(-this.size * 2, y); // start off screen left
       this.velocity = new Vector2(2, 0); // straight right
       this.isArrival = true;
       this.arrivalTime = performance.now();
    } else {
       this.position = new Vector2(x, y);
       this.velocity = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).setMag(2);
    }
    
    this.initType(type);

    // Initialize segments
    for (let i = 0; i < this.numSegments; i++) {
        this.segments.push({ pos: this.position.copy(), angle: 0 });
    }
  }

  initType(type: string) {
    switch(type) {
      case 'Betta':
        this.color = '#3b2f5c'; // Deep indigo 
        this.finColor = '#6a4d8c';
        this.maxSpeed = 1.2;
        this.size = 18;
        this.numSegments = 7;
        break;
      case 'Goldfish':
        this.color = '#ffa73c'; 
        this.finColor = '#ffcb85';
        this.maxSpeed = 1.0;
        this.size = 22;
        this.numSegments = 4;
        break;
      case 'Angelfish':
        this.color = '#e0e5eb'; 
        this.finColor = '#a8b6c4';
        this.maxSpeed = 1.5;
        this.size = 20;
        this.numSegments = 3;
        break;
      case 'Discus':
        this.color = '#ff6b6b'; 
        this.finColor = '#55c8c5';
        this.maxSpeed = 1.4;
        this.size = 25;
        this.numSegments = 4;
        break;
      case 'Neon':
        this.color = '#3498db'; 
        this.finColor = '#e74c3c';
        this.maxSpeed = 2.5;
        this.size = 8;
        this.numSegments = 3;
        break;
      case 'Corydoras':
        this.color = '#f5d6d6'; 
        this.finColor = '#d9b6b6';
        this.maxSpeed = 1.5;
        this.size = 14;
        this.numSegments = 4;
        break;
      case 'Jellyfish':
        this.color = 'rgba(255, 230, 240, 0.6)';
        this.finColor = 'rgba(255, 200, 200, 0.4)';
        this.maxSpeed = 0.5;
        this.size = 18;
        this.numSegments = 6;
        break;
      case 'Pufferfish':
        this.color = '#cfaeb1'; // pink-grey
        this.finColor = '#a88588';
        this.maxSpeed = 1.0;
        this.size = 14;
        this.numSegments = 3;
        break;
      case 'Clownfish':
      default:
        this.color = '#ff8c42'; 
        this.finColor = '#ffbc8f';
        this.maxSpeed = 1.8;
        this.size = 15;
        this.numSegments = 5;
        break;
    }
  }

  applyForce(force: Vector2) {
    this.acceleration.add(force);
  }

  update() {
    if (this.isArrival) {
       // Swim straight in gracefully
       if (performance.now() - this.arrivalTime < 2000) {
           this.velocity.setMag(1.2);
       } else {
           this.isArrival = false; // Normal behaviour resumes
       }
       this.position.add(this.velocity);
       this.updateSegments();
       return;
    }

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // reset acceleration
    
    // Hunger dynamics
    this.hunger += 0.03;
    // Pufferfish deflation physics
    if (this.type === 'Pufferfish') {
        if (!this.isInflated) {
            this.inflationSize = Math.max(0, this.inflationSize - 0.5); // Deflate
        } else {
            this.inflationSize = Math.min(25, this.inflationSize + 4); // Fast inflate!
            this.isInflated = false; // Reset, will be set to true again by avoidCursor if needed
            this.velocity.mult(0.9); // Huge drag when inflated
        }
    }

    this.updateSegments();
  }

  updateSegments() {
    // Record history of position
    this.segmentHistory.unshift(this.position.copy());
    
    // We only need as much history as the tail length. (roughly segment * spacing)
    const spacing = this.size * 0.5;
    if (this.segmentHistory.length > this.numSegments * spacing) {
        this.segmentHistory.pop();
    }

    // Assign positions to segments based on history
    this.segments[0].pos = this.position.copy();
    this.segments[0].angle = this.velocity.heading();

    for (let i = 1; i < this.numSegments; i++) {
        let historyIndex = Math.floor(i * spacing);
        if (historyIndex >= this.segmentHistory.length) {
            historyIndex = this.segmentHistory.length - 1;
        }

        if (historyIndex >= 0) {
            let targetPos = this.segmentHistory[historyIndex];
            
            // Calculate angle between segments for drawing
            let dx = this.segments[i-1].pos.x - targetPos.x;
            let dy = this.segments[i-1].pos.y - targetPos.y;
            this.segments[i].angle = Math.atan2(dy, dx);
            this.segments[i].pos = targetPos.copy();
        }
    }
  }

  seekFood(foods: {id: number, x: number, y: number, color: string, eaten: boolean}[]) {
    if (this.hunger < 30 || this.type === 'Jellyfish') return; // Jellies drift

    let closestFood = null;
    let recordDist = Infinity;

    for (let food of foods) {
        if (food.eaten) continue;
        const d = this.position.dist(new Vector2(food.x, food.y));
        if (d < recordDist) {
            recordDist = d;
            closestFood = food;
        }
    }

    if (closestFood) {
        if (recordDist < this.size) {
            closestFood.eaten = true;
            this.hunger = Math.max(0, this.hunger - 40);
            this.lastEatTime = performance.now();
        } else {
            const desired = Vector2.sub(new Vector2(closestFood.x, closestFood.y), this.position);
            desired.normalize();
            desired.mult(this.maxSpeed * 1.5);
            const steer = Vector2.sub(desired, this.velocity);
            steer.limit(this.maxForce * 1.5);
            this.applyForce(steer);
        }
    }
  }

  checkEdges(width: number, height: number) {
    const margin = 50;
    const turnForce = 0.15;
    let desired = null;
    
    // Corydoras stay near the bottom
    let customHeightMarginTop = margin;
    let customHeightMarginBot = margin;
    if (this.type === 'Corydoras') {
       customHeightMarginTop = height - 100;
    }

    if (this.position.x < margin) {
      desired = new Vector2(this.maxSpeed, this.velocity.y);
    } else if (this.position.x > width - margin) {
      desired = new Vector2(-this.maxSpeed, this.velocity.y);
    }
    
    if (this.position.y < customHeightMarginTop) {
      desired = new Vector2(this.velocity.x, this.maxSpeed);
    } else if (this.position.y > height - customHeightMarginBot) {
      desired = new Vector2(this.velocity.x, -this.maxSpeed);
    }

    if (desired) {
      desired.normalize();
      desired.mult(this.maxSpeed);
      const steer = Vector2.sub(desired, this.velocity);
      steer.limit(turnForce);
      this.applyForce(steer);
    }
  }

  avoidCursor(cursorX: number, cursorY: number) {
    const cursor = new Vector2(cursorX, cursorY);
    const d = this.position.dist(cursor);
    
    if (d < this.cursorAvoidanceRadius) {
      if (this.type === 'Pufferfish') {
          this.isInflated = true; // Trigger inflation
      }

      const diff = Vector2.sub(this.position, cursor);
      diff.normalize();
      diff.mult(1 / d);
      diff.mult(this.maxSpeed * this.cursorAvoidanceForce * 100);
      
      const steer = Vector2.sub(diff, this.velocity);
      steer.limit(this.maxForce * 3);
      this.applyForce(steer);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.type === 'Jellyfish') {
      this.drawJellyfish(ctx);
      return;
    }

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1. Draw Fins (attach to segment 1 or 2)
    const midIdx = Math.floor(this.numSegments / 2);
    const midSeg = this.segments[midIdx] || this.segments[0];
    
    // Depending on type, draw specific fin shapes
    if (this.type === 'Angelfish') {
       this.drawAngelfishFins(ctx, midSeg);
    } else if (this.type === 'Betta') {
       this.drawBettaFins(ctx, midSeg);
    } else {
       // generic fins (top and bottom)
       ctx.fillStyle = this.finColor;
       ctx.save();
       ctx.translate(midSeg.pos.x, midSeg.pos.y);
       ctx.rotate(midSeg.angle);
       ctx.beginPath();
       ctx.moveTo(-this.size * 0.3, -this.size * 0.3);
       ctx.quadraticCurveTo(-this.size * 0.5, -this.size * 1.5, this.size * 0.2, -this.size * 0.3);
       ctx.fill();
       ctx.beginPath();
       ctx.moveTo(-this.size * 0.3, this.size * 0.3);
       ctx.quadraticCurveTo(-this.size * 0.5, this.size * 1.5, this.size * 0.2, this.size * 0.3);
       ctx.fill();
       ctx.restore();
    }

    // 2. Draw Body (Segmented)
    const renderSegments = true;
    if (renderSegments) {
        for (let i = this.numSegments - 1; i >= 0; i--) {
            const seg = this.segments[i];
            const sizeMultiplier = 1 - (i / this.numSegments) * 0.8; // Tail gets smaller
            
            // For discus, make it extremely round and fat at the center
            let rX = this.size * 0.6 * sizeMultiplier;
            let rY = this.size * 0.8 * sizeMultiplier;
            if (this.type === 'Discus' && i === 1) {
                rY = this.size; 
                rX = this.size * 1.2;
            } else if (this.type === 'Angelfish' && i === 1) {
                rY = this.size * 1.5;
            } else if (this.type === 'Goldfish' && i === 1) {
                rY = this.size * 1.2;
                rX = this.size * 1.0;
            } else if (this.type === 'Pufferfish') {
                rY += this.inflationSize * sizeMultiplier;
                rX += (this.inflationSize * 0.8) * sizeMultiplier; // Swell up like a balloon
            }

            // Draw segment
            ctx.save();
            ctx.translate(seg.pos.x, seg.pos.y);
            ctx.rotate(seg.angle);
            ctx.fillStyle = (i === this.numSegments - 1) ? this.finColor : this.color;
            ctx.beginPath();
            
            if (i === this.numSegments - 1) {
                // Tail fin on last segment
                ctx.moveTo(rX, 0);
                let tailSpread = this.size * 1.2;
                if (this.type === 'Betta') tailSpread = this.size * 2;
                ctx.lineTo(-rX * 2, -tailSpread);
                ctx.lineTo(-rX * 2, tailSpread);
                ctx.closePath();
                ctx.fill();
            } else {
                // Body chunk
                ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
                ctx.fill();

                // Pufferfish spikes
                if (this.type === 'Pufferfish' && this.inflationSize > 5 && i === 1) {
                    ctx.fillStyle = this.finColor;
                    for (let s = 0; s < 8; s++) {
                        const angle = (Math.PI * 2 / 8) * s;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(angle) * rX, Math.sin(angle) * rY);
                        ctx.lineTo(Math.cos(angle - 0.2) * (rX + 4), Math.sin(angle - 0.2) * (rY + 4));
                        ctx.lineTo(Math.cos(angle) * (rX + 8), Math.sin(angle) * (rY + 8));
                        ctx.fill();
                    }
                }
                
                // Stripe?
                if (this.type === 'Neon') {
                    ctx.fillStyle = '#ff3366'; // red understripe
                    ctx.beginPath(); ctx.ellipse(0, rY*0.5, rX*0.8, rY*0.2, 0, 0, Math.PI*2); ctx.fill();
                } else if (this.type === 'Clownfish' && (i === 1 || i === 3)) {
                    ctx.fillStyle = 'rgba(255,255,255,0.8)'; // white stripe
                    ctx.beginPath(); ctx.ellipse(0, 0, rX*0.5, rY, 0, 0, Math.PI*2); ctx.fill();
                }
            }
            ctx.restore();
        }
    }

    // 3. Draw Eyes (on first segment)
    const head = this.segments[0];
    ctx.save();
    ctx.translate(head.pos.x, head.pos.y);
    ctx.rotate(head.angle);
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.size * 0.4, -this.size * 0.25, Math.max(3, this.size * 0.2), 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.arc(this.size * 0.5, -this.size * 0.25, Math.max(1, this.size * 0.1), 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();

    this.drawHungerState(ctx);

    if (this.isArrival) {
        this.drawArrivalEffects(ctx);
    }

    ctx.restore();
  }

  drawAngelfishFins(ctx: CanvasRenderingContext2D, seg: {pos: Vector2, angle: number}) {
      ctx.fillStyle = this.finColor;
      ctx.save();
      ctx.translate(seg.pos.x, seg.pos.y);
      ctx.rotate(seg.angle);
      // Top Fin
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.2, -this.size * 0.5);
      ctx.lineTo(-this.size * 1.5, -this.size * 3.5);
      ctx.lineTo(this.size * 0.5, -this.size * 0.5);
      ctx.fill();
      // Bottom Fin
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.2, this.size * 0.5);
      ctx.lineTo(-this.size * 1.5, this.size * 3.5);
      ctx.lineTo(this.size * 0.5, this.size * 0.5);
      ctx.fill();
       // Black stripes
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, -this.size); ctx.lineTo(0, this.size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-this.size*0.8, -this.size); ctx.lineTo(-this.size*0.8, this.size); ctx.stroke();
      ctx.restore();
  }

  drawBettaFins(ctx: CanvasRenderingContext2D, seg: {pos: Vector2, angle: number}) {
      ctx.fillStyle = this.finColor;
      ctx.save();
      ctx.translate(seg.pos.x, seg.pos.y);
      ctx.rotate(seg.angle);
      
      const wave = Math.sin(performance.now() * 0.002) * 5;
      
      // Giant flowing top fin
      ctx.beginPath();
      ctx.moveTo(this.size * 0.2, -this.size * 0.4);
      ctx.quadraticCurveTo(-this.size, -this.size * 3 + wave, -this.size * 2, -this.size * 0.5);
      ctx.fill();
      // Flowing bottom fin
      ctx.beginPath();
      ctx.moveTo(this.size * 0.2, this.size * 0.4);
      ctx.quadraticCurveTo(-this.size, this.size * 3 - wave, -this.size * 2, this.size * 0.5);
      ctx.fill();
      ctx.restore();
  }

  drawJellyfish(ctx: CanvasRenderingContext2D) {
      // Jellies move vertically mostly, we override drawing
      const head = this.position;
      ctx.save();
      ctx.translate(head.x, head.y);
      const wiggle = Math.sin(performance.now() * 0.003) * 5;
      
      ctx.fillStyle = this.color;
      // Dome
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.8 + wiggle, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      // Tendrils
      ctx.strokeStyle = this.finColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for(let i=0; i<5; i++) {
          ctx.beginPath();
          const offsetX = -this.size*0.6 + i*(this.size*0.3);
          ctx.moveTo(offsetX, 0);
          ctx.quadraticCurveTo(offsetX + wiggle, this.size, offsetX - wiggle, this.size * 2);
          ctx.quadraticCurveTo(offsetX, this.size * 3, offsetX + wiggle * 2, this.size * 4);
          ctx.stroke();
      }
      ctx.restore();
  }

  drawHungerState(ctx: CanvasRenderingContext2D) {
    if (this.hunger > 70) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y - this.size * 2.5);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath(); ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3e505b';
        ctx.font = '12px Poppins, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('...', 0, -2);
        ctx.restore();
    } else if (performance.now() - this.lastEatTime < 2000) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y - this.size * 2.5);
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '16px Poppins';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('❤', 0, 0);
        ctx.restore();
    }
  }

  drawArrivalEffects(ctx: CanvasRenderingContext2D) {
      const timeElapsed = performance.now() - this.arrivalTime;
      
      // Sparkles burst for first 1 second
      if (timeElapsed < 1000) {
          ctx.save();
          // We must undo rotation from Fish's main draw if it was rotated, but drawArrivalEffects 
          // is called from inside fish's ctx.restore state? No, we called it inside draw, but after restore? 
          // Wait, draw() saves then does stuff. At the end it restores. Oh, I put drawArrivalEffects BEFORE ctx.restore().
          // Wait, no, the main draw() does ctx.save() at the start.
          // Let's just translate to position here, but without the segment's rotation.
          ctx.restore(); // pop the main draw's save first
          
          ctx.save();
          ctx.translate(this.position.x, this.position.y);
          
          for(let i=0; i<4; i++) {
              const angle = (Math.PI * 2 / 4) * i + timeElapsed * 0.005;
              const dist = 20 + (timeElapsed / 1000) * 30; // expand outwards
              const opacity = 1 - (timeElapsed / 1000);
              ctx.globalAlpha = opacity;
              
              ctx.fillStyle = '#00d2d3'; // teal
              ctx.beginPath();
              ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 3, 0, Math.PI*2);
              ctx.fill();
              
              ctx.fillStyle = '#feca57'; // gold
              ctx.beginPath();
              ctx.arc(Math.cos(angle + 0.5) * dist * 0.8, Math.sin(angle + 0.5) * dist * 0.8, 2, 0, Math.PI*2);
              ctx.fill();
          }
          ctx.restore();
          
          // Re-save to balance the restore at the very end of draw()
          ctx.save(); 
      }

      // Speech bubble "Hi!" or species name
      // Floats above for 2 seconds
      if (timeElapsed < 2000) {
          const opacity = timeElapsed < 1500 ? 1 : 1 - ((timeElapsed - 1500) / 500);
          
          ctx.restore(); // pop the main draw's save
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(this.position.x, this.position.y - this.size * 2 - 15);
          
          // Bubble tail
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.moveTo(0, 5);
          ctx.lineTo(-5, -5);
          ctx.lineTo(5, -5);
          ctx.fill();
          
          // Bubble body (pill shape)
          const text = "Hi!";
          ctx.font = 'bold 12px Nunito, sans-serif';
          const textWidth = ctx.measureText(text).width;
          const pad = 8;
          ctx.beginPath();
          ctx.ellipse(0, -15, textWidth/2 + pad, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#5c4f44';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 0, -14);
          
          ctx.restore();
          ctx.save(); // keep balanced
      }
  }
}
