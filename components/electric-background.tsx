"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const ElectricBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Set up Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 2000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    // Create three particle systems with cosmic colors
    const electricBlueMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00bfff, // Electric blue
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const cosmicPurpleMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0x8a2be2, // Deep cosmic purple
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const nebulaPinkMaterial = new THREE.PointsMaterial({
      size: 0.018,
      color: 0xff1493, // Deep nebula pink
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const electricBlueParticles = new THREE.Points(particlesGeometry, electricBlueMaterial)
    const cosmicPurpleParticles = new THREE.Points(particlesGeometry.clone(), cosmicPurpleMaterial)
    const nebulaPinkParticles = new THREE.Points(particlesGeometry.clone(), nebulaPinkMaterial)

    scene.add(electricBlueParticles)
    scene.add(cosmicPurpleParticles)
    scene.add(nebulaPinkParticles)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate particles with different speeds
      electricBlueParticles.rotation.y += 0.001
      electricBlueParticles.rotation.x += 0.0005
      cosmicPurpleParticles.rotation.y -= 0.0008
      cosmicPurpleParticles.rotation.x -= 0.0003
      nebulaPinkParticles.rotation.y += 0.0005
      nebulaPinkParticles.rotation.x -= 0.0007

      // Subtle movement based on mouse position
      electricBlueParticles.rotation.y += mouseX * 0.0002
      electricBlueParticles.rotation.x += mouseY * 0.0002
      cosmicPurpleParticles.rotation.y -= mouseX * 0.0001
      cosmicPurpleParticles.rotation.x -= mouseY * 0.0001
      nebulaPinkParticles.rotation.y += mouseX * 0.00015
      nebulaPinkParticles.rotation.x += mouseY * 0.00015

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-70" />
}

export default ElectricBackground
