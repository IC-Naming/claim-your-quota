import { useEffect, useRef } from 'react';
import * as dat from 'dat.gui';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const guiRef = useRef(new dat.GUI());
  const linesRef = useRef([]);
  const starsRef = useRef([]);
  const tickRef = useRef(0);
  const firstRef = useRef(true);

  useEffect(() => {
    const c = canvasRef.current;
    
    const w = c.width = window.innerWidth;
    const h = c.height = window.innerHeight;
    const ctx = c.getContext('2d');

    const opts = {
      lineCount: 1,
      starCount: 2,
      radVel: 0,
      lineBaseVel: 0.1,
      lineAddedVel: 0.1,
      lineBaseLife: 0.4,
      lineAddedLife: 0.01,
      starBaseLife: 10,
      starAddedLife: 10,
      ellipseTilt: -0.3,
      ellipseBaseRadius: 0.15,
      ellipseAddedRadius: 0.02,
      ellipseAxisMultiplierX: 2,
      ellipseAxisMultiplierY: 1,
      ellipseCX: w / 2,
      ellipseCY: h / 2,
      repaintAlpha: 0.005,
    };

    const init = () => {
      linesRef.current.length = starsRef.current.length = 0;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.01)';
      ctx.fillRect(0, 0, w, h);

      if (firstRef.current) {
        const f = guiRef.current.addFolder('logics');
        f.add(opts, 'lineCount', 1, 300);
        f.add(opts, 'starCount', 1, 300);
        f.add(opts, 'radVel', 0, 1);
        f.add(opts, 'lineBaseVel', 0.01, 1);
        f.add(opts, 'lineAddedVel', 0, 1);
        f.add(opts, 'lineBaseLife', 0, 1);
        f.add(opts, 'lineAddedLife', 0, 1);
        f.add(opts, 'starBaseLife', 0, 100);
        f.add(opts, 'starAddedLife', 0, 100);
        const fGraphics = guiRef.current.addFolder('graphics');
        fGraphics.add(opts, 'ellipseTilt', -Math.PI, Math.PI).step(0.1);
        fGraphics.add(opts, 'ellipseBaseRadius', 0, 0.5);
        fGraphics.add(opts, 'ellipseAddedRadius', 0, 0.5);
        fGraphics.add(opts, 'ellipseAxisMultiplierX', 0, 3);
        fGraphics.add(opts, 'ellipseAxisMultiplierY', 0, 3);
        fGraphics.add(opts, 'ellipseCX', 0, w);
        fGraphics.add(opts, 'ellipseCY', 0, h);
        fGraphics.add(opts, 'repaintAlpha', 0, 1);

        loop();
        firstRef.current = false;
      }
    };

    const loop = () => {
      window.requestAnimationFrame(loop);
      step();
      draw();
    };

    const step = () => {
      tickRef.current += 0.5;

      if (linesRef.current.length < opts.lineCount && Math.random() < 0.5) {
        linesRef.current.push(new Line());
      }

      if (starsRef.current.length < opts.starCount) {
        starsRef.current.push(new Star());
      } else {
        starsRef.current.shift();
      }

      linesRef.current.forEach((line) => line.step());
      starsRef.current.forEach((star) => star.step());
    };

    const draw = () => {
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      ctx.translate(opts.ellipseCX, opts.ellipseCY);
      ctx.rotate(opts.ellipseTilt);
      ctx.scale(opts.ellipseAxisMultiplierX, opts.ellipseAxisMultiplierY);

      linesRef.current.forEach((line) => line.draw());

      ctx.scale(1 / opts.ellipseAxisMultiplierX, 1 / opts.ellipseAxisMultiplierY);
      ctx.rotate(-opts.ellipseTilt);
      ctx.translate(-opts.ellipseCX, -opts.ellipseCY);

      starsRef.current.forEach((star) => star.draw());
    };

    function Line() {
      this.reset();
    }

    Line.prototype.reset = function () {
      this.rad = Math.random() * Math.PI * 2;
      this.len = w * (opts.ellipseBaseRadius + Math.random() * opts.ellipseAddedRadius);
      this.lenVel = opts.lineBaseVel + Math.random() * opts.lineAddedVel;

      this.x = this.px = Math.cos(this.rad) * this.len;
      this.y = this.py = Math.sin(this.rad) * this.len;

      this.life = this.originalLife = w * (opts.lineBaseLife + Math.random() * opts.lineAddedLife);

      this.alpha = 0.2 + Math.random() * 0.8;
    };

    Line.prototype.step = function () {
      --this.life;
    
      var ratio = 1 - 0.1 * this.life / this.originalLife;
    
      this.px = this.x;
      this.py = this.y;
    
      this.rad += opts.radVel;
      this.len -= this.lenVel;
    
      this.x = Math.cos(this.rad) * this.len;
      this.y = Math.sin(this.rad) * this.len;
    
      if (this.life <= 0) {
        this.reset();
      }
    };

    Line.prototype.draw = function () {
      var ratio = Math.abs(this.life / this.originalLife - 1 / 2);

      ctx.lineWidth = ratio * 5;
      ctx.strokeStyle = ctx.shadowColor = `hsla(${tickRef.current + (this.x / (w * (opts.ellipseBaseRadius + opts.ellipseAddedRadius))) * 100}, 80%, ${75 - ratio * 150}%, ${this.alpha})`;
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.lineTo(this.x, this.y);

      ctx.stroke();
    };

    function Star() {
      this.reset();
    }

    Star.prototype.reset = function () {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.life = opts.starBaseLife + Math.random() * opts.starAddedLife;
    };

    Star.prototype.step = function () {
      --this.life;

      if (this.life <= 0) this.reset();
    };

    Star.prototype.draw = function () {
      ctx.fillStyle = ctx.shadowColor = `hsla(${tickRef.current + (this.x / w) * 100}, 80%, 50%, .2)`;
      ctx.shadowBlur = this.life;
      ctx.fillRect(this.x, this.y, 1, 1);
    };

    window.addEventListener('resize', function () {
      let w = c.width = window.innerWidth;
      let h = c.height = window.innerHeight;

      opts.ellipseCX = w / 2;
      opts.ellipseCY = h / 2;

      init();
    });
    
    init();

  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default CanvasComponent;
