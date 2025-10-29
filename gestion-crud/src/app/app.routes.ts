import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
	{
		path: 'list',
		loadComponent: () => import('./pages/list/list').then(m => m.List),
		resolve: { movies: () => import('./resolvers/movies.resolver').then(r => r.MoviesResolver) }
	},
		{ path: 'reserve/:id', loadComponent: () => import('./pages/reserve/reserve').then(m => m.Reserve) },
	{ path: 'form', loadComponent: () => import('./pages/form/form').then(m => m.Form) },
	{ path: 'form-edit/:id', loadComponent: () => import('./pages/form-edit/form-edit').then(m => m.FormEdit) },
	{ path: 'details/:id', loadComponent: () => import('./pages/details/details').then(m => m.Details) },
	{ path: '**', redirectTo: 'home' }
];
