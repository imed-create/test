"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import * as THREE from "three"

export const ElectricCharacter = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const characterRef = useRef<THREE.Group | null>(null)
  const lightningRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create electric character
    const createCharacter = () => {
      const group = new THREE.Group()
      characterRef.current = group

      // Create body parts with electric material
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        transparent: true,
        opacity: 0.8,
      })

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material
      )
      head.position.y = 2
      group.add(head)

      // Body
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.5, 1.5, 32),
        material
      )
      body.position.y = 0.75
      group.add(body)

      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32)
      const leftArm = new THREE.Mesh(armGeometry, material)
      leftArm.position.set(-0.8, 1, 0)
      leftArm.rotation.z = Math.PI / 4
      group.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, material)
      rightArm.position.set(0.8, 1, 0)
      rightArm.rotation.z = -Math.PI / 4
      group.add(rightArm)

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 32)
      const leftLeg = new THREE.Mesh(legGeometry, material)
      leftLeg.position.set(-0.3, -0.75, 0)
      group.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, material)
      rightLeg.position.set(0.3, -0.75, 0)
      group.add(rightLeg)

      scene.add(group)
    }

    // Create lightning effect
    const createLightning = () => {
      const lightning = document.createElement("div")
      lightning.className = "character-lightning"
      
      // Random position around character
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      lightning.style.left = `${50 + x * 10}%`
      lightning.style.top = `${50 + y * 10}%`
      lightning.style.transform = `rotate(${angle * 180 / Math.PI}deg)`
      
      lightningRef.current?.appendChild(lightning)
      
      gsap.to(lightning, {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => lightning.remove(),
      })
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (characterRef.current) {
        characterRef.current.rotation.y += 0.01
      }

      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    // Create periodic lightning
    const createPeriodicLightning = () => {
      createLightning()
      setTimeout(createPeriodicLightning, Math.random() * 500 + 200)
    }

    createCharacter()
    animate()
    createPeriodicLightning()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen"
    >
      <div
        ref={lightningRef}
        className="absolute inset-0 pointer-events-none"
      />
      <style jsx>{`
        .character-lightning {
          position: absolute;
          width: 4px;
          height: 150px;
          background: linear-gradient(
            to bottom,
            transparent,
            #00ff9d,
            #00bfff,
            transparent
          );
          filter: blur(2px);
          opacity: 0.9;
          transform-origin: center;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
} 