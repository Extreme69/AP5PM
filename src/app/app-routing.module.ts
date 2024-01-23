import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'animes',
    pathMatch: 'full'
  },
  {
    path: 'animes',
    loadChildren: () => import('./pages/animes/animes.module').then( m => m.AnimesPageModule)
  },
  {
    path: 'animes/:id',
    loadChildren: () => import('./pages/anime-details/anime-details.module').then( m => m.AnimeDetailsPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
