import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((ref) => {
    const ngRef = (window as any)['ngRef'] as
      | { destroy: () => void }
      | undefined;
    if (ngRef) {
      ngRef.destroy();
    }
    (window as any)['ngRef'] = ref;
  })
  .catch((err) => console.error(err));
