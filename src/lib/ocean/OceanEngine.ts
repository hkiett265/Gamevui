import { FishEntity, FISH_DEFINITIONS } from './fishTypes';
import { CANNON_CONFIGS, useOceanFishStore } from '@/stores/useOceanFishStore';
import { oceanSoundSystem } from '@/audio/oceanSoundSystem';

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  level: number;
  damage: number;
  netRadius: number;
  color: string;
  glowColor: string;
  targetX?: number;
  targetY?: number;
}

export interface EnergyNet {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  damage: number;
  hitFishIds: Set<string>;
}

export interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  seed: number;
  alpha: number;
}

export interface CoinParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  life: number;
  maxLife: number;
  value: number;
  size: number;
  isBoss: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

export class OceanEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private lastTime = 0;

  // Entities
  public fishList: FishEntity[] = [];
  public bullets: Bullet[] = [];
  public nets: EnergyNet[] = [];
  public bubbles: Bubble[] = [];
  public coins: CoinParticle[] = [];
  public floatingTexts: FloatingText[] = [];

  // Spawner timers
  private spawnTimer = 0;
  private bossTimer = 18; // First boss arrives at 18s
  private dragonTimer = 45; // Dragon arrives at 45s

  // Cannon state
  public cannonX = 0;
  public cannonY = 0;
  public cannonAngle = -Math.PI / 2;
  public recoil = 0;

  // Auto-fire interval
  private autoFireTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

    this.initBubbles(40);
    this.handleResize();
  }

  public handleResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.ctx.scale(dpr, dpr);

    this.cannonX = width / 2;
    this.cannonY = height - 15;
  }

  private initBubbles(count: number) {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.bubbles = [];
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 8,
        speed: 30 + Math.random() * 50,
        wobbleSpeed: 2 + Math.random() * 3,
        wobbleAmp: 10 + Math.random() * 15,
        seed: Math.random() * 100,
        alpha: 0.2 + Math.random() * 0.4
      });
    }
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private loop = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    const store = useOceanFishStore.getState();

    if (store.gameState === 'PLAYING') {
      store.tickTimer(dt);
      this.update(dt);
    }

    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  public setAim(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const targetX = clientX - rect.left;
    const targetY = clientY - rect.top;
    const dx = targetX - this.cannonX;
    const dy = targetY - this.cannonY;

    // Angle clamped so cannon doesn't shoot backwards into bottom floor
    let angle = Math.atan2(dy, dx);
    if (angle > -0.15 && angle < Math.PI / 2) angle = -0.15;
    if (angle < -Math.PI + 0.15 || angle > Math.PI / 2) angle = -Math.PI + 0.15;

    this.cannonAngle = angle;
    useOceanFishStore.getState().setCannonAngle(angle);
  }

  public shoot(targetX?: number, targetY?: number) {
    const store = useOceanFishStore.getState();
    if (store.gameState !== 'PLAYING') return;

    const canShoot = store.deductBulletCost();
    if (!canShoot) return;

    const config = CANNON_CONFIGS[store.cannonLevel];
    oceanSoundSystem.playCannonShoot(store.cannonLevel);
    this.recoil = 12; // visual recoil kickback

    // Calculate muzzle spawn position
    const muzzleDist = 42;
    const bx = this.cannonX + Math.cos(this.cannonAngle) * muzzleDist;
    const by = this.cannonY + Math.sin(this.cannonAngle) * muzzleDist;

    const speed = config.bulletSpeed * 40;
    this.bullets.push({
      id: 'b_' + Math.random().toString(36).substring(2, 9),
      x: bx,
      y: by,
      vx: Math.cos(this.cannonAngle) * speed,
      vy: Math.sin(this.cannonAngle) * speed,
      angle: this.cannonAngle,
      level: store.cannonLevel,
      damage: config.damage,
      netRadius: config.netRadius,
      color: config.color,
      glowColor: config.glowColor,
      targetX,
      targetY
    });
  }

  public triggerBomb() {
    const store = useOceanFishStore.getState();
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;

    // Massive screen-clearing underwater depth charge
    this.spawnNet(w / 2, h / 2, 400, 35, '#f43f5e');

    this.floatingTexts.push({
      id: 'ft_' + Math.random(),
      x: w / 2,
      y: h / 2,
      text: '💥 BOM ĐẠI DƯƠNG!',
      color: '#f43f5e',
      size: 32,
      alpha: 1,
      life: 2.0
    });
  }

  private update(dt: number) {
    const store = useOceanFishStore.getState();
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;

    // 1. Recoil recovery
    if (this.recoil > 0) {
      this.recoil = Math.max(0, this.recoil - dt * 60);
    }

    // 2. Auto-fire
    if (store.isAutoFiring) {
      this.autoFireTimer += dt;
      if (this.autoFireTimer >= 0.28) {
        this.autoFireTimer = 0;
        this.shoot();
      }
    }

    // 3. Spawning
    this.spawnTimer += dt;
    if (this.spawnTimer > 1.2) {
      this.spawnTimer = 0;
      this.spawnRandomFish(w, h);
    }

    // Boss Spawning
    this.bossTimer -= dt;
    if (this.bossTimer <= 0) {
      this.bossTimer = 28;
      this.spawnBoss('shark', w, h);
    }

    this.dragonTimer -= dt;
    if (this.dragonTimer <= 0) {
      this.dragonTimer = 50;
      this.spawnBoss('dragon', w, h);
    }

    // 4. Update Fish
    const isFrozen = store.freezeActive;
    for (let i = this.fishList.length - 1; i >= 0; i--) {
      const fish = this.fishList[i];
      fish.update(dt, isFrozen);

      // Despawn fish that swim far off-screen
      const pad = 120;
      if (
        fish.x < -pad ||
        fish.x > w + pad ||
        fish.y < -pad ||
        fish.y > h + pad
      ) {
        this.fishList.splice(i, 1);
      }
    }

    // 5. Update Bullets & Collisions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Check collision against fish
      let exploded = false;
      for (const fish of this.fishList) {
        const dist = Math.hypot(b.x - fish.x, b.y - fish.y);
        const hitRadius = Math.max(fish.def.width, fish.def.height) * 0.45;
        if (dist <= hitRadius) {
          this.spawnNet(b.x, b.y, b.netRadius, b.damage, b.color);
          exploded = true;
          break;
        }
      }

      // Check target reached or out of bounds
      if (!exploded) {
        if (b.targetX !== undefined && b.targetY !== undefined) {
          const distToTarget = Math.hypot(b.x - b.targetX, b.y - b.targetY);
          if (distToTarget <= 25) {
            this.spawnNet(b.x, b.y, b.netRadius, b.damage, b.color);
            exploded = true;
          }
        } else if (b.x < 0 || b.x > w || b.y < 0 || b.y > h) {
          this.spawnNet(b.x, b.y, b.netRadius, b.damage, b.color);
          exploded = true;
        }
      }

      if (exploded) {
        this.bullets.splice(i, 1);
      }
    }

    // 6. Update Nets (Expanding Shockwave)
    for (let i = this.nets.length - 1; i >= 0; i--) {
      const net = this.nets[i];
      net.radius += (net.maxRadius - net.radius) * dt * 10;
      net.alpha -= dt * 2.2;

      // Damage fish inside net
      for (let fIdx = this.fishList.length - 1; fIdx >= 0; fIdx--) {
        const fish = this.fishList[fIdx];
        if (net.hitFishIds.has(fish.id)) continue;

        const dist = Math.hypot(net.x - fish.x, net.y - fish.y);
        if (dist <= net.radius + Math.max(fish.def.width, fish.def.height) * 0.35) {
          net.hitFishIds.add(fish.id);
          oceanSoundSystem.playFishHit();
          const isCaught = fish.takeDamage(net.damage);

          if (isCaught) {
            store.recordFishCatch(fish.def.baseCoins, fish.def.isBoss);
            this.spawnCoins(fish.x, fish.y, fish.def.baseCoins, fish.def.isBoss);
            this.floatingTexts.push({
              id: 'ft_' + Math.random(),
              x: fish.x,
              y: fish.y - 15,
              text: `+${Math.round(fish.def.baseCoins * store.multiplier)}`,
              color: fish.def.isBoss ? '#facc15' : '#38bdf8',
              size: fish.def.isBoss ? 28 : 20,
              alpha: 1,
              life: 1.2
            });
            this.fishList.splice(fIdx, 1);
          }
        }
      }

      if (net.alpha <= 0) {
        this.nets.splice(i, 1);
      }
    }

    // 7. Update Coins (Physics to Cannon)
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.life -= dt;

      // Arc towards cannon position at bottom center
      const dx = this.cannonX - c.x;
      const dy = this.cannonY - c.y;
      const dist = Math.hypot(dx, dy);

      c.vx += (dx / dist) * 1200 * dt;
      c.vy += (dy / dist) * 1200 * dt;

      c.x += c.vx * dt;
      c.y += c.vy * dt;

      if (dist < 30 || c.life <= 0) {
        this.coins.splice(i, 1);
      }
    }

    // 8. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y -= dt * 45;
      ft.alpha = Math.max(0, ft.life / 1.2);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 9. Update Ambient Bubbles
    for (const b of this.bubbles) {
      b.y -= b.speed * dt;
      b.x += Math.sin(b.seed + performance.now() * 0.003 * b.wobbleSpeed) * b.wobbleAmp * dt;
      if (b.y < -20) {
        b.y = h + 20;
        b.x = Math.random() * w;
      }
    }
  }

  private spawnNet(x: number, y: number, radius: number, damage: number, color: string) {
    oceanSoundSystem.playNetDeploy();
    this.nets.push({
      id: 'net_' + Math.random(),
      x,
      y,
      radius: 10,
      maxRadius: radius,
      alpha: 1,
      color,
      damage,
      hitFishIds: new Set()
    });
  }

  private spawnCoins(x: number, y: number, value: number, isBoss = false) {
    const count = isBoss ? 16 : Math.min(8, Math.max(3, Math.round(value / 15)));
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      this.coins.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        targetX: this.cannonX,
        targetY: this.cannonY,
        life: 1.5,
        maxLife: 1.5,
        value: Math.round(value / count),
        size: isBoss ? 14 : 10,
        isBoss
      });
    }
  }

  private spawnRandomFish(w: number, h: number) {
    // Choose spawn side: Left -> Right or Right -> Left
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -60 : w + 60;
    const startY = 80 + Math.random() * (h - 220);

    const targetX = fromLeft ? w + 100 : -100;
    const targetY = 80 + Math.random() * (h - 220);
    const angle = Math.atan2(targetY - startY, targetX - startX);

    // Weighted random species selection
    const rand = Math.random();
    let type = 'nemo';
    if (rand < 0.45) type = 'nemo';
    else if (rand < 0.70) type = 'butterfly';
    else if (rand < 0.85) type = 'blowfish';
    else if (rand < 0.95) type = 'turtle';
    else type = 'manta';

    // If nemo, spawn a cute school of 3-5 nemo
    if (type === 'nemo') {
      const schoolSize = 3 + Math.floor(Math.random() * 3);
      for (let s = 0; s < schoolSize; s++) {
        const offsetDist = s * 30;
        const offsetX = startX - Math.cos(angle) * offsetDist + (Math.random() - 0.5) * 20;
        const offsetY = startY - Math.sin(angle) * offsetDist + (Math.random() - 0.5) * 20;
        this.fishList.push(new FishEntity('nemo', offsetX, offsetY, angle));
      }
    } else {
      this.fishList.push(new FishEntity(type, startX, startY, angle));
    }
  }

  private spawnBoss(type: 'shark' | 'dragon', w: number, h: number) {
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -150 : w + 150;
    const startY = 120 + Math.random() * (h - 300);

    const targetX = fromLeft ? w + 200 : -200;
    const targetY = 120 + Math.random() * (h - 300);
    const angle = Math.atan2(targetY - startY, targetX - startX);

    this.fishList.push(new FishEntity(type, startX, startY, angle));

    // Announce boss with floating text banner
    this.floatingTexts.push({
      id: 'ft_' + Math.random(),
      x: w / 2,
      y: 120,
      text: type === 'dragon' ? '👑 CÁ RỒNG VÀNG XUẤT HIỆN!' : '🦈 CÁ MẬP BÚA XUẤT HIỆN!',
      color: type === 'dragon' ? '#facc15' : '#ef4444',
      size: 26,
      alpha: 1,
      life: 2.5
    });
  }

  // --- RENDERING PIPELINE ---
  private render() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const ctx = this.ctx;

    // 1. Clear & Ocean Abyss Backdrop
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#0369a1'); // sunlight shallow cyan
    oceanGrad.addColorStop(0.35, '#0284c7');
    oceanGrad.addColorStop(0.7, '#075985');
    oceanGrad.addColorStop(1, '#0c2240'); // deep ocean navy
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Sunlight Caustic Light Beams
    ctx.save();
    ctx.globalAlpha = 0.08;
    const t = performance.now() * 0.001;
    for (let i = 0; i < 5; i++) {
      const beamX = (w / 5) * i + Math.sin(t + i) * 60;
      const grad = ctx.createLinearGradient(beamX, 0, beamX + 80, h);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(beamX - 30, 0);
      ctx.lineTo(beamX + 30, 0);
      ctx.lineTo(beamX + 120, h);
      ctx.lineTo(beamX + 40, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. Ambient Bubbles
    ctx.save();
    for (const b of this.bubbles) {
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();

      // Bubble highlight shine
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha + 0.2})`;
      ctx.beginPath();
      ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Fish Entities
    for (const fish of this.fishList) {
      fish.render(ctx);
    }

    // 5. Energy Nets (Expanding Shockwave)
    for (const net of this.nets) {
      ctx.save();
      ctx.globalAlpha = net.alpha;

      // Glow circle
      ctx.strokeStyle = net.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = net.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(net.x, net.y, net.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Honeycomb / Web lines
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.moveTo(net.x, net.y);
        ctx.lineTo(net.x + Math.cos(a) * net.radius, net.y + Math.sin(a) * net.radius);
      }
      ctx.stroke();

      ctx.restore();
    }

    // 6. Bullets (Torpedoes)
    for (const b of this.bullets) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      // Glow trail
      ctx.shadowColor = b.glowColor;
      ctx.shadowBlur = 12;

      // Bullet torpedo shape
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bright white core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(2, 0, 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 7. Coin Fountain
    for (const c of this.coins) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;

      // Gold coin
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(0, 0, c.size, 0, Math.PI * 2);
      ctx.fill();

      // Inner coin rim
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, c.size * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // 8. Floating Texts
    ctx.save();
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.font = `900 ${ft.size}px monospace, sans-serif`;
      ctx.textAlign = 'center';

      // Text stroke outline
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);

      // Text fill
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();

    // 9. Cannon Turret at Bottom Center
    this.renderCannon(ctx);

    // 10. Freeze Skill Frost Vignette Overlay
    const store = useOceanFishStore.getState();
    if (store.freezeActive) {
      ctx.save();
      const frostGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7);
      frostGrad.addColorStop(0, 'rgba(186, 230, 253, 0.05)');
      frostGrad.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
      ctx.fillStyle = frostGrad;
      ctx.fillRect(0, 0, w, h);

      // Frost border banner
      ctx.font = '800 20px sans-serif';
      ctx.fillStyle = '#e0f2fe';
      ctx.textAlign = 'center';
      ctx.fillText(`❄️ ĐẠI DƯƠNG ĐÓNG BĂNG (${Math.ceil(store.freezeDuration)}s)`, w / 2, 85);
      ctx.restore();
    }
  }

  // --- DRAW CANNON TURRET ---
  private renderCannon(ctx: CanvasRenderingContext2D) {
    const store = useOceanFishStore.getState();
    const config = CANNON_CONFIGS[store.cannonLevel];

    ctx.save();
    ctx.translate(this.cannonX, this.cannonY);

    // Base pedestal
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 10, 48, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Rotate cannon barrel according to player angle
    ctx.rotate(this.cannonAngle + Math.PI / 2);

    // Recoil translation
    ctx.translate(0, this.recoil);

    // Dual/Single Cannon Barrels depending on level
    const barrelColor = config.color;
    ctx.shadowColor = config.glowColor;
    ctx.shadowBlur = 15;

    if (store.cannonLevel === 1) {
      // Single Barrel
      ctx.fillStyle = '#334155';
      ctx.fillRect(-8, -45, 16, 45);
      ctx.fillStyle = barrelColor;
      ctx.fillRect(-6, -48, 12, 8);
    } else if (store.cannonLevel === 2) {
      // Double Barrels
      ctx.fillStyle = '#334155';
      ctx.fillRect(-14, -45, 10, 45);
      ctx.fillRect(4, -45, 10, 45);
      ctx.fillStyle = barrelColor;
      ctx.fillRect(-15, -48, 12, 7);
      ctx.fillRect(3, -48, 12, 7);
    } else if (store.cannonLevel === 3) {
      // Triple Barrels
      ctx.fillStyle = '#334155';
      ctx.fillRect(-18, -42, 8, 42);
      ctx.fillRect(-4, -48, 8, 48);
      ctx.fillRect(10, -42, 8, 42);
      ctx.fillStyle = barrelColor;
      ctx.fillRect(-19, -45, 10, 6);
      ctx.fillRect(-5, -51, 10, 6);
      ctx.fillRect(9, -45, 10, 6);
    } else if (store.cannonLevel === 4) {
      // Plasma Laser Cannon
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-12, -50);
      ctx.lineTo(12, -50);
      ctx.lineTo(16, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = barrelColor;
      ctx.fillRect(-8, -54, 16, 8);
    } else {
      // Level 5: Golden Dragon Cannon
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-16, -50, 32, 50);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, -52, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cannon Turret Dome Hub
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // Central Energy Core
    ctx.fillStyle = barrelColor;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
