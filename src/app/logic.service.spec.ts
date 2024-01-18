import { TestBed } from '@angular/core/testing';
import { TaskFactoryService } from './task-factory.service';
import { LogicService } from './logic.service';
import { skip, bufferCount } from 'rxjs/operators';
import { Store, StoreModule } from '@ngrx/store';
import { rootReducer } from './store/reducers';

describe('LogicService', () => {
  let service: LogicService;
  let store: Store;
  beforeEach(() => {    
    const fakeService = {
      createTask: () => ({}),
      pause: () => ({}),
      play: () => ({}),
    };
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(rootReducer), 
      ],
      providers: [
        LogicService,
        { provide: TaskFactoryService, useValue: fakeService }
      ],
    });
    service = TestBed.inject(LogicService);
    store = TestBed.inject(Store);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('initialState defaults to: []', () => {
    expect(service.initialState).toEqual([]);
  });
  it('state increases by one after add one task', (done) => {
    expect.hasAssertions();
    const fake = TestBed.get(TaskFactoryService);
    jest.spyOn(fake, 'createTask').mockReturnValue({ name: 'test1' });

    service.tasks$.pipe(skip(1)).subscribe((x) => {
      expect(x).toContainEqual({ name: 'test1' });
      expect(x.length).toEqual(1);
      done();
    });
    service.addTask('any name');
  });
  it('state increases by 4 after add 4 tasks', (done) => {
    expect.hasAssertions();
    const iterates = 4;
    const fake = TestBed.get(TaskFactoryService);
    jest.spyOn(fake, 'createTask').mockReturnValue({ name: 'test1' });

    service.tasks$.pipe(bufferCount(iterates)).subscribe((x) => {
      expect(x.length).toEqual(iterates);
      done();
    });
    for (let index = 0; index < iterates; index++) {
      service.addTask('any name');
    }
  });
});
