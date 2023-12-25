import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { LayoutComponent } from './layout.component';
import { TaskListComponent } from './task-list.component';
import { AddEditTaskComponent } from './add-edit-task.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TasksRoutingModule],
  declarations: [LayoutComponent, TaskListComponent, AddEditTaskComponent],
})
export class TasksModule {}
