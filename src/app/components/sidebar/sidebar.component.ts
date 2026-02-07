import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { slideUp } from '../../composables/slideUp.js';
import { slideToggle } from '../../composables/slideToggle.js';
import { AppMenuService } from '../../service/app-menus.service';
import { AppSettings } from '../../service/app-settings.service';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent implements AfterViewChecked, OnInit, AfterViewInit {
  menus: any[] = [];
  usuario: any = {}; 
  userSubscription!: Subscription;

  @ViewChild('sidebarScrollbar', { static: false }) private sidebarScrollbar: ElementRef;
  @Output() appSidebarMinifiedToggled = new EventEmitter<boolean>();
  @Output() hideMobileSidebar = new EventEmitter<boolean>();
  @Output() setPageFloatSubMenu = new EventEmitter();
  @Output() appSidebarMobileToggled = new EventEmitter<boolean>();
  @Input() appSidebarTransparent;
  @Input() appSidebarGrid;
  @Input() appSidebarFixed;
  @Input() appSidebarMinified;

  appSidebarFloatSubMenu;
  appSidebarFloatSubMenuHide;
  appSidebarFloatSubMenuHideTime = 250;
  appSidebarFloatSubMenuTop;
  appSidebarFloatSubMenuLeft = '60px';
  appSidebarFloatSubMenuRight;
  appSidebarFloatSubMenuBottom;
  appSidebarFloatSubMenuArrowTop;
  appSidebarFloatSubMenuArrowBottom;
  appSidebarFloatSubMenuLineTop;
  appSidebarFloatSubMenuLineBottom;
  appSidebarFloatSubMenuOffset;

  mobileMode;
  desktopMode;
  scrollTop;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private eRef: ElementRef,
    public appSettings: AppSettings,
    private appMenuService: AppMenuService,
    private authService: AuthService,
    private router: Router
  ) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngOnInit() {
    this.userSubscription = this.authService.getUser().subscribe(usuario => {
      this.usuario = usuario;
  
      // Cargamos los menús y seteamos estado expand si corresponde
      const rawMenus = this.appMenuService.getAppMenus();
  
      this.menus = this.setInitialStates(rawMenus);
      
      console.log("📋 Menús cargados:", this.menus);
      console.log("¿Sidebar minificado?", this.appSettings.appSidebarMinified);
    });
  }
  
  private setInitialStates(menus: any[]): any[] {
    return menus.map(menu => {
      if (menu.caret || (menu.submenu && menu.submenu.length > 0)) {
        menu.state = 'collapse';
      }
  
      if (menu.submenu) {
        menu.submenu = this.setInitialStates(menu.submenu);
      }
  
      return menu;
    });
  }
  

  recursiveSetExpand(menus: any[]): any[] {
    return menus.map(menu => {
      const hasSubmenu = !!menu.submenu?.length;
      const expanded = menu.caret === true || hasSubmenu;
  
      return {
        ...menu,
        expanded,
        submenu: hasSubmenu ? this.recursiveSetExpand(menu.submenu) : undefined
      };
    });
  }

// Método para alternar submenús
toggleSubmenu(menu: any, event?: Event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Alternar el estado actual
  menu.state = (menu.state === 'expand') ? 'collapse' : 'expand';

  // Colapsar otros menús del mismo nivel
  this.menus.forEach(m => {
    if (m !== menu && m.submenu) {
      m.state = 'collapse';
    }
  });
}



// Método para expandir/colapsar submenús anidados
expandCollapseSubmenu(submenu: any, parentMenu: any[], event?: Event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  submenu.state = (submenu.state === 'expand') ? 'collapse' : 'expand';

  // Colapsar otros del mismo nivel
  parentMenu.forEach(m => {
    if (m !== submenu && m.submenu) {
      m.state = 'collapse';
    }
  });
}

  getMenuItemClass(url: string): string {
    return this.router.url === url ? 'active' : '';
  }

  getMenuItemClasses(menu: any): string {
    const classes = [];
    if (menu.submenu) classes.push('has-sub');
    if (menu.expanded) classes.push('expand');
    if (menu.state === 'collapsed') classes.push('closed');
    if (menu.hide) classes.push('d-none');
    return classes.join(' ');
  }

  toggleNavProfile(e) {
    e.preventDefault();
    const targetSidebar = <HTMLElement>document.querySelector('.app-sidebar:not(.app-sidebar-end)');
    const targetMenu = e.target.closest('.menu-profile');
    const targetProfile = <HTMLElement>document.querySelector('#appSidebarProfileMenu');
    const expandTime = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 250;

    if (targetProfile && targetProfile.style) {
      if (targetProfile.style.display === 'block') {
        targetMenu.classList.remove('active');
      } else {
        targetMenu.classList.add('active');
      }
      slideToggle(targetProfile, expandTime);
      targetProfile.classList.toggle('expand');
    }
  }

  toggleAppSidebarMinified() {
    this.appSidebarMinifiedToggled.emit(true);
    this.scrollTop = 40;
  }

  toggleAppSidebarMobile() {
    this.appSidebarMobileToggled.emit(true);
  }

  calculateAppSidebarFloatSubMenuPosition() {
    const targetTop = this.appSidebarFloatSubMenuOffset.top;
    const windowHeight = window.innerHeight;

    setTimeout(() => {
      const targetElm = <HTMLElement>document.querySelector('.app-sidebar-float-submenu-container');
      const targetSidebar = <HTMLElement>document.getElementById('sidebar');
      const targetHeight = targetElm.offsetHeight;
      this.appSidebarFloatSubMenuRight = 'auto';
      this.appSidebarFloatSubMenuLeft = (this.appSidebarFloatSubMenuOffset.width + targetSidebar.offsetLeft) + 'px';

      if ((windowHeight - targetTop) > targetHeight) {
        this.appSidebarFloatSubMenuTop = this.appSidebarFloatSubMenuOffset.top + 'px';
        this.appSidebarFloatSubMenuBottom = 'auto';
        this.appSidebarFloatSubMenuArrowTop = '20px';
        this.appSidebarFloatSubMenuArrowBottom = 'auto';
        this.appSidebarFloatSubMenuLineTop = '20px';
        this.appSidebarFloatSubMenuLineBottom = 'auto';
      } else {
        this.appSidebarFloatSubMenuTop = 'auto';
        this.appSidebarFloatSubMenuBottom = '0';
        const arrowBottom = (windowHeight - targetTop) - 21;
        this.appSidebarFloatSubMenuArrowTop = 'auto';
        this.appSidebarFloatSubMenuArrowBottom = arrowBottom + 'px';
        this.appSidebarFloatSubMenuLineTop = '20px';
        this.appSidebarFloatSubMenuLineBottom = arrowBottom + 'px';
      }
    }, 0);
  }

  showAppSidebarFloatSubMenu(menu, e) {
    if (this.appSettings.appSidebarMinified) {
      clearTimeout(this.appSidebarFloatSubMenuHide);
      this.appSidebarFloatSubMenu = menu;
      this.appSidebarFloatSubMenuOffset = e.target.getBoundingClientRect();
      this.calculateAppSidebarFloatSubMenuPosition();
    }
  }

  hideAppSidebarFloatSubMenu() {
    this.appSidebarFloatSubMenuHide = setTimeout(() => {
      this.appSidebarFloatSubMenu = '';
    }, this.appSidebarFloatSubMenuHideTime);
  }

  remainAppSidebarFloatSubMenu() {
    clearTimeout(this.appSidebarFloatSubMenuHide);
  }

  appSidebarSearch(e: any) {
    // No changes
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrollTop = (this.appSettings.appSidebarMinified) ? event.srcElement.scrollTop + 40 : 0;
    if (typeof(Storage) !== 'undefined') {
      localStorage.setItem('sidebarScroll', event.srcElement.scrollTop);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewChecked() {
    if (typeof(Storage) !== 'undefined' && localStorage.sidebarScroll) {
      if (this.sidebarScrollbar && this.sidebarScrollbar.nativeElement) {
        this.sidebarScrollbar.nativeElement.scrollTop = localStorage.sidebarScroll;
      }
    }
  }

  ngAfterViewInit() {
    // Sin cambios aquí
  }
}

