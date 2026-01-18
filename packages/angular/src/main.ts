import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(
  AppComponent,
)
  .catch((err: Error) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
