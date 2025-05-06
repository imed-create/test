"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const LightningEffect = () => {
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

    // Lightning materials
    const lightningMaterial = new THREE.LineBasicMaterial({
      color: 0x00bfff, // Electric blue
      transparent: true,
      opacity: 0.7,
    })

    const goldLightningMaterial = new THREE.LineBasicMaterial({
      color: 0xfbbf24, // Gold
      transparent: true,
      opacity: 0.5,
    })

    const tealLightningMaterial = new THREE.LineBasicMaterial({
      color: 0x2dd4bf, // Teal
      transparent: true,
      opacity: 0.6,
    })

    // Array to store all lightning bolts
    const lightnings: THREE.Line[] = []
    const maxLightnings = 15

    // Function to create a lightning bolt
    const createLightning = (isBlue = true, isGold = false) => {
      const points = []
      // Random starting point
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 - 5,
        (Math.random() - 0.5) * 5,
      )

      points.push(startPoint)

      let currentPoint = startPoint.clone()

      // Create zigzag pattern
      const segments = Math.floor(Math.random() * 10) + 5
      for (let i = 0; i < segments; i++) {
        currentPoint = new THREE.Vector3(
          currentPoint.x + (Math.random() - 0.5) * 3,
          currentPoint.y + (Math.random() - 0.5) * 3,
          currentPoint.z + (Math.random() - 0.5) * 0.5,
        )
        points.push(currentPoint)
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      let material
      if (isBlue) {
        material = lightningMaterial
      } else if (isGold) {
        material = goldLightningMaterial
      } else {
        material = tealLightningMaterial
      }

      const lightning = new THREE.Line(geometry, material)

      scene.add(lightning)
      lightnings.push(lightning)

      // Remove after a short time
      setTimeout(
        () => {
          scene.remove(lightning)
          geometry.dispose()
          const index = lightnings.indexOf(lightning)
          if (index > -1) {
            lightnings.splice(index, 1)
          }
        },
        Math.random() * 200 + 100,
      )
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Random lightning
      if (lightnings.length < maxLightnings && Math.random() < 0.05) {
        const rand = Math.random()
        if (rand < 0.5) {
          createLightning(true, false) // Blue lightning
        } else if (rand < 0.8) {
          createLightning(false, true) // Gold lightning
        } else {
          createLightning(false, false) // Teal lightning
        }
      }

      // Create branching lightning occasionally
      if (lightnings.length > 0 && Math.random() < 0.03) {
        const sourceLightning = lightnings[Math.floor(Math.random() * lightnings.length)]
        if (sourceLightning && sourceLightning.geometry) {
          const positions = sourceLightning.geometry.attributes.position.array
          const randomIndex = Math.floor(Math.random() * (positions.length / 3 - 1)) * 3

          const branchPoints = []
          const startPoint = new THREE.Vector3(
            positions[randomIndex],
            positions[randomIndex + 1],
            positions[randomIndex + 2],
          )

          branchPoints.push(startPoint)

          let currentPoint = startPoint.clone()
          const segments = Math.floor(Math.random() * 3) + 2

          for (let i = 0; i < segments; i++) {
            currentPoint = new THREE.Vector3(
              currentPoint.x + (Math.random() - 0.5) * 2,
              currentPoint.y + (Math.random() - 0.5) * 2,
              currentPoint.z + (Math.random() - 0.5) * 0.5,
            )
            branchPoints.push(currentPoint)
          }

          const branchGeometry = new THREE.BufferGeometry().setFromPoints(branchPoints)
          const rand = Math.random()
          let material

          if (rand < 0.5) {
            material = lightningMaterial
          } else if (rand < 0.8) {
            material = goldLightningMaterial
          } else {
            material = tealLightningMaterial
          }

          const branch = new THREE.Line(branchGeometry, material)

          scene.add(branch)
          lightnings.push(branch)

          setTimeout(
            () => {
              scene.remove(branch)
              branchGeometry.dispose()
              const index = lightnings.indexOf(branch)
              if (index > -1) {
                lightnings.splice(index, 1)
              }
            },
            Math.random() * 100 + 50,
          )
        }
      }

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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 opacity-30" />
}

export default LightningEffect
