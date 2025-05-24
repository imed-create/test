"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

export const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // HTML elements refs from original
  const titleRef = useRef<HTMLHeadingElement>(null) // This will be replaced by 3D text
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const sceneRef = useRef<THREE.Scene>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const textMeshRef = useRef<THREE.Mesh>()
  const galaxyParticlesRef = useRef<THREE.Points>()
  const lightningBoltsRef = useRef<THREE.Line[]>([])
  const animationFrameIdRef = useRef<number | null>(null)

  const [isFontLoaded, setIsFontLoaded] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return

    // Initialize Three.js Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 15 // Adjusted for text visibility
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    // Basic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0x88ddff, 0.7, 100) // Electric blueish light
    pointLight.position.set(0, 2, 10)
    scene.add(pointLight)

    // 1. Galaxy Background Placeholder (Particle System)
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCnt = 10000
    const posArray = new Float32Array(particlesCnt * 3)
    for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100 // Spread them out
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xaaaaaa, // Dim white/gray stars
      transparent: true,
      opacity: 0.7,
    })
    const galaxy = new THREE.Points(particlesGeometry, particlesMaterial)
    galaxyParticlesRef.current = galaxy
    scene.add(galaxy)

    // 2. 3D Text "Imed Khedimellah"
    const fontLoader = new FontLoader()
    // IMPORTANT: Replace with actual path to a font file (e.g., Helvetiker, Gentilis, or custom)
    // For now, using a generic path. This will likely fail if the font isn't there.
    // A robust solution would involve ensuring the font is in public/ and accessible.
    const fontPath = "/fonts/helvetiker_regular.typeface.json" // Example path

    fontLoader.load(
      fontPath,
      (font) => {
        const textGeo = new TextGeometry("Imed Khedimellah", {
          font: font,
          size: 2.5, // Adjust size
          height: 0.3, // Depth
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        })
        textGeo.center() // Center the text geometry

        // Glowing effect placeholder: emissive material
        const textMaterial = new THREE.MeshStandardMaterial({
          color: 0x00aaff, // Electric blue base
          emissive: 0x00ffff, // Teal glow
          emissiveIntensity: 0.6,
          metalness: 0.7,
          roughness: 0.4,
        })
        const textMesh = new THREE.Mesh(textGeo, textMaterial)
        textMeshRef.current = textMesh
        scene.add(textMesh)
        setIsFontLoaded(true) // Trigger GSAP animations for text

        // Subtle float animation for 3D text
        gsap.to(textMesh.rotation, { y: textMesh.rotation.y + 0.01, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(textMesh.position, { y: textMesh.position.y + 0.2, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });

      },
      undefined, // onProgress callback
      (error) => {
        console.error("Font loading failed:", error)
        // Fallback: Create a simple box as placeholder if font fails
        const fallbackGeo = new THREE.BoxGeometry(10, 2, 1)
        const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00ffff, emissiveIntensity: 0.6 })
        const fallbackText = new THREE.Mesh(fallbackGeo, fallbackMat)
        textMeshRef.current = fallbackText
        scene.add(fallbackText)
        setIsFontLoaded(true); // Allow animations to proceed with fallback
      }
    )

    // 3. Lightning Bolts Placeholder
    const createLightningBolt = () => {
      const material = new THREE.LineBasicMaterial({
        color: 0xffff00, // Gold
        linewidth: 2, // Note: linewidth > 1 might not work on all platforms/drivers
        transparent: true,
        opacity: 0, // Start invisible
      });
      const points = [];
      let x = (Math.random() - 0.5) * 20;
      let y = (Math.random() - 0.5) * 10;
      let z = (Math.random() - 0.5) * 5 - 5; // Behind text
      points.push(new THREE.Vector3(x, y, z));
      for (let i = 0; i < 5; i++) {
        x += (Math.random() - 0.5) * 5;
        y += (Math.random() - 0.5) * 3;
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const bolt = new THREE.Line(geometry, material);
      scene.add(bolt);
      lightningBoltsRef.current.push(bolt);
      return bolt;
    };

    const animateLightningBolt = (bolt: THREE.Line) => {
      gsap.timeline()
        .to(bolt.material, { opacity: 1, duration: 0.05 })
        .to(bolt.material, { opacity: 0, duration: 0.1, delay: Math.random() * 0.1 + 0.05 })
        .call(() => { // Re-position and re-animate after a delay
            setTimeout(() => {
                if (bolt.geometry) { // Check if still exists
                    // New points
                    const points = [];
                    let x = (Math.random() - 0.5) * 20;
                    let y = (Math.random() - 0.5) * 10;
                    let z = (Math.random() - 0.5) * 5 - 5;
                    points.push(new THREE.Vector3(x, y, z));
                    for (let i = 0; i < 5; i++) {
                        x += (Math.random() - 0.5) * 5;
                        y += (Math.random() - 0.5) * 3;
                        points.push(new THREE.Vector3(x, y, z));
                    }
                    bolt.geometry.setFromPoints(points);
                    bolt.geometry.attributes.position.needsUpdate = true;
                    animateLightningBolt(bolt);
                }
            }, Math.random() * 3000 + 1000);
        });
    };

    for (let i = 0; i < 3; i++) { // Create 3 lightning bolts
        const bolt = createLightningBolt();
        setTimeout(() => animateLightningBolt(bolt), Math.random() * 1000); // Stagger initial appearance
    }


    // Animation Loop
    const clock = new THREE.Clock()
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return
      
      const elapsedTime = clock.getElapsedTime()
      if (galaxyParticlesRef.current) {
        galaxyParticlesRef.current.rotation.y = elapsedTime * 0.02 // Slow rotation
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current)
      animationFrameIdRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Handle Resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current)
      window.removeEventListener("resize", handleResize)
      gsap.killTweensOf("*") // Kill all GSAP tweens

      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      lightningBoltsRef.current.forEach(bolt => {
        if (bolt.geometry) bolt.geometry.dispose();
        if (bolt.material) (bolt.material as THREE.Material).dispose(); // Type assertion
      });
      lightningBoltsRef.current = [];

      renderer.dispose()
    }
  }, [])


  // GSAP Animations for HTML elements (triggered after font loading for 3D text)
  useEffect(() => {
    if (!isFontLoaded || !subtitleRef.current || !scrollCueRef.current) return

    const subtitleChars = subtitleRef.current.innerText.split("")
    subtitleRef.current.innerHTML = subtitleChars.map(char => `<span>${char === " " ? "&nbsp;" : char}</span>`).join("")
    const subtitleSpans = subtitleRef.current.querySelectorAll("span")

    const tl = gsap.timeline({ delay: 0.5 }); // Delay slightly after 3D text might appear

    // Subtitle animation: letter by letter fade-in with "electric arc" (color flash)
    tl.fromTo(
      subtitleSpans,
      { opacity: 0, y: 20, scale: 0.8, color: "#00ffff" }, // Start with teal color
      {
        opacity: 1,
        y: 0,
        scale: 1,
        color: "#cccccc", // End with silver-gray
        duration: 0.1,
        stagger: 0.05,
        ease: "power2.out",
        onStart: function() { // "this" refers to the target span
          gsap.to(this.targets()[0], { // Flash to white briefly
            color: "#ffffff", 
            duration: 0.05, 
            yoyo: true, 
            repeat: 1,
            ease: "power1.inOut"
          });
        }
      }
    );

    // Scroll cue animation (pulsing aura)
    gsap.to(scrollCueRef.current, {
      scale: 1.2,
      opacity: 0.7,
      boxShadow: "0 0 15px 5px rgba(0, 255, 255, 0.5)", // Teal glow
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1, // Start after subtitle animation
    })

    // Original parallax effect for the section (if still desired)
    gsap.to(sectionRef.current, {
        yPercent: -20, // Reduced parallax
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
    });

  }, [isFontLoaded]) // Re-run when font is loaded

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" // Use flex-col for layout
      style={{ background: 'transparent' }} // Background handled by Three.js
      variants={heroVariants}
      initial="hidden"
      animate="visible" // Animate on mount (after preloader)
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      
      {/* This h1 is now effectively a placeholder for the 3D text position, can be removed or hidden */}
      <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold mb-6 electric-text sr-only">
        Imed Khedimellah
      </h1>

      <div className="relative z-10 text-center mt-[10vh]"> {/* Adjust margin-top to position HTML content relative to 3D text */}
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-silver mb-12 font-inter" // Ensure Inter font
          style={{ opacity: 0 }} // Start hidden, GSAP will animate
        >
          Aeronautical Engineer turned Web Developer
        </p>
      </div>
      
      <div
        ref={scrollCueRef}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10" // Ensure scroll cue is on top
      >
        <div 
            className="w-8 h-12 border-2 border-white rounded-full flex justify-center items-center"
            style={{boxShadow: "0 0 0px 0px rgba(0, 255, 255, 0.0)"}} // Initial for GSAP
        >
          <div className="w-1 h-3 bg-white rounded-full mt-1 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
