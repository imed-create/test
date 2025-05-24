'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';
import { newProjectsData, Project } from '@/data/new-projects'; // Updated import
import Image from 'next/image'; // For Next.js optimized images
import * as Dialog from '@radix-ui/react-dialog'; // Radix UI Dialog
import { Cross2Icon } from '@radix-ui/react-icons'; // For close button

gsap.registerPlugin(ScrollTrigger);

export const Works = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null); // This is the horizontally scrolling container
  const textContainerRef = useRef<HTMLDivElement>(null); // Keep if used by existing animations
  const gridCanvasRef = useRef<HTMLCanvasElement>(null); // Keep
  const lettersCanvasRef = useRef<HTMLCanvasElement>(null); // Keep

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Lenis setup (from original)
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const updateTicker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Grid canvas setup (from original - keep for now)
    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas?.getContext('2d');
    const resizeGridCanvas = () => {
      if (!gridCanvas || !gridCtx) return;
      const dpr = window.devicePixelRatio || 1;
      gridCanvas.width = window.innerWidth * dpr;
      gridCanvas.height = window.innerHeight * dpr;
      gridCanvas.style.width = `${window.innerWidth}px`;
      gridCanvas.style.height = `${window.innerHeight}px`;
      gridCtx.scale(dpr, dpr);
    };
    if (gridCanvas && gridCtx) resizeGridCanvas();

    const drawGrid = (scrollProgress = 0) => {
      if (!gridCtx || !gridCanvas) return;
      gridCtx.fillStyle = 'black';
      gridCtx.fillRect(0, 0, gridCanvas.width / (window.devicePixelRatio || 1), gridCanvas.height / (window.devicePixelRatio || 1)); // Adjusted for dpr
      gridCtx.fillStyle = '#00ff9d'; // Electric blue
      const [dotSize, spacing] = [1, 30];
      const rows = Math.ceil(gridCanvas.height / (window.devicePixelRatio || 1) / spacing);
      const cols = Math.ceil(gridCanvas.width / (window.devicePixelRatio || 1) / spacing) + 15;
      const offset = (scrollProgress * window.innerWidth * 5) % spacing;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridCtx.beginPath();
          gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
          gridCtx.fill();
        }
      }
    };
    if (gridCanvas && gridCtx) drawGrid(0);
    
    // Three.js setup for floating letters (from original - keep for now)
    let lettersRenderer: THREE.WebGLRenderer | null = null;
    let lettersScene: THREE.Scene | null = null;
    let lettersCamera: THREE.PerspectiveCamera | null = null;
    let letterAnimationPaths: any[] = []; // Store paths for cleanup or updates
    let letterElementsMap = new Map();


    if (lettersCanvasRef.current && textContainerRef.current) {
        lettersScene = new THREE.Scene();
        lettersCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        lettersCamera.position.z = 20;

        lettersRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: lettersCanvasRef.current });
        lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        lettersRenderer.setPixelRatio(window.devicePixelRatio);
        lettersRenderer.setClearColor(0x000000, 0);

        const createTextAnimationPath = (yPos: number, amplitude: number) => {
            const points = [];
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                points.push(new THREE.Vector3(-25 + 50 * t, yPos + Math.sin(t * Math.PI) * -amplitude, (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5));
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)), new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1, visible: false }));
            (line as any).curve = curve; // Attach curve for later use
            return line;
        };
        letterAnimationPaths = [createTextAnimationPath(10, 2), createTextAnimationPath(3.5, 1), createTextAnimationPath(-3.5, -1), createTextAnimationPath(-10, -2)];
        letterAnimationPaths.forEach(line => lettersScene?.add(line));
        
        const textContainer = textContainerRef.current;
        letterAnimationPaths.forEach((line, i) => {
            (line as any).letterElements = Array.from({ length: 15 }, () => {
              const el = document.createElement('div');
              el.className = 'letter hidden md:block absolute text-6xl font-bold text-electric-blue opacity-50'; // Added styling
              el.textContent = ['W', 'O', 'R', 'K'][i];
              textContainer.appendChild(el);
              letterElementsMap.set(el, { current: { x: 0, y: 0 }, target: { x: 0, y: 0 }});
              return el;
            });
        });
    }
    
    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
    const updateTargetPositions = (scrollProgress = 0) => {
        if (!lettersCamera) return;
        letterAnimationPaths.forEach((line, lineIndex) => {
            (line as any).letterElements?.forEach((element: HTMLElement, i: number) => {
                const point = (line as any).curve.getPoint((i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1);
                const vector = point.clone().project(lettersCamera!);
                const positions = letterElementsMap.get(element);
                if (positions) {
                    positions.target = { x: (-vector.x * 0.5 + 0.5) * window.innerWidth, y: (-vector.y * 0.5 + 0.5) * window.innerHeight };
                }
            });
        });
    };
    if (lettersCamera) updateTargetPositions(0);

    const updateLetterPositions = () => {
        letterElementsMap.forEach((positions, element) => {
            const distX = positions.target.x - positions.current.x;
            if (Math.abs(distX) > window.innerWidth * 0.7) { // Jump if too far (e.g. resize)
                positions.current.x = positions.target.x;
                positions.current.y = positions.target.y;
            } else { // Lerp
                positions.current.x = lerp(positions.current.x, positions.target.x, 0.07);
                positions.current.y = lerp(positions.current.y, positions.target.y, 0.07);
            }
            element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0)`;
        });
    };
    
    // Horizontal scroll for cardsRef
    // let currentCardsX = 0; // Not needed if GSAP directly sets transform
    const scrollUpdate = (self: ScrollTrigger) => {
        if (gridCanvas && gridCtx) drawGrid(self.progress);
        if (lettersCamera) updateTargetPositions(self.progress);

        if (cardsRef.current) {
            const targetX = -self.progress * (cardsRef.current.scrollWidth - window.innerWidth);
            // currentCardsX = lerp(currentCardsX, targetX, 0.1); // Original lerp for reference, GSAP handles it now
            gsap.set(cardsRef.current, { x: targetX }); // Direct set, GSAP's scrub provides smoothing
        }
    };

    if (cardsRef.current) {
        // Ensure cardsRef has a large enough width to enable scrolling
        const numCards = newProjectsData.length;
        // Example: each card is ~30vw wide, plus 5vw margin = 35vw
        const totalWidthVw = numCards * 35;
        cardsRef.current.style.width = `${totalWidthVw}vw`;
        
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${cardsRef.current!.scrollWidth - window.innerWidth}`,
            pin: true,
            pinSpacing: true, // Keeps space for pinned element
            scrub: 1.5, // Higher scrub for smoother effect with lerp
            onUpdate: scrollUpdate,
        });
    }
    
    const animate = () => {
        updateLetterPositions(); // Lerp letter positions
        // The card scrolling is now primarily driven by GSAP's scrub and onUpdate's lerp
        if (lettersRenderer && lettersScene && lettersCamera) {
            lettersRenderer.render(lettersScene, lettersCamera);
        }
        requestAnimationFrame(animate);
    };
    animate();


    const handleResize = () => {
        if (gridCanvas && gridCtx) {
            resizeGridCanvas();
            drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
        }
        if (lettersRenderer && lettersCamera) {
            lettersRenderer.setSize(window.innerWidth, window.innerHeight);
            lettersCamera.aspect = window.innerWidth / window.innerHeight;
            lettersCamera.updateProjectionMatrix();
            updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
        }
        ScrollTrigger.refresh(); // Refresh ScrollTrigger on resize
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // Cleanup Three.js and DOM elements for letters
      if (lettersRenderer) lettersRenderer.dispose();
      if (textContainerRef.current) textContainerRef.current.innerHTML = ''; // Clear letters
      letterElementsMap.clear();
    };
  }, []);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="works" // Added id for navigation
      className="relative min-h-screen bg-black overflow-hidden" // Ensure overflow-hidden is on the main section
    >
      {/* Existing canvas elements for background effects */}
      <canvas ref={gridCanvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <canvas ref={lettersCanvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
      <div ref={textContainerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 perspective-[2500px]" />

      {/* Section Title */}
      <h2 className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 text-4xl md:text-5xl font-bold font-montserrat text-white electric-text z-20">
        Featured Projects
      </h2>
      
      {/* Horizontally Scrolling Cards Container */}
      <div
        ref={cardsRef}
        className="relative h-screen flex items-center z-10" // Ensure cards are above background canvas but below UI like modal.
        // Width set dynamically in useEffect. Add some padding if needed at start/end.
        style={{ paddingLeft: '10vw', paddingRight: '10vw' }} 
      >
        {newProjectsData.map((project) => (
          <div // Changed from motion.div for simplicity with GSAP scroll
            key={project.id}
            className="group relative w-[65vw] md:w-[45vw] lg:w-[35vw] h-[55vh] md:h-[60vh] mx-[5vw] flex-shrink-0
                       bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden 
                       transition-transform duration-300 ease-out hover:scale-105 border-2 border-gray-700/80 hover:border-electric-blue cursor-pointer"
            onClick={() => handleCardClick(project)}
          >
            <div className="relative w-full h-3/5 overflow-hidden">
              <Image
                src={project.image || "/images/projects/placeholder.jpg"} // Placeholder if image missing
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            </div>
            <div className="p-4 md:p-6 flex flex-col justify-between h-2/5">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-montserrat text-electric-blue mb-2 truncate group-hover:text-gold transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-silver font-inter line-clamp-2 md:line-clamp-3">
                  {project.description}
                </p>
              </div>
              <button
                className="mt-3 self-start px-4 py-2 text-xs md:text-sm font-semibold text-black bg-electric-blue rounded-lg hover:bg-gold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label={`View details for ${project.title}`}
              >
                View Details
              </button>
            </div>
            {/* Placeholder for electricity sparks - simple CSS animated border elements */}
            <div className="absolute -inset-px rounded-2xl border-2 border-transparent group-hover:border-gold opacity-0 group-hover:opacity-70 transition-all duration-300 animate-pulse-electric pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Radix UI Dialog for Project Details */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       w-[90vw] max-w-2xl max-h-[85vh] p-6 md:p-8 bg-gray-900 
                       border border-electric-blue/70 rounded-xl shadow-2xl z-50 
                       overflow-y-auto focus:outline-none data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut"
            // Basic glow effect for modal
            style={{boxShadow: "0 0 30px 8px rgba(0, 255, 157, 0.25), 0 0 15px 4px rgba(0, 191, 255, 0.2)"}} 
          >
            {selectedProject && (
              <>
                <Dialog.Title className="text-2xl md:text-3xl font-bold font-montserrat text-electric-blue mb-1">
                  {selectedProject.title}
                </Dialog.Title>
                {selectedProject.url && (
                    <a href={`http://${selectedProject.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline font-inter mb-4 block">
                        {selectedProject.url}
                    </a>
                )}
                <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden my-4 shadow-md">
                  <Image
                    src={selectedProject.image || "/images/projects/placeholder.jpg"}
                    alt={selectedProject.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <Dialog.Description className="text-sm md:text-base text-silver font-inter mb-5 whitespace-pre-wrap leading-relaxed">
                  {selectedProject.details}
                </Dialog.Description>
                {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-md font-semibold font-montserrat text-gold mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map(tech => (
                        <span key={tech} className="px-3 py-1 text-xs bg-gray-800 text-silver rounded-full shadow">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Dialog.Close asChild>
                  <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-electric-blue transition-colors duration-150" 
                    aria-label="Close"
                  >
                    <Cross2Icon width={22} height={22} />
                  </button>
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* Minimal CSS for Radix animations (should be in globals.css) */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes scaleOut { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } }

        .data-\[state=open\] .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .data-\[state=closed\] .animate-fadeIn { animation: fadeOut 0.3s ease-in forwards; } /* Ensure fadeOut is applied */
        .data-\[state=open\] .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .data-\[state=closed\] .animate-scaleIn { animation: scaleOut 0.3s ease-in forwards; } /* Ensure scaleOut is applied */
        
        @keyframes pulseElectricAnim {
          0%, 100% { border-color: rgba(255, 215, 0, 0.7); box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
          50% { border-color: rgba(255, 215, 0, 1); box-shadow: 0 0 15px rgba(255, 215, 0, 0.7); }
        }
        .animate-pulse-electric {
            animation: pulseElectricAnim 1.5s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}; 