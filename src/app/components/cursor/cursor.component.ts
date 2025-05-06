import { Component, type OnInit, type OnDestroy, type ElementRef, type Renderer2, type NgZone } from "@angular/core"
import { Subscription } from "rxjs"
import type { CursorService } from "../../services/cursor.service"

@Component({
  selector: "app-cursor",
  templateUrl: "./cursor.component.html",
  styleUrls: ["./cursor.component.scss"],
})
export class CursorComponent implements OnInit, OnDestroy {
  hovering = false
  position = { x: 0, y: 0 }
  isVisible = false
  private subscription: Subscription = new Subscription()

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone,
    private cursorService: CursorService,
  ) {}

  ngOnInit() {
    this.subscription = this.cursorService.hovering$.subscribe((hovering) => {
      this.hovering = hovering
    })

    this.zone.runOutsideAngular(() => {
      window.addEventListener("mousemove", this.updatePosition)
      window.addEventListener("mouseleave", this.handleMouseLeave)
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    window.removeEventListener("mousemove", this.updatePosition)
    window.removeEventListener("mouseleave", this.handleMouseLeave)
  }

  updatePosition = (e: MouseEvent) => {
    this.zone.run(() => {
      this.position = { x: e.clientX, y: e.clientY }
      this.isVisible = true
    })
  }

  handleMouseLeave = () => {
    this.zone.run(() => {
      this.isVisible = false
    })
  }
}
