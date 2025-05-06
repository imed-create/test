import { Component, type OnInit, type AfterViewInit, type ElementRef, ViewChild, type Renderer2 } from "@angular/core"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import type { CursorService } from "./services/cursor.service"

gsap.registerPlugin(ScrollTrigger)

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "imed-portfolio"
  loading = true

  @ViewChild("main") mainElement!: ElementRef

  constructor(
    private renderer: Renderer2,
    private cursorService: CursorService,
  ) {}

  ngOnInit() {
    // Simulate loading time
    setTimeout(() => {
      this.loading = false
    }, 5000)
  }

  ngAfterViewInit() {
    this.initSmoothScroll()
    this.initScrollAnimations()
  }

  initSmoothScroll() {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }

  initScrollAnimations() {
    // Initialize GSAP ScrollTrigger animations
    const sections = document.querySelectorAll("section")

    sections.forEach((section, index) => {
      gsap.fromTo(
        section.querySelector(".section-content"),
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        },
      )
    })
  }

  onCursorHover(hovering: boolean) {
    this.cursorService.setHovering(hovering)
  }
}
