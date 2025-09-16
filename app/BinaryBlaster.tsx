import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- TYPE DEFINITIONS ---
type GameState = 'loading' | 'menu' | 'rules' | 'playing' | 'paused' | 'waveComplete' | 'gameOver';
type InputMode = 'multiple-choice' | 'numeric-input';
type Difficulty = 'Apprentice' | 'Binary Engineer' | 'Cybernetic Sage';
type GameMode =
  | 'binaryToDecimal' | 'decimalToBinary' | 'hexToDecimal' | 'decimalToHex'
  | 'binaryToHex' | 'hexToBinary' | 'octalToDecimal' | 'decimalToOctal';

interface IProjectile {
  x: number; y: number; targetX: number; targetY: number; speed: number;
  vx: number; vy: number; size: number; life: number;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface IEnemy {
  label: string; answer: string; x: number; y: number; speed: number; type: string;
  health: number; width: number; height: number; model: HTMLImageElement; fire: HTMLImageElement;
  sineOffset: number;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface IParticle {
    x: number; y: number; vx: number; vy: number; life: number; size: number;
    color: string; gravity: number; rotation: number; rotationSpeed: number; shape: string;
    update(dt: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}

interface IExplosionEffect {
    x: number; y: number; life: number; maxRadius: number; color: string;
    update(dt: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}

interface LogEntry {
    id: number;
    problem: string;
    answer: string;
}

// --- UTILITY & GAME LOGIC (can be outside component) ---
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const binaryToDecimal = (bin: string) => parseInt(bin, 2);
const decimalToBinary = (n: number) => (n >>> 0).toString(2);
const hexToDecimal = (hex: string) => parseInt(hex, 16);
const decimalToHex = (n: number) => (Number(n) >>> 0).toString(16).toUpperCase();
const octalToDecimal = (oct: string) => parseInt(oct, 8);
const decimalToOctal = (n: number) => (Number(n) >>> 0).toString(8);
const binaryToHex = (bin: string) => parseInt(bin, 2).toString(16).toUpperCase();
const hexToBinary = (hex: string) => {
    let bin = parseInt(hex, 16).toString(2);
    const len = hex.length * 4;
    while (bin.length < len) { bin = "0" + bin; }
    return bin;
};

// Audio context can be created once
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};
const beep = (freq = 440, length = 0.08, type: OscillatorType = 'sine', gain = 0.06) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + length);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + length);
};

// --- REACT COMPONENT ---
const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopId = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Game State as React State
    const [gameState, setGameState] = useState<GameState>('loading');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [difficulty, setDifficulty] = useState<Difficulty>('Apprentice');
    const [levelProgress, setLevelProgress] = useState(0);
    const [waveTimer, setWaveTimer] = useState(90);
    const [inputMode, setInputMode] = useState<InputMode>('multiple-choice');
    const [currentMode, setCurrentMode] = useState<GameMode>('binaryToDecimal');
    const [currentTarget, setCurrentTarget] = useState<IEnemy | null>(null);
    const [learningLog, setLearningLog] = useState<LogEntry[]>([]);
    const [finalScore, setFinalScore] = useState(0);
    const [choices, setChoices] = useState<string[]>([]);
    const [answerInputValue, setAnswerInputValue] = useState("");

    // Refs for mutable game objects that don't need to trigger re-renders
    const playerRef = useRef({ x: 0, y: 0, targetX: 0 });
    const enemiesRef = useRef<IEnemy[]>([]);
    const projectilesRef = useRef<IProjectile[]>([]);
    const particlesRef = useRef<IParticle[]>([]);
    const explosionsRef = useRef<IExplosionEffect[]>([]);
    const cameraShakeRef = useRef({ x: 0, y: 0, time: 0, intensity: 0 });
    const imagesRef = useRef<Record<string, HTMLImageElement>>({});

    // --- GAME ASSET LOADING ---
    useEffect(() => {
        const ASSET_URLS = {
            ship: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='var(--accent)' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M50 5 L75 35 L50 25 L25 35 Z'/><path d='M50 25 L50 65' stroke-dasharray='5 5'/><path d='M25 35 Q40 50 20 60 L15 85 L25 95 Q50 80 75 95 L85 85 L80 60 Q60 50 75 35 Z' fill='rgba(40,240,255,0.05)'/><path d='M50 65 L40 75 L60 75 Z' fill='rgba(40,240,255,0.2)'/></g><circle cx='50' cy='15' r='5' fill='var(--accent)'/></svg>`),
            enemy: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><style> .cls-1{fill:rgba(255,255,255,0.01);stroke:rgba(255,255,255,0.08);stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.cls-2{fill:rgba(40,240,255,0.15);stroke:rgba(40,240,255,0.4);stroke-width:1px;}.cls-3{fill:rgba(40,240,255,0.4);}</style><path class='cls-1' d='M50,15 L75,35 L75,65 L50,85 L25,65 L25,35 Z'/><path class='cls-2' d='M50,85 L50,95'/><path class='cls-2' d='M25,65 L15,75'/><path class='cls-2' d='M75,65 L85,75'/><path class='cls-3' d='M50,25 L60,35 L50,45 L40,35 Z'/><circle class='cls-3' cx='50' cy='35' r='5'/></svg>`),
            fire: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50,100 Q40,80 50,70 Q60,80 50,100 Z' fill='rgba(255, 120, 0, 1)'/><path d='M50,100 Q45,90 50,85 Q55,90 50,100 Z' fill='rgba(255, 200, 0, 1)'/></svg>`),
        };

        const preloadImages = () => {
            const promises = Object.entries(ASSET_URLS).map(([name, url]) => {
                return new Promise<void>(resolve => {
                    const img = new Image();
                    img.onload = () => {
                        imagesRef.current[name] = img;
                        resolve();
                    };
                    img.src = url;
                });
            });
            return Promise.all(promises);
        };

        preloadImages().then(() => {
            setGameState('menu');
        });
    }, []);

    // --- GAME CLASSES ---
    const Projectile = class implements IProjectile {
        x: number; y: number; targetX: number; targetY: number; speed: number;
        vx: number; vy: number; size: number; life: number;

        constructor(x: number, y: number, targetX: number, targetY: number) {
            this.x = x; this.y = y; this.targetX = targetX; this.targetY = targetY; this.speed = 1500;
            const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            this.vx = Math.cos(angle) * this.speed; this.vy = Math.sin(angle) * this.speed;
            this.size = 8; this.life = 1;
        }
        update(dt: number) {
            this.x += this.vx * dt; this.y += this.vy * dt;
            this.life = Math.max(0, this.life - dt * 2);
        }
        draw(ctx: CanvasRenderingContext2D) {
            ctx.save(); ctx.globalAlpha = this.life;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
            gradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
            gradient.addColorStop(0.4, 'rgba(255, 200, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
            ctx.fillStyle = gradient; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2); ctx.fill();
            for (let i = 0; i < 25; i++) {
                const p = i / 25; const a = (1 - p) * this.life * 0.7; const s = this.size * (1 - p) * 1.5;
                const tx = this.x - this.vx * (i * 1.5 / this.speed); const ty = this.y - this.vy * (i * 1.5 / this.speed);
                ctx.fillStyle = `hsla(${25 + p * 30}, 100%, 60%, ${a})`; ctx.beginPath();
                ctx.arc(tx, ty, s, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }
    }

    const Enemy = class implements IEnemy {
        label: string; answer: string; x: number; y: number; speed: number; type: string;
        health: number; width: number; height: number; model: HTMLImageElement; fire: HTMLImageElement;
        sineOffset: number;

        constructor(opts: any) {
            this.label = opts.label; this.answer = opts.answer;
            this.x = opts.x; this.y = opts.y; this.speed = opts.speed; this.type = opts.type || 'basic';
            this.health = opts.health || 1; this.width = 60; this.height = 60;
            this.model = imagesRef.current.enemy; this.fire = imagesRef.current.fire;
            this.sineOffset = Math.random() * Math.PI * 2;
        }
        update(dt: number) {
            if (this.type === 'jumper') { this.y += this.speed * dt * (Math.sin(Date.now() / 200 + this.sineOffset) * 0.3 + 1);
            } else { this.y += this.speed * dt; }
            this.x += Math.sin((Date.now() / 400) + this.sineOffset) * 8 * dt;
        }
        draw(ctx: CanvasRenderingContext2D) {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.save();
            const fireScale = Math.sin(Date.now() / 100) * 0.1 + 0.9;
            ctx.translate(0, this.height * 0.5); ctx.scale(1, fireScale);
            ctx.shadowColor = 'rgba(255, 120, 0, 0.5)'; ctx.shadowBlur = 15;
            if (this.fire) ctx.drawImage(this.fire, -this.width / 2.5, -this.height / 1.5, this.width / 1.25, this.height / 1.25);
            ctx.restore();
            const glowIntensity = Math.sin(performance.now() / 500) * 0.2 + 0.8;
            ctx.shadowColor = 'rgba(40,240,255,0.12)'; ctx.shadowBlur = 14 * glowIntensity;
            if (this.model) ctx.drawImage(this.model, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.font = '14px monospace'; ctx.fillStyle = 'rgba(200,255,255,0.95)'; ctx.textAlign = 'center';
            ctx.fillText(this.label, 0, -5);
            ctx.restore();
        }
    }
    
    const Particle = class implements IParticle {
        x: number; y: number; vx: number; vy: number; life: number; size: number;
        color: string; gravity: number; rotation: number; rotationSpeed: number; shape: string;
        constructor(x:number,y:number,opts:any={}){
            this.x=x;this.y=y;this.vx=opts.vx||rand(-80,80);this.vy=opts.vy||rand(-120,-40);
            this.life=opts.life||rand(0.3,1.2);this.size=opts.size||rand(1,4);this.color=opts.color||'rgba(255,160,80,0.95)';
            this.gravity=opts.gravity||120;this.rotation=rand(0,Math.PI*2);this.rotationSpeed=rand(-Math.PI,Math.PI);this.shape=opts.shape||'circle';
        }
        update(dt: number){
            this.life-=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;
            this.vy+=this.gravity*dt;this.rotation+=this.rotationSpeed*dt;
        }
        draw(ctx: CanvasRenderingContext2D){
            if(this.life<=0)return;ctx.save();ctx.globalAlpha=Math.max(0,this.life);
            ctx.fillStyle=this.color;ctx.translate(this.x,this.y);ctx.rotate(this.rotation);
            if(this.shape==='circle'){ctx.beginPath();ctx.arc(0,0,this.size,0,Math.PI*2);ctx.fill();}
            else if(this.shape==='square'){ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size);}
            ctx.restore();
        }
    }

    const ExplosionEffect = class implements IExplosionEffect {
        x: number; y: number; life: number; maxRadius: number; color: string;
        constructor(x:number,y:number,color='rgba(255,255,255,1)'){this.x=x;this.y=y;this.life=0.2;this.maxRadius=60;this.color=color;}
        update(dt:number){this.life-=dt;}
        draw(ctx: CanvasRenderingContext2D){
            if(this.life<=0)return;const p=1-(this.life/0.2);const r=this.maxRadius*p;
            ctx.save();ctx.globalAlpha=Math.max(0,this.life*4);ctx.fillStyle=this.color;
            ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();ctx.restore();
        }
    }

    // --- GAME ACTIONS & LOGIC ---
    const spawnExplosion = useCallback((x: number, y: number) => {
        explosionsRef.current.push(new ExplosionEffect(x, y, 'rgba(255, 255, 255, 0.9)'));
        for (let i = 0; i < 60; i++) {
            const angle = rand(0, Math.PI * 2); const speed = rand(100, 300);
            const vx = Math.cos(angle) * speed; const vy = Math.sin(angle) * speed; const size = rand(1, 6);
            particlesRef.current.push(new Particle(x, y, { vx, vy, size, color: `hsl(${rand(20, 50)},100%,${rand(50, 90)}%)`, life: rand(0.5, 1.5) }));
        }
        for (let i = 0; i < 10; i++) {
            const angle=rand(0,Math.PI*2);const speed=rand(80,200);
            const vx=Math.cos(angle)*speed;const vy=Math.sin(angle)*speed;const size=rand(4,10);
            particlesRef.current.push(new Particle(x,y,{vx,vy,size,color:`rgb(${rand(100,180)},${rand(100,180)},${rand(100,180)})`,life:rand(1,3),gravity:300,shape:'square'}));
        }
        beep(180, 0.4, 'sawtooth', 0.2);
        cameraShakeRef.current = { x: 0, y: 0, intensity: 10, time: 0.2 };
    }, []);

    const generateProblem = useCallback((bits: number, mode: GameMode) => {
        let decimal, s;
        switch (mode) {
            case 'binaryToDecimal': s = ''; for (let i = 0; i < bits; i++) s += Math.random() < .5 ? '0' : '1'; if (s[0] === '0' && s.length > 1) s = '1' + s.slice(1); return { label: s, answer: binaryToDecimal(s).toString() };
            case 'decimalToBinary': decimal = Math.floor(rand(Math.pow(2, bits - 1), Math.pow(2, bits) - 1)); return { label: decimal.toString(), answer: decimalToBinary(decimal) };
            case 'hexToDecimal': decimal = Math.floor(rand(Math.pow(16, Math.floor(bits / 4)) - 1, Math.pow(16, Math.ceil(bits / 4)) - 1)); if (decimal < 16) decimal = Math.floor(rand(16, 255)); s = decimalToHex(decimal); return { label: s, answer: hexToDecimal(s).toString() };
            case 'decimalToHex': decimal = Math.floor(rand(Math.pow(2, bits - 1), Math.pow(2, bits) - 1)); return { label: decimal.toString(), answer: decimalToHex(decimal) };
            case 'binaryToHex': bits = Math.ceil(bits / 4) * 4; s = ''; for (let i = 0; i < bits; i++) s += Math.random() < .5 ? '0' : '1'; if (s[0] === '0' && s.length > 1) s = '1' + s.slice(1); return { label: s, answer: binaryToHex(s) };
            case 'hexToBinary': const h = '0123456789ABCDEF'; let l = Math.ceil(bits / 4); s = ''; for (let i = 0; i < l; i++) s += h[Math.floor(Math.random() * h.length)]; if (s[0] === '0') s = h[Math.floor(rand(1, 16))] + s.slice(1); return { label: s, answer: hexToBinary(s) };
            case 'octalToDecimal': decimal = Math.floor(rand(Math.pow(8, Math.floor(bits / 3)) - 1, Math.pow(8, Math.ceil(bits / 3)) - 1)); if (decimal < 8) decimal = Math.floor(rand(8, 63)); s = decimalToOctal(decimal); return { label: s, answer: octalToDecimal(s).toString() };
            case 'decimalToOctal': decimal = Math.floor(rand(Math.pow(2, bits - 1), Math.pow(2, bits) - 1)); return { label: decimal.toString(), answer: decimalToOctal(decimal) };
            default: return { label: '101', answer: '5' };
        }
    }, []);

    const spawnEnemy = useCallback(() => {
        if (!canvasRef.current) return;
        const w = canvasRef.current.getBoundingClientRect().width;
        let bits = 4;
        if (difficulty === 'Apprentice') bits = Math.floor(rand(3, 6));
        if (difficulty === 'Binary Engineer') bits = Math.floor(rand(6, 10));
        if (difficulty === 'Cybernetic Sage') bits = Math.floor(rand(10, 14));
        const p = generateProblem(bits, currentMode);
        const x = rand(60, w - 60), y = -40;
        let s = rand(15, 40) + (difficulty === 'Binary Engineer' ? 15 : 0) + (difficulty === 'Cybernetic Sage' ? 30 : 0);
        let t = 'basic';
        if (difficulty === 'Binary Engineer' && Math.random() < .1) t = 'fast';
        if (difficulty === 'Binary Engineer' && Math.random() < .1) t = 'armored';
        if (difficulty === 'Cybernetic Sage') { if (Math.random() < .2) t = 'fast'; if (Math.random() < .2) t = 'armored'; if (Math.random() < .12) t = 'jumper'; }
        enemiesRef.current.push(new Enemy({ label: p.label, answer: p.answer, x, y, speed: s, type: t, health: (t === 'armored' ? 3 : 1) }));
    }, [difficulty, currentMode, generateProblem]);

    const makeMCQ = useCallback((enemy: IEnemy) => {
        const c = enemy.answer; const d = new Set<string>();
        while (d.size < 3) {
            let cand; const delta = Math.round(rand(-8, 8)) || Math.round(rand(1, 8));
            switch (currentMode) {
                case 'binaryToDecimal': case 'hexToDecimal': case 'octalToDecimal': cand = (parseInt(c) + delta).toString(); if (parseInt(cand) > 0) d.add(cand); break;
                case 'decimalToBinary': cand = decimalToBinary(parseInt(enemy.label) + delta); if (cand !== c) d.add(cand); break;
                case 'decimalToHex': cand = decimalToHex(parseInt(enemy.label) + delta); if (cand !== c) d.add(cand); break;
                case 'decimalToOctal': cand = decimalToOctal(parseInt(enemy.label) + delta); if (cand !== c) d.add(cand); break;
                case 'binaryToHex': cand = decimalToHex(binaryToDecimal(enemy.label) + delta); if (cand !== c) d.add(cand); break;
                case 'hexToBinary': cand = decimalToBinary(hexToDecimal(enemy.label) + delta); if (cand !== c) d.add(cand); break;
            }
        }
        const arr = [c, ...Array.from(d)]; arr.sort(() => Math.random() - .5);
        setChoices(arr);
    }, [currentMode]);
    
    const addLogEntry = useCallback((problem: string, answer: string) => {
        setLearningLog(prev => [{ id: Date.now(), problem, answer }, ...prev.slice(0, 7)]);
    }, []);

    const handleAnswer = useCallback((answer: string, enemy: IEnemy | null) => {
        if (!enemy || enemy !== currentTarget) return;
        const isCorrect = answer.toLowerCase() === enemy.answer.toLowerCase();

        if (isCorrect) {
            if (canvasRef.current) {
                const y = canvasRef.current.getBoundingClientRect().height - 90;
                projectilesRef.current.push(new Projectile(playerRef.current.x, y, enemy.x, enemy.y));
            }
            setChoices([]);
            setAnswerInputValue("");
            setCurrentTarget(null);
        } else {
            setStreak(0);
            setScore(s => Math.max(0, s - 5));
            document.body.animate([{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(15deg)' }, { filter: 'hue-rotate(0deg)' }], { duration: 240 });
            beep(120, 0.18, 'sine', 0.14);
        }
    }, [currentTarget]);

    const endGame = useCallback(() => {
        setGameState('gameOver');
        setFinalScore(score);
    }, [score]);

    // --- GAME LOOP ---
    const gameLoop = useCallback((timestamp: number) => {
        const now = timestamp / 1000;
        const dt = Math.min(0.05, now - lastTimeRef.current);
        lastTimeRef.current = now;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        // Update logic
        if (gameState === 'playing') {
            playerRef.current.x += (playerRef.current.targetX - playerRef.current.x) * .1;
            
            // Projectiles
            projectilesRef.current = projectilesRef.current.filter(p => {
                p.update(dt);
                for(let j=enemiesRef.current.length-1; j>=0; j--){
                    const e = enemiesRef.current[j];
                    if(Math.sqrt(Math.pow(p.x-e.x,2)+Math.pow(p.y-e.y,2))<e.width/2){
                        spawnExplosion(e.x, e.y);
                        enemiesRef.current.splice(j,1);
                        setStreak(s => s + 1);
                        setScore(s => s + 10 + Math.floor(10 * (1 + (streak+1)/5)));
                        addLogEntry(e.label, e.answer);
                        setLevelProgress(p => Math.min(100, p + 5));
                        return false; // remove projectile
                    }
                }
                return p.life > 0;
            });

    // Enemies
    const canvasHeight = canvasRef.current ? canvasRef.current.getBoundingClientRect().height : 0;
    enemiesRef.current = enemiesRef.current.filter(e => {
        e.update(dt);
        if (e.y > canvasHeight + 40) {
            setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) endGame();
                return newLives;
            });
            setStreak(0);
            spawnExplosion(e.x, canvasHeight - 60);
            cameraShakeRef.current = { x: 0, y: 0, intensity: 15, time: .3 };
            return false;
        }
        return true;
    });
            
            // Particles & Explosions
            particlesRef.current = particlesRef.current.filter(p => { p.update(dt); return p.life > 0; });
            explosionsRef.current = explosionsRef.current.filter(e => { e.update(dt); return e.life > 0; });
            
            // Wave timer
            setWaveTimer(t => {
                const newTime = t - dt;
                if (newTime <= 0) {
                    // completeWave logic here
                    setGameState('waveComplete');
                    setTimeout(() => {
                        setWaveTimer(90);
                        setGameState('playing');
                    }, 900);
                    return 90;
                }
                return newTime;
            });

        }

    // Render logic
    const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : { width: 0, height: 0 };
    if (rect.width === 0 || rect.height === 0) return;
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    ctx.save();
    if (cameraShakeRef.current.time > 0) {
        cameraShakeRef.current.x = (Math.random() - .5) * cameraShakeRef.current.intensity;
        cameraShakeRef.current.y = (Math.random() - .5) * cameraShakeRef.current.intensity;
        cameraShakeRef.current.time -= dt;
        cameraShakeRef.current.intensity *= .9;
    } else {
        cameraShakeRef.current.x = 0; cameraShakeRef.current.y = 0;
    }
    ctx.translate(cameraShakeRef.current.x, cameraShakeRef.current.y);

        // Starfield, player, entities
        drawStarfield(ctx, rect.width, rect.height, now);
        drawPlayerShip(ctx, playerRef.current.x, rect.height - 90);
        enemiesRef.current.forEach(e => e.draw(ctx));
        if (gameState === 'playing' && currentTarget) {
            drawTargetReticule(ctx, currentTarget, performance.now());
        }
        projectilesRef.current.forEach(p => p.draw(ctx));
        particlesRef.current.forEach(p => p.draw(ctx));
        explosionsRef.current.forEach(e => e.draw(ctx));

        ctx.restore();

        gameLoopId.current = requestAnimationFrame(gameLoop);
    }, [gameState, streak, currentTarget, spawnExplosion, addLogEntry, endGame]);

    // Enemy Spawner
    useEffect(() => {
        if (gameState !== 'playing') return;
        const spawnInterval = 2500;
        const intervalId = setInterval(spawnEnemy, spawnInterval);
        return () => clearInterval(intervalId);
    }, [gameState, spawnEnemy]);
    
    // Target acquisition
    useEffect(() => {
        if (gameState !== 'playing') return;
        const intervalId = setInterval(() => {
            const getTargetableEnemy = () => {
                if (!enemiesRef.current.length) return null;
                let c = [...enemiesRef.current];
                c.sort((a, b) => b.y - a.y);
                return c[0];
            };
            const target = getTargetableEnemy();
            if (target && target !== currentTarget) {
                setCurrentTarget(target);
                if (inputMode === 'multiple-choice') {
                    makeMCQ(target);
                }
            } else if (!target) {
                setCurrentTarget(null);
                setChoices([]);
            }
        }, 220);
        return () => clearInterval(intervalId);
    }, [gameState, currentTarget, inputMode, makeMCQ]);

    // Start/Stop Game Loop
    useEffect(() => {
        if (gameState === 'playing') {
            lastTimeRef.current = performance.now() / 1000;
            gameLoopId.current = requestAnimationFrame(gameLoop);
        } else {
            if (gameLoopId.current) {
                cancelAnimationFrame(gameLoopId.current);
            }
        }
        return () => {
            if (gameLoopId.current) {
                cancelAnimationFrame(gameLoopId.current);
            }
        };
    }, [gameState, gameLoop]);

    // Canvas resize handling
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
            const DPR = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.floor(rect.width * DPR);
            canvas.height = Math.floor(rect.height * DPR);
            const ctx = canvas.getContext('2d');
            ctx?.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, []);
    
    // Player movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => { playerRef.current.targetX = e.clientX; };
        const handleTouchMove = (e: TouchEvent) => { if (e.touches.length > 0) playerRef.current.targetX = e.touches[0].clientX; };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);
    
    // Pause/Resume with keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'p' || e.key === 'Escape') {
                setGameState(gs => {
                    if (gs === 'playing') {
                        getAudioContext()?.suspend();
                        return 'paused';
                    }
                    if (gs === 'paused') {
                        getAudioContext()?.resume();
                        return 'playing';
                    }
                    return gs;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    // --- RENDER HELPERS ---
    const starCache = useRef<{x:number, y:number, size:number, speed:number, twinkle:number, isStreak:boolean}[]>([]);
    const drawStarfield = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
        if(starCache.current.length === 0){
            for(let i=0; i<200; i++) starCache.current.push({x:Math.random()*w,y:Math.random()*h,size:Math.random()*1.5+.2,speed:Math.random()*2+.5,twinkle:Math.random()*2,isStreak:Math.random()<.05});
        }
        ctx.save(); ctx.fillStyle='rgba(1,6,12,0.7)'; ctx.fillRect(0,0,w,h);
        for(let s of starCache.current){
            const tw=.6+Math.sin(t*2+s.twinkle)*.4;
            ctx.fillStyle=`rgba(160,220,255,${tw*.7})`;
            const yPos=(s.y+(t*6*s.speed))%h;
            if(s.isStreak){ctx.fillRect(s.x,yPos-s.size*10,s.size,s.size*20);}
            else{ctx.beginPath();ctx.arc(s.x,yPos,s.size,0,Math.PI*2);ctx.fill();}
        }
        ctx.restore();
    };

    const drawPlayerShip = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.save();ctx.translate(x,y);
        const pulse=Math.sin(performance.now()/300)*8+12;
        ctx.shadowBlur=pulse;ctx.shadowColor='rgba(40,240,255,0.07)';
        if(imagesRef.current.ship){ctx.drawImage(imagesRef.current.ship,-40,-28,80,56);}
        ctx.restore();
    };
    
    const drawTargetReticule = (ctx: CanvasRenderingContext2D, enemy: IEnemy, t: number) => {
        const x=enemy.x;const y=enemy.y;
        const r=enemy.width/2+12;const a=t/300;
        ctx.save();ctx.strokeStyle='rgba(255,75,107,0.85)';ctx.lineWidth=2;
        ctx.shadowColor='rgba(255,75,107,1)';ctx.shadowBlur=10;
        ctx.translate(x,y);ctx.rotate(a);
        const arcLen=Math.PI/3;
        for(let i=0;i<4;i++){
            ctx.beginPath();
            const start=(i*Math.PI/2)+(Math.PI/4)-(arcLen/2);
            ctx.arc(0,0,r,start,start+arcLen);ctx.stroke();
        }
        ctx.restore();
    };

    // --- GAME STATE HANDLERS ---
    const startGame = (mode: GameMode) => {
        setCurrentMode(mode);
        setGameState('playing');
        setWaveTimer(90);
        setLevelProgress(0);
        enemiesRef.current = [];
        projectilesRef.current = [];
        setScore(0);
        setLives(3);
        setStreak(0);
        if (canvasRef.current) {
            playerRef.current.x = canvasRef.current.getBoundingClientRect().width / 2;
        }
    };

    const showMenu = () => {
        setGameState('menu');
    };

    const pauseGame = () => {
        if (gameState !== 'playing') return;
        setGameState('paused');
        getAudioContext()?.suspend();
    };
    
    const resumeGame = () => {
        if (gameState !== 'paused') return;
        setGameState('playing');
        getAudioContext()?.resume();
    };

    const showRules = (mode: GameMode) => {
        setCurrentMode(mode);
        setGameState('rules');
    };
    
    // --- UI COMPONENTS ---
    const rulesData: Record<GameMode, { title: string; html: string }> = {
      'binaryToDecimal': { title: 'Binary to Decimal', html: `<p>Convert binary (base-2) numbers to decimal (base-10).</p><h3>How to Convert</h3><p>Each binary digit is a power of 2. Sum the values of positions with a 1.</p><p><strong>Example:</strong> 1010<sub>2</sub></p><p style="font-family: monospace; text-align: center;">(1&times;2<sup>3</sup>)+(0&times;2<sup>2</sup>)+(1&times;2<sup>1</sup>)+(0&times;2<sup>0</sup>) = 8+0+2+0 = 10<sub>10</sub></p>` },
      'decimalToBinary': { title: 'Decimal to Binary', html: `<p>Convert decimal (base-10) numbers to binary (base-2).</p><h3>How to Convert</h3><p>Repeatedly divide the number by 2 and record remainders. Read from bottom to top.</p><p><strong>Example:</strong> 10<sub>10</sub></p><p style="font-family: monospace; text-align: center;">10&div;2=5 R 0<br>5&div;2=2 R 1<br>2&div;2=1 R 0<br>1&div;2=0 R 1</p><p>Result: 1010<sub>2</sub></p>` },
      'hexToDecimal': { title: 'Hexadecimal to Decimal', html: `<p>Convert hexadecimal (base-16) to decimal (base-10).</p><h3>How to Convert</h3><p>Each digit is a power of 16 (A=10, F=15).</p><p><strong>Example:</strong> 1A<sub>16</sub></p><p style="font-family: monospace; text-align: center;">(1&times;16<sup>1</sup>)+(10&times;16<sup>0</sup>) = 16+10 = 26<sub>10</sub></p>` },
      'decimalToHex': { title: 'Decimal to Hexadecimal', html: `<p>Convert decimal (base-10) to hexadecimal (base-16).</p><h3>How to Convert</h3><p>Repeatedly divide by 16. Convert remainders 10-15 to A-F.</p><p><strong>Example:</strong> 42<sub>10</sub></p><p style="font-family: monospace; text-align: center;">42&div;16=2 R 10(A)<br>2&div;16=0 R 2</p><p>Result: 2A<sub>16</sub></p>` },
      'binaryToHex': { title: 'Binary to Hexadecimal', html: `<p>Convert binary (base-2) to hexadecimal (base-16).</p><h3>How to Convert</h3><p>Group binary digits into sets of 4 from the right.</p><p><strong>Example:</strong> 11010110<sub>2</sub></p><p style="font-family: monospace; text-align: center;">1101 | 0110 &rarr; D | 6</p><p>Result: D6<sub>16</sub></p>` },
      'hexToBinary': { title: 'Hexadecimal to Binary', html: `<p>Convert hexadecimal (base-16) to binary (base-2).</p><h3>How to Convert</h3><p>Convert each hex digit to its 4-bit binary equivalent.</p><p><strong>Example:</strong> D6<sub>16</sub></p><p style="font-family: monospace; text-align: center;">D &rarr; 1101<br>6 &rarr; 0110</p><p>Result: 11010110<sub>2</sub></p>` },
      'octalToDecimal': { title: 'Octal to Decimal', html: `<p>Convert octal (base-8) to decimal (base-10).</p><h3>How to Convert</h3><p>Each octal digit is a power of 8.</p><p><strong>Example:</strong> 32<sub>8</sub></p><p style="font-family: monospace; text-align: center;">(3&times;8<sup>1</sup>)+(2&times;8<sup>0</sup>) = 24+2 = 26<sub>10</sub></p>` },
      'decimalToOctal': { title: 'Decimal to Octal', html: `<p>Convert decimal (base-10) to octal (base-8).</p><h3>How to Convert</h3><p>Repeatedly divide the number by 8 and record remainders.</p><p><strong>Example:</strong> 26<sub>10</sub></p><p style="font-family: monospace; text-align: center;">26&div;8=3 R 2<br>3&div;8=0 R 3</p><p>Result: 32<sub>8</sub></p>` },
    };

    const PracticeArena = () => {
        const [input, setInput] = useState('');
        const [fromBase, setFromBase] = useState('10');
        const [toBase, setToBase] = useState('2');
        const [result, setResult] = useState('-');

        useEffect(() => {
            if (input.trim() === '') { setResult('-'); return; }
            try {
                const decimalValue = parseInt(input, parseInt(fromBase));
                if (isNaN(decimalValue)) throw new Error("Invalid input");
                setResult(decimalValue.toString(parseInt(toBase)).toUpperCase());
            } catch (e) {
                setResult('Invalid');
            }
        }, [input, fromBase, toBase]);

        return (
            <div id="practiceArena">
                <h3>Practice Arena</h3>
                <div className="interactive-converter">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a value..." />
                    <select value={fromBase} onChange={e => setFromBase(e.target.value)}>
                        <option value="10">Decimal</option><option value="2">Binary</option>
                        <option value="16">Hexadecimal</option><option value="8">Octal</option>
                    </select>
                    <span> → </span>
                    <select value={toBase} onChange={e => setToBase(e.target.value)}>
                        <option value="10">Decimal</option><option value="2">Binary</option>
                        <option value="16">Hexadecimal</option><option value="8">Octal</option>
                    </select>
                    <div className="result">{result}</div>
                </div>
            </div>
        );
    };

    const LearningHub = () => {
        const [activeTopic, setActiveTopic] = useState<GameMode | null>(null);
        return (
            <>
                <div id="learningSection">
                    <h3 style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>Learn the Concepts</h3>
                    <div className="learning-nav">
                        {Object.keys(rulesData).map(key => (
                            <button key={key} className="game-button" onClick={() => setActiveTopic(key as GameMode)}>
                                {rulesData[key as GameMode].title}
                            </button>
                        ))}
                    </div>
                    <div id="learningContent" className="learning-content-area"
                        dangerouslySetInnerHTML={{ __html: activeTopic ? rulesData[activeTopic].html : '<p>Select a topic above to learn more about it.</p>' }}
                    />
                </div>
                <PracticeArena />
            </>
        )
    }

    return (
        <>
            <style>{`
            :root{
              --accent:#28f0ff; --accent-2:#7cff6b; --danger:#ff4b6b; --bg:#05060a; --glass: rgba(255,255,255,0.04);
              --fps:60; --player-color: #28f0ff; --projectile-color: #7cff6b;
            }
            html,body{height:100%;margin:0;background:linear-gradient(180deg,#02030a 0%, #071027 100%);font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#dceffb; cursor:auto;}
            #container{position:relative;width:100%;height:100vh;overflow:hidden}
            canvas#gameCanvas{display:block;width:100%;height:100%;background:transparent}
            canvas#gameCanvas.blasting{cursor:auto;}
            #loadingScreen{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;backdrop-filter:blur(4px);z-index:40}
            .logo{font-weight:800;font-size:36px;letter-spacing:2px;color:var(--accent);text-shadow:0 4px 18px rgba(40,240,255,0.06)}
            .spinner{margin-top:18px;width:72px;height:72px;border-radius:50%;border:6px solid rgba(255,255,255,0.06);border-top-color:var(--accent);animation:spin 1s linear infinite}
            @keyframes spin{to{transform:rotate(360deg)}}
            #uiOverlay{position:absolute;left:12px;right:12px;bottom:12px;pointer-events:none;padding:0;display:flex;gap:12px;align-items:center;z-index:30; justify-content:center; flex-direction: column;}
            .hud{pointer-events:auto;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(6px);padding:14px;border-radius:14px;display:flex;gap:14px;align-items:center; width: 100%; box-sizing: border-box;}
            .centerPanel{flex-direction:column;text-align:center;}
            .stat{display:flex;gap:8px;align-items:center}
            .score{font-size:16px;font-weight:700;color:var(--accent);transition: color 0.2s, transform 0.2s;}
            .small{font-size:12px;color:rgba(220,239,251,0.8)}
            .lives{display:flex;gap:6px}
            .shield{width:20px;height:20px;border-radius:4px;background:linear-gradient(180deg,#2ae6ff33,#1b9ea833);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.06);}
            .shield.lost{opacity:0.3; transition: opacity 0.4s;}
            .shield:nth-child(1) { transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);}
            .shield:nth-child(2) { transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.05s;}
            .shield:nth-child(3) { transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.1s;}
            #inputPanel{pointer-events:auto;display:flex;flex-direction:column;gap:8px;align-items:center; width:100%;}
            .choices{display:flex;gap:8px; justify-content:center; flex-wrap:wrap;}
            .choiceBtn{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.06);padding:8px 12px;border-radius:8px;color:#cfefff;min-width:80px;text-align:center;cursor:pointer;transition:transform .08s ease, box-shadow .12s ease; font-size:14px;}
            .choiceBtn:hover{transform:translateY(-4px);box-shadow:0 6px 24px rgba(40,240,255,0.06)}
            #answerInput{width:180px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit;font-size:14px; text-align:center;}
            .progress-group{display:flex; flex-direction:column; gap:4px; width:100%;}
            .waveBar{height:8px;width:100%;background:rgba(255,255,255,0.03);border-radius:4px;overflow:hidden;}
            .waveBar > i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));width:100%;transform-origin:left}
            #learningLog{position:absolute;top:12px;left:12px;right:12px;width:auto; max-height:25vh;overflow:auto;padding:12px;border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.04);z-index:31}
            .logEntry{padding:8px;border-radius:8px;margin-bottom:8px;background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(40,240,255,0.02));font-size:13px}
            #gameOver{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:50}
            #gameOver .panel{background:rgba(3,6,12,0.7);padding:28px;border-radius:14px;border:1px solid rgba(255,255,255,0.06)}
            .modal-screen { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(4px); z-index: 50; padding: 20px; }
            .modal-panel { background: rgba(3,6,12,0.7); padding: 28px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); max-width: 600px; width: 100%; box-sizing: border-box;}
            .modal-panel h2 { font-size: 2em; margin-top: 0; }
            .modal-panel p { font-size: 0.9em; line-height: 1.6; }
            .modal-panel ul { font-size: 0.9em; padding-left: 20px; }
            .modal-panel li { margin-bottom: 8px; }
            .game-mode-selection { display: flex; flex-direction: column; gap: 12px; width: 100%; }
            .game-mode-selection .game-button { margin: 0; width: 100%; box-sizing: border-box; }
            .game-button { padding: 12px 24px; margin: 8px; font-size: 1.2em; font-weight: bold; color: var(--accent); background: linear-gradient(180deg, rgba(40,240,255,0.05), rgba(40,240,255,0.02)); border: 1px solid var(--accent); border-radius: 10px; cursor: pointer; transition: all 0.2s ease; }
            .game-button:hover { background: linear-gradient(180deg, rgba(40,240,255,0.1), rgba(40,240,255,0.05)); box-shadow: 0 0 10px var(--accent); }
            .game-button.small-btn { padding: 6px 14px; font-size: 0.9em; }
            .learning-nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 16px 0; }
            .learning-nav .game-button { padding: 6px 12px; font-size: 0.8em; font-weight: normal; margin: 0; }
            .learning-content-area { background: rgba(0,0,0,0.2); border-radius: 8px; padding: 16px; min-height: 100px; text-align: left; }
            .interactive-converter { padding: 16px; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 16px; text-align: center; }
            .interactive-converter input, .interactive-converter select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px; border-radius: 6px; font-size: 1em; margin: 4px; }
            .interactive-converter .result { margin-top: 12px; font-size: 1.2em; font-weight: bold; color: var(--accent-2); }
            #practiceArena { text-align: center; }
            #practiceArena h3 { text-align:center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
            @media (min-width: 900px) {
                #uiOverlay{flex-direction:row; align-items:flex-end; left:0; right:0; bottom:20px; padding:14px 28px;}
                .leftPanel{flex:1;min-width:180px; width: auto;}
                .centerPanel{width:420px;}
                .rightPanel{width:180px;}
                #learningLog{top:20px;right:20px;left:auto;width:300px;max-height:48vh;}
                .game-mode-selection { display: grid; grid-template-columns: 1fr 1fr; }
            }
          `}</style>
            <div id="container">
                <canvas id="gameCanvas" ref={canvasRef}></canvas>

                {gameState === 'loading' && (
                    <div id="loadingScreen">
                        <div className="logo">BINARY BLASTER</div>
                        <div className="spinner" aria-hidden></div>
                        <div className="small" style={{ marginTop: '12px', opacity: .8 }}>Initializing engine...</div>
                    </div>
                )}
                
                {gameState === 'menu' && (
                    <div id="startScreen" className="modal-screen">
                        <div className="modal-panel" style={{ textAlign: 'center' }}>
                            <h2>Select Game Mode</h2>
                            <div className="game-mode-selection">
                                {Object.keys(rulesData).map(key => (
                                    <button key={key} className="game-button" onClick={() => showRules(key as GameMode)}>
                                        {rulesData[key as GameMode].title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {gameState === 'rules' && (
                    <div id="rulesScreen" className="modal-screen">
                        <div className="modal-panel">
                            <h2 id="rulesTitle">{rulesData[currentMode].title}</h2>
                            <div id="rulesContent" dangerouslySetInnerHTML={{ __html: rulesData[currentMode].html }} />
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button className="game-button" onClick={() => startGame(currentMode)}>Play!</button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'paused' && (
                     <div id="pauseScreen" className="modal-screen">
                        <div className="modal-panel" style={{ textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2 style={{ textAlign: 'center' }}>Game Paused</h2>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <button className="game-button" onClick={resumeGame}>Resume</button>
                                <button className="game-button" onClick={() => { resumeGame(); showMenu(); }}>Main Menu</button>
                            </div>
                            <LearningHub />
                        </div>
                    </div>
                )}

                { (gameState === 'playing' || gameState === 'paused') && (
                    <>
                        <div id="learningLog" aria-live="polite">
                            {learningLog.map(entry => (
                                <div key={entry.id} className="logEntry">
                                    <strong>{entry.problem}</strong> = {entry.answer}
                                </div>
                            ))}
                        </div>
                        <div id="uiOverlay" style={{display: 'flex'}}>
                            <div className="hud leftPanel">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '8px' }}>
                                    <div className="stat"><div className="score" id="score">SCORE: {score}</div></div>
                                    <div className="stat">
                                        <div className="small">LIVES</div>
                                        <div className="lives">
                                            {[...Array(3)].map((_, i) => <div key={i} className={`shield ${i >= lives ? 'lost' : ''}`}></div>)}
                                        </div>
                                    </div>
                                    <div className="stat"><div className="small">STREAK</div><div id="streak">{streak}</div></div>
                                    <div className="stat" style={{ marginTop: '8px' }}><button id="pauseBtn" className="game-button small-btn" onClick={pauseGame}>PAUSE</button></div>
                                </div>
                            </div>
                            <div className="hud centerPanel">
                                <div id="inputPanel">
                                    <div id="targetInfo" className="small" style={{ opacity: .95 }}>TARGET: {currentTarget ? `${currentTarget.label} → ?` : '—'}</div>
                                    <div id="modeToggle" style={{ marginTop: '6px' }}>
                                        <button onClick={() => setInputMode(m => m === 'multiple-choice' ? 'numeric-input' : 'multiple-choice')}>
                                            {inputMode === 'multiple-choice' ? 'MULTIPLE CHOICE' : 'TYPE MODE'}
                                        </button>
                                    </div>
                                    {inputMode === 'multiple-choice' ? (
                                        <div id="multipleChoices" className="choices" style={{ marginTop: '8px' }}>
                                            {choices.map(choice => (
                                                <button key={choice} className="choiceBtn" onClick={() => handleAnswer(choice, currentTarget)}>{choice}</button>
                                            ))}
                                        </div>
                                    ) : (
                                        <input id="answerInput" type="text" placeholder="Enter Answer..." value={answerInputValue} onChange={e => setAnswerInputValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAnswer(answerInputValue, currentTarget) }}/>
                                    )}
                                </div>
                            </div>
                            <div className="hud rightPanel">
                                <div className="progress-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <div className="small">DIFFICULTY: {difficulty}</div>
                                        <div className="small">WAVE</div>
                                    </div>
                                    <div className="waveBar"><i style={{ width: `${clamp(waveTimer / 90, 0, 1) * 100}%` }}></i></div>
                                </div>
                                <div className="progress-group" style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <div className="small">Progress: {levelProgress}%</div>
                                        <div className="small">LEVEL</div>
                                    </div>
                                    <div className="waveBar"><i style={{ background: 'linear-gradient(90deg,var(--accent-2),#9bffb6)', width: `${levelProgress}%` }}></i></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
                {gameState === 'gameOver' && (
                    <div id="gameOver">
                        <div className="panel">
                            <h2>GAME OVER</h2>
                            <div id="finalScore">Final Score: {finalScore}</div>
                            <div style={{ marginTop: '12px' }}><button className="game-button" onClick={showMenu}>Play Again</button></div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default App;

