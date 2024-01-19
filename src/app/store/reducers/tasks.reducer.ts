import { createReducer, on } from "@ngrx/store";
import * as TasksActions from '../actions/tasks.actions';

export interface TaskBase {
    id: number;
    name: string;
    count: number;
}

export interface TasksState {
    tasks: TaskBase[];
    activeTaskId: number;
    totalTime: number;
}

export const initialState: TasksState = {
    tasks: [],
    activeTaskId: undefined,
    totalTime: 0
}

export const tasksReducer = createReducer(
    initialState,

    on(TasksActions.PLAY_TASK, (state: TasksState, { taskId }) => ({
        ...state,
        activeTaskId: taskId
    })),

    on(TasksActions.PAUSE_TASK, (state: TasksState) => ({
        ...state,
        activeTaskId: null,
    })),

    on(TasksActions.ADD_TASK, (state, { task }) => ({
      ...state,
      tasks: [...state.tasks, task],
    })),

    on(TasksActions.INCREMENT, (state: TasksState) => {
        const updatedTasks = state.tasks.map(task => {
       
          if (task.id === state.activeTaskId) {
            return { ...task, count: task.count + 1 };
          } else {
            return task;
          }
        });
      
        return {
          ...state,
          tasks: updatedTasks,
          totalTime: state.totalTime + 1
        };
      })
    
)