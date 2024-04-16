import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SkeletonizerSkeletonComponent } from '../../projects/skeletonizer/src/lib/skeletonizer.skeleton.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SkeletonizerSkeletonComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
