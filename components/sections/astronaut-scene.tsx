"use client"

import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

gsap.registerPlugin(ScrollTrigger)

export const AstronautScene: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const sceneRef = useRef<THREE.Scene>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const animationFrameIdRef = useRef<number | null>(null)

  // 3D Object refs
  const astronautRef = useRef<THREE.Group>() // Group for astronaut parts
  const starsRef = useRef<THREE.Points>()
  const spaceDustRef = useRef<THREE.Points>()
  const planetsRef = useRef<THREE.Mesh[]>([])
  const textMesh1Ref = useRef<THREE.Mesh>()
  const textMesh2Ref = useRef<THREE.Mesh>()

  const [isFontLoaded, setIsFontLoaded] = useState(false)
  const fontPath = "/fonts/helvetiker_regular.typeface.json" // Consistent font path

  // Define isMobile in the component's scope to be accessible by the return statement
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Determine viewport size on client side
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile); // Update on resize

    if (!canvasRef.current || !sectionRef.current) return;

    // Initialize Three.js Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.z = 10 // Initial camera position
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0) // Transparent background initially
    rendererRef.current = renderer
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8) // Soft ambient light
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
    const pointLight = new THREE.PointLight(0x00aaff, 0.7, 150) // Electric blueish for accents
    pointLight.position.set(-10, 0, -20) // Coming from deep space
    scene.add(pointLight)


    // Background: Deep space color (will be mostly covered by stars/dust)
    scene.background = new THREE.Color(0x03001C) // Very dark blue/purple

    // Stars - Responsive Count
    // const isMobile = window.innerWidth < 768; // This will be replaced by isMobileView state
    const starCount = isMobileView ? 5000 : 15000;
    const starVertices = []
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * (isMobileView ? 1000 : 2000) // Adjust spread for mobile
      const y = (Math.random() - 0.5) * (isMobileView ? 1000 : 2000)
      const z = (Math.random() - 0.5) * (isMobileView ? 1000 : 2000)
      starVertices.push(x, y, z)
    }
    const starsGeometry = new THREE.BufferGeometry()
    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.8,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    starsRef.current = stars
    scene.add(stars)

    // Space Dust - Responsive Count
    const dustCount = isMobileView ? 1000 : 5000;
    const dustVertices = []
    for (let i = 0; i < dustCount; i++) {
      const x = (Math.random() - 0.5) * (isMobileView ? 50 : 100) // Adjust spread for mobile
      const y = (Math.random() - 0.5) * (isMobileView ? 50 : 100)
      const z = (Math.random() - 0.5) * (isMobileView ? 50 : 100)
      dustVertices.push(x, y, z)
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustVertices, 3))
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.15,
      transparent: true,
      opacity: 0.3,
    })
    const spaceDust = new THREE.Points(dustGeometry, dustMaterial)
    spaceDustRef.current = spaceDust
    scene.add(spaceDust)

    // Astronaut Placeholder (Capsule-like: sphere for head, cylinder for body)
    const astronautGroup = new THREE.Group()
    const headRadius = 0.8
    const bodyHeight = 1.5
    const bodyRadius = 0.6

    const headGeo = new THREE.SphereGeometry(headRadius, 32, 16)
    const bodyGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32)
    const astronautMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd, // Light gray/white
      roughness: 0.6,
      metalness: 0.2,
    })
    const head = new THREE.Mesh(headGeo, astronautMaterial)
    head.position.y = bodyHeight / 2 + headRadius * 0.7 // Position head on top of body
    const body = new THREE.Mesh(bodyGeo, astronautMaterial)
    
    astronautGroup.add(head)
    astronautGroup.add(body)
    astronautGroup.position.set(0, 0, 0) // Initial position
    astronautRef.current = astronautGroup
    scene.add(astronautGroup)

    // Rotating Planets
    const planetColors = [0xff6347, 0x4682b4, 0x32cd32, 0xffd700] // Tomato, SteelBlue, LimeGreen, Gold
    for (let i = 0; i < 3; i++) {
      const planetGeo = new THREE.SphereGeometry(Math.random() * 3 + 2, 32, 16) // Random size
      const planetMat = new THREE.MeshStandardMaterial({ color: planetColors[i % planetColors.length] })
      const planet = new THREE.Mesh(planetGeo, planetMat)
      planet.position.set(
        (Math.random() - 0.5) * 80, // Spread them out
        (Math.random() - 0.5) * 30,
        -50 - Math.random() * 50 // Positioned in the distance
      )
      scene.add(planet)
      planetsRef.current.push(planet)
      // Initial rotation
      gsap.to(planet.rotation, {
        y: Math.PI * 2,
        x: Math.PI * 0.5,
        duration: 20 + Math.random() * 20, // Random rotation speed
        repeat: -1,
        ease: "none",
      })
    }

    // Font Loading for 3D Text
    const fontLoader = new FontLoader()
    fontLoader.load(fontPath, (font) => {
      const createTextMesh = (text: string, size = 1.5, depth = 0.2) => {
        const geo = new TextGeometry(text, {
          font: font, size: size, height: depth, curveSegments: 12,
          bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.01, bevelSegments: 3,
        })
        geo.center()
        const mat = new THREE.MeshStandardMaterial({
            color: 0x00ffff, // Cyan/Teal
            emissive: 0x00aaaa,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.5,
        })
        return new THREE.Mesh(geo, mat)
      }

      const text1 = createTextMesh("Pushed beyond skies...")
      text1.position.set(0, 3, -5) // Positioned above astronaut initially
      textMesh1Ref.current = text1
      scene.add(text1)

      const text2 = createTextMesh("...now building the web of tomorrow")
      text2.position.set(0, -1, -5) // Positioned below, initially further or invisible
      text2.material.opacity = 0
      text2.visible = false
      textMesh2Ref.current = text2
      scene.add(text2)
      
      setIsFontLoaded(true) // Enable ScrollTrigger animations that depend on text
    }, undefined, (error) => {
      console.error("AstronautScene: Font loading failed.", error)
      // Fallback text if font fails (e.g. simple planes)
      const fallbackMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
      const plane1 = new THREE.Mesh(new THREE.PlaneGeometry(10,1), fallbackMat);
      plane1.position.set(0,3,-5);
      scene.add(plane1);
      textMesh1Ref.current = plane1;

      const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(10,1), fallbackMat);
      plane2.position.set(0,-1,-5);
      plane2.visible = false;
      scene.add(plane2);
      textMesh2Ref.current = plane2;

      setIsFontLoaded(true);
    })

    // Animation Loop
    const clock = new THREE.Clock()
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return
      const elapsedTime = clock.getElapsedTime()
      
      // Subtle floating for astronaut if not controlled by ScrollTrigger primarily
      if (astronautRef.current && !ScrollTrigger.getTweensOf(astronautRef.current.position).length) {
         astronautRef.current.position.y += Math.sin(elapsedTime * 0.5) * 0.002;
         astronautRef.current.rotation.y += 0.001;
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
      ScrollTrigger.getAll().forEach(st => st.kill()) // Kill all ScrollTriggers
      gsap.killTweensOf("*")

      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      planetsRef.current = [];
      renderer.dispose()
    }
  }, [])

  // GSAP ScrollTrigger Animations (useEffect dependent on isFontLoaded)
  useEffect(() => {
    if (!isFontLoaded || !sectionRef.current || !cameraRef.current || !astronautRef.current || !starsRef.current || !spaceDustRef.current || !textMesh1Ref.current || !textMesh2Ref.current) {
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${window.innerHeight * (isMobileView ? 1.5 : 2)}`, // Reduced scroll depth on mobile
        scrub: 1.5, 
        pin: true, 
      },
    })

    // Camera movement (zoom out slightly, then move)
    tl.to(cameraRef.current.position, { z: 25, y: 2, ease: "power1.inOut" }, "start")
      .to(cameraRef.current.rotation, { x: -Math.PI / 12, ease: "power1.inOut"}, "start")


    // Astronaut movement (float up, then slightly forward)
    if (astronautRef.current) {
      tl.to(astronautRef.current.position, { y: 5, z: -5, ease: "power1.inOut" }, "start")
        .to(astronautRef.current.rotation, { x: Math.PI / 8, y: Math.PI / 4, ease: "power1.inOut" }, "start")
    }

    // Parallax for stars and dust
    if (starsRef.current) {
      tl.to(starsRef.current.position, { z: 150, ease: "none" }, "start") // Stars move slower (further away)
    }
    if (spaceDustRef.current) {
      tl.to(spaceDustRef.current.position, { z: 50, ease: "none" }, "start") // Dust moves a bit faster
    }
    
    // Planets parallax
    planetsRef.current.forEach((planet, index) => {
        tl.to(planet.position, { 
            z: planet.position.z + 60 + index * 10, // Move towards camera, different rates
            x: planet.position.x + (Math.random() - 0.5) * 20, // Slight sideways drift
            ease: "power1.out" 
        }, "start");
    });

    // Text animation
    if (textMesh1Ref.current && textMesh2Ref.current) {
      const textMat1 = textMesh1Ref.current.material as THREE.MeshStandardMaterial; // Type assertion
      const textMat2 = textMesh2Ref.current.material as THREE.MeshStandardMaterial;

      tl.to(textMesh1Ref.current.position, { y: 10, z: -15, ease: "power1.inOut" }, "+=0.2") // Move first text
        .to(textMat1, { opacity: 0, duration: 0.5, onComplete: () => { if(textMesh1Ref.current) textMesh1Ref.current.visible = false } }, "<+=0.3") // Fade out
        
        .call(() => { if(textMesh2Ref.current) textMesh2Ref.current.visible = true }, null, ">-=0.2") // Make second text visible
        .fromTo(textMesh2Ref.current.position, 
            { y: -5, z: 5, x: (Math.random()-0.5) * 5 }, // Start from slightly random position
            { y: -1, z: 0, x:0, ease: "power2.out" }
        )
        .to(textMat2, { opacity: 1, duration: 1 }, "<") // Fade in
    }

    // Lightning Pulses
    const lightningLight = new THREE.AmbientLight(0x66ccff, 0); // Electric blue, initially off
    if (sceneRef.current) sceneRef.current.add(lightningLight);
    
    ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 2}`,
        toggleClass: "is-scrolling", // Example class, not used here
        onUpdate: self => {
            // Trigger lightning randomly or at specific progress points
            if (Math.random() < 0.005) { // Low chance on each update
                gsap.fromTo(lightningLight, 
                    { intensity: 0 }, 
                    { intensity: 1.5, duration: 0.05, yoyo: true, repeat: 1, ease: "power4.inOut" }
                );
            }
        }
    });
    
    // Ensure cleanup for this ScrollTrigger as well
    return () => {
        if (lightningLight && sceneRef.current) sceneRef.current.remove(lightningLight);
        lightningLight.dispose();
    }

  }, [isFontLoaded]) // Rerun animations when font is loaded

  return (
    // Ensure cleanup for this ScrollTrigger as well
    return () => {
        if (lightningLight && sceneRef.current) sceneRef.current.remove(lightningLight);
        lightningLight.dispose();
        window.removeEventListener('resize', checkMobile); // Clean up resize listener
    }

  }, [isFontLoaded, isMobileView]) // Rerun animations when font or isMobileView changes

  const sectionHeight = isMobileView ? "200vh" : "250vh";

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: sectionHeight }} 
    >
      <div className="sticky top-0 h-screen w-full"> {/* Sticky container for the canvas */}
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </section>
  )
}

export default AstronautScene
