import { TestBed, waitForAsync } from '@angular/core/testing';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PhotosService } from './photos.service';
import { provideHttpClient } from '@angular/common/http';
import { Direction } from '../models/photo.model';
import { getPhotosListMock } from '../mocks/getPhotosListMock.mock';

describe('PhotosService', () => {
    let service: PhotosService;
    let httpTestingController: HttpTestingController;
    const fakeStore: { [x: string]: string; } = {};
    
    const fakeStorage = {
        getItem: (key: string): string | null => {
            return key in fakeStore ? fakeStore[key] : null;
        },
        setItem: (key: string, value: string) => {
            fakeStore[key] = `${value}`;
        },
    };
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(PhotosService)
        httpTestingController = TestBed.inject(HttpTestingController);
    });
    
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    
    it('should have a method fetchPhotos that get the images from server', waitForAsync(() => {
        service.fetchPhotos(Direction.down).subscribe((data) => {
            expect(data).toEqual(getPhotosListMock);
        });
        
        const req = httpTestingController.expectOne('https://picsum.photos/v2/list?page=1&limit=9');
        expect(req.request.method).toBe('GET');
        req.flush(getPhotosListMock);
        httpTestingController.verify();
    }));
    
    it('should return empty array if current page is less or egual with 0', () => {
        service.fetchPhotos(Direction.up).subscribe((data) => {
            expect(data).toEqual([]);
        });
    })
    
    it('should have a method getFavoritesFromSessionStorage that get the photos from session storage', () => {
        const getItemSpy = spyOn(window.sessionStorage, 'getItem').and.callFake(fakeStorage.getItem);
        service.getFavoritesFromSessionStorage();
        
        expect(getItemSpy).toHaveBeenCalledWith('favoritesImages');
    });
    
    it('should have a method that remove photos to favorites and update the session storage', waitForAsync(() => {
        const setItemSpy = spyOn(window.sessionStorage, 'setItem').and.callFake(fakeStorage.setItem);
        service.removeFromFavorites(getPhotosListMock[1]);
        
        service.favoritesList$.subscribe(r => {
            expect(r).toEqual([]);
        });
        expect(setItemSpy).toHaveBeenCalledTimes(1);
    }));
    
    it('should have a method that add photos to favorites and update the session storage', waitForAsync(() => {
        const setItemSpy = spyOn(window.sessionStorage, 'setItem').and.callFake(fakeStorage.setItem);
        service.addToFavorites(getPhotosListMock[0]);
        
        service.favoritesList$.subscribe(r => {
            expect(r).toEqual([getPhotosListMock[0]]);
        });
        expect(setItemSpy).toHaveBeenCalled();
    }));
    
    it('should have a method that return the favorite photo by id', () => {
        service.addToFavorites(getPhotosListMock[0]);
        const result = service.getFavoriteImageById(getPhotosListMock[0].id);
        
        expect(result).toEqual(getPhotosListMock[0])
    });
});
