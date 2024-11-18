import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingComponent } from './listing.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgFor } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PhotosService } from 'src/app/services/photos.service';
import { getPhotosListMock } from 'src/app/mocks/getPhotosListMock.mock';
import { Observable, of } from 'rxjs';
import { Direction, Limits, Photo } from 'src/app/models/photo.model';

describe('ListingComponent', () => {
    let component: ListingComponent;
    let fixture: ComponentFixture<ListingComponent>;
    let photosService: PhotosService;
    let fetchPhotosSpy: jasmine.Spy<(direction: Direction, limits: Limits) => Observable<Photo[]>>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ListingComponent,
                NgFor,
                NoopAnimationsModule
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
        .compileComponents();
        
        photosService = TestBed.inject(PhotosService);
        fetchPhotosSpy = spyOn(photosService, 'fetchPhotos').and.returnValues(
            of(getPhotosListMock)
        );
        fixture = TestBed.createComponent(ListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a method that adds photos to favorites and notify user about it', () => {
        const addToFavoritesSpy = spyOn(photosService, 'addToFavorites');
        const snackBarOpenSpy = spyOn(component.snackBarRef, 'open');
        const imagesLinksElements = fixture.nativeElement.querySelectorAll('[data-test="image-cta"]');
        imagesLinksElements[0].click();

        expect(addToFavoritesSpy).toHaveBeenCalled();
        expect(snackBarOpenSpy).toHaveBeenCalledWith('The image was added to favorites', '', {
            duration: 1000
        });
    });
});
