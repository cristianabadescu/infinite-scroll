import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/models/photo.model';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [NgIf, MatButtonModule],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    private photosService = inject(PhotosService);
    private route = inject(ActivatedRoute);
    private router = inject(Router)
    image!: Photo | undefined;
    
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id'); // Get the route parameter
        if (id) {
            this.image = this.photosService.getFavoriteImageById(id)
        }
    }

    removeFromFavorites() {
        if (this.image) {
            this.photosService.removeFromFavorites(this.image).subscribe(result => {
                if (result) {
                    this.router.navigateByUrl('/favorites')
                }
            })
        }
    }
}
