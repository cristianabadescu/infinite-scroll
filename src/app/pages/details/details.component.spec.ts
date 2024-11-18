import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PhotosService } from 'src/app/services/photos.service';
import { getPhotosListMock } from 'src/app/mocks/getPhotosListMock.mock';
import { Photo } from 'src/app/models/photo.model';
import { of } from 'rxjs';

describe('DetailsComponent', () => {
    const imageId = '1';
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    let photosService: PhotosService;
    let getFavoriteImageByIdSpy: jasmine.Spy<(id: string) => Photo | undefined>;
    let router: Router;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetailsComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({
                                id: imageId,
                            })
                        }
                    }
                }
            ]
        })
        .compileComponents();
        
        photosService = TestBed.inject(PhotosService);
        router = TestBed.inject(Router);
        getFavoriteImageByIdSpy = spyOn(photosService, 'getFavoriteImageById').and.returnValue(getPhotosListMock[1])
        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getFavoriteImageById with the param from url', () => {
        expect(getFavoriteImageByIdSpy).toHaveBeenCalledWith(imageId);
    })

    it('should call removeFromFavorites from photosService and redirect the user to favoites page at remove button click', () => {
        const removeFromFavoritesSpy = spyOn(photosService, 'removeFromFavorites').and.returnValue(of(true));
        const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
        const removeButtonElement =  fixture.nativeElement.querySelector('[data-test="remove-button"]');
        removeButtonElement.click();

        expect(removeFromFavoritesSpy).toHaveBeenCalledOnceWith(getPhotosListMock[1]);
        expect(navigateByUrlSpy).toHaveBeenCalledOnceWith('/favorites');
    })
});
