/**
 * Fish types and procedural canvas rendering routines for Bắn Cá Đại Dương
 */

export interface FishDefinition {
  type: string;
  name: string;
  width: number;
  height: number;
  maxHp: number;
  baseCoins: number;
  baseSpeed: number;
  swimFreq: number;
  isBoss?: boolean;
}

export const FISH_DEFINITIONS: Record<string, FishDefinition> = {
  nemo: {
    type: 'nemo',
    name: 'Cá Hề Nemo',
    width: 44,
    height: 26,
    maxHp: 1,
    baseCoins: 10,
    baseSpeed: 2.2,
    swimFreq: 12
  },
  butterfly: {
    type: 'butterfly',
    name: 'Cá Bướm Hoàng Gia',
    width: 56,
    height: 40,
    maxHp: 2,
    baseCoins: 25,
    baseSpeed: 1.7,
    swimFreq: 9
  },
  blowfish: {
    type: 'blowfish',
    name: 'Cá Nóc Gai',
    width: 62,
    height: 50,
    maxHp: 4,
    baseCoins: 65,
    baseSpeed: 1.3,
    swimFreq: 14
  },
  turtle: {
    type: 'turtle',
    name: 'Rùa Biển Cổ Đại',
    width: 88,
    height: 62,
    maxHp: 8,
    baseCoins: 180,
    baseSpeed: 1.0,
    swimFreq: 5
  },
  manta: {
    type: 'manta',
    name: 'Cá Đuối Phát Sáng',
    width: 115,
    height: 85,
    maxHp: 14,
    baseCoins: 400,
    baseSpeed: 1.5,
    swimFreq: 6
  },
  shark: {
    type: 'shark',
    name: 'Cá Mập Búa',
    width: 160,
    height: 70,
    maxHp: 28,
    baseCoins: 900,
    baseSpeed: 2.0,
    swimFreq: 9,
    isBoss: true
  },
  dragon: {
    type: 'dragon',
    name: 'Cá Rồng Vàng Thần Thoại',
    width: 220,
    height: 80,
    maxHp: 60,
    baseCoins: 3200,
    baseSpeed: 1.2,
    swimFreq: 7,
    isBoss: true
  }
};

export class FishEntity {
  public id: string;
  public type: string;
  public def: FishDefinition;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public angle: number;
  public hp: number;
  public maxHp: number;
  public isDead = false;
  public hitFlashTimer = 0;
  public animTime = 0;
  public baseSpeed: number;
  public pathSeed: number;

  constructor(type: string, startX: number, startY: number, targetAngle: number) {
    this.id = 'fish_' + Math.random().toString(36).substring(2, 9);
    this.type = type;
    this.def = FISH_DEFINITIONS[type] || FISH_DEFINITIONS.nemo;
    this.x = startX;
    this.y = startY;
    this.angle = targetAngle;
    this.maxHp = this.def.maxHp;
    this.hp = this.def.maxHp;
    this.baseSpeed = this.def.baseSpeed * (0.85 + Math.random() * 0.3);
    this.vx = Math.cos(targetAngle) * this.baseSpeed;
    this.vy = Math.sin(targetAngle) * this.baseSpeed;
    this.pathSeed = Math.random() * 100;
    this.animTime = Math.random() * 10;
  }

  public update(dt: number, isFrozen: boolean) {
    this.animTime += dt;
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
    }

    if (isFrozen) return;

    // Gentle natural wave curve swimming
    const waveOffset = Math.sin(this.animTime * 2.5 + this.pathSeed) * 0.45;
    const currentAngle = this.angle + waveOffset;

    this.x += Math.cos(currentAngle) * this.baseSpeed * 60 * dt;
    this.y += Math.sin(currentAngle) * this.baseSpeed * 60 * dt;
  }

  public takeDamage(damage: number): boolean {
    this.hp -= damage;
    this.hitFlashTimer = 0.15; // flash white/red for 150ms
    if (this.hp <= 0) {
      this.isDead = true;
      return true; // Fish was caught
    }
    return false;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Orient facing forward
    const facingAngle = this.vx < 0 ? this.angle + Math.PI : this.angle;
    ctx.rotate(this.angle);
    if (this.vx < 0) {
      ctx.scale(1, -1); // flip vertically if moving leftwards
    }

    const wiggle = Math.sin(this.animTime * this.def.swimFreq) * 0.15;

    // Flash white on hit
    if (this.hitFlashTimer > 0) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
    } else if (this.def.isBoss) {
      ctx.shadowColor = this.type === 'dragon' ? '#facc15' : '#ef4444';
      ctx.shadowBlur = 20;
    }

    // Render specific fish species
    switch (this.type) {
      case 'nemo':
        this.drawNemo(ctx, wiggle);
        break;
      case 'butterfly':
        this.drawButterfly(ctx, wiggle);
        break;
      case 'blowfish':
        this.drawBlowfish(ctx, wiggle);
        break;
      case 'turtle':
        this.drawTurtle(ctx, wiggle);
        break;
      case 'manta':
        this.drawManta(ctx, wiggle);
        break;
      case 'shark':
        this.drawShark(ctx, wiggle);
        break;
      case 'dragon':
        this.drawDragon(ctx, wiggle);
        break;
      default:
        this.drawNemo(ctx, wiggle);
    }

    // HP Bar for bosses or tanky fish
    if (this.maxHp > 1 && this.hp < this.maxHp) {
      const barW = Math.max(30, this.def.width * 0.7);
      const barH = 5;
      const barY = -this.def.height * 0.65;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-barW / 2, barY, barW, barH);
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#eab308' : '#ef4444';
      ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);
    }

    ctx.restore();
  }

  // --- DRAW NEMO ---
  private drawNemo(ctx: CanvasRenderingContext2D, wiggle: number) {
    // Body
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#ff7a00';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // White stripes
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-3, 0, 4, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(8, 0, 3, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail fin (animated)
    ctx.save();
    ctx.translate(-18, 0);
    ctx.rotate(wiggle);
    ctx.fillStyle = '#ff5500';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -9);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-12, 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(12, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(13, -4, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- DRAW BUTTERFLY FISH ---
  private drawButterfly(ctx: CanvasRenderingContext2D, wiggle: number) {
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cyan stripes & fins
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(10, -18);
    ctx.lineTo(-5, -24);
    ctx.lineTo(-15, -12);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(2, 0, 5, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.save();
    ctx.translate(-22, 0);
    ctx.rotate(wiggle);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, -12);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-15, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(14, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(15, -5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- DRAW BLOWFISH ---
  private drawBlowfish(ctx: CanvasRenderingContext2D, wiggle: number) {
    const isPuffed = this.hitFlashTimer > 0;
    const r = isPuffed ? 26 : 22;

    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#84cc16';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Spikes
    ctx.fillStyle = '#65a30d';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const sx = Math.cos(a) * (r + 4);
      const sy = Math.sin(a) * (r + 4);
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.4, r * 0.75, r * 0.45, 0, 0, Math.PI);
    ctx.fill();

    // Big expressive surprised eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(10, -6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(11, -6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Little fin
    ctx.save();
    ctx.translate(-r, 0);
    ctx.rotate(wiggle * 1.5);
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- DRAW TURTLE ---
  private drawTurtle(ctx: CanvasRenderingContext2D, wiggle: number) {
    // Shell
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#15803d';
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shell rim
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Head
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(38, 0, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#022c22';
    ctx.beginPath();
    ctx.arc(43, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Paddling Flippers
    const flipperWiggle = Math.sin(this.animTime * 4) * 0.3;
    ctx.save();
    ctx.translate(14, -20);
    ctx.rotate(-0.4 + flipperWiggle);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(0, -10, 8, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(14, 20);
    ctx.rotate(0.4 - flipperWiggle);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(0, 10, 8, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- DRAW MANTA RAY ---
  private drawManta(ctx: CanvasRenderingContext2D, wiggle: number) {
    const wingFlap = Math.sin(this.animTime * 3) * 8;

    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#312e81';
    ctx.beginPath();
    ctx.moveTo(40, 0); // nose
    ctx.quadraticCurveTo(10, -42 - wingFlap, -20, -38 - wingFlap); // left wing tip
    ctx.quadraticCurveTo(-15, 0, -35, 0); // body tail base
    ctx.quadraticCurveTo(-15, 0, -20, 38 + wingFlap); // right wing tip
    ctx.quadraticCurveTo(10, 42 + wingFlap, 40, 0);
    ctx.closePath();
    ctx.fill();

    // Glowing cyan spots
    ctx.fillStyle = '#38bdf8';
    [-10, 0, 12].forEach((px) => {
      ctx.beginPath();
      ctx.arc(px, -12, 2.5, 0, Math.PI * 2);
      ctx.arc(px, 12, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Whip Tail
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.quadraticCurveTo(-55, wiggle * 15, -75, wiggle * 25);
    ctx.stroke();
  }

  // --- DRAW HAMMERHEAD SHARK (MINI-BOSS) ---
  private drawShark(ctx: CanvasRenderingContext2D, wiggle: number) {
    // Body
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#334155';
    ctx.beginPath();
    ctx.ellipse(0, 0, 65, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // White belly
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(5, 10, 50, 12, 0, 0, Math.PI);
    ctx.fill();

    // Hammerhead Skull T-bar
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(55, -28, 16, 56, 6);
    ctx.fill();

    // Eyes on hammer tips
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(63, -25, 3, 0, Math.PI * 2);
    ctx.arc(63, 25, 3, 0, Math.PI * 2);
    ctx.fill();

    // Big Dorsal Fin
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-10, -20);
    ctx.lineTo(-25, -45);
    ctx.lineTo(-40, -18);
    ctx.closePath();
    ctx.fill();

    // Animated Shark Tail
    ctx.save();
    ctx.translate(-60, 0);
    ctx.rotate(wiggle * 1.8);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-28, -32);
    ctx.lineTo(-18, 0);
    ctx.lineTo(-28, 26);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- DRAW GOLDEN DRAGON (MEGA BOSS) ---
  private drawDragon(ctx: CanvasRenderingContext2D, wiggle: number) {
    // Golden Aura Glow
    const gradient = ctx.createRadialGradient(0, 0, 30, 0, 0, 110);
    gradient.addColorStop(0, 'rgba(250, 204, 21, 0.4)');
    gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.fill();

    // Undulating serpentine dragon body
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#eab308';
    ctx.beginPath();
    ctx.ellipse(10, 0, 85, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shiny scales
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    for (let sx = -40; sx < 60; sx += 20) {
      ctx.beginPath();
      ctx.arc(sx, 0, 12, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }

    // Imperial Head & Horns
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(85, -12);
    ctx.lineTo(110, -5);
    ctx.lineTo(110, 12);
    ctx.lineTo(85, 18);
    ctx.closePath();
    ctx.fill();

    // Golden Horns
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(85, -12);
    ctx.quadraticCurveTo(95, -35, 115, -32);
    ctx.stroke();

    // Whiskers waving
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(105, 5);
    ctx.quadraticCurveTo(125, 20 + wiggle * 20, 145, 15);
    ctx.stroke();

    // Fierce Ruby Eye
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(96, -3, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(97, -4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Dragon tail
    ctx.save();
    ctx.translate(-75, 0);
    ctx.rotate(wiggle * 2);
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-45, -38);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-45, 38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
