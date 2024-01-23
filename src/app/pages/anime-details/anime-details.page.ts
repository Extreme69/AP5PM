import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from 'src/app/services/anime.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.page.html',
  styleUrls: ['./anime-details.page.scss'],
})
export class AnimeDetailsPage implements OnInit {

  anime: any = null;
  animeId: string | null = null;

  // Flags to control the visibility of the synopsis and background sections
  showSynopsis = false;
  showBackground = false;

  constructor(private route: ActivatedRoute, private animeService: AnimeService, private loadingCtrl: LoadingController) { }

    /**
   * Initializes the component.
   * Performs the following tasks:
   *   1. Displays a loading spinner while fetching anime details.
   *   2. Retrieves the anime ID from the route parameters.
   *   3. Calls the animeService to get detailed information about the anime.
   *   4. Logs the retrieved anime data to the console.
   *   5. Dismisses the loading spinner when data retrieval is complete.
   */
  async ngOnInit() {
    //Start loading
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.animeId = this.route.snapshot.paramMap.get('id');

    if (this.animeId !== null) {
      this.animeService.getAnimeDetails(this.animeId).subscribe(res => {
        this.anime = res;
        console.log(this.anime);
      });
    }

    //End the loading
    loading.dismiss();
  }

  /**
   * Checks if the current anime is marked as a favorite.
   *
   * Returns boolean - True if the anime is a favorite, false otherwise.
   */
  isFavorite(): boolean {
    const favoritesString = localStorage.getItem('favorites') as string | null;
    const favorites: any[] = favoritesString ? JSON.parse(favoritesString) : [];
    return favorites.some((fav: any) => fav.id === this.animeId);
  }


  /**
   * Toggles the favorite status of the current anime.
   * If the anime is already a favorite, it is removed from the favorites list.
   * If it's not a favorite, it is added to the favorites list.
   */
  toggleFavorite(): void {
    const favoritesString: string | null = localStorage.getItem('favorites');
    const favorites: any[] = favoritesString ? JSON.parse(favoritesString) : [];

    const index = favorites.findIndex((fav: any) => fav.id === this.animeId);

    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ id: this.animeId, ...this.anime?.data });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  /** Redirects to homePage.
  */
  openHomepage() {
    window.open(this.anime?.data?.url, '_blank');
  }

  /** Toggle the visibility of the synopsis section.
  */
  toggleSynopsis() {
    this.showSynopsis = !this.showSynopsis;
    this.showBackground = false;
  }

  /** Toggle the visibility of the background section.
  */
  toggleBackground() {
    this.showBackground = !this.showBackground;
    this.showSynopsis = false;
  }
}
