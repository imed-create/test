'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';
import { projects } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

export const Works = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const lettersCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Grid canvas setup
    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas?.getContext('2d');
    if (!gridCanvas || !gridCtx) return;

    const resizeGridCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      if (gridCanvas) {
        gridCanvas.width = window.innerWidth * devicePixelRatio;
        gridCanvas.height = window.innerHeight * devicePixelRatio;
        gridCanvas.style.width = `${window.innerWidth}px`;
        gridCanvas.style.height = `${window.innerHeight}px`;
        gridCtx.scale(devicePixelRatio, devicePixelRatio);
      }
    };

    resizeGridCanvas();

    const drawGrid = (scrollProgress = 0) => {
      if (!gridCtx || !gridCanvas) return;
      gridCtx.fillStyle = 'black';
      gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
      
      gridCtx.fillStyle = '#00ff9d';
      const [dotSize, spacing] = [1, 30];
      const [rows, cols] = [
        Math.ceil(gridCanvas.height / spacing),
        Math.ceil(gridCanvas.width / spacing) + 15
      ];

      const offset = (scrollProgress * window.innerWidth * 5) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dotX = x * spacing + -offset;
          const dotY = y * spacing;

          gridCtx.beginPath();
          gridCtx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          gridCtx.fill();
        }
      }
    };

    // Three.js setup for floating letters
    const lettersScene = new THREE.Scene();
    const lettersCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    lettersCamera.position.z = 20;

    const lettersRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    if (lettersCanvasRef.current) {
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);
      lettersRenderer.setPixelRatio(window.devicePixelRatio);
      lettersRenderer.setClearColor(0x000000, 0);
      lettersCanvasRef.current.appendChild(lettersRenderer.domElement);
    }

    // Create text animation paths
    const createTextAnimationPath = (yPos: number, amplitude: number) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1 })
      );
      line.curve = curve;
      return line;
    };

    const path = [
      createTextAnimationPath(10, 2),
      createTextAnimationPath(3.5, 1),
      createTextAnimationPath(-3.5, -1),
      createTextAnimationPath(-10, -2)
    ];
    path.forEach((line) => lettersScene.add(line));

    // Add floating letters
    const letterPositions = new Map();
    const textContainer = textContainerRef.current;
    if (textContainer) {
      path.forEach((line, i) => {
        line.letterElements = Array.from({ length: 15 }, () => {
          const el = document.createElement('div');
          el.className = 'letter';
          el.textContent = ['W', 'O', 'R', 'K'][i];
          textContainer.appendChild(el);
          letterPositions.set(el, {
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 }
          });
          return el;
        });
      });
    }

    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const updateTargetPositions = (scrollProgress = 0) => {
      path.forEach((line, lineIndex) => {
        line.letterElements?.forEach((element, i) => {
          const point = line.curve.getPoint(
            (i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
          );
          const vector = point.clone().project(lettersCamera);
          const positions = letterPositions.get(element);
          if (positions) {
            positions.target = {
              x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (-vector.y * 0.5 + 0.5) * window.innerHeight
            };
          }
        });
      });
    };

    const updateLetterPositions = () => {
      letterPositions.forEach((positions, element) => {
        const distX = positions.target.x - positions.current.x;
        if (Math.abs(distX) > window.innerWidth * 0.7) {
          positions.current.x = positions.target.x;
          positions.current.y = positions.target.y;
        } else {
          positions.current.x = lerp(positions.current.x, positions.target.x, 0.07);
          positions.current.y = lerp(positions.current.y, positions.target.y, 0.07);
        }

        element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0)`;
      });
    };

    // Cards animation
    let currentXPosition = 0;
    const moveDistance = window.innerWidth * 5;

    const updateCardsPosition = () => {
      const targetX = -moveDistance * (ScrollTrigger.getAll()[0]?.progress || 0);
      currentXPosition = lerp(currentXPosition, targetX, 0.07);
      if (cardsRef.current) {
        gsap.set(cardsRef.current, { x: currentXPosition });
      }
    };

    // Main animation loop
    const animate = () => {
      updateLetterPositions();
      updateCardsPosition();
      lettersRenderer.render(lettersScene, lettersCamera);
      requestAnimationFrame(animate);
    };

    // ScrollTrigger setup
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=700%',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        updateTargetPositions(self.progress);
        drawGrid(self.progress);
      }
    });

    drawGrid(0);
    animate();
    updateTargetPositions(0);

    // Handle resize
    const handleResize = () => {
      resizeGridCanvas();
      drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);
      lettersCamera.aspect = window.innerWidth / window.innerHeight;
      lettersCamera.updateProjectionMatrix();
      updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      <canvas
        ref={gridCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <canvas
        ref={lettersCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div
        ref={textContainerRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none perspective-[2500px]"
      />
      
      <div
        ref={cardsRef}
        className="relative w-[500vw] h-screen flex justify-around items-center"
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="w-[10%] h-1/2 p-2 bg-black flex flex-col gap-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex-1 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-3 flex justify-between items-center px-1 uppercase font-mono text-xs text-electric-blue">
              <p>{project.title}</p>
              <p>{project.id}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}; 