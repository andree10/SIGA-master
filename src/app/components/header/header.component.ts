import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { AppSettings } from '../../service/app-settings.service';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";

declare var slideToggle: any;

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {
  @Input() appSidebarTwo;
	@Output() appSidebarEndToggled = new EventEmitter<boolean>();
	@Output() appSidebarMobileToggled = new EventEmitter<boolean>();
	@Output() appSidebarEndMobileToggled = new EventEmitter<boolean>();
	@Output() appSidebarMinifiedToggled = new EventEmitter<boolean>();

	
	usuario: any = {};
	userSubscription!: Subscription;
  
	constructor(
	  private renderer: Renderer2, 
	  public appSettings: AppSettings,
	  private authService: AuthService,
	  private router: Router
	) {
	  this.userSubscription = this.authService.getUser().subscribe(usuario => {
		  console.log("Usuario recibido en HeaderComponent:", usuario);
		
		  if (usuario) {
			this.usuario = usuario;
		  }
		});
	}
	
  toggleAppSidebarMobile() {
		this.appSidebarMobileToggled.emit(true);
  }
  
	toggleAppSidebarEnd() {
		this.appSidebarEndToggled.emit(true);
	}
	
  toggleAppSidebarEndMobile() {
		this.appSidebarEndMobileToggled.emit(true);
  }

	toggleAppTopMenuMobile() {
		var target = document.querySelector('.app-top-menu');
		if (target) {
			slideToggle(target);
		}
	}

	toggleAppHeaderMegaMenuMobile() {
	  this.appSettings.appHeaderMegaMenuMobileToggled = !this.appSettings.appHeaderMegaMenuMobileToggled;
	}

	toggleAppSidebarMinified() {
		this.appSidebarMinifiedToggled.emit(true);
	}

	logout() {
		this.authService.logout(); // Elimina el token de autenticación
		this.router.navigate(['/inicio']); // Redirige a la página de inicio de sesión
	}

	ngOnDestroy() {
	  this.appSettings.appHeaderMegaMenuMobileToggled = false;
	}


}
