import { Status } from './status';

export class Task {
  id!: number;
  title!: string;
  description!: string;
  status!: Status;
  isDeleting: boolean = false;
}
