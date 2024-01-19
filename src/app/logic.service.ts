import { Injectable } from '@angular/core';
import { TaskModel } from './models/task-model';
import { Observable, combineLatest, of } from 'rxjs';
import { TaskFactoryService } from './task-factory.service';
import { map, switchMap } from 'rxjs/operators';
import { CloneSubject } from './clone-subject';
import { Store } from '@ngrx/store';
import * as TasksActions from './store/actions/tasks.actions'

@Injectable({
	providedIn: 'root',
})
export class LogicService {
	readonly initialState: TaskModel[] = [];
	private state: TaskModel[] = [...this.initialState];
	private logicSubj$ = new CloneSubject(this.state);

	constructor(private taskService: TaskFactoryService, private store: Store) { }
	
	public get tasks$(): Observable<TaskModel[]> {
		return this.logicSubj$.asObservable();
	}

	public addTask(tskName: string) {
		const newTask = this.taskService.createTask(tskName);
		this.store.dispatch(TasksActions.ADD_TASK({ task: {name: newTask.name, id: newTask.id, count: 0}}))
		this.state.push(newTask);
		this.doNext();
	}

	public updateTask(evt: TaskModel): void {
		const index = this.state.findIndex((tsk) => tsk.id === evt.id);
		this.state = this.toggleAllButtonTexts(this.state, index);
		this.doNext();
	}

	public get totalTime$(): Observable<number> {
	
		return this.tasks$.pipe(
			map((tasks: TaskModel[]) => tasks.map((task: TaskModel) => task.timer)),
			switchMap((timers: Observable<number>[]) => combineLatest(timers)),
			map((timerValues: number[] )=> timerValues.reduce((acc: number, curr: number) => acc + curr, 0))
		)
	}

	public nameExists(value: string): Observable<boolean> {
		return of(this.state.find((x) => x.name === value) !== undefined);
	}

	private toggleAllButtonTexts(
		tasks: TaskModel[],
		selectedId: number
	): TaskModel[] {
		tasks
			.filter((tsk) => tsk.id !== selectedId)
			.forEach((tsk) => this.inactivateButtons(tsk));
		this.toggleText(tasks[selectedId]);
		return tasks;
	}

	private inactivateButtons(tsk: TaskModel): void {
		if (tsk.buttonText === 'pause') {
			this.setPlay(tsk);
		}
	}

	private toggleText(tsk: TaskModel): void {
		if (tsk.buttonText === 'pause') {
			this.setPlay(tsk);
		} else {
			this.setPause(tsk);
		}
	}

	private setPlay(tsk: TaskModel) {
		tsk.buttonText = 'play_arrow';
		this.taskService.pause(tsk.id);
	}

	private setPause(tsk: TaskModel) {
		tsk.buttonText = 'pause';
		this.taskService.play(tsk.id);
	}

	private doNext() {
		this.logicSubj$.next(this.state);
	}
}
