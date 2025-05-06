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

gsap.registerPlugin(ScrollTrigger)

interface TimelineItem {
  year: string
  title: string
  description: string
}

interface Skill {
  name: string
  category: string
}

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit, AfterViewInit {
  @Output() cursorHover = new EventEmitter<boolean>()
  @ViewChild("aboutSection") aboutSection!: ElementRef

  timelineItems: TimelineItem[] = [
    {
      year: "2023",
      title: "Full-stack Developer",
      description: "Specializing in React, Next.js, and Three.js for interactive web experiences",
    },
    {
      year: "2022",
      title: "Crypto Researcher",
      description: "Conducting research on blockchain technologies and cryptocurrency markets",
    },
    {
      year: "2021",
      title: "Web Developer",
      description: "Started journey into web development with focus on frontend technologies",
    },
    {
      year: "2019",
      title: "Aeronautical Engineer",
      description: "Master's degree in Aeronautical Engineering with focus on fluid dynamics",
    },
  ]

  skills: Skill[] = [
    { name: "Angular", category: "Frontend" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Three.js", category: "3D" },
    { name: "GSAP", category: "Animation" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Node.js", category: "Backend" },
    { name: "Blockchain", category: "Technology" },
    { name: "Crypto Research", category: "Research" },
    { name: "Aeronautical Engineering", category: "Engineering" },
    { name: "UI/UX Design", category: "Design" },
  ]

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAnimations()
  }

  initAnimations(): void {
    // Animate section title
    gsap.from(".about-title", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: this.aboutSection.nativeElement,
        start: "top 80%",
        end: "top 50%",
        scrub: 1,
      },
    })

    // Animate timeline items
    gsap.from(".timeline-item", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 80%",
        end: "top 50%",
        scrub: 1,
      },
    })

    // Animate skills
    gsap.from(".skill-item", {
      opacity: 0,
      scale: 0.8,
      stagger: 0.05,
      duration: 0.5,
      scrollTrigger: {
        trigger: ".skills-container",
        start: "top 80%",
        end: "top 50%",
        scrub: 1,
      },
    })
  }

  onMouseEnter(): void {
    this.cursorHover.emit(true)
  }

  onMouseLeave(): void {
    this.cursorHover.emit(false)
  }
}
