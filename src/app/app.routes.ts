import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'homepage', loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: '', loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'channel/:id', loadComponent: () => import('./channel/channel.page').then(m => m.ChannelPage)
  },
  {
    path: 'register', loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'playlist',
    loadComponent: () => import('./playlist/playlist.page').then(m => m.PlaylistPage)
  },
  {
    path: 'channel-view',
    loadComponent: () => import('./channel-view/channel-view.page').then(m => m.ChannelViewPage)
  },
  {
    path: 'group/:id',
    loadComponent: () => import('./group/group.page').then( m => m.GroupPage)
  },

];
