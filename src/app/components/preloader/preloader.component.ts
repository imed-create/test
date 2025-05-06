import { Component, type OnInit } from "@angular/core"
import { trigger, state, style, animate, transition } from "@angular/animations"
import * as THREE from "three"

@Component({
  selector: "app-preloader",
  templateUrl: "./preloader.component.html",
  styleUrls: ["./preloader.component.scss"],
  animations: [
    trigger("fadeOut", [
      state("void", style({ opacity: 1 })),
      transition(":leave", [animate("0.8s ease-in-out", style({ opacity: 0 }))]),
    ]),
  ],
})
export class PreloaderComponent implements OnInit {
  progress = 0
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  airplane!: THREE.Group

  constructor() {}

  ngOnInit() {
    this.initThreeJS()
    this.animateProgress()
  }

  initThreeJS() {
    // Initialize Three.js scene for the preloader
    const container = document.getElementById("preloader-canvas")
    if (!container) return

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)

    // Create a simple airplane model
    this.createAirplane()

    // Add some lightning effects
    this.addLightning()

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    this.scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (this.airplane) {
        this.airplane.rotation.y += 0.01
        this.airplane.position.y = Math.sin(Date.now() * 0.001) * 0.2
      }

      this.renderer.render(this.scene, this.camera)
    }

    animate()

    // Handle resize
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  createAirplane() {
    this.airplane = new THREE.Group()

    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8)
    const fuselageMaterial = new THREE.MeshPhongMaterial({
      color: 0x00bfff,
      emissive: 0x00bfff,
      emissiveIntensity: 0.2,
    })
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial)
    fuselage.rotation.z = Math.PI / 2
    this.airplane.add(fuselage)

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.7, 0.05, 0.2)
    const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
    const wing = new THREE.Mesh(wingGeometry, wingMaterial)
    wing.position.y = 0.05
    this.airplane.add(wing)

    // Tail
    const tailGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.2)
    const tailMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
    const tail = new THREE.Mesh(tailGeometry, tailMaterial)
    tail.position.x = -0.4
    tail.position.y = 0.1
    this.airplane.add(tail)

    // Vertical stabilizer
    const stabilizerGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.05)
    const stabilizerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
    const stabilizer = new THREE.Mesh(stabilizerGeometry, stabilizerMaterial)
    stabilizer.position.x = -0.4
    stabilizer.position.y = 0.2
    this.airplane.add(stabilizer)

    this.scene.add(this.airplane)
    this.airplane.position.z = -2
  }

  addLightning() {
    // Create lightning trail behind the airplane
    const createLightning = () => {
      if (!this.airplane) return

      const points = []
      const startPoint = new THREE.Vector3().copy(this.airplane.position)
      startPoint.x -= 0.5

      points.push(startPoint)

      let currentPoint = startPoint.clone()

      // Create zigzag pattern
      const segments = Math.floor(Math.random() * 5) + 5
      for (let i = 0; i < segments; i++) {
        currentPoint = new THREE.Vector3(
          currentPoint.x - (Math.random() * 0.3 + 0.1),
          currentPoint.y + (Math.random() - 0.5) * 0.2,
          currentPoint.z + (Math.random() - 0.5) * 0.2,
        )
        points.push(currentPoint)
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      // Randomly choose between blue and gold for the lightning
      const color = Math.random() > 0.5 ? 0x00bfff : 0xfbbf24

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
      })

      const lightning = new THREE.Line(geometry, material)
      this.scene.add(lightning)

      // Remove after a short time
      setTimeout(() => {
        this.scene.remove(lightning)
        geometry.dispose()
        material.dispose()
      }, 200)
    }

    // Create lightning at intervals
    setInterval(createLightning, 100)
  }

  animateProgress() {
    const interval = setInterval(() => {
      this.progress += 2
      if (this.progress >= 100) {
        clearInterval(interval)
      }
    }, 100)
  }
}
