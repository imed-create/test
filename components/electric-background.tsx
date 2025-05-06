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

    // Create three particle systems with different colors
    const blueParticlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00bfff,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const goldParticlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xfbbf24,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const tealParticlesMaterial = new THREE.PointsMaterial({
      size: 0.018,
      color: 0x2dd4bf,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const blueParticles = new THREE.Points(particlesGeometry, blueParticlesMaterial)
    const goldParticles = new THREE.Points(particlesGeometry.clone(), goldParticlesMaterial)
    const tealParticles = new THREE.Points(particlesGeometry.clone(), tealParticlesMaterial)

    scene.add(blueParticles)
    scene.add(goldParticles)
    scene.add(tealParticles)

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

      // Rotate particles
      blueParticles.rotation.y += 0.001
      blueParticles.rotation.x += 0.0005
      goldParticles.rotation.y -= 0.0008
      goldParticles.rotation.x -= 0.0003
      tealParticles.rotation.y += 0.0005
      tealParticles.rotation.x -= 0.0007

      // Subtle movement based on mouse position
      blueParticles.rotation.y += mouseX * 0.0002
      blueParticles.rotation.x += mouseY * 0.0002
      goldParticles.rotation.y -= mouseX * 0.0001
      goldParticles.rotation.x -= mouseY * 0.0001
      tealParticles.rotation.y += mouseX * 0.00015
      tealParticles.rotation.x += mouseY * 0.00015

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
