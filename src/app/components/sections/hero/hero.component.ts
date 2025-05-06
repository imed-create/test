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
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(SplitText)

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent implements OnInit, AfterViewInit {
  @Output() cursorHover = new EventEmitter<boolean>()
  @ViewChild("heroTitle") heroTitle!: ElementRef
  @ViewChild("heroSubtitle") heroSubtitle!: ElementRef

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAnimations()
  }

  initAnimations(): void {
    // Split text for animation
    const titleSplit = new SplitText(this.heroTitle.nativeElement, { type: "chars, words" })
    const subtitleSplit = new SplitText(this.heroSubtitle.nativeElement, { type: "chars, words" })

    // Animate title
    gsap.from(titleSplit.chars, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.02,
      duration: 1,
      ease: "power4.out",
      delay: 0.2,
    })

    // Animate subtitle
    gsap.from(subtitleSplit.words, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.8,
      ease: "power3.out",
      delay: 1,
    })

    // Animate buttons
    gsap.from(".hero-buttons .btn", {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.5,
    })
  }

  onMouseEnter(): void {
    this.cursorHover.emit(true)
  }

  onMouseLeave(): void {
    this.cursorHover.emit(false)
  }
}
