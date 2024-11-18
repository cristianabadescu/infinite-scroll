import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink, RouterLinkActive, provideRouter } from '@angular/router';

describe('AppComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [AppComponent, MatButtonModule, RouterOutlet, RouterLink, RouterLinkActive],
        providers: [provideRouter([])],
    }));
    
    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
