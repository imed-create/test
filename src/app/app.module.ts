import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

import { AppComponent } from "./app.component"
import { PreloaderComponent } from "./components/preloader/preloader.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { HeroComponent } from "./components/sections/hero/hero.component"
import { AboutComponent } from "./components/sections/about/about.component"
import { ProjectsComponent } from "./components/sections/projects/projects.component"
import { ContactComponent } from "./components/sections/contact/contact.component"
import { ThreeSceneComponent } from "./components/three-scene/three-scene.component"
import { ElectricBackgroundComponent } from "./components/electric-background/electric-background.component"
import { ProjectCardComponent } from "./components/project-card/project-card.component"
import { TimelineItemComponent } from "./components/timeline-item/timeline-item.component"
import { SocialLinksComponent } from "./components/social-links/social-links.component"
import { CursorComponent } from "./components/cursor/cursor.component"
import { LightningEffectComponent } from "./components/lightning-effect/lightning-effect.component"

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    ContactComponent,
    ThreeSceneComponent,
    ElectricBackgroundComponent,
    ProjectCardComponent,
    TimelineItemComponent,
    SocialLinksComponent,
    CursorComponent,
    LightningEffectComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, RouterModule.forRoot([])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
