import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { TaskListComponent } from './task-list.component';
import { AddEditTaskComponent } from './add-edit-task.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: TaskListComponent },
      { path: 'add', component: AddEditTaskComponent },
      { path: 'edit/:id', component: AddEditTaskComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
