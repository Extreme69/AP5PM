import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonMenu, LoadingController } from '@ionic/angular';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.page.html',
  styleUrls: ['./animes.page.scss'],
})
export class AnimesPage implements OnInit {

  @ViewChild(IonMenu) menu!: IonMenu;  // ViewChild to access the menu

  animes: any[] = [];
  currentPage = 1;
  searchTerm = '';
  oldSearchTerm = '';
  randomAnimeId!: number;

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    this.loadAnimes();
  }

  ionViewWillEnter() {
    this.getRandomAnimeId();
  }

  /** Function to loadAnimes on the page. If the oldSearchTerm is different than searchTerm -> 
   * the user has inputed a new search -> reset currentPage and animes.
   * Than search for the anime with the name (If name is null, it calls all the animes by alphabetical order)
   * and set the oldSearchTerm to the new searchTerm. End the infiniteScrollCustomEvent if we are at the end of a page.
  */
  async loadAnimes(event?: InfiniteScrollCustomEvent) {
    if (this.oldSearchTerm !== this.searchTerm) {
      this.currentPage = 1;
      this.animes = [];
    }

    //Search for anime with the name
    this.animeService.getAnimeByName(this.searchTerm, this.currentPage).subscribe(
      (res: any) => {
        this.animes.push(...res.data);
        console.log(res);

        this.oldSearchTerm = this.searchTerm;

        //End the infiniteScrollCustomEvent
        event?.target.complete();
        if (event) {
          event.target.disabled = res.last_visible_page === this.currentPage;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  /** Function for the infiniteScrollEvent. This increases the currentPage.
  */
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadAnimes(event);
  }

  /** Call this when user searches something.
   * It saves the searchTerm and calls the loadAnimes function.
   */
  async handleSearch(event?: any) {
    this.searchTerm = event.target.value;
    this.loadAnimes();
  }

  /** In the API there are some animes that dont have an english title so 
 * if it doesn't have one, get the japanese one or say 'Unknown title'.
 */
  getAnimeTitle(anime: any): string {
    // Check if titles are defined and have at least one element
    if (anime.titles && anime.titles.length > 0) {
      return anime.titles[0].title;
    } else {
      // Handle the case when titles are undefined or empty
      return 'Unknown Title';
    }
  }

  /** Open the menu when the button is clicked.
   */
  openMenu(): void {
    this.menu.open();
  }

  /**
   * Get the color for the anime score based on a scoring range.
   * @param score - The anime score.
   * @returns {string} - The color for the score.
   */
  getScoreColor(score: number | null): string {
    if (score === null) {
      return 'gray';
    } else if (score >= 7) {
      return 'green';
    } else if (score >= 4) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  /**
   * Fetch a random anime ID and store it in the component property. 
   * This gets called everytime we enter this view.
   */
  getRandomAnimeId(){
    this.animeService.getRandomAnime().subscribe(
      (res: any) => {
        this.randomAnimeId = res.data.mal_id;
      });
  }
}
