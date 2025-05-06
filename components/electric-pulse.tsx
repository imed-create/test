"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const ElectricPulse = () => {
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

    // Create electric pulse effect
    const pulseGeometry = new THREE.SphereGeometry(2, 32, 32)
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    })

    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
    scene.add(pulse)

    // Create smaller inner pulse
    const innerPulseGeometry = new THREE.SphereGeometry(1.5, 24, 24)
    const innerPulseMaterial = new THREE.MeshBasicMaterial({
      color: 0xf50c28,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    })

    const innerPulse = new THREE.Mesh(innerPulseGeometry, innerPulseMaterial)
    scene.add(innerPulse)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Pulse animation
      pulse.scale.x = 1 + Math.sin(time) * 0.2
      pulse.scale.y = 1 + Math.sin(time) * 0.2
      pulse.scale.z = 1 + Math.sin(time) * 0.2
      pulse.rotation.x += 0.002
      pulse.rotation.y += 0.003

      // Inner pulse animation (opposite phase)
      innerPulse.scale.x = 1 + Math.sin(time + Math.PI) * 0.2
      innerPulse.scale.y = 1 + Math.sin(time + Math.PI) * 0.2
      innerPulse.scale.z = 1 + Math.sin(time + Math.PI) * 0.2
      innerPulse.rotation.x -= 0.002
      innerPulse.rotation.y -= 0.003

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
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-5 opacity-30" />
}

export default ElectricPulse
