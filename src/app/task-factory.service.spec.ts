import { TestBed } from '@angular/core/testing';
import { TaskFactoryService } from './task-factory.service';
import { TimerManagerService } from './timer-manager.service';
import { Store, StoreModule } from '@ngrx/store';
import { rootReducer } from './store/reducers';

describe('TaskFactoryService', () => {
  let store: Store;
  let service: TaskFactoryService
  beforeEach(() => {        
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(rootReducer), 
      ],
      providers: [
        TimerManagerService
      ],
    });
    service = TestBed.inject(TaskFactoryService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    const service: TaskFactoryService = TestBed.inject(TaskFactoryService);
    expect(service).toBeTruthy();
  });
});
