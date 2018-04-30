//all the imports
//import "../layui/layui/layui.js";
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
import { MyCustomDayService } from "../services/app.customdayservice";
import { TimeslipModel } from "../services/app.timeslipservice";
import { Subject } from 'rxjs/Subject';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter
} from 'angular-calendar';
// import {layui} from "layui-src"
import { ClickOutsideModule } from 'ng-click-outside';
// import * as $ from "jquery";
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

interface RecurringEvent {
  title: string;
  color: any;
  
  
  rrule?: {
    freq: RRule.Frequency;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: RRule.Weekday[];
  };
}


@Component({
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['add-timeslip.component.css'],
  templateUrl: 'add-timeslip.component.html'
})

export class AddTimeslipComponent{
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

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
      onClick: ( { event }: { event: CalendarEvent } ): void => {
        this.timeSlipService.deleteTimeslip(event.meta.timeSlipId).subscribe(
          data=> {
            console.log(data);
            this.getAllTimeSlips();
          },error =>{
            alert(error);
          }
        )
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  //recurringEvents
    recurringEvents: RecurringEvent[] = [
    {
      title: 'Recurs on the 5th of each month',
      color: colors.yellow,
      rrule: {
        freq: RRule.MONTHLY,
        bymonthday: 5
      }
    },
    {
      title: 'Recurs yearly on the 10th of the current month',
      color: colors.blue,
      rrule: {
        freq: RRule.YEARLY,
        bymonth: getMonth(new Date()) + 1,
        bymonthday: 10,
        
      }
    },
    {
      title: 'Recurs weekly on mondays',
      color: colors.red,
      rrule: {
        freq: RRule.WEEKLY,
        byweekday: [RRule.MO]
      }
    }
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
  wbiService : MyWBIService;
  timeSlipService : MyTimeslipService;
  customdayService : MyCustomDayService;
  projectList : any;
  wbiList : any;
  customdayList :any;
  selectedProject : string;
  selectedWBI : string;
  selectedCustomday : string;
  newEventForm :boolean = false;
  newEvent : CalendarEvent[]= [];
  events: Array<CalendarEvent<{ timeSlipId: string,WBIId : string }>> = [];
  timeslipModel: TimeslipModel;
  //userId : string = "47135933-9179-4E48-AE65-C981E1E22344";
  timeslipId : string;
  userId : string = sessionStorage.getItem('userId');
  allTimeSlips :any;
  clickedDate : Date;
  //chooseCustomday : boolean;
  projectDropdown: boolean = false;
  WBIDropdown : boolean = false;
  startTime : any = {hour: 9, minute: 30};
  endTime :any = {hour: 13, minute: 30};
  startTimeDropdown : boolean = false;
  endTimeDropdown : boolean = false;
  meridian = true;
  quickRemarks : any;
  quickAddDate : any;
  EditRemark : string;
  EditProjectName : string;
  EditWBIName : string;
  EditStartTime : any;
  EditEndTime : any;
  EditTimeSlipId : string;
  EditStartDate : Date;
  EditEndDate : Date;
  //mr: NgbModalRef;

  //constructor 
  constructor(private modal: NgbModal,_projectService:MyProjectService,_wbiService:MyWBIService, _timeslipService:MyTimeslipService,
  _customdayService : MyCustomDayService,public router:Router) {
    this.projectService = _projectService;
    this.wbiService = _wbiService;
    this.timeSlipService = _timeslipService;
    this.customdayService = _customdayService;
  }

  // init fucntion
  ngOnInit() {
    this.showProjectList();
    this.getAllTimeSlips();
    this.getAllCustomDays();
  }

  // all the functions below
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

  showProjectDropdown(){
    console.log("karl");
    this.projectDropdown = !this.projectDropdown;
  }

  showWBIDropdown(){
    this.WBIDropdown = !this.WBIDropdown;
  }

  showStartTime(){
    this.startTimeDropdown = !this.startTimeDropdown;
  }

  showEndTime(){
    this.endTimeDropdown = !this.endTimeDropdown;
  }

  onClickedOutsideProject(e: Event){
    
    this.projectDropdown = false;
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

  getAllCustomDays(){
    this.customdayService.getCustomdays("47135933-9179-4E48-AE65-C981E1E22344").subscribe(
      data=> {
      console.log(data);
      this.customdayList = data;
      },
      error => {
        alert(error);
      }
    )
  }

  showInCalendar(){
    for (let oneTimeSlip of this.allTimeSlips){
      this.addNewEvent(oneTimeSlip.newRemarks,oneTimeSlip.newStartTask,oneTimeSlip.newEndTask,oneTimeSlip.newTimesheetEntryId,oneTimeSlip.newChangeRequestId);
    }
    console.log(this.events);
  }

  addNewEvent(title,start,end,timeSlipId,WBIId){
    console.log(start);
      this.events.push({
      title: title,
      start: new Date(start),
      end: new Date(end),
      meta:{
        timeSlipId :timeSlipId,
        WBIId :WBIId
      },
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: this.actions
    });
    this.refresh.next(); 
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
    this.clickedDate = date;
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
    console.log(action);
    console.log(event);
    this.getProjectName(event.meta.WBIId);
    this.getWBIName(event.meta.WBIId);
    this.EditTimeSlipId = event.meta.timeSlipId;
    this.EditRemark = event.title;
    this.EditStartDate = event.start;
    this.EditEndDate = event.end;
    this.EditStartTime = {hour: event.start.getHours(),minute: event.start.getMinutes()};
    this.EditEndTime = {hour: event.end.getHours(),minute: event.end.getMinutes()};
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  getProjectName(WBIId : string){
    this.projectService.getOneProjectByWBIId(WBIId).subscribe(
      data=>{
        console.log(data);
        this.EditProjectName = data["newName"];
      },
      error=>{
        alert(error);
        
      }
      
    )
  }

  getWBIName(WBIId : string) {
    console.log("I want to get WBI Name!")
    this.wbiService.getOneWBI(WBIId).subscribe(
      data=> {
        console.log(data);
        this.EditWBIName = data["newRemarks"];
      },
      error =>{
        alert (error);
      }
    )
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
      title: this.newEvent[0].title,
      start: this.newEvent[0].start,
      end: this.newEvent[0].end,
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

  confirmAddEvent(){
    console.log(this.newEvent[0].start.toISOString());
    let newTimeSlip: TimeslipModel  = {
      StartDate : this.newEvent[0].start.toISOString(),
      EndDate : this.newEvent[0].end.toISOString(),
      Remarks : this.newEvent[0].title,
      WBIId :this.selectedWBI,
      // this uerId need to be changed each time push/pull from github
      UserId : sessionStorage.getItem('userId'),
      DayId : ""
    }
    this.timeslipModel = newTimeSlip; 
    this.timeSlipService.postTimeslip(this.timeslipModel).subscribe(
      data=> {
        console.log(this.timeslipModel)
        console.log(data);
        //this.addEvent()
        this.getAllTimeSlips();
        this.newEvent = [];
        this.newEventForm = false;
      },error =>{

        alert(error);
      }
    )    
  }

  confirmQuickAddts(){
    console.log(this.selectedProject);
    console.log(this.selectedWBI);
    console.log(this.quickRemarks);
    console.log(this.quickAddDate);
    console.log(this.startTime);
    console.log(this.endTime);
    let newTimeSlip: TimeslipModel  = {
      StartDate : this.quickAddDate.year + "/" + this.quickAddDate.month + "/" + this.quickAddDate.day +" "+ this.startTime.hour+ ":"+this.startTime.minute ,
      EndDate : this.quickAddDate.year + "/" + this.quickAddDate.month + "/" + this.quickAddDate.day+" "+ this.endTime.hour+ ":"+this.endTime.minute,
      Remarks : this.quickRemarks,
      WBIId :this.selectedWBI,
      // this uerId need to be changed each time push/pull from github
      UserId : sessionStorage.getItem('userId'),
      DayId : ""
    }
    this.timeslipModel = newTimeSlip; 
    this.timeSlipService.postTimeslip(this.timeslipModel).subscribe(
      data=> {
        console.log(this.timeslipModel)
        console.log(data);
        //this.addEvent()
        this.getAllTimeSlips();
        this.newEvent = [];
        this.newEventForm = false;
        this.selectedProject = "";
        this.selectedWBI = "";
        this.quickRemarks = "";
      },error =>{

        alert(error);
      }
    ) 

  }

  confirmAddCustomDay(){
    console.log(this.selectedCustomday); 
    //console.log(this.clickedDate.getFullYear()+"-"+this.clickedDate.getMonth()+"-"+this.clickedDate.getDay()+"" );
    console.log(this.clickedDate.toISOString());
    let CustomdayTimeslip : customdayTimeslip = {
      CustomdayId :this.selectedCustomday,
      Date :this.clickedDate.toISOString()
    }
    this.timeSlipService.createTimeslipByCustomday(CustomdayTimeslip).subscribe(
      data=> {
        console.log(data);
        this.getAllTimeSlips();
      },error =>{
        alert(error);
      }
    )
  }

  confirmEdit(){
    let newTimeSlip: TimeslipModel = {
      TimeSlipId : this.EditTimeSlipId,
      StartDate : this.EditStartDate.toDateString(),
      EndDate : this.EditEndDate.toDateString(),
      Remarks : this.EditRemark,
      //WBIId :this.selectedWBI,
      // this uerId need to be changed each time push/pull from github
      UserId : sessionStorage.getItem('userId'),
      DayId : ""      
    }
    this.timeSlipService.updateTimeslip(newTimeSlip).subscribe(
      data=>{
        console.log(data);
        this.getAllTimeSlips();
        //this.mr.close();
      },error =>{
        alert(error);
      }
    )
  }

  cancelAddEvent(){
    this.newEvent = [];
    this.newEventForm = false;
  }

  changeProject(){
    console.log("hello");
    this.selectedWBI = "";
    if (this.selectedProject == ""){
        return ;
    }else {
      this.wbiService.GetAllWBIsByProjectId(this.selectedProject).subscribe(data=>{

        console.log(data);
        this.projectDropdown = false;
        this.wbiList = data;
        
      },error=>{
        alert(error);
      })
    }
   
  }
  
  logOut(){
    sessionStorage.setItem('userId', null);
    sessionStorage.setItem('token',null);
        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };


          this.router.navigate(['login'],navigationExtras);
  }
}

export class customdayTimeslip {
  CustomdayId:string;
  Date :string;
}
