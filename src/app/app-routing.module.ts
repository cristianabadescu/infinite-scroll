import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
    },
    {
        path: 'list',
        loadComponent: () => import('./pages/listing/listing.component').then(m => m.ListingComponent),
    },
    {
        path: 'favorites',
        loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent),
    },
    {
        path: 'favorites/:id',
        loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
