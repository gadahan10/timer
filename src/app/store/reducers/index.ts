import { ActionReducerMap } from "@ngrx/store";
import { TasksState, tasksReducer } from "./tasks.reducer";

export interface AppState {
    tasksStore: TasksState;
}

export const rootReducer: ActionReducerMap<AppState> = {
    tasksStore: tasksReducer,
};