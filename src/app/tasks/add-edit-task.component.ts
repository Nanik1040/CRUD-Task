import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';

import { TaskService, AlertService } from '../_services';
// import { MustMatch } from '../_helpers';

@Component({ templateUrl: 'add-edit-task.component.html' })
export class AddEditTaskComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isAddMode!: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    const formOptions: AbstractControlOptions = {};
    this.form = this.formBuilder.group(
      {
        title: ['', Validators.required],
        description: ['', Validators.required],
        status: ['', Validators.required],
      },
      formOptions
    );

    if (!this.isAddMode) {
      this.taskService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => this.form.patchValue(x));
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createTask();
    } else {
      this.updateTask();
    }
  }

  private createTask() {
    this.taskService
      .create(this.form.value)
      .pipe(first())
      .subscribe(() => {
        this.alertService.success('Task added', { keepAfterRouteChange: true });
        this.router.navigate(['../'], { relativeTo: this.route });
      })
      .add(() => (this.loading = false));
  }

  private updateTask() {
    this.taskService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe(() => {
        this.alertService.success('Task updated', {
          keepAfterRouteChange: true,
        });
        this.router.navigate(['../../'], { relativeTo: this.route });
      })
      .add(() => (this.loading = false));
  }
}
