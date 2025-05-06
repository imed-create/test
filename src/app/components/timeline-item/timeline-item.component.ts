import { Component, type OnInit, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "app-timeline-item",
  templateUrl: "./timeline-item.component.html",
  styleUrls: ["./timeline-item.component.scss"],
})
export class TimelineItemComponent implements OnInit {
  @Input() year = ""
  @Input() title = ""
  @Input() description = ""
  @Output() cursorHover = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit(): void {}

  onMouseEnter(): void {
    this.cursorHover.emit(true)
  }

  onMouseLeave(): void {
    this.cursorHover.emit(false)
  }
}
