import { createAction, props } from "@ngrx/store";
import { TaskBase } from "../reducers/tasks.reducer";

export const ADD_TASK = createAction('[Tasks counter] ADD_TASK', props<{task: TaskBase}>());
export const PLAY_TASK = createAction('[Tasks counter] PLAY_TASK', props<{ taskId: number }>());
export const PAUSE_TASK = createAction('[Tasks counter] PAUSE_TASK');
export const INCREMENT = createAction('[Tasks counter] INCREMENT');