import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class CursorService {
  private hoveringSubject = new BehaviorSubject<boolean>(false)
  hovering$ = this.hoveringSubject.asObservable()

  constructor() {}

  setHovering(isHovering: boolean) {
    this.hoveringSubject.next(isHovering)
  }
}
