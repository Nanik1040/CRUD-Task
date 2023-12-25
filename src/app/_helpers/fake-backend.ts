import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { Status } from '../_models';

// array in local storage for  tasks
const tasksKey = 'angular-11-crud-example-tasks';
const tasksJSON = localStorage.getItem(tasksKey);
let tasks: any[] = tasksJSON
  ? JSON.parse(tasksJSON)
  : [
      {
        id: 1,
        title: 'User Story 1',
        description: 'Create a Home Page',
        status: Status.Pending,
      },
    ];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/tasks') && method === 'GET':
          return getTasks();
        case url.match(/\/tasks\/\d+$/) && method === 'GET':
          return getTaskById();
        case url.endsWith('/tasks') && method === 'POST':
          return createTask();
        case url.match(/\/tasks\/\d+$/) && method === 'PUT':
          return updateTask();
        case url.match(/\/tasks\/\d+$/) && method === 'DELETE':
          return deleteTask();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getTasks() {
      return ok(tasks.map((x) => basicDetails(x)));
    }

    function getTaskById() {
      const task = tasks.find((x) => x.id === idFromUrl());
      return ok(basicDetails(task));
    }

    function createTask() {
      const task = body;

      // assign task id and a few other properties then save
      task.id = newTaskId();
      tasks.push(task);
      localStorage.setItem(tasksKey, JSON.stringify(tasks));

      return ok();
    }

    function updateTask() {
      let params = body;
      let task = tasks.find((x) => x.id === idFromUrl());

      // update and save task
      Object.assign(task, params);
      localStorage.setItem(tasksKey, JSON.stringify(tasks));

      return ok();
    }

    function deleteTask() {
      tasks = tasks.filter((x) => x.id !== idFromUrl());
      localStorage.setItem(tasksKey, JSON.stringify(tasks));
      return ok();
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: any) {
      return throwError({ error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function basicDetails(task: any) {
      const { id, title, description, status } = task;
      return { id, title, description, status };
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function newTaskId() {
      return tasks.length ? Math.max(...tasks.map((x) => x.id)) + 1 : 1;
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
