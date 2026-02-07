// Core Module
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule }               from '@angular/platform-browser/animations';
import { BrowserModule, Title }                  from '@angular/platform-browser';
import { HttpClientModule }                      from '@angular/common/http';
import { AppRoutingModule }                      from './app-routing.module';
import { NgModule }                              from '@angular/core';
import { FormsModule, ReactiveFormsModule }      from '@angular/forms';
// import { FormsModule }      from './shared/forms/forms.module';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


// Main Component
import { AppComponent }                    from './app.component';
import { HeaderComponent }                 from './components/header/header.component';
import { SidebarComponent }                from './components/sidebar/sidebar.component';
import { SidebarRightComponent }           from './components/sidebar-right/sidebar-right.component';
import { TopMenuComponent }                from './components/top-menu/top-menu.component';
import { PanelComponent }                  from './components/panel/panel.component';
import { FloatSubMenuComponent }           from './components/float-sub-menu/float-sub-menu.component';
import { ThemePanelComponent }             from './components/theme-panel/theme-panel.component';

// Component Module
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

// Pages
import { HomePage }          from './pages/home/home';
import { DucaRgComponent }   from './pages/duca/duca-rg/duca-rg.component';
import {EmpresasComponent }   from './pages/admin/empresas/empresas.component';
// Error
import { ErrorPage }          from './pages/error/error';
import { LoginPage } from './pages/login/login';
import { ModalModule } from 'ngx-bootstrap/modal';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UsuarioComponent } from './pages/admin/empresas/usuarios/usuarios.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarRightComponent,
    TopMenuComponent,
    PanelComponent,
    FloatSubMenuComponent,
    ThemePanelComponent,
    DucaRgComponent, // Debe estar aquí
EmpresasComponent,
    UsuarioComponent,
    HomePage,
    LoginPage,
    ErrorPage
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  providers: [ Title, {
		provide: NG_SCROLLBAR_OPTIONS,
		useValue: {
			visibility: 'hover'
		}
  }, provideAnimationsAsync()],
  bootstrap: [ AppComponent ]
})

export class AppModule {
  constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        var title = 'SIGA | ' + this.route.snapshot.firstChild.data['title'];
        this.titleService.setTitle(title);
      }
    });
  }
}
