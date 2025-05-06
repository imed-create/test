import { Component, type OnInit, HostListener, Output, EventEmitter } from "@angular/core"
import { trigger, state, style, animate, transition } from "@angular/animations"

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  animations: [
    trigger("fadeInDown", [
      state(
        "void",
        style({
          opacity: 0,
          transform: "translateY(-20px)",
        }),
      ),
      transition(":enter", [
        animate(
          "0.6s ease-out",
          style({
            opacity: 1,
            transform: "translateY(0)",
          }),
        ),
      ]),
    ]),
    trigger("mobileMenuAnimation", [
      state(
        "void",
        style({
          opacity: 0,
          transform: "translateY(-20px)",
        }),
      ),
      transition(":enter", [
        animate(
          "0.3s ease-out",
          style({
            opacity: 1,
            transform: "translateY(0)",
          }),
        ),
      ]),
      transition(":leave", [
        animate(
          "0.3s ease-in",
          style({
            opacity: 0,
            transform: "translateY(-20px)",
          }),
        ),
      ]),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  @Output() cursorHover = new EventEmitter<boolean>()

  isScrolled = false
  mobileMenuOpen = false

  navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ]

  constructor() {}

  ngOnInit(): void {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  onMouseEnter() {
    this.cursorHover.emit(true)
  }

  onMouseLeave() {
    this.cursorHover.emit(false)
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false
  }
}
