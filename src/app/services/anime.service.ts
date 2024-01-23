import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResult {
  current_page: number;
  data: any[]; // All the animes
  last_visible_page: number; // All the pages
  total: number; // Total animes
}

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  constructor(private http: HttpClient) { }

  /** Gets the anime details of an anime by calling /anime/${mal_id}.
   */
  getAnimeDetails(mal_id: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/anime/${mal_id}`);
  }

  /** Gets all the animes with name by calling /anime?q=${name}&order_by=title&page=${page}.
   * If the name is '' -> gets all the animes by their score by calling /top/anime${page}.
   */
  getAnimeByName(name: string, page = 1): Observable<any> {
    if (name === '') {
      return this.http.get(`${environment.baseUrl}/top/anime?page=${page}`);
    } else {
      return this.http.get(`${environment.baseUrl}/anime?q=${name}&order_by=title&page=${page}`);
    }
  }
  /** Gets a random anime.*/
  getRandomAnime(){
    return this.http.get(`${environment.baseUrl}/random/anime`);
  }
}