import {
  Component,
  type OnInit,
  type AfterViewInit,
  type ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { gsap } from "gsap"

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit, AfterViewInit {
  @Output() cursorHover = new EventEmitter<boolean>()
  @ViewChild("contactSection") contactSection!: ElementRef

  contactForm: FormGroup
  isSubmitting = false
  isSubmitted = false

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAnimations()
  }

  initAnimations(): void {
    gsap.from(".contact-title", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: this.contactSection.nativeElement,
        start: "top 80%",
        end: "top 50%",
        scrub: 1,
      },
    })

    gsap.from(".contact-form", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: this.contactSection.nativeElement,
        start: "top 70%",
        end: "top 40%",
        scrub: 1,
      },
    })

    gsap.from(".contact-info", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.4,
      scrollTrigger: {
        trigger: this.contactSection.nativeElement,
        start: "top 70%",
        end: "top 40%",
        scrub: 1,
      },
    })
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true

      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false
        this.isSubmitted = true
        this.contactForm.reset()

        // Reset success message after 5 seconds
        setTimeout(() => {
          this.isSubmitted = false
        }, 5000)
      }, 1500)
    }
  }

  onMouseEnter(): void {
    this.cursorHover.emit(true)
  }

  onMouseLeave(): void {
    this.cursorHover.emit(false)
  }
}
