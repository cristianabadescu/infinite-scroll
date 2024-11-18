import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            AppRoutingModule
        ),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
