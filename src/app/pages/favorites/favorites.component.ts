import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from 'src/app/models/photo.model';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [AsyncPipe, NgFor, RouterLink],
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
    favoritesList$: Observable<Photo[]> = this.photosService.favoritesList$;

    constructor(
        private photosService: PhotosService
    ) {}
}
