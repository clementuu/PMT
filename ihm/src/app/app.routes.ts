import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { ProjectComponent } from './components/project/project.component';
import { TaskComponent } from './components/task/task.component';
import { ProjectNewComponent } from './components/project-new/project-new.component';
import { TaskNewComponent } from './components/task-new/task-new.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
    canActivate: [authGuard]
  },
  {
    path: 'project/:id/new-task',
    component: TaskNewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'new-project', // New route for creating a project
    component: ProjectNewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'task/:id', // New route for task details using TaskComponent
    component: TaskComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
