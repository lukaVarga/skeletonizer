import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SkeletonizerModule } from '@skeletonizer/angular';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SkeletonizerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
