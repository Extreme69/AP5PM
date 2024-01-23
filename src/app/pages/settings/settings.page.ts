import { Component, AfterViewInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements AfterViewInit {
  isDarkMode: boolean;

  constructor(
    private themeService: ThemeService,
    private toastController: ToastController
  ) {
    this.isDarkMode = this.themeService.getCurrentTheme() === 'dark';
  }

  ngAfterViewInit() {
    // Apply the current theme immediately after the view has been initialized
    this.themeService.setTheme(this.isDarkMode ? 'dark' : 'light');
  }

  /** Changes between light/dark theme.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }

  /** Removes all the watched animes and displays a notification.
   */
  async removeFavorites(): Promise<void> {
    // Clear all favorites
    const favorites: any[] = [];
  
    // Save the cleaned favorites back to local storage (which is now an empty array)
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Display a toast notification
    const toast = await this.toastController.create({
      header: 'Watched animes have been removed!',
      duration: 2000, 
      position: 'bottom', 
      color: 'success', 
      cssClass: 'fade-out-toast',
    });

    toast.present();
  }  
}
