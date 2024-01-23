import { Component } from '@angular/core';
import { AnimeService } from 'src/app/services/anime.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  favorites: any[] = [];
  totalWatchedHours = 0;

  constructor(private animeService: AnimeService, private loadingCtrl: LoadingController) {
  }

  /**
 * Lifecycle hook called just before the component view is about to be entered.
 * Performs the following tasks:
 *   1. Displays a loading spinner while initializing the view.
 *   2. Calls the loadFavorites method to fetch and update favorite anime data.
 *   3. Calls the calculateTotalWatchedHours method to calculate and update total watched hours.
 *   4. Dismisses the loading spinner when initialization is complete.
 */
  async ionViewWillEnter() {
    //Start loading
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.loadFavorites();
    this.calculateTotalWatchedHours();

    //End the loading
    loading.dismiss();
  }

  /** Function loads all the animes from local storage.
   */
  loadFavorites(): void {
    const favoritesString = localStorage.getItem('favorites') as string | null;
    this.favorites = favoritesString ? JSON.parse(favoritesString) : [];
  }

  /** In the API there are some animes that dont have an english title so 
  * if it doesn't have one, get the japanese one or say 'Unknown title'
  */
  getAnimeTitle(anime: any): string {
    if (anime.titles && anime.titles.length > 0 && anime.titles[0].title) {
      return anime.titles[0].title;
    } else if (anime.title) {
      return anime.title;
    } else {
      return 'Unknown Title';
    }
  }

  /** Find the anime by its id and remove it from favorite animes from local storage,
   * and calls the this.loadFavorites() funtion.
  */
  removeFromFavorites(favorite: any): void {
    const favoritesString: string | null = localStorage.getItem('favorites');
    let favorites: any[] = favoritesString ? JSON.parse(favoritesString) : [];

    // Find the index of the anime in the favorites array
    const index = favorites.findIndex((fav) => fav.id === favorite.id);

    // If found, remove it from the array
    if (index !== -1) {
      favorites.splice(index, 1);

      // Save the updated favorites back to local storage
      localStorage.setItem('favorites', JSON.stringify(favorites));

      //console.log(`${this.getAnimeTitle(favorite)} removed from favorites.`);

      this.loadFavorites();
      this.calculateTotalWatchedHours();
    } else {
      console.log(`${this.getAnimeTitle(favorite)} not found in favorites.`);
    }
  }

  /** Calculate the total watched hours based on the duration and number of episodes of each favorite anime.
   * If an anime is missing episodes or duration, the anime will be skipped and no more time will be added to the 
   * final time.
  */
  calculateTotalWatchedHours(): void {
    this.totalWatchedHours = this.favorites.reduce((totalHours, favorite) => {

      // Ensure both episodes and duration are available
      if (favorite.episodes && favorite.duration) {

        // Extract the numeric value from the duration string
        const durationMatch = favorite.duration.match(/(\d+)/);

        // Check if there is a match and it is a valid number
        if (durationMatch && !isNaN(Number(durationMatch[0]))) {

          // Calculate the total hours for each anime and accumulate
          totalHours += (favorite.episodes * Number(durationMatch[0])) / 60; // Convert minutes to hours
        }
      }
      return totalHours;
    }, 0);

    // Round the total watched hours to two decimal places
    this.totalWatchedHours = parseFloat(this.totalWatchedHours.toFixed(2));
  }
}
