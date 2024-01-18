import { AppState } from "../reducers";

export const selectTasksList = (state: AppState) => state.tasksStore.tasks;
export const selectTotalTime = (state: AppState) => state.tasksStore.totalTime;
export const selectedTaskId = (state: AppState) => state.tasksStore.activeTaskId;