// ===== RETRO 8-BIT VALENTINE: THE PATH TO YOUR HEART =====
// Palette: Sweetheart Pink #FFB2D1, Deep Rose #FF4D6D, Vintage Cream #FFF0F3

// ===== PIXEL ART RENDERER =====
const PixelArt = {
    // Draw a pixel-art heart on a canvas context at (x,y) with given size and color
    drawHeart(ctx, x, y, size, color, outline) {
      const s = size / 8; // each "pixel" unit
      ctx.fillStyle = color;
      // Heart shape in 8x7 grid
      const grid = [
        [0,1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
      ];
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col]) {
            ctx.fillRect(x + col * s, y + row * s, s, s);
          }
        }
      }
      if (outline) {
        ctx.fillStyle = outline;
        // Top highlight
        const highlight = [
          [0,1,1,0,0,1,1,0],
          [1,0,0,0,0,0,0,0],
        ];
        for (let row = 0; row < highlight.length; row++) {
          for (let col = 0; col < highlight[row].length; col++) {
            if (highlight[row][col]) {
              ctx.fillRect(x + col * s, y + row * s, s, s);
            }
          }
        }
      }
    },
  
    // Draw a pixel-art lock on a canvas
    drawLock(ctx, x, y, size, color) {
      const s = size / 10;
      ctx.fillStyle = color;
      const grid = [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
      ];
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col]) {
            ctx.fillRect(x + col * s, y + row * s, s, s);
          }
        }
      }
      // Keyhole
      ctx.fillStyle = '#0d0508';
      ctx.fillRect(x + 4 * s, y + 5 * s, 2 * s, s);
      ctx.fillRect(x + 4.5 * s, y + 6 * s, s, s);
    },
  
    // Draw pixel-art lock with heart merged
    drawHeartLock(ctx, w, h, locked, frame) {
      ctx.clearRect(0, 0, w, h);
      if (locked) {
        // Locked heart with lock overlay
        this.drawHeart(ctx, 8, 4, 80, '#FF4D6D', '#FFB2D1');
        this.drawLock(ctx, 24, 24, 48, '#FFF0F3');
      } else {
        // Unlocked: heart glowing, lock gone
        const pulse = Math.floor(frame / 4) % 2;
        this.drawHeart(ctx, 8 - pulse, 4 - pulse, 80 + pulse * 2, '#FF4D6D', '#FFB2D1');
        // Sparkle particles
        const sparkles = [[12, 8], [72, 12], [44, 60], [8, 40], [76, 44]];
        ctx.fillStyle = '#FFF0F3';
        sparkles.forEach(([sx, sy], i) => {
          if ((frame + i * 3) % 8 < 4) {
            ctx.fillRect(sx, sy, 4, 4);
          }
        });
      }
    },
  
    // Draw 16x16 player sprite
    drawPlayer(ctx, x, y, w, h, facing, squash, frame) {
      const scaleX = 1 + squash;
      const scaleY = 1 - squash;
      ctx.save();
      ctx.translate(x + w / 2, y + h);
      ctx.scale(facing === 'left' ? -scaleX : scaleX, scaleY);
      ctx.translate(-w / 2, -h);
  
      const s = w / 8;
      // Body
      ctx.fillStyle = '#FF4D6D';
      const body = [
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0],
      ];
      for (let row = 0; row < body.length; row++) {
        for (let col = 0; col < body[row].length; col++) {
          if (body[row][col]) {
            ctx.fillRect(col * s, row * s, s + 0.5, s + 0.5);
          }
        }
      }
  
      // Eyes
      ctx.fillStyle = '#FFF0F3';
      ctx.fillRect(2 * s, 2 * s, s, s);
      ctx.fillRect(5 * s, 2 * s, s, s);
      // Pupils (animate with frame)
      ctx.fillStyle = '#0d0508';
      const pupilOff = frame % 60 < 50 ? 0 : s * 0.3;
      ctx.fillRect(2 * s + pupilOff, 2 * s, s * 0.6, s);
      ctx.fillRect(5 * s + pupilOff, 2 * s, s * 0.6, s);
  
      // Highlight
      ctx.fillStyle = '#FFB2D1';
      ctx.fillRect(2 * s, s, 2 * s, s * 0.5);
  
      ctx.restore();
    },
  
    // Draw pixel envelope
    drawEnvelope(ctx, x, y, w, h, bob) {
      const s = 2;
      ctx.save();
      ctx.translate(x, y + bob);
      // Golden body
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(0, 0, w, h);
      // Darker border
      ctx.fillStyle = '#CC9900';
      // Top edge
      for (let i = 0; i < w; i += s) { ctx.fillRect(i, 0, s, s); }
      // Bottom
      for (let i = 0; i < w; i += s) { ctx.fillRect(i, h - s, s, s); }
      // Left
      for (let i = 0; i < h; i += s) { ctx.fillRect(0, i, s, s); }
      // Right
      for (let i = 0; i < h; i += s) { ctx.fillRect(w - s, i, s, s); }
      // Flap
      ctx.fillStyle = '#FFA500';
      for (let i = 0; i < w / 2; i += s) {
        const row = Math.floor(i * h * 0.6 / (w / 2));
        ctx.fillRect(i, 0, s, row);
        ctx.fillRect(w - i - s, 0, s, row);
      }
      // Heart seal
      ctx.fillStyle = '#FF4D6D';
      const hs = 4;
      this.drawHeart(ctx, w / 2 - hs * 4, h * 0.35, hs * 8, '#FF4D6D');
      ctx.restore();
    },
  
    // Draw pixel spike (glitchy 8-bit style, frame-based for smoothness)
    drawSpike(ctx, x, y, w, h, frame) {
      ctx.fillStyle = '#FF4D6D';
      const s = 2;
      const cols = Math.ceil(w / s);
      const rows = Math.ceil(h / s);
      for (let r = 0; r < rows; r++) {
        const rowWidth = Math.floor((r / rows) * cols);
        const startCol = Math.floor((cols - rowWidth) / 2);
        for (let c = startCol; c < startCol + rowWidth; c++) {
          const glitch = (frame + r * 7 + c * 11) % 30;
          if (glitch < 2) continue;
          ctx.fillRect(x + c * s, y + (rows - r - 1) * s, s, s);
        }
      }
      // Highlight top pixel
      ctx.fillStyle = '#FFB2D1';
      ctx.fillRect(x + Math.floor(cols / 2) * s, y, s, s);
    },
  
    // Dithered gradient rect
    drawDitheredRect(ctx, x, y, w, h, color1, color2) {
      for (let py = 0; py < h; py += 2) {
        for (let px = 0; px < w; px += 2) {
          const ratio = py / h;
          const dither = ((px + py) % 4 < 2) ? 0 : 1;
          ctx.fillStyle = ratio + dither * 0.1 > 0.5 ? color2 : color1;
          ctx.fillRect(x + px, y + py, 2, 2);
        }
      }
    }
  };
  
  
  // ===== AUDIO ENGINE =====
  const AudioEngine = {
    ctx: null,
    musicGain: null,
    sfxGain: null,
    currentMusic: null,
  
    init() {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.3;
      this.musicGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.4;
      this.sfxGain.connect(this.ctx.destination);
    },
  
    ensureCtx() {
      if (!this.ctx) this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    },
  
    playGameMusic() {
      this.ensureCtx();
      this.stopMusic();
      const ctx = this.ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      gain.connect(this.musicGain);
  
      const notes = [262, 330, 392, 523, 392, 330, 262, 294, 349, 440, 523, 440, 349, 294];
      let noteIndex = 0;
      const playNote = () => {
        if (!this.currentMusic) return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = notes[noteIndex % notes.length];
        noteGain.gain.setValueAtTime(0.15, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
        noteIndex++;
        this.currentMusic = setTimeout(playNote, 220);
      };
      this.currentMusic = setTimeout(playNote, 0);
    },
  
    playRomanticMusic() {
      this.ensureCtx();
      this.stopMusic();
      const ctx = this.ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.1;
      gain.connect(this.musicGain);
  
      const notes = [523, 587, 659, 784, 659, 587, 523, 494, 440, 494, 523, 587, 523];
      let noteIndex = 0;
      const playNote = () => {
        if (!this.currentMusic) return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIndex % notes.length];
        noteGain.gain.setValueAtTime(0.08, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.9);
        noteIndex++;
        this.currentMusic = setTimeout(playNote, 700);
      };
      this.currentMusic = setTimeout(playNote, 0);
    },
  
    stopMusic() {
      if (this.currentMusic) {
        clearTimeout(this.currentMusic);
        this.currentMusic = null;
      }
    },
  
    playPowerUp() {
      this.ensureCtx();
      const ctx = this.ctx;
      const freqs = [523, 659, 784, 1047];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.2);
      });
    },
  
    playDeath() {
      this.ensureCtx();
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    },
  
    playJump() {
      this.ensureCtx();
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    },
  
    playCorrect() {
      this.ensureCtx();
      const ctx = this.ctx;
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.2);
      });
    },
  
    playWrong() {
      this.ensureCtx();
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 120;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    },
  
    playShimmer() {
      this.ensureCtx();
      const ctx = this.ctx;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 800 + i * 200;
        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      }
    }
  };
  
  
  // ===== SCREEN MANAGEMENT =====
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  
  // ===== HEART LOCK ANIMATION =====
  const HeartLockAnim = {
    canvas: null,
    ctx: null,
    frame: 0,
    locked: true,
    animating: false,
    unlockFrame: 0,
    rafId: null,
    running: true,

    init() {
      this.canvas = document.getElementById('heart-lock-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.locked = true;
      this.running = true;
      this.animate();
    },

    stop() {
      this.running = false;
      if (this.rafId != null) cancelAnimationFrame(this.rafId);
      this.rafId = null;
    },

    animate() {
      if (!this.running || !this.ctx) return;
      this.frame++;
      PixelArt.drawHeartLock(this.ctx, 96, 96, this.locked, this.frame);
      this.rafId = requestAnimationFrame(() => this.animate());
    },
  
    unlock() {
      this.locked = false;
      this.animating = true;
      // Flash effect
      this.canvas.style.filter = 'brightness(2)';
      setTimeout(() => { this.canvas.style.filter = 'brightness(1)'; }, 150);
      setTimeout(() => { this.canvas.style.filter = 'brightness(1.5)'; }, 300);
      setTimeout(() => { this.canvas.style.filter = 'brightness(1)'; }, 450);
    }
  };
  
  
  // ===== AUTH SYSTEM =====
  const Auth = {
    questions: [
      { q: " IN WHAT PLACE DID WE HAVE OUR FIRST REAL DATE?", a: "SHANGHAI COURT" },
      { q: " WHAT IS THE ONE NAME THAT I ALWAYS CALL YOU?", a: "BANGARAM" },
      { q: " ON WHAT MONTH AND DAY IS OUR ANNIVERSARY?", a: "JULY 6TH" }
    ],
    currentQ: 0,
    backdoorClicks: 0,
    q2Answer: '',
  
    init() {
      HeartLockAnim.init();
      this.showQuestion();
      document.getElementById('submit-btn').addEventListener('click', () => this.checkAnswer());
      document.getElementById('answer-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
      document.getElementById('answer-input').addEventListener('input', () => {
        const input = document.getElementById('answer-input').value.toUpperCase();
        const answer = this.questions[this.currentQ].a;
        if (answer.startsWith(input) && input.length > 0) {
          const ratio = input.length / answer.length;
          // Make heart lock canvas scale with progress
          const scale = 1 + ratio * 0.15;
          document.getElementById('heart-lock-canvas').style.transform = `scale(${scale})`;
        } else {
          document.getElementById('heart-lock-canvas').style.transform = 'scale(1)';
        }
      });
  
      document.getElementById('backdoor').addEventListener('click', () => {
        this.backdoorClicks++;
        if (this.backdoorClicks >= 5) {
          this.q2Answer = this.questions[1].a;
          this.skipToGame();
        }
      });
    },
  
    showQuestion() {
      const q = this.questions[this.currentQ];
      document.getElementById('question-text').textContent = q.q;
      document.getElementById('answer-input').value = '';
      document.getElementById('auth-feedback').textContent = '';
      document.getElementById('answer-input').focus();
  
      for (let i = 0; i < 3; i++) {
        const dot = document.getElementById('dot-' + i);
        dot.className = 'dot';
        if (i < this.currentQ) dot.classList.add('completed');
        if (i === this.currentQ) dot.classList.add('active');
      }
    },
  
    checkAnswer() {
      AudioEngine.ensureCtx();
      const input = document.getElementById('answer-input').value.trim().toUpperCase();
      const correct = this.questions[this.currentQ].a;
  
      if (input === correct) {
        AudioEngine.playCorrect();
        if (this.currentQ === 1) this.q2Answer = correct;
        document.getElementById('dot-' + this.currentQ).className = 'dot completed';
        this.currentQ++;
  
        if (this.currentQ >= 3) {
          AudioEngine.playPowerUp();
          HeartLockAnim.unlock();
          setTimeout(() => this.skipToGame(), 800);
        } else {
          setTimeout(() => this.showQuestion(), 400);
        }
      } else {
        AudioEngine.playWrong();
        document.getElementById('auth-feedback').textContent = '> ACCESS DENIED: ONLY MY FAVORITE PERSON KNOWS THIS.';
        document.querySelector('.auth-container').classList.add('shake');
        setTimeout(() => {
          document.querySelector('.auth-container').classList.remove('shake');
        }, 400);
      }
    },
  
    skipToGame() {
      if (!this.q2Answer) this.q2Answer = this.questions[1].a;
      HeartLockAnim.stop();
      showScreen('loading-screen');
      this.runLoadingBar();
    },
  
    runLoadingBar() {
      let progress = 0;
      const bar = document.getElementById('progress-bar');
      const pct = document.getElementById('loading-percent');
      const interval = setInterval(() => {
        progress += Math.random() * 6 + 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            showScreen('game-screen');
            Game.init();
          }, 500);
        }
        // Step-based for retro feel
        const stepped = Math.floor(progress / 4) * 4;
        bar.style.width = stepped + '%';
        pct.textContent = Math.floor(progress) + '%';
      }, 100);
    }
  };
  
  
  // ===== GAME ENGINE =====
  const Game = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    player: null,
    platforms: [],
    hazards: [],
    envelope: null,
    specialItems: [],
    particles: [],
    currentLevel: 1,
    deaths: 0,
    keys: {},
    gameLoop: null,
    levelState: {},
    gravity: 0.6,
    running: false,
    frame: 0,
    lastFrameTime: 0,
    bgCache: null,

    // Player animation
    squash: 0,
    facing: 'right',
    wasOnGround: false,
  
    // Level 4 specific
    passwordFails: 0,
    bridgeBuilt: false,
    bridgeTimer: 0,
    bridgePlatforms: [],
    bridgeRotating: false,
  
    init() {
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      this.resize();
      window.addEventListener('resize', () => this.resize());
  
      window.addEventListener('keydown', (e) => {
        this.keys[e.key.toLowerCase()] = true;
        if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
      });
      window.addEventListener('keyup', (e) => {
        this.keys[e.key.toLowerCase()] = false;
      });
  
      AudioEngine.playGameMusic();
      this.loadLevel(1);
      this.running = true;
      this.lastFrameTime = 0;
      requestAnimationFrame((t) => this.loop(t));
    },
  
    resize() {
      const container = document.getElementById('game-screen');
      const hud = document.querySelector('.game-hud');
      this.width = container.clientWidth;
      this.height = container.clientHeight - (hud ? hud.offsetHeight : 50);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      if (this.ctx) this.ctx.imageSmoothingEnabled = false;
      this.bgCache = null;
      if (this.running && this.currentLevel) this.loadLevel(this.currentLevel);
    },
  
    loadLevel(num) {
      this.currentLevel = num;
      this.platforms = [];
      this.hazards = [];
      this.specialItems = [];
      this.particles = [];
      this.envelope = null;
      this.levelState = {};
      this.bridgeBuilt = false;
      this.bridgePlatforms = [];
      this.bridgeRotating = false;
      this.squash = 0;
      document.getElementById('level-label').textContent = 'LVL ' + num;
      document.getElementById('password-overlay').classList.add('hidden');
  
      const W = this.width;
      const H = this.height;
      const floorY = H - 40;
  
      this.player = {
        x: 60, y: floorY - 32,
        w: 24, h: 28,
        vx: 0, vy: 0,
        onGround: false,
        canJump: true,
        canDoubleJump: false,
        hasDoubleJumped: false,
        jumpBroken: false,
        jumpCount: 0,
      };
  
      switch (num) {
        case 1: this.buildLevel1(W, H, floorY); break;
        case 2: this.buildLevel2(W, H, floorY); break;
        case 3: this.buildLevel3(W, H, floorY); break;
        case 4: this.buildLevel4(W, H, floorY); break;
      }
    },
  
    buildLevel1(W, H, floorY) {
      this.platforms.push({ x: 0, y: floorY, w: W * 0.65, h: 40, visible: true, disappears: false });
      this.platforms.push({ x: W * 0.65, y: floorY, w: W * 0.2, h: 40, visible: true, disappears: true, id: 'trap-floor' });
      this.platforms.push({ x: W * 0.85, y: floorY, w: W * 0.15, h: 40, visible: true, disappears: false });
      this.platforms.push({ x: W * 0.3, y: floorY - 80, w: 80, h: 14, visible: true });
      this.platforms.push({ x: W * 0.5, y: floorY - 130, w: 80, h: 14, visible: true });
      this.platforms.push({ x: W * 0.68, y: floorY - 90, w: 90, h: 14, visible: false, id: 'secret' });
      this.envelope = { x: W * 0.9, y: floorY - 50, w: 30, h: 24, reached: false };
      this.levelState.trapTriggered = false;
    },
  
    buildLevel2(W, H, floorY) {
      this.platforms.push({ x: 0, y: floorY, w: W, h: 40, visible: true });
      this.platforms.push({ x: W * 0.2, y: floorY - 100, w: 90, h: 14, visible: true });
      this.platforms.push({ x: W * 0.5, y: floorY - 140, w: 90, h: 14, visible: true });
      this.platforms.push({ x: W * 0.75, y: floorY - 90, w: 90, h: 14, visible: true });
  
      const pillarPositions = [0.25, 0.45, 0.65, 0.82];
      pillarPositions.forEach(pos => {
        this.hazards.push({
          x: W * pos, y: -80, w: 28, h: 68,
          type: 'pillar',
          triggerX: W * (pos - 0.03), triggerW: 60,
          falling: false, vy: 0, origY: -80
        });
      });
  
      // Ceiling spikes
      for (let i = 0; i < W; i += 36) {
        this.hazards.push({ x: i, y: 0, w: 18, h: 14, type: 'deco-spike' });
      }
  
      this.envelope = { x: W * 0.92, y: floorY - 50, w: 30, h: 24, reached: false };
    },
  
    buildLevel3(W, H, floorY) {
      this.platforms.push({ x: 0, y: floorY, w: W * 0.25, h: 40, visible: true });
      this.platforms.push({ x: W * 0.32, y: floorY, w: W * 0.2, h: 40, visible: true });
      this.platforms.push({ x: W * 0.58, y: floorY, w: W * 0.15, h: 40, visible: true });
      this.platforms.push({ x: W * 0.8, y: floorY, w: W * 0.2, h: 40, visible: true });
      this.platforms.push({ x: W * 0.35, y: floorY - 160, w: 80, h: 14, visible: true });
      this.platforms.push({ x: W * 0.55, y: floorY - 200, w: 80, h: 14, visible: true });
      this.platforms.push({ x: W * 0.75, y: floorY - 170, w: 80, h: 14, visible: true });
  
      this.specialItems.push({
        x: W * 0.15, y: floorY - 70, w: 24, h: 24,
        type: 'repair-heart', collected: false
      });
  
      const gapStarts = [W * 0.25, W * 0.52, W * 0.73];
      const gapEnds = [W * 0.32, W * 0.58, W * 0.8];
      for (let g = 0; g < 3; g++) {
        for (let sx = gapStarts[g]; sx < gapEnds[g]; sx += 20) {
          this.hazards.push({ x: sx, y: H - 14, w: 16, h: 14, type: 'spike' });
        }
      }
  
      this.envelope = { x: W * 0.88, y: floorY - 220, w: 30, h: 24, reached: false };
      this.levelState.jumpBreakCount = 0;
      this.levelState.jumpBroken = false;
      this.levelState.showBrokenMsg = false;
      this.levelState.brokenMsgTimer = 0;
    },
  
    buildLevel4(W, H, floorY) {
      this.platforms.push({ x: 0, y: floorY, w: W * 0.25, h: 40, visible: true });
      this.platforms.push({ x: W * 0.75, y: floorY, w: W * 0.25, h: 40, visible: true });
  
      for (let sx = W * 0.25; sx < W * 0.75; sx += 20) {
        this.hazards.push({ x: sx, y: H - 14, w: 16, h: 14, type: 'spike' });
      }
  
      this.envelope = {
        x: W * 0.88, y: floorY - 50, w: 30, h: 24, reached: false,
        moves: true, moveSpeed: 2, trapped: false,
        minX: W * 0.76, maxX: W * 0.96,
        minY: floorY - 200, maxY: floorY - 40,
        vx: 2, vy: -1
      };
  
      this.levelState.needPassword = true;
      this.levelState.passwordSolved = false;
      this.showPasswordPrompt();
    },
  
    showPasswordPrompt() {
      const overlay = document.getElementById('password-overlay');
      overlay.classList.remove('hidden');
      const lettersDiv = document.getElementById('password-letters');
      const password = Auth.q2Answer;
      lettersDiv.innerHTML = '';
      for (let i = 0; i < password.length; i++) {
        const span = document.createElement('div');
        span.className = 'password-letter';
        span.id = 'pl-' + i;
        lettersDiv.appendChild(span);
      }
  
      const input = document.getElementById('password-input');
      input.value = '';
      input.focus();
  
      if (this.passwordFails >= 3) {
        document.getElementById('password-hint').classList.remove('hidden');
      }
  
      input.oninput = () => {
        const val = input.value.toUpperCase();
        const pw = Auth.q2Answer;
        for (let i = 0; i < pw.length; i++) {
          const el = document.getElementById('pl-' + i);
          if (i < val.length) {
            el.textContent = val[i];
            el.classList.add('filled');
          } else {
            el.textContent = '';
            el.classList.remove('filled');
          }
        }
  
        if (val === pw) {
          AudioEngine.playShimmer();
          this.buildBridge();
          setTimeout(() => {
            overlay.classList.add('hidden');
            input.oninput = null;
          }, 800);
        }
      };
  
      input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          const val = input.value.toUpperCase();
          if (val !== Auth.q2Answer) {
            this.passwordFails++;
            AudioEngine.playWrong();
            input.value = '';
            for (let i = 0; i < Auth.q2Answer.length; i++) {
              const el = document.getElementById('pl-' + i);
              el.textContent = '';
              el.classList.remove('filled');
            }
            if (this.passwordFails >= 3) {
              document.getElementById('password-hint').classList.remove('hidden');
            }
          }
        }
      };
    },
  
    buildBridge() {
      const W = this.width;
      const H = this.height;
      const floorY = H - 40;
      const password = Auth.q2Answer;
      const startX = W * 0.25;
      const segW = (W * 0.5) / password.length;
  
      for (let i = 0; i < password.length; i++) {
        this.bridgePlatforms.push({
          x: startX + i * segW,
          y: floorY,
          w: segW - 4,
          h: 28,
          letter: password[i],
          angle: 0,
          opacity: 0,
          born: Date.now() + i * 150
        });
      }
  
      this.bridgeBuilt = true;
      this.levelState.passwordSolved = true;
      this.levelState.needPassword = false;
      setTimeout(() => { this.bridgeRotating = true; }, 4000);
    },
  
    die() {
      this.deaths++;
      document.getElementById('death-counter').textContent = this.deaths;
      AudioEngine.playDeath();
      // Pixel explosion particles
      for (let i = 0; i < 12; i++) {
        this.particles.push({
          x: this.player.x + this.player.w / 2,
          y: this.player.y + this.player.h / 2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 20,
          color: i % 3 === 0 ? '#FFF0F3' : i % 3 === 1 ? '#FF4D6D' : '#FFB2D1',
          size: 3 + Math.floor(Math.random() * 3)
        });
      }
      setTimeout(() => this.loadLevel(this.currentLevel), 200);
    },
  
    winLevel() {
      AudioEngine.playPowerUp();
      if (this.currentLevel < 4) {
        this.currentLevel++;
        setTimeout(() => this.loadLevel(this.currentLevel), 500);
      } else {
        this.running = false;
        AudioEngine.stopMusic();
        setTimeout(() => {
          showScreen('ending-screen');
          Ending.init();
        }, 800);
      }
    },
  
    update(dt) {
      const p = this.player;
      if (!p) return;
      this.frame++;
      if (dt <= 0 || dt > 3) dt = 1;

      const moveSpeed = 4.5;
      const jumpForce = -11;

      // Freeze movement when password overlay is open (Level 4)
      const pwOverlay = document.getElementById('password-overlay');
      const passwordOpen = pwOverlay && !pwOverlay.classList.contains('hidden');
      if (passwordOpen) {
        p.vx = 0;
        p.vy = 0;
        this.particles = this.particles.filter(pt => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          return pt.life > 0;
        });
        return;
      }

      // Horizontal movement
      p.vx = 0;
      if (this.keys['arrowleft'] || this.keys['a']) { p.vx = -moveSpeed; this.facing = 'left'; }
      if (this.keys['arrowright'] || this.keys['d']) { p.vx = moveSpeed; this.facing = 'right'; }
  
      // Jumping
      const jumpKey = this.keys['arrowup'] || this.keys['w'] || this.keys[' '];
  
      if (this.currentLevel === 3 && !this.levelState.jumpBroken && p.x > this.width * 0.45) {
        this.levelState.jumpBroken = true;
        this.levelState.showBrokenMsg = true;
        this.levelState.brokenMsgTimer = 150;
      }
      if (this.currentLevel === 3 && this.levelState.jumpBroken && !p.canDoubleJump) {
        if (jumpKey && p.onGround && !this.keys._jumpHeld) {
          this.levelState.showBrokenMsg = true;
          this.levelState.brokenMsgTimer = 90;
        }
      } else if (jumpKey && !this.keys._jumpHeld) {
        if (p.onGround) {
          p.vy = jumpForce;
          p.onGround = false;
          p.hasDoubleJumped = false;
          this.squash = -0.3; // Stretch on jump
          AudioEngine.playJump();
        } else if (p.canDoubleJump && !p.hasDoubleJumped) {
          p.vy = jumpForce * 0.85;
          p.hasDoubleJumped = true;
          this.squash = -0.25;
          AudioEngine.playJump();
        }
      }
      this.keys._jumpHeld = jumpKey;

      // Gravity and position (delta-scaled for smooth, consistent movement)
      p.vy += this.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
  
      // Squash/stretch decay
      this.squash *= 0.85;
      if (Math.abs(this.squash) < 0.01) this.squash = 0;
  
      // Landing detection for squash
      const wasOnGround = this.wasOnGround;
  
      // Platform collision
      p.onGround = false;
      const allPlats = [
        ...this.platforms.filter(pl => pl.visible !== false || pl.id === 'secret'),
        ...this.bridgePlatforms.filter(bp => Date.now() > bp.born && bp.opacity > 0.5)
      ];

      for (const pl of allPlats) {
        if (pl.disappears && pl._gone) continue;
        if (pl.id === 'secret' && !this.levelState.trapTriggered) continue;
  
        if (p.x + p.w > pl.x && p.x < pl.x + pl.w) {
          if (p.vy >= 0 && p.y + p.h >= pl.y && p.y + p.h <= pl.y + pl.h + p.vy + 2) {
            p.y = pl.y - p.h;
            p.vy = 0;
            p.onGround = true;
          }
          if (p.vy < 0 && p.y <= pl.y + pl.h && p.y >= pl.y) {
            p.y = pl.y + pl.h;
            p.vy = 0;
          }
        }
      }
  
      // Squash on landing
      if (p.onGround && !wasOnGround) {
        this.squash = 0.35;
      }
      this.wasOnGround = p.onGround;
  
      // Wall collision
      if (p.x < 0) p.x = 0;
      if (p.x + p.w > this.width) p.x = this.width - p.w;
  
      // Fall off bottom
      if (p.y > this.height + 50) { this.die(); return; }
  
      this.updateLevelLogic();
  
      // Hazard collision
      for (const h of this.hazards) {
        if (h.type === 'deco-spike') continue;
        if (h.type === 'pillar' && !h.falling && h.y < 0) {
          if (p.x + p.w > h.triggerX && p.x < h.triggerX + h.triggerW && p.y + p.h > this.height - 80) {
            h.falling = true;
          }
          continue;
        }
        if (h.type === 'pillar' && h.falling) {
          h.vy += 0.5;
          h.y += h.vy;
        }
        if (this.rectCollide(p, h)) { this.die(); return; }
      }
  
      // Special items
      for (const item of this.specialItems) {
        if (item.collected) continue;
        if (this.rectCollide(p, item)) {
          item.collected = true;
          if (item.type === 'repair-heart') {
            p.canDoubleJump = true;
            this.levelState.jumpBroken = false;
            AudioEngine.playPowerUp();
            this.levelState.showRepairMsg = true;
            this.levelState.repairMsgTimer = 90;
          }
        }
      }
  
      // Envelope collision
      if (this.envelope && !this.envelope.reached) {
        if (this.currentLevel === 4 && !this.levelState.passwordSolved) {
          // Can't reach yet
        } else {
          if (this.envelope.moves && !this.envelope.trapped) {
            const dx = p.x - this.envelope.x;
            const dy = p.y - this.envelope.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              this.envelope.x -= Math.sign(dx) * this.envelope.moveSpeed * 2;
              this.envelope.y -= Math.sign(dy) * this.envelope.moveSpeed;
            }
            if (this.envelope.x < this.envelope.minX) { this.envelope.x = this.envelope.minX; this.envelope.trapped = this.isInCorner(); }
            if (this.envelope.x > this.envelope.maxX) { this.envelope.x = this.envelope.maxX; this.envelope.trapped = this.isInCorner(); }
            if (this.envelope.y < this.envelope.minY) this.envelope.y = this.envelope.minY;
            if (this.envelope.y > this.envelope.maxY) this.envelope.y = this.envelope.maxY;
          }
          if (this.rectCollide(p, this.envelope)) {
            this.envelope.reached = true;
            this.winLevel();
          }
        }
      }
  
      // Update particles
      this.particles = this.particles.filter(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        return pt.life > 0;
      });
  
      // Message timers
      if (this.levelState.showBrokenMsg) {
        this.levelState.brokenMsgTimer--;
        if (this.levelState.brokenMsgTimer <= 0) this.levelState.showBrokenMsg = false;
      }
      if (this.levelState.showRepairMsg) {
        this.levelState.repairMsgTimer--;
        if (this.levelState.repairMsgTimer <= 0) this.levelState.showRepairMsg = false;
      }
  
      // Bridge animation
      for (const bp of this.bridgePlatforms) {
        if (Date.now() > bp.born) bp.opacity = Math.min(1, bp.opacity + 0.05);
        if (this.bridgeRotating) {
          bp.angle += 0.01;
          if (bp.angle > 0.3) bp.w = Math.max(5, bp.w - 0.3);
        }
      }
    },
  
    isInCorner() {
      const e = this.envelope;
      return (e.x <= e.minX + 5 || e.x >= e.maxX - 5) && (e.y <= e.minY + 5 || e.y >= e.maxY - 5);
    },
  
    updateLevelLogic() {
      if (this.currentLevel === 1 && !this.levelState.trapTriggered) {
        if (this.player.x > this.width * 0.52) {
          this.levelState.trapTriggered = true;
          const trap = this.platforms.find(p => p.id === 'trap-floor');
          if (trap) { trap._gone = true; trap.visible = false; }
          const secret = this.platforms.find(p => p.id === 'secret');
          if (secret) { secret.visible = 'shimmer'; secret._gone = false; }
        }
      }
    },
  
    rectCollide(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    },
  
    draw() {
      const ctx = this.ctx;
      const W = this.width;
      const H = this.height;

      // Cached dithered background (redraw only on resize for smooth FPS)
      if (!this.bgCache || this.bgCache.width !== W || this.bgCache.height !== H) {
        this.bgCache = document.createElement('canvas');
        this.bgCache.width = W;
        this.bgCache.height = H;
        const bctx = this.bgCache.getContext('2d');
        for (let py = 0; py < H; py += 8) {
          for (let px = 0; px < W; px += 8) {
            const ratio = py / H;
            const dither = ((px + py) % 16 < 8) ? 0 : 1;
            bctx.fillStyle = ratio + dither * 0.1 > 0.5 ? '#1a0a14' : '#0d0508';
            bctx.fillRect(px, py, 8, 8);
          }
        }
      }
      ctx.drawImage(this.bgCache, 0, 0);
  
      // Background pixel hearts (subtle)
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 5; i++) {
        const bx = ((i * 200 + this.frame * 0.3) % (W + 60)) - 30;
        const by = (i * 150 + Math.sin(this.frame * 0.02 + i) * 20) % H;
        PixelArt.drawHeart(ctx, bx, by, 32, '#FF4D6D');
      }
      ctx.globalAlpha = 1;
  
      // Platforms
      for (const pl of this.platforms) {
        if (pl._gone) continue;
        if (pl.visible === false) continue;
        if (pl.visible === 'shimmer') {
          ctx.globalAlpha = 0.3 + Math.sin(this.frame * 0.08) * 0.2;
          ctx.fillStyle = '#FFB2D1';
          ctx.fillRect(Math.floor(pl.x), Math.floor(pl.y), Math.floor(pl.w), pl.h);
          // Pixel border
          ctx.fillStyle = '#FF4D6D';
          ctx.fillRect(Math.floor(pl.x), Math.floor(pl.y), Math.floor(pl.w), 2);
          ctx.globalAlpha = 1;
          continue;
        }
        // Main platform body
        ctx.fillStyle = '#a0203e';
        ctx.fillRect(Math.floor(pl.x), Math.floor(pl.y), Math.floor(pl.w), pl.h);
        // Top highlight
        ctx.fillStyle = '#FF4D6D';
        ctx.fillRect(Math.floor(pl.x), Math.floor(pl.y), Math.floor(pl.w), 3);
        // Bottom shadow
        ctx.fillStyle = '#5a1020';
        ctx.fillRect(Math.floor(pl.x), Math.floor(pl.y + pl.h - 3), Math.floor(pl.w), 3);
        // Left highlight
        ctx.fillStyle = '#FFB2D1';
        ctx.fillRect(Math.floor(pl.x), Math.floor(pl.y), 2, pl.h);
        // Dither pattern on surface
        ctx.fillStyle = '#b0304e';
        for (let dx = 0; dx < pl.w; dx += 8) {
          for (let dy = 4; dy < pl.h - 4; dy += 6) {
            if ((dx + dy) % 12 < 4) {
              ctx.fillRect(Math.floor(pl.x + dx), Math.floor(pl.y + dy), 2, 2);
            }
          }
        }
      }
  
      // Bridge platforms with petal glow
      for (const bp of this.bridgePlatforms) {
        if (bp.opacity <= 0) continue;
        ctx.save();
        ctx.globalAlpha = bp.opacity;
        ctx.translate(Math.floor(bp.x + bp.w / 2), Math.floor(bp.y + bp.h / 2));
        ctx.rotate(bp.angle);
        // Glow
        ctx.fillStyle = '#FFB2D1';
        ctx.fillRect(-Math.floor(bp.w / 2) - 2, -Math.floor(bp.h / 2) - 2, Math.floor(bp.w) + 4, bp.h + 4);
        // Body
        ctx.fillStyle = '#FF4D6D';
        ctx.fillRect(-Math.floor(bp.w / 2), -Math.floor(bp.h / 2), Math.floor(bp.w), bp.h);
        // Letter
        ctx.fillStyle = '#FFF0F3';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bp.letter, 0, 0);
        ctx.restore();
      }
  
      // Hazards (glitchy 8-bit spikes)
      for (const h of this.hazards) {
        if (h.type === 'deco-spike') {
          PixelArt.drawSpike(ctx, h.x, h.y, h.w, h.h, this.frame);
          continue;
        }
        if (h.type === 'spike') {
          PixelArt.drawSpike(ctx, h.x, h.y, h.w, h.h, this.frame);
          continue;
        }
        if (h.type === 'pillar') {
          // Pixel art pillar with heart decoration
          ctx.fillStyle = '#FF4D6D';
          ctx.fillRect(Math.floor(h.x), Math.floor(h.y), h.w, h.h);
          // Pillar border
          ctx.fillStyle = '#FFB2D1';
          ctx.fillRect(Math.floor(h.x), Math.floor(h.y), h.w, 3);
          ctx.fillRect(Math.floor(h.x), Math.floor(h.y), 3, h.h);
          ctx.fillStyle = '#a0203e';
          ctx.fillRect(Math.floor(h.x + h.w - 3), Math.floor(h.y), 3, h.h);
          ctx.fillRect(Math.floor(h.x), Math.floor(h.y + h.h - 3), h.w, 3);
          // Heart decoration on pillar
          PixelArt.drawHeart(ctx, Math.floor(h.x + h.w / 2 - 8), Math.floor(h.y + 10), 16, '#FFF0F3');
          // Warning zone
          if (!h.falling) {
            ctx.fillStyle = 'rgba(255,77,109,0.2)';
            for (let wx = h.triggerX; wx < h.triggerX + h.triggerW; wx += 4) {
              if ((wx + this.frame) % 8 < 4)
                ctx.fillRect(Math.floor(wx), this.height - 4, 4, 4);
            }
          }
        }
      }
  
      // Special items
      for (const item of this.specialItems) {
        if (item.collected) continue;
        if (item.type === 'repair-heart') {
          const pulse = Math.floor(this.frame / 15) % 2;
          PixelArt.drawHeart(ctx, item.x - pulse, item.y - pulse, item.w + pulse * 2, '#4CFF50', '#8FFF90');
          // Plus sign
          ctx.fillStyle = '#FFF0F3';
          ctx.fillRect(item.x + item.w / 2 - 1, item.y + item.h / 2 - 5, 3, 10);
          ctx.fillRect(item.x + item.w / 2 - 4, item.y + item.h / 2 - 1, 9, 3);
        }
      }
  
      // Envelope
      if (this.envelope && !this.envelope.reached) {
        const e = this.envelope;
        const bob = Math.floor(Math.sin(this.frame * 0.06) * 3);
        PixelArt.drawEnvelope(ctx, e.x, e.y + bob, e.w, e.h, 0);
      }
  
      // Player (16x16 pixel sprite with squash/stretch)
      if (this.player) {
        PixelArt.drawPlayer(ctx, this.player.x, this.player.y, this.player.w, this.player.h, this.facing, this.squash, this.frame);
      }
  
      // Particles (pixel squares)
      for (const pt of this.particles) {
        ctx.globalAlpha = pt.life / 20;
        ctx.fillStyle = pt.color;
        ctx.fillRect(Math.floor(pt.x), Math.floor(pt.y), pt.size, pt.size);
      }
      ctx.globalAlpha = 1;
  
      // UI messages in pixel RPG box style
      if (this.levelState.showBrokenMsg) {
        this.drawPixelMessage(' JUMP IS BROKEN! FIND THE REPAIR HEART!', '#FF4D6D');
      }
      if (this.levelState.showRepairMsg) {
        this.drawPixelMessage(' DOUBLE JUMP UNLOCKED!', '#4CFF50');
      }
  
      // Level hints
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'center';
      if (this.currentLevel === 1 && this.levelState.trapTriggered) {
        ctx.fillStyle = '#FFB2D1';
        ctx.globalAlpha = 0.5 + Math.sin(this.frame * 0.05) * 0.3;
        ctx.fillText(' LOOK FOR THE SHIMMER...', W / 2, 30);
        ctx.globalAlpha = 1;
      }
      if (this.currentLevel === 4 && this.envelope && this.envelope.moves && !this.envelope.trapped && this.levelState.passwordSolved) {
        ctx.fillStyle = '#FFB2D1';
        ctx.globalAlpha = 0.6;
        ctx.fillText(' TRAP THE ENVELOPE IN A CORNER!', W / 2, 30);
        ctx.globalAlpha = 1;
      }
    },
  
    drawPixelMessage(text, color) {
      const ctx = this.ctx;
      const W = this.width;
      const boxW = Math.min(500, W - 40);
      const boxX = (W - boxW) / 2;
      const boxY = 50;
      // Background
      ctx.fillStyle = '#0d0508';
      ctx.fillRect(boxX, boxY, boxW, 36);
      // Border
      ctx.fillStyle = color;
      ctx.fillRect(boxX, boxY, boxW, 3);
      ctx.fillRect(boxX, boxY + 33, boxW, 3);
      ctx.fillRect(boxX, boxY, 3, 36);
      ctx.fillRect(boxX + boxW - 3, boxY, 3, 36);
      // Text
      ctx.fillStyle = color;
      ctx.font = '9px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(text, W / 2, boxY + 22);
    },
  
    loop(now) {
      if (!this.running) return;
      if (!this.lastFrameTime) this.lastFrameTime = now;
      const dt = Math.min((now - this.lastFrameTime) / 16.666, 3);
      this.lastFrameTime = now;
      this.update(dt);
      this.draw();
      requestAnimationFrame((t) => this.loop(t));
    }
  };
  
  
  // ===== ENDING SEQUENCE =====
  const Ending = {
    canvas: null,
    ctx: null,
    petals: [],
    frame: 0,
  
    letterLines: [
      { text: "HAPPY VALENTINES DAYY MY BANGARAM", type: "title" },
      { text: "My love, my kanna, my wife, I love youu soo much for playing this little game of mine that i created. I know there were alot of traps and other things but kanna its just to show how we have gone through every problem, how we learnt from our mistakes and how our love grew." },
      { text: "I know its been along time since i have written a letter to you. This is my creative way of giving you a letter kanna." },
      { text: "The past 2 years that we have spent together were the best thing god has ever given me because these two years the way you made me, the way you made me realise the smallest of the smallest is something i never knew i might turn into." },
      { text: "Yes, you do torture me, i do alot of stupid stuff but at the end of the day ill always choose you kanna because you are the one who changed my life for better." },
      { text: "There is no other human being that can make my mood get back to normal or give me the comfort of a lifetime kanna. Thank you for accepting me, my flaws, my mistakes i made from our past." },
      { text: "I just pray to god that we achieve whatever we are willing to together and just live a really good life in the future my bangaram." },
      { text: "I LOVEE YOUUU SOOO MUCHHH KANNA.", type: "emphasis" },
      { text: "Your love,\nTanuj", type: "signature" }
    ],
  
    init() {
      this.canvas = document.getElementById('ending-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
  
      AudioEngine.playRomanticMusic();
      this.drawPixelEnvelope();
  
      // Spawn pixel petals
      for (let i = 0; i < 25; i++) {
        this.petals.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: 2 + Math.floor(Math.random() * 4),
          speed: 0.3 + Math.random() * 0.4,
          drift: Math.random() * 2 - 1,
          opacity: 0.15 + Math.random() * 0.25,
          color: Math.random() > 0.5 ? '#FF4D6D' : '#FFB2D1'
        });
      }
  
      this.animatePetals();
  
      document.getElementById('envelope').addEventListener('click', () => {
        document.getElementById('envelope').classList.add('opened');
        AudioEngine.playCorrect();
        setTimeout(() => {
          document.getElementById('envelope-container').style.opacity = '0';
          setTimeout(() => {
            document.getElementById('envelope-container').style.display = 'none';
            this.showLetter();
          }, 500);
        }, 600);
      });
    },
  
    drawPixelEnvelope() {
      const canvas = document.getElementById('envelope-canvas');
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      PixelArt.drawEnvelope(ctx, 40, 20, 120, 90, 0);
      // Add sparkles
      ctx.fillStyle = '#FFF0F3';
      const sparkles = [[20, 15], [170, 25], [30, 130], [160, 120], [95, 10]];
      sparkles.forEach(([x, y]) => {
        ctx.fillRect(x, y, 4, 4);
      });
    },
  
    animatePetals() {
      const ctx = this.ctx;
      const W = this.canvas.width;
      const H = this.canvas.height;
  
      const draw = () => {
        this.frame++;
        ctx.clearRect(0, 0, W, H);
  
        // Dithered background glow
        const cx = W / 2, cy = H / 2;
        ctx.globalAlpha = 0.03;
        for (let r = 200; r > 0; r -= 8) {
          ctx.fillStyle = r % 16 < 8 ? '#FF4D6D' : '#FFB2D1';
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }
        ctx.globalAlpha = 1;
  
        for (const p of this.petals) {
          p.y += p.speed;
          p.x += Math.sin(this.frame * 0.02 + p.drift * 10) * 0.4;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
  
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          // Pixel petal (small square)
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
          // Inner highlight
          if (p.size > 3) {
            ctx.fillStyle = '#FFF0F3';
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
          }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
      };
      draw();
    },
  
    showLetter() {
      const container = document.getElementById('letter-container');
      const content = document.getElementById('letter-content');
      container.classList.remove('hidden');
      container.style.opacity = '1';
      content.innerHTML = '';
  
      const rpgCursor = document.getElementById('rpg-cursor');
  
      // Typewriter effect: reveal each line character by character
      let lineIndex = 0;
      const revealLine = () => {
        if (lineIndex >= this.letterLines.length) {
          rpgCursor.classList.add('active');
          setTimeout(() => {
            document.getElementById('continue-btn').classList.remove('hidden');
            rpgCursor.classList.remove('active');
          }, 800);
          return;
        }
  
        const line = this.letterLines[lineIndex];
        const div = document.createElement('div');
        div.className = 'letter-line';
        if (line.type === 'title') div.classList.add('letter-title');
        else if (line.type === 'signature') div.classList.add('letter-signature');
        else if (line.type === 'emphasis') div.classList.add('letter-emphasis');
  
        div.style.opacity = '1';
        div.classList.add('visible');
        content.appendChild(div);
  
        // Typewriter: add characters one by one
        const text = line.text;
        let charIndex = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        div.appendChild(cursor);
  
        const typeChar = () => {
          if (charIndex < text.length) {
            const ch = text[charIndex];
            if (ch === '\n') {
              div.insertBefore(document.createElement('br'), cursor);
            } else {
              const span = document.createTextNode(ch);
              div.insertBefore(span, cursor);
            }
            charIndex++;
  
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
  
            // Speed: faster for spaces, normal for chars
            const speed = ch === ' ' ? 15 : line.type === 'title' ? 60 : 25;
            setTimeout(typeChar, speed);
          } else {
            // Remove cursor after line is done
            cursor.remove();
            lineIndex++;
            setTimeout(revealLine, 400);
          }
        };
  
        // Small delay before starting each line
        setTimeout(typeChar, 200);
      };
  
      setTimeout(revealLine, 500);
  
      document.getElementById('continue-btn').addEventListener('click', () => {
        document.getElementById('letter-container').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('letter-container').classList.add('hidden');
          this.showHeartFormation();
        }, 500);
      });
    },
  
    showHeartFormation() {
      const container = document.getElementById('heart-formation');
      container.classList.remove('hidden');
      AudioEngine.playShimmer();
  
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2 - 20;
      const scale = Math.min(window.innerWidth, window.innerHeight) * 0.012;
      const points = [];
  
      for (let i = 0; i < 28; i++) {
        const t = (i / 28) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({ x: cx + hx * scale, y: cy + hy * scale });
      }
  
      const icons = ['♥', '🌼', '🌺', '🪻', '💌', '🦋', '💐', '♥', '🏵️', '🌸'];
  
      for (let i = 0; i < 28; i++) {
        const particle = document.createElement('div');
        particle.className = 'photo-particle';
        particle.textContent = icons[i % icons.length];
  
        const edge = Math.floor(Math.random() * 4);
        let startX, startY;
        switch (edge) {
          case 0: startX = Math.random() * window.innerWidth; startY = -60; break;
          case 1: startX = window.innerWidth + 60; startY = Math.random() * window.innerHeight; break;
          case 2: startX = Math.random() * window.innerWidth; startY = window.innerHeight + 60; break;
          case 3: startX = -60; startY = Math.random() * window.innerHeight; break;
        }
  
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.opacity = '0';
        container.appendChild(particle);
  
        setTimeout(() => {
          particle.style.opacity = '1';
          particle.style.left = (points[i].x - 24) + 'px';
          particle.style.top = (points[i].y - 24) + 'px';
        }, 200 + i * 100);
      }
  
      // Pulse after formation
      setTimeout(() => {
        container.style.animation = 'pixelPulse 1.5s step-end infinite';
      }, 200 + 28 * 100 + 2000);
    }
  };
  
  
  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', () => AudioEngine.ensureCtx(), { once: true });
    document.addEventListener('keydown', () => AudioEngine.ensureCtx(), { once: true });
    Auth.init();
  });
  