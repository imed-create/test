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
  selector: "app-lightning-effect",
  templateUrl: "./lightning-effect.component.html",
  styleUrls: ["./lightning-effect.component.scss"],
})
export class LightningEffectComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>

  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private animationFrameId = 0

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

      // Lightning material
      const lightningMaterial = new THREE.LineBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.7,
      })

      // Function to create a lightning bolt
      const createLightning = () => {
        const points = []
        const startPoint = new THREE.Vector3((Math.random() - 0.5) * 10, 5, (Math.random() - 0.5) * 5)

        points.push(startPoint)

        let currentPoint = startPoint.clone()

        // Create zigzag pattern
        const segments = Math.floor(Math.random() * 5) + 5
        for (let i = 0; i < segments; i++) {
          currentPoint = new THREE.Vector3(
            currentPoint.x + (Math.random() - 0.5) * 2,
            currentPoint.y - 10 / segments,
            currentPoint.z + (Math.random() - 0.5) * 2,
          )
          points.push(currentPoint)
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const lightning = new THREE.Line(geometry, lightningMaterial)

        this.scene.add(lightning)

        // Remove after a short time
        setTimeout(() => {
          this.scene.remove(lightning)
          geometry.dispose()
        }, 200)
      }

      // Animation
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate)

        // Random chance to create lightning
        if (Math.random() < 0.03) {
          createLightning()
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
        cancelAnimationFrame(this.animationFrameId)
        this.renderer.dispose()
        this.scene.clear()
      }
    })
  }
}
