import { Injectable } from '@angular/core';
import { Direction, Limits, Photo } from '../models/photo.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    private apiUrl = "https://picsum.photos/v2/";
    private currentPage: number = 1;
    private _favoritesList$ = new BehaviorSubject<Photo[]>([]);
    favoritesList$ = this._favoritesList$.asObservable(); 
    limit = config.pageLimit;
    
    constructor(
        private http: HttpClient
    ) {
        this.getFavoritesFromSessionStorage()
    }

    fetchPhotos(direction: Direction, limits: Limits) {
        this.currentPage = Math.floor(direction === Direction.down ?
            limits.end ? (limits.end + 1)/config.pageLimit + 1: 1 :
            limits.start/config.pageLimit);

        if (this.currentPage <= 0) {
            return of([]);
        }

        return this.http.get<Photo[]>(
            `${this.apiUrl}list?page=${this.currentPage}&limit=${this.limit}`,
        ).pipe(
            delay(250)
        );
    }

    getFavoritesFromSessionStorage() {
        const favotitesPhotosFromStorage =  sessionStorage.getItem('favoritesImages');

        if (favotitesPhotosFromStorage) {
            this._favoritesList$.next(JSON.parse(favotitesPhotosFromStorage))
        }
    }

    addToFavorites(image: Photo) {
        const favoritesList = this._favoritesList$.getValue();
        const isAlreadyAdded = favoritesList.find(favImg => favImg.id === image.id);
        if(isAlreadyAdded) {
            return;
        }

        this._favoritesList$.next([...favoritesList, image]);
        this.persistDataInSessionStorage();
    }

    removeFromFavorites(image: Photo): Observable<boolean> {
        const favoritesList = this._favoritesList$.getValue();
        const index = favoritesList.indexOf(image);
        favoritesList.splice(index, 1)
        this._favoritesList$.next(favoritesList);
        this.persistDataInSessionStorage();
        return of(true);
    }

    getFavoriteImageById(id: string): Photo | undefined {
        const favoritesList = this._favoritesList$.getValue();
        const favoriteImage = favoritesList.find(favImg => favImg.id === id);

        return favoriteImage;
    }

    persistDataInSessionStorage(): void {
        sessionStorage.setItem('favoritesImages', JSON.stringify(this._favoritesList$.getValue()))
    }
}
