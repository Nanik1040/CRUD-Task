import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { TaskService } from '../_services';
import { Task } from '../_models';

@Component({ templateUrl: 'task-list.component.html' })
export class TaskListComponent implements OnInit {
  tasks!: Task[];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService
      .getAll()
      .pipe(first())
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }

  deleteTask(id: number) {
    const task = this.tasks.find((x) => x.id === id);
    if (!task) return;
    task.isDeleting = true;
    this.taskService
      .delete(id)
      .pipe(first())
      .subscribe(() => (this.tasks = this.tasks.filter((x) => x.id !== id)));
  }
}
