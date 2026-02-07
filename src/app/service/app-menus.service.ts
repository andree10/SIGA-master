import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppMenuService {
	getAppMenus() {
		return [
		  {
			'icon': 'fa fa-home',
			'title': 'Inicio',
			'url': '/home'
		  },
		  {
			'icon': 'fa fa-folder',
			'title': 'DUCA',
			'caret': true,
			'submenu': [
			  { 'url': '/duca-rg', 'title': 'Registro' },
			  { 'url': '/duca/rectificacion', 'title': 'Rectificación' },
			  { 'url': '/duca/consulta', 'title': 'Consulta' }
			]
		  },
		  {
			'icon': 'fa fa-user',
			'title': 'Administración',
			'caret': true,
			'submenu': [
			  { 'url': '/empresas', 'title': 'Empresas' },
			  { 'url': '/usuarios', 'title': 'Usuarios' },
			  { 'url': '/roles', 'title': 'Roles' }
			]
		  },
		  {
			'icon': 'fa fa-sitemap',
			'title': 'Menú Anidado',
			'caret': true,
			'submenu': [
			  {
				'url': '/menu/1',
				'title': 'Nivel 1.1',
				'caret': true,
				'submenu': [
				  {
					'url': '/menu/1/1',
					'title': 'Nivel 2.1',
					'caret': true,
					'submenu': [
					  { 'url': '/menu/1/1/1', 'title': 'Nivel 3.1' },
					  { 'url': '/menu/1/1/2', 'title': 'Nivel 3.2' }
					]
				  },
				  { 'url': '/menu/1/2', 'title': 'Nivel 2.2' }
				]
			  },
			  { 'url': '/menu/2', 'title': 'Nivel 1.2' }
			]
		  }
		];
	  }
}