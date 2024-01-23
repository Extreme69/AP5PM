import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';

  /** 
   * Retrieves the current theme from local storage or defaults to 'light' if not set.
   * @returns {string} The current theme ('light' or 'dark').
   */
  getCurrentTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  /** 
   * Sets the theme in local storage and applies it to the document body.
   * @param {string} theme - The theme to set ('light' or 'dark').
   */
  setTheme(theme: string): void {
    // Uncomment the line below to log theme changes for debugging purposes.
    // console.log(`Setting theme to ${theme}`);
    
    localStorage.setItem(this.THEME_KEY, theme);
    document.body.classList.toggle('dark', theme === 'dark');
  }
  
  /** 
   * Toggles between 'light' and 'dark' themes by calling setTheme with the opposite theme.
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}
