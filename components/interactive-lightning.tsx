"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"

const InteractiveLightning: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const effectsGroupRef = useRef<THREE.Group | null>(null) // Group to hold temporary effects

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    effectsGroupRef.current = new THREE.Group()
    scene.add(effectsGroupRef.current)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 50 // Position camera further back to view effects in screen space easily
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Transparent background
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    // Placeholder for lightning sprite material
    const createSparkMaterial = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      if (!context) return null;

      context.beginPath();
      context.arc(32, 32, 30, 0, Math.PI * 2);
      context.fillStyle = 'rgba(220, 220, 255, 0.8)'; // Light electric blue/white
      context.fill();
      context.shadowColor = 'rgba(150, 180, 255, 1)';
      context.shadowBlur = 20;
      
      const texture = new THREE.CanvasTexture(canvas);
      return new THREE.SpriteMaterial({ map: texture, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8 });
    }
    const sparkMaterial = createSparkMaterial();


    const handlePointerDown = (event: PointerEvent) => {
      if (!sceneRef.current || !cameraRef.current || !effectsGroupRef.current || !sparkMaterial) return

      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1

      const vector = new THREE.Vector3(x, y, 0.5) // z=0.5 is between near and far plane
      vector.unproject(cameraRef.current) // Convert screen coordinates to world space

      const dir = vector.sub(cameraRef.current.position).normalize()
      const distance = -cameraRef.current.position.z / dir.z // Distance to plane z=0
      const pos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance))

      const numSparks = 5 + Math.floor(Math.random() * 5); // 5 to 9 sparks
      for (let i = 0; i < numSparks; i++) {
        const spark = new THREE.Sprite(sparkMaterial.clone()); // Clone material for individual opacity/scale later if needed
        
        const spread = 1.5;
        spark.position.set(
          pos.x + (Math.random() - 0.5) * spread,
          pos.y + (Math.random() - 0.5) * spread,
          pos.z // Keep them somewhat flat initially
        );
        
        const initialScale = Math.random() * 1.5 + 0.5; // Random initial scale
        spark.scale.set(initialScale, initialScale, initialScale);
        
        effectsGroupRef.current.add(spark);

        // Animate spark (scale up then fade out)
        const duration = Math.random() * 0.4 + 0.3; // 0.3 to 0.7 seconds
        new THREE.Tween(spark.scale)
          .to({ x: initialScale * (1.5 + Math.random()), y: initialScale * (1.5 + Math.random()) }, duration * 1000 * 0.4) // Scale up quickly
          .easing(THREE.Easing.Quadratic.Out)
          .chain(
            new THREE.Tween(spark.scale)
              .to({ x: 0.01, y: 0.01 }, duration * 1000 * 0.6) // Scale down to almost nothing
              .easing(THREE.Easing.Quadratic.In)
          )
          .start();
        
        new THREE.Tween(spark.material)
          .to({ opacity: 0 }, duration * 1000)
          .easing(THREE.Easing.Exponential.Out)
          .onComplete(() => {
            effectsGroupRef.current?.remove(spark)
            spark.material.dispose(); // Dispose material when done
            // spark.geometry.dispose(); // Sprite geometry is shared, no need to dispose unless custom
          })
          .start();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)

    // Animation loop for TWEEN
    const animate = (time: number) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // TWEEN.update needs to be called in the animation loop
      // Assuming TWEEN is globally available or imported if you use it as a module
      // For this example, I'll use Three.js's own TWEEN if it's bundled, or you might need to import it.
      // For simplicity, if TWEEN is not set up, the .start() won't run.
      // Let's assume THREE.TWEEN is available for this example.
      (THREE.TWEEN as any)?.update(time);


      rendererRef.current.render(sceneRef.current, cameraRef.current)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate); // Start the loop

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("resize", handleResize)
      rendererRef.current?.dispose()
      sceneRef.current?.traverse(object => {
        if (object instanceof THREE.Sprite) {
            object.material.dispose();
        }
      })
      effectsGroupRef.current?.clear(); // Clear children from group
      sceneRef.current?.clear(); // Clear scene
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-[5] pointer-events-auto" // Low z-index, but allow pointer events
      // Ensure it's below main content but above thunderstorm if that's also very low z
    />
  )
}

export default InteractiveLightning;
