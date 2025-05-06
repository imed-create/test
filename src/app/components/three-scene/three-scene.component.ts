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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

@Component({
  selector: "app-three-scene",
  templateUrl: "./three-scene.component.html",
  styleUrls: ["./three-scene.component.scss"],
})
export class ThreeSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>

  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
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
      this.scene.background = new THREE.Color(0x1e3a8a)

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      this.camera.position.z = 5

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvasRef.nativeElement,
        antialias: true,
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.enableZoom = false

      // Particles
      const particlesGeometry = new THREE.BufferGeometry()
      const particlesCount = 3000
      const posArray = new Float32Array(particlesCount * 3)

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x2dd4bf,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
      this.scene.add(particlesMesh)

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      this.scene.add(ambientLight)

      const pointLight = new THREE.PointLight(0x2dd4bf, 1)
      pointLight.position.set(2, 3, 4)
      this.scene.add(pointLight)

      // Animation
      let mouseX = 0
      let mouseY = 0
      let targetX = 0
      let targetY = 0
      const windowHalfX = window.innerWidth / 2
      const windowHalfY = window.innerHeight / 2

      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - windowHalfX) / 100
        mouseY = (event.clientY - windowHalfY) / 100
      }

      document.addEventListener("mousemove", handleMouseMove)

      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate)

        targetX = mouseX * 0.3
        targetY = mouseY * 0.3

        particlesMesh.rotation.y += 0.003
        particlesMesh.rotation.x += 0.001

        particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05
        particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05

        this.controls.update()
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
        document.removeEventListener("mousemove", handleMouseMove)
        cancelAnimationFrame(this.animationFrameId)
        this.renderer.dispose()
        this.scene.clear()
      }
    })
  }
}
