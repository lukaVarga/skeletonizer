import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: Error) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
