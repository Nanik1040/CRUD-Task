import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const tasksModule = () =>
  import('./tasks/tasks.module').then((x) => x.TasksModule);

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', loadChildren: tasksModule },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
