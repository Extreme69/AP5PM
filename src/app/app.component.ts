import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menuController: MenuController, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.setTheme(this.themeService.getCurrentTheme());
  }

  /** Method to close the menu.*/ 
  closeMenu() {
    this.menuController.close();
  }
}
