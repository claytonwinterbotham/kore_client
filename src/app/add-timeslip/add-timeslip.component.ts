//all the imports
import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { NgModel } from '@angular/forms';
import { MyProjectService } from "../services/app.projectservice"
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter
} from 'angular-calendar';

//const
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['add-timeslip.component.css'],
  templateUrl: 'add-timeslip.component.html'
})

export class AddTimeslipComponent{
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  projects = [
    { value: 1, label: 'projects1' },
    { value: 2, label: 'projects2' },
    { value: 3, label: 'projects3' },
    { value: 4, label: 'projects4' },
    { value: 5, label: 'projects5' },
    { value: 6, label: 'projects6' }
  ];

  wbis = [
    { value: 1, label: 'wbis1' },
    { value: 2, label: 'wbis2' },
    { value: 3, label: 'wbis3' },
    { value: 4, label: 'wbis4' },
    { value: 5, label: 'wbis5' },
    { value: 6, label: 'wbis6' }
  ];

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-pencil-alt"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'title',
    //   project: 'Atlanta',
    //   wbi: 'Projects',
    //   description: 'Worked on projects',
    //   color: colors.red,
    //   actions: this.actions
    // }
  ];

      // exclude weekends
      excludeDays: number[] = [0, 6];

      skipWeekends(direction: 'back' | 'forward'): void {
        if (this.view === 'day') {
          if (direction === 'back') {
            while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
              this.viewDate = subDays(this.viewDate, 1);
            }
          } else if (direction === 'forward') {
            while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
              this.viewDate = addDays(this.viewDate, 1);
            }
          }
        }
      }

//variables 
  activeDayIsOpen: boolean = true;
  projectService : MyProjectService;
  projectList : any;
  selectedProject : string;
  newEventForm :boolean = false;
  newEvent : CalendarEvent[]= [];
  

  
  constructor(private modal: NgbModal,_projectService:MyProjectService) {
    this.projectService = _projectService;
  }

  ngOnInit() {
    this.showProjectList();
  }

  showProjectList(){
    this.projectService.getProjects().subscribe(
      data=> {
        console.log(data);
        this.projectList = data;
      },
    error => {
      alert(error);
    }
  )
  }

  // handler for clicking each day.
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  //hander for the change of time of events
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  showNewEvent(): void  {
    this.showProjectList();
    this.newEvent.push({
      title: 'myTest',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: this.actions
    });
    this.refresh.next();
    this.selectedProject = "";
    this.newEventForm = true;
  }

  addEvent(): void {
    this.events.push({
      title: 'myTest',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: this.actions
    });
    this.refresh.next();
  }

  changeProject(){
    
  }


}