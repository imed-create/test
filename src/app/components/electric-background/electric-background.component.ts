import {
  Component,
  type OnInit,
  type AfterViewInit,
  type ElementRef,
  ViewChild,
  type NgZone,
  type OnDestroy,
} from "@angular/core"
import * as THREE from "three"

@Component({
  selector: "app-electric-background",
  templateUrl: "./electric-background.component.html",
  styleUrls: ["./electric-background.component.scss"],
})
export class ElectricBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>

  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private lightnings: THREE.Line[] = []
  private animationFrameId = 0
  private maxLightnings = 15

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJS()
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId)
    this.renderer.dispose()
    this.scene.clear()
  }

  private initThreeJS(): void {
    this.ngZone.runOutsideAngular(() => {
      // Set up Three.js scene
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      this.camera.position.z = 5

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvasRef.nativeElement,
        alpha: true,
        antialias: true,
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

      // Create electric particles
      const particlesGeometry = new THREE.BufferGeometry()
      const particlesCount = 2000
      const posArray = new Float32Array(particlesCount * 3)

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20
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

      this.scene.add(blueParticles)
      this.scene.add(goldParticles)
      this.scene.add(tealParticles)

      // Mouse interaction
      let mouseX = 0
      let mouseY = 0
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      }
      window.addEventListener("mousemove", handleMouseMove)

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

        this.scene.add(lightning)
        this.lightnings.push(lightning)

        // Remove after a short time
        setTimeout(
          () => {
            this.scene.remove(lightning)
            geometry.dispose()
            const index = this.lightnings.indexOf(lightning)
            if (index > -1) {
              this.lightnings.splice(index, 1)
            }
          },
          Math.random() * 200 + 100,
        )
      }

      // Animation loop
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate)

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

        // Random lightning
        if (this.lightnings.length < this.maxLightnings && Math.random() < 0.05) {
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
        if (this.lightnings.length > 0 && Math.random() < 0.03) {
          const sourceLightning = this.lightnings[Math.floor(Math.random() * this.lightnings.length)]
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

            this.scene.add(branch)
            this.lightnings.push(branch)

            setTimeout(
              () => {
                this.scene.remove(branch)
                branchGeometry.dispose()
                const index = this.lightnings.indexOf(branch)
                if (index > -1) {
                  this.lightnings.splice(index, 1)
                }
              },
              Math.random() * 100 + 50,
            )
          }
        }

        this.renderer.render(this.scene, this.camera)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener("resize", handleResize)

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)
        cancelAnimationFrame(this.animationFrameId)
        this.renderer.dispose()
        this.scene.clear()
      }
    })
  }
}
