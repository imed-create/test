"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import * as THREE from "three"

// Simple Sky Shader
const skyVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const skyFragmentShader = `
  varying vec2 vUv;
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float time; // For potential animation

  void main() {
    float h = normalize(vUv.y + sin(vUv.x * 10.0 + time * 0.5) * 0.1) * 0.5 + 0.5; // Wavy clouds
    gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
  }
`

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Refs for Three.js objects to aid in cleanup and direct manipulation
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null) // Using Orthographic for full-screen shader
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)
  const skyMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const airplaneRef = useRef<THREE.Mesh | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const spaceshipsRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!canvasRef.current || !preloaderRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Using OrthographicCamera for a full-screen quad shader
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true, 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    // Sky Shader Plane
    const skyGeometry = new THREE.PlaneGeometry(2, 2) // Full-screen quad
    const initialTopColor = new THREE.Color(0x87ceeb) // Light blue
    const initialBottomColor = new THREE.Color(0x4682b4) // Steel blue (darker)
    const skyMaterial = new THREE.ShaderMaterial({
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      uniforms: {
        topColor: { value: initialTopColor },
        bottomColor: { value: initialBottomColor },
        time: { value: 0.0 },
      },
    })
    skyMaterialRef.current = skyMaterial
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(skyMesh)

    // Perspective camera for 3D objects (will be rendered on top of sky shader)
    const perspectiveCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    perspectiveCamera.position.z = 5

    // GSAP Animation Timeline
    const tl = gsap.timeline()
    const totalDuration = 6.5 // Target ~6.5 seconds

    // --- Animation Sequence ---

    // 1. Sky & Lightning (Duration: ~1.5s)
    const lightningLight = new THREE.AmbientLight(0xffffff, 0) // Use Ambient for global flash
    scene.add(lightningLight)
    tl.to(lightningLight, { 
        intensity: 0.7, 
        duration: 0.08, 
        repeat: 2, 
        yoyo: true, 
        ease: "power4.inOut" 
      }, "+=0.5") // Start after 0.5s
      .to(lightningLight, { intensity: 0, duration: 0.1 }, ">") // Ensure it ends off

    // 2. Airplane (Appears at 0.8s, flies for 2s)
    const planeGeometry = new THREE.ConeGeometry(0.2, 1, 8)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, emissive: 0x333333 })
    const airplane = new THREE.Mesh(planeGeometry, planeMaterial)
    airplane.rotation.x = Math.PI / 2 
    airplane.position.set(-10, 0.5, 0) // Start off-screen, slightly higher
    airplaneRef.current = airplane // Store ref for cleanup
    scene.add(airplane)

    // Airplane trail placeholder (simple line)
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const trailGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    const airplaneTrail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(airplaneTrail);

    tl.to(airplane.position, { 
        x: 10, 
        duration: 2, 
        ease: "power2.inOut",
        onUpdate: () => { // Update trail
            const positions = airplaneTrail.geometry.attributes.position.array as Float32Array;
            positions[0] = airplane.position.x - 0.5; // Start behind plane
            positions[1] = airplane.position.y;
            positions[2] = airplane.position.z;
            positions[3] = airplane.position.x + 1.5; // End further behind
            positions[4] = airplane.position.y;
            positions[5] = airplane.position.z;
            airplaneTrail.geometry.attributes.position.needsUpdate = true;
        }
    }, "0.8") // Start airplane animation at 0.8s into the main timeline

    // 3. Spacetime Tunnel Morph (Starts at ~2s, duration ~1.5s)
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCnt = 800
    const posArray = new Float32Array(particlesCnt * 3)
    for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30 // Wider spread
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.07,
      color: 0xaaaaff, // Bluish particles
      transparent: true,
      opacity: 0, // Start invisible
    })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    particlesMesh.position.z = -10 // Start further back
    particlesRef.current = particlesMesh
    scene.add(particlesMesh)

    tl.to(skyMaterial.uniforms.bottomColor.value, { // Morph sky to dark
        r: 0.0, g: 0.0, b: 0.2, // Dark blue
        duration: 1.5, ease: "power1.in"
      }, "1.8") // Start morph around 1.8s
      .to(skyMaterial.uniforms.topColor.value, { // Morph sky to black
        r: 0.0, g: 0.0, b: 0.0,
        duration: 1.5, ease: "power1.in"
      }, "<") // Simultaneously
      .call(() => {
        airplane.visible = false 
        airplaneTrail.visible = false;
        gsap.to(particlesMaterial, { opacity: 0.7, duration: 1 }); // Fade in particles
      }, null, ">-0.5") // After sky morph starts
      .to(particlesMesh.position, { z: perspectiveCamera.position.z + 2, duration: 2, ease: "power2.in" }, ">-0.8") // Particles rush past camera
      // Thunder pulse placeholder: quick camera shake or FOV change
      .to(perspectiveCamera, { fov: perspectiveCamera.fov + 5, duration: 0.1, yoyo: true, repeat: 1, ease:"power4.inOut" }, ">-1.5")
      .to(perspectiveCamera, { fov: perspectiveCamera.fov, duration: 0.1 }) // Reset fov


    // 4. Spaceships/Galaxy (Appear after tunnel, duration ~1.5s)
    const spaceshipGeometry = new THREE.ConeGeometry(0.1, 0.5, 8)
    const spaceshipMaterial = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0x552200 })
    
    for (let i = 0; i < 5; i++) {
      const ship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial.clone()) // Clone material for potential individual control
      ship.rotation.x = Math.PI / 2
      ship.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, -15 - Math.random() * 5) // Start further back
      ship.visible = false
      scene.add(ship)
      spaceshipsRef.current.push(ship) // Store for cleanup
      tl.call(() => ship.visible = true, null, "3.8") // Appear around 3.8s (after tunnel morph)
        .to(ship.position, { z: perspectiveCamera.position.z + 10, duration: 2 + Math.random() * 0.5, ease: "power1.in" }, ">")
    }
     // Galaxy placeholder (modify existing particles or add new ones)
    tl.to(particlesMaterial, { color: new THREE.Color(0xffddaa), size: 0.1, duration: 1.5 }, "3.8") // Make particles look more like stars

    // 5. Fade to Main Content (Starts at ~5.5s, duration 1s)
    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setIsLoading(false)
      },
    }, `>${totalDuration - 6.5}`); // Ensure this is the last step, starts at ~5.5s for a 6.5s total

    // Animation loop
    let clock = new THREE.Clock()
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !skyMaterialRef.current) return
      
      skyMaterialRef.current.uniforms.time.value = clock.getElapsedTime()

      // Render full-screen quad first
      rendererRef.current.autoClear = false;
      rendererRef.current.clear();
      rendererRef.current.render(sceneRef.current, cameraRef.current) // Renders sky with orthographic

      // Render 3D elements on top
      rendererRef.current.clearDepth(); // Clear depth buffer
      rendererRef.current.render(sceneRef.current, perspectiveCamera) // Renders 3D objects

      animationFrameIdRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (rendererRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        rendererRef.current.setSize(width, height)
        perspectiveCamera.aspect = width / height
        perspectiveCamera.updateProjectionMatrix()
        // Orthographic camera doesn't need aspect updates for this full-screen use case
      }
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      window.removeEventListener("resize", handleResize)
      
      gsap.killTweensOf("*"); // Kill all GSAP tweens associated with this component

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
      skyMaterial?.dispose();
      lightningLight?.dispose();
      
      renderer.dispose()
      if (preloaderRef.current) {
          preloaderRef.current.style.opacity = '1';
      }
      // Clear refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      skyMaterialRef.current = null;
      airplaneRef.current = null;
      particlesRef.current = null;
      spaceshipsRef.current = [];
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent" // bg is handled by canvas/shader
      style={{ pointerEvents: isLoading ? 'all' : 'none' }} 
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
