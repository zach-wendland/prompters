"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;
const HERO_IMAGE_SRC = "https://i.imgflip.com/3otbnf.jpg";

type Vector = {
  x: number;
  y: number;
};

type Entity = Vector & {
  width: number;
  height: number;
  vx: number;
  vy: number;
};

type Virus = Entity & {
  spin: number;
};

type Router = Entity & {
  pulse: number;
};

type Firewall = Entity & {
  lifetime: number;
};

type GameState = {
  hero: Entity & { invulnerable: number };
  viruses: Virus[];
  routers: Router[];
  firewalls: Firewall[];
  score: number;
  level: number;
  lastVirus: number;
  lastRouter: number;
  lastFirewall: number;
  virusInterval: number;
  routerInterval: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const intersects = (a: Entity, b: Entity) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export default function BaneInternetGauntlet() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<Record<string, boolean>>({});
  const gameRef = useRef<GameState | null>(null);
  const heroImageRef = useRef<HTMLImageElement | null>(null);

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("Press start to begin infiltrating the net.");
  const [highScore, setHighScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = HERO_IMAGE_SRC;
    heroImageRef.current = image;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = true;
      if ([" ", "space", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const resetGame = useCallback(() => {
    const hero: GameState["hero"] = {
      x: CANVAS_WIDTH / 2 - 25,
      y: CANVAS_HEIGHT - 90,
      width: 50,
      height: 70,
      vx: 0,
      vy: 0,
      invulnerable: 0,
    };

    gameRef.current = {
      hero,
      viruses: [],
      routers: [],
      firewalls: [],
      score: 0,
      level: 1,
      lastVirus: 0,
      lastRouter: 0,
      lastFirewall: 0,
      virusInterval: 1400,
      routerInterval: 2600,
    };

    setScore(0);
    setLevel(1);
    setLives(3);
    setStatus("Collect routers to boost Bane's bandwidth. Avoid red data spikes.");
    setGameOver(false);
    setIsRunning(true);
  }, []);

  const endGame = useCallback((finalMessage: string, finalScore: number) => {
    setIsRunning(false);
    setGameOver(true);
    setStatus(finalMessage);
    setHighScore((prev) => Math.max(prev, finalScore));
    setScore(finalScore);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let previous = performance.now();

    const render = (time: number) => {
      const delta = time - previous;
      previous = time;
      const game = gameRef.current;
      if (!game) return;

      const hero = game.hero;
      hero.vx = 0;
      hero.vy = 0;

      const keyMap: Record<string, Vector> = {
        w: { x: 0, y: -1 },
        arrowup: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        arrowdown: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        arrowleft: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
        arrowright: { x: 1, y: 0 },
      };

      Object.entries(keyMap).forEach(([key, vector]) => {
        if (keysRef.current[key]) {
          hero.vx += vector.x;
          hero.vy += vector.y;
        }
      });

      const normalizedMagnitude = Math.hypot(hero.vx, hero.vy);
      const speed = 0.3 * delta * (1 + game.level * 0.08);
      if (normalizedMagnitude > 0) {
        hero.vx = (hero.vx / normalizedMagnitude) * speed;
        hero.vy = (hero.vy / normalizedMagnitude) * speed;
      }

      hero.x = clamp(hero.x + hero.vx, 10, CANVAS_WIDTH - hero.width - 10);
      hero.y = clamp(hero.y + hero.vy, 10, CANVAS_HEIGHT - hero.height - 10);

      if (hero.invulnerable > 0) {
        hero.invulnerable = Math.max(0, hero.invulnerable - delta);
      }

      if (time - game.lastVirus > game.virusInterval) {
        game.lastVirus = time;
        const width = 26 + Math.random() * 40;
        const height = width;
        const spawnX = Math.random() * (CANVAS_WIDTH - width - 40) + 20;
        const velocityY = 0.15 + Math.random() * 0.2 + game.level * 0.05;
        game.viruses.push({
          x: spawnX,
          y: -height,
          width,
          height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: velocityY,
          spin: Math.random() * Math.PI * 2,
        });
        if (game.virusInterval > 450) {
          game.virusInterval -= 8;
        }
      }

      if (time - game.lastRouter > game.routerInterval) {
        game.lastRouter = time;
        const routerWidth = 32;
        const spawnX = Math.random() * (CANVAS_WIDTH - routerWidth - 40) + 20;
        game.routers.push({
          x: spawnX,
          y: -routerWidth,
          width: routerWidth,
          height: routerWidth,
          vx: 0,
          vy: 0.14 + game.level * 0.04,
          pulse: 0,
        });
        if (game.routerInterval > 1600) {
          game.routerInterval -= 12;
        }
      }

      if (time - game.lastFirewall > 6800) {
        game.lastFirewall = time;
        game.firewalls.push({
          x: Math.random() * (CANVAS_WIDTH - 120 - 40) + 20,
          y: Math.random() * (CANVAS_HEIGHT - 120 - 40) + 20,
          width: 120,
          height: 20,
          vx: 0,
          vy: 0,
          lifetime: 4200,
        });
      }

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      context.fillStyle = "#0a111f";
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, "rgba(0, 255, 209, 0.25)");
      gradient.addColorStop(1, "rgba(10, 32, 68, 0.6)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      context.strokeStyle = "rgba(0, 255, 209, 0.2)";
      context.lineWidth = 1;
      for (let y = 40; y < CANVAS_HEIGHT; y += 40) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(CANVAS_WIDTH, y);
        context.stroke();
      }

      context.save();
      game.firewalls = game.firewalls.filter((wall) => wall.lifetime > 0);
      game.firewalls.forEach((wall) => {
        wall.lifetime -= delta;
        context.globalAlpha = Math.max(0.2, wall.lifetime / 4200);
        context.fillStyle = "rgba(255, 120, 0, 0.55)";
        context.fillRect(wall.x, wall.y, wall.width, wall.height);
        context.fillStyle = "rgba(255, 180, 0, 0.35)";
        context.fillRect(wall.x, wall.y + wall.height + 4, wall.width, 4);

        if (intersects(hero, wall)) {
          hero.y = wall.y - hero.height - 2;
        }
      });
      context.restore();

      game.viruses = game.viruses.filter((virus) => virus.y < CANVAS_HEIGHT + 60);
      game.viruses.forEach((virus) => {
        virus.x += virus.vx * delta;
        virus.y += virus.vy * delta;
        virus.spin += delta * 0.003;

        context.save();
        context.translate(virus.x + virus.width / 2, virus.y + virus.height / 2);
        context.rotate(virus.spin);
        const radius = virus.width / 2;
        context.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const innerRadius = radius * 0.4;
          const outerRadius = radius;
          context.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
          context.lineTo(Math.cos(angle + Math.PI / 6) * innerRadius, Math.sin(angle + Math.PI / 6) * innerRadius);
        }
        context.closePath();
        context.fillStyle = "rgba(255, 64, 96, 0.9)";
        context.fill();
        context.restore();

        if (hero.invulnerable <= 0 && intersects(hero, virus)) {
          setLives((prev) => {
            const nextLives = prev - 1;
            if (nextLives <= 0) {
              endGame("Connection severed. The net consumes the unprepared.", game.score);
            } else {
              setStatus("Firewall breached! Bane reroutes in " + nextLives + " attempts left.");
              hero.invulnerable = 1200;
            }
            return Math.max(0, nextLives);
          });
          game.viruses.splice(game.viruses.indexOf(virus), 1);
        }
      });

      game.routers = game.routers.filter((router) => router.y < CANVAS_HEIGHT + 40);
      game.routers.forEach((router) => {
        router.y += router.vy * delta;
        router.pulse += delta * 0.004;

        context.save();
        context.translate(router.x + router.width / 2, router.y + router.height / 2);
        context.rotate(Math.sin(router.pulse) * 0.1);
        context.fillStyle = "rgba(0, 255, 209, 0.85)";
        context.fillRect(-router.width / 2, -router.height / 2, router.width, router.height);
        context.fillStyle = "rgba(0, 180, 255, 0.6)";
        context.fillRect(-router.width / 4, -router.height / 4, router.width / 2, router.height / 2);
        context.restore();

        if (intersects(hero, router)) {
          game.score += 75 + game.level * 15;
          const updatedScore = game.score;
          if (updatedScore > highScore) {
            setHighScore(updatedScore);
          }
          setScore(updatedScore);
          setStatus("Bandwidth secured. Viral nodes purged: " + updatedScore + " Mbps.");
          router.y = CANVAS_HEIGHT + 100;
          if (game.score / 400 > game.level - 1) {
            game.level += 1;
            setLevel(game.level);
            setStatus("Level " + game.level + " — deeper into the datastream.");
          }
        }
      });

      context.save();
      if (hero.invulnerable > 0) {
        context.globalAlpha = 0.6 + Math.sin(time / 80) * 0.2;
      }
      const image = heroImageRef.current;
      if (image && image.complete) {
        context.drawImage(image, hero.x, hero.y, hero.width, hero.height);
      } else {
        context.fillStyle = "#b0b7c6";
        context.fillRect(hero.x, hero.y, hero.width, hero.height);
      }
      context.restore();

      context.fillStyle = "rgba(0, 255, 209, 0.8)";
      context.font = "16px 'Orbitron', monospace";
      context.fillText(`Score: ${game.score}`, 20, 30);
      context.fillText(`Level: ${game.level}`, 20, 52);
      context.fillText(`Stability: ${lives}`, 20, 74);

      if (isRunning) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [endGame, highScore, isRunning, lives]);

  const handleStart = () => {
    resetGame();
  };

  return (
    <div className="space-y-8 text-steel">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6 rounded-2xl border border-teal/30 bg-gunmetal/70 p-6 shadow-neon">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-teal">Simulation</p>
            <h2 className="font-orbitron text-2xl text-aqua">Bane's Internet Gauntlet</h2>
            <p className="text-sm text-steel/80">
              Maneuver through the datastream, collect encrypted routers, and dodge malicious viral shards.
              Bane's visage oversees your every move — prove you were truly born in the internet.
            </p>
          </header>

          <div className="flex flex-wrap gap-4 text-sm text-steel/70">
            <div className="flex-1 min-w-[12rem]">
              <h3 className="font-semibold text-steel">Controls</h3>
              <ul className="mt-2 space-y-1">
                <li>Use <span className="text-aqua">WASD</span> or arrow keys to navigate.</li>
                <li>Collect cyan routers to increase your score.</li>
                <li>Avoid crimson viral shards — lose all stability and the connection drops.</li>
              </ul>
            </div>
            <div className="flex-1 min-w-[12rem]">
              <h3 className="font-semibold text-steel">Objectives</h3>
              <ul className="mt-2 space-y-1">
                <li>Stability begins at three — collisions drain it.</li>
                <li>Collecting routers increases level difficulty dynamically.</li>
                <li>Firewall plates spawn to grant momentary safety but can trap you.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-teal/30 bg-charcoal/70 p-4 text-sm">
            <p className="font-semibold text-steel">Status Feed</p>
            <p className="text-aqua/80">{status}</p>
            <p className="text-xs text-steel/60">High Score: {Math.max(highScore, score)}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="rounded-lg bg-aqua px-4 py-2 font-semibold text-gunmetal transition hover:bg-teal"
            >
              {gameOver ? "Restart Simulation" : isRunning ? "Restart Run" : "Initiate Gauntlet"}
            </button>
            {gameOver && <span className="text-xs uppercase tracking-widest text-rose-300">Connection severed</span>}
          </div>

          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="mt-2 w-full rounded-xl border border-aqua/20 bg-black/80"
          />
        </div>

        <aside className="space-y-4 rounded-2xl border border-teal/30 bg-gunmetal/70 p-6 text-sm shadow-neon">
          <h3 className="font-orbitron text-xl text-steel">Bane's Manifesto</h3>
          <img
            src={HERO_IMAGE_SRC}
            alt="Bane declaring his mastery of the internet"
            className="w-full rounded-lg border border-teal/30 shadow-lg"
          />
          <p className="text-steel/70">
            You merely adopted the internet. Harness the gauntlet to demonstrate you were born in it — molded by its
            firewalls and datastreams. Maintain stability, weave past viral threats, and cement your legend in the network.
          </p>
          <div className="rounded-lg border border-aqua/30 bg-charcoal/60 p-4">
            <h4 className="font-semibold text-steel">Telemetry</h4>
            <ul className="mt-2 space-y-1 text-steel/70">
              <li>Current Score: <span className="text-aqua">{score}</span></li>
              <li>Current Level: <span className="text-aqua">{level}</span></li>
              <li>Connection Stability: <span className="text-aqua">{lives}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
