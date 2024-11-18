import { NgFor } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { config } from 'src/app/config';
import { Direction, Photo } from 'src/app/models/photo.model';
import { PhotosService } from 'src/app/services/photos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-listing',
    standalone: true,
    imports: [NgFor],
    templateUrl: './listing.component.html',
    styleUrl: './listing.component.scss'
})
export class ListingComponent implements OnInit {
    images: Photo[] = [];
    isLoading = false;
    snackBarRef = this.snackBar;
    
    constructor(
        private photosService: PhotosService,
        private snackBar : MatSnackBar
    ) {}
    
    @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
        if (this.isLoading) return;

        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const pos = scrollTop + document.documentElement.offsetHeight;
        const max = document.documentElement.scrollHeight;

        if(Math.ceil(pos) == max )   {
            this.getPhotos(Direction.down)
        }
        if(scrollTop === 0) {
            this.getPhotos(Direction.up)
        }
    }
    
    ngOnInit(): void {
        this.getPhotos(Direction.down)
    }

    addToFavorites(image: Photo) {
        this.photosService.addToFavorites(image);
        this.snackBarRef.open('The image was added to favorites', '', {
            duration: 1000,
        });
    }
    
    getPhotos(direction: Direction): void {
        if (this.isLoading) {
            return
        }

        this.isLoading = true;
        this.snackBarRef.open('Loading more images. Hold on 😊');

        const limits = {
            start: Number(this.images[0]?.id) | 0,
            end: Number(this.images[this.images.length - 1]?.id) | 0
        }

        this.photosService.fetchPhotos(direction, limits).subscribe((images) => {
            if (this.images.length < config.pageLimit * 2) {
                this.images.push(...images);
            }
            else if (direction === Direction.down) {
                this.images.splice(0, config.pageLimit)
                this.images.push(...images);
            } else {
                this.images.splice(config.pageLimit, config.pageLimit);
                this.images.unshift(...images);

                document.documentElement.scrollTop = 1;
            }

            this.isLoading = false;
            this.snackBarRef.dismiss()
        });
    }
}
