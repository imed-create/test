import {
  Component,
  type OnInit,
  type AfterViewInit,
  type ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Draggable } from "gsap/Draggable"

gsap.registerPlugin(ScrollTrigger, Draggable)

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  link: string
}

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  @Output() cursorHover = new EventEmitter<boolean>()
  @ViewChild("projectsContainer") projectsContainer!: ElementRef
  @ViewChild("projectsTrack") projectsTrack!: ElementRef

  projects: Project[] = [
    {
      id: 1,
      title: "Zeind Food",
      description: "A modern food delivery platform with real-time order tracking and payment integration.",
      image: "/assets/images/projects/zeind-food.jpg",
      category: "Web Development",
      link: "https://zeindfood.com",
    },
    {
      id: 2,
      title: "Syrian Stone",
      description: "E-commerce platform for natural stone products with 3D visualization.",
      image: "/assets/images/projects/syrian-stone.jpg",
      category: "3D & WebGL",
      link: "https://syrian-stone.com",
    },
    {
      id: 3,
      title: "Iron Pro TV",
      description: "Streaming platform for fitness content with subscription management.",
      image: "/assets/images/projects/iron-protv.jpg",
      category: "Web Development",
      link: "https://iron-protv.fr",
    },
    {
      id: 4,
      title: "Atlas OnTV Pro",
      description: "IPTV service management platform with user authentication and billing.",
      image: "/assets/images/projects/atlas-ontvpro.jpg",
      category: "Full Stack",
      link: "https://atlas-ontvpro.com",
    },
    {
      id: 5,
      title: "Crypto Dashboard",
      description: "Real-time cryptocurrency dashboard with market analysis and trading algorithms.",
      image: "/assets/images/projects/crypto-dashboard.jpg",
      category: "Blockchain",
      link: "#",
    },
    {
      id: 6,
      title: "Aero Simulator",
      description: "Interactive aerodynamics simulator for educational purposes.",
      image: "/assets/images/projects/aero-simulator.jpg",
      category: "3D & WebGL",
      link: "#",
    },
  ]

  activeProject: Project | null = null

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScrollAnimation()
  }

  initScrollAnimation(): void {
    // Horizontal scroll animation
    if (window.innerWidth >= 768) {
      const sections = gsap.utils.toArray(".project-card")

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: this.projectsTrack.nativeElement,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + this.projectsTrack.nativeElement.offsetWidth,
        },
      })
    }

    // Animate project cards
    gsap.from(".project-card", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: this.projectsContainer.nativeElement,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    })
  }

  setActiveProject(project: Project | null): void {
    this.activeProject = project
  }

  onMouseEnter(): void {
    this.cursorHover.emit(true)
  }

  onMouseLeave(): void {
    this.cursorHover.emit(false)
  }
}
