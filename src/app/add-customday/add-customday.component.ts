//all the imports
import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  getMonth,
  startOfMonth,
  startOfWeek,  
  endOfWeek,
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { RRule} from 'rrule';
import { NgModel } from '@angular/forms';
import { MyProjectService } from "../services/app.projectservice";
import { MyWBIService } from "../services/app.wbiservice";
import { MyTimeslipService } from "../services/app.timeslipservice";
import { TimeslipModel } from "../services/app.timeslipservice";
import {MyCustomDayService} from "../services/app.customdayservice";
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { Router, NavigationExtras } from '@angular/router';
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
  selector: 'app-add-customday',
  templateUrl: './add-customday.component.html',
  styleUrls: [
    './add-customday.component.css'],
})
export class AddCustomdayComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view: string = 'day';

  //variables 
  activeDayIsOpen: boolean = true;
  projectService : MyProjectService;
  wbiService : MyWBIService;
  timeSlipService : MyTimeslipService;
  mycustomdayService : MyCustomDayService;
  projectList : any;
  wbiList : any;
  selectedProject : string;
  selectedWBI : string;
  
  newEventForm :boolean = false;
  newEvent : CalendarEvent[]= [];
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
  timeslipModel: TimeslipModel;
  userId : string = "47135933-9179-4E48-AE65-C981E1E22344";
  allTimeSlips :any;
  mySecretDay: Date = new Date(this.randomDate(new Date(1, 1, 1),new Date(2000, 1, 1)));
  viewDate: Date = this.mySecretDay;
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
  customDayName :string;
  customDayDescription : string;
  myTimeSlips :TimeslipBackEndModel[] = [];




  constructor(private modal: NgbModal,_projectService:MyProjectService,_wbiService:MyWBIService, _timeslipService:MyTimeslipService,
    public router:Router,_customdayService:MyCustomDayService) { 
    this.projectService = _projectService;
    this.wbiService = _wbiService;
    this.timeSlipService = _timeslipService;
    this.mycustomdayService = _customdayService;
  }

  ngOnInit() {
   //this.mySecretDay = new Date(this.randomDate(new Date(1, 1, 1),new Date(2000, 1, 1)))  ;
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

  getAllTimeSlips(){
    this.events = [];
    this.timeSlipService.getTimeSlipsByUserId(this.userId).subscribe(
      data=> {
        console.log(data);
        this.allTimeSlips = data;
        this.showInCalendar();
      },
    error => {
      alert(error);
    }
  )
  }

  showInCalendar(){
    for (let oneTimeSlip of this.allTimeSlips){
      this.addNewEvent(oneTimeSlip.newRemarks,oneTimeSlip.newStartTask,oneTimeSlip.newEndTask);
    }
  }

  addNewEvent(title,start,end){
    console.log(start);
      this.events.push({
      title: title,
      start: new Date(start),
      end: new Date(end),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: this.actions
    });
    this.refresh.next(); 
    console.log("i'm here");
    console.log(this.events);
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
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  showNewEvent(): void  {
    this.showProjectList();
    this.newEvent.push({
      title: '',
      start: startOfDay(this.mySecretDay),
      end: endOfDay(this.mySecretDay),
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

  changeProject(){
    console.log("hello");
    this.selectedWBI = "";
    if (this.selectedProject == ""){
        return ;
    }else {
      this.wbiService.GetAllWBIsByProjectId(this.selectedProject).subscribe(data=>{

        console.log(data);
        this.wbiList = data;
      },error=>{
        alert(error);
      })
    }
  }

  AddToEvent(){
    this.events.push(this.newEvent[0]);
    this.newEvent = [];
    this.newEventForm = false;
    this.refresh.next(); 
  }

  confirmAndReturn(){ 
   // console.log(this.events.length);
    for (let oneEvent of this.events){
       console.log(oneEvent.start);
        this.myTimeSlips.push({
        StartTime : oneEvent.start.toISOString(),
        EndTime : oneEvent.end.toISOString(),
        Remarks : oneEvent.title,
        WBI_Id :this.selectedWBI,
        // this uerId need to be changed each time push/pull from github
        UserId : "47135933-9179-4E48-AE65-C981E1E22344"
      });
      this.refresh.next(); 
      //console.log(newTimeSlip);
    }
    console.log(this.myTimeSlips); 


    let newCustomDayTimeSlips :CustomDayVM = {
      Name :this.customDayName,
      Description : this.customDayDescription,
      UserId : "47135933-9179-4E48-AE65-C981E1E22344",
      TimeSlip : this.myTimeSlips
    }
    console.log(newCustomDayTimeSlips);

    this.mycustomdayService.create(newCustomDayTimeSlips).subscribe(
      data=> {
        console.log(data);
        //navigate to calendar page
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };
        this.router.navigate(['addtimeslip'],navigationExtras);        
      },error => {
        alert(error);
      }
    )


  }

  cancelAddEvent(){
    this.newEvent = [];
    this.newEventForm = false;
  }

  randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() -                     start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return ([year, month, day].join('-'));
}
}

export class CustomDayVM{
  Name : string;
  Description : string;
  UserId : string;
  TimeSlip :TimeslipBackEndModel[];
}

export class TimeslipBackEndModel {
  StartTime:string;
  EndTime:string;
  Remarks: string;
  WBI_Id : string;
  UserId: String;
  
}