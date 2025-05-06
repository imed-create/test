import { Component, type OnInit, Input, Output, EventEmitter, type ElementRef, type AfterViewInit } from "@angular/core"
import { gsap } from "gsap"

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  link: string
}

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
})
export class ProjectCardComponent implements OnInit, AfterViewInit {
  @Input() project!: Project
  @Output() cursorHover = new EventEmitter<boolean>()

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initTiltEffect()
  }

  initTiltEffect(): void {
    const card = this.el.nativeElement.querySelector(".project-card")

    card.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: "power2.out",
      })
    })

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    })
  }

  onMouseEnter(): void {
    this.cursorHover.emit(true)
  }

  onMouseLeave(): void {
    this.cursorHover.emit(false)
  }
}
