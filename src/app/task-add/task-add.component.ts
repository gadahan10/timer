import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { LogicService } from '../logic.service';
import { debounceTime, distinctUntilChanged, first, map, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss'],
})
export class TaskAddComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private service: LogicService, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({
      text: [
        null,
        Validators.compose([Validators.required, Validators.minLength(2)]),
        this.validateNameExists.bind(this),
      ],
    });
  }
  
  submitHandler(text: string) {   
    this.service.addTask(text.toUpperCase());
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
  }

  validateNameExists(control: AbstractControl) {
    const name = control.value.toUpperCase();
   
    return this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(() => this.service.nameExists(name).pipe(take(1))),
      tap(() => this.cdr.markForCheck()),
      map((nameExists: boolean) => nameExists ? { nameTaken: true } : null)
    ).pipe(first())
    
  }
}
