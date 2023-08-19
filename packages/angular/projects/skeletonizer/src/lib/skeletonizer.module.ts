import { NgModule } from '@angular/core';
import { SkeletonizerSkeletonComponent } from './skeletonizer.skeleton.component';
import { SkeletonizeDirective } from './skeletonize.directive';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    SkeletonizerSkeletonComponent,
    SkeletonizeDirective,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    SkeletonizerSkeletonComponent,
  ],
})
export class SkeletonizerModule { }
