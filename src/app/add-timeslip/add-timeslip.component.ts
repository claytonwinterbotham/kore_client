//all the imports
//import "../layui/layui/layui.js";
import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input
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
import {TimeslipTemplateService,TimeSlipTemplate} from "../services/timeslip-template.service"
import { TimeslipModel } from "../services/app.timeslipservice";
import { Subject } from 'rxjs/Subject';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarMonthViewDay 
} from 'angular-calendar';
// import {layui} from "layui-src"
import { ClickOutsideModule } from 'ng-click-outside';
// import * as $ from "jquery";
import { Router, NavigationExtras } from '@angular/router';
import { Inject} from "@angular/core";
import { DOCUMENT } from '@angular/platform-browser';
import { DayViewHour } from 'calendar-utils';
import { NgxSpinnerService } from 'ngx-spinner';

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
const DEFAULT_HOUR_INTERVAL = 3;

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

  @Input() id;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('searchSuccess') searchSuccess: TemplateRef<any>;
  @ViewChild('searchFail') searchFail: TemplateRef<any>;
  @ViewChild('confirmDelete') confirmDelete: TemplateRef<any>;
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

        if (event.meta.timeSlipId == ""){
          this.events = this.events.filter(iEvent => iEvent !== event);
          this.newTimeSlipTest = true;
        }else {
          const modalRef = this.modalService.open(this.confirmDelete);
          this.deletingTimeSlipId = event.meta.timeSlipId;

        }
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
  timeSlipTemplateService : TimeslipTemplateService;
  projectList : any;
  wbiList : any;
  customdayList :any;
  selectedProject : string;
  selectedWBI : string;
  selectedCustomday : string;
  newEventForm :boolean = false;
  newEvent : CalendarEvent[]= [];
  events: CalendarEvent[]= [];
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
  searchString : string;
  searchWBIs :boolean = false;
  fakeTimeSlips : any;
  originalEvents :CalendarEvent[] = [];
  wbiRemainingHours : string;
  selectedDayViewDate: Date;
  dayView: DayViewHour[];
  newTimeSlipTest: boolean = true;
  WBIDisabled : boolean = true;
  searchDisabled : boolean = false;
  projectDisabled : boolean = false;
  deletingTimeSlipId : string;

      //for time control binding
      fixedHourInterval : number;
      fixedMinuteInterval : number;
    
      controlsAreBinded : boolean;

  remainingHourInvalid: boolean = false;
  //constructor 
  constructor(private modal: NgbModal,_projectService:MyProjectService,_wbiService:MyWBIService, _timeslipService:MyTimeslipService,
  _customdayService : MyCustomDayService,public router:Router, @Inject(DOCUMENT) private document: Document,
  _timeSlipTemplateService : TimeslipTemplateService,private modalService: NgbModal,
  private spinner: NgxSpinnerService) {
    this.projectService = _projectService;
    this.wbiService = _wbiService;
    this.timeSlipService = _timeslipService;
    this.customdayService = _customdayService;
    this.timeSlipTemplateService = _timeSlipTemplateService;
  }

  // init fucntion
  ngOnInit() {
    this.showProjectList();
    this.getAllTimeSlips();
    this.getAllCustomDays(); 
  }

  deleteTimeSlip(){
    this.spinner.show();
    this.timeSlipService.deleteTimeslip(this.deletingTimeSlipId).subscribe(
      data=> {
        console.log(data);
        this.getAllTimeSlips();
        this.deletingTimeSlipId = null;
        this.spinner.hide();
      },error =>{
        alert(error);
      }
    )
  }
  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    //this.addSelectedDayViewClass();
  }

  beforeDayViewRender(dayView: DayViewHour[]) {
   
    this.dayView = dayView;
    //this.addSelectedDayViewClass();
  }

  // addSelectedDayViewClass() {

 



  //   this.dayView.forEach(hourSegment => {
  //     hourSegment.segments.forEach(segment => {
  //       delete segment.cssClass;
  //       if (
  //         this.selectedDayViewDate &&
  //         segment.date.getTime() === this.selectedDayViewDate.getTime()
  //       ) {

          
  //         //segment.cssClass = 'cal-day-selected';
  //         //console.log(new Date(segment.date.getTime()));
  //         //this.endTime.setMinutes(this.startTime.getMinutes()+30);
  //         console.log(segment.date.getHours());
  //         this.startTime = {hour: segment.date.getHours(), minute: segment.date.getMinutes()};
  //         let newDate = new Date(segment.date.getTime());
  //         newDate.setMinutes(newDate.getMinutes()+30);
  //         //segment.date.setMinutes(segment.date.getMinutes()+30);
  //         this.endTime = {hour:newDate.getHours(), minute: newDate.getMinutes()};
  //         console.log(this.startTime.hour)
  //         console.log(newDate);
  //         this.refresh.next();

  //       }
  //     });
  //   });
  // }

  //Binding on time controls
  onCheckboxChange(){
    console.log("In the checkbox change method...");
    console.log("Are controls binded = " + this.controlsAreBinded);
    this.fixedHourInterval = this.endTime.hour - this.startTime.hour;
    this.fixedMinuteInterval = this.endTime.minute - this.startTime.minute;
    console.log("Fixed hour interval: " + this.fixedHourInterval);
    console.log("Fixed minute interval: " + this.fixedMinuteInterval);
  }
  onStartTimeChange(){
    console.log("In the onstartimechange method...");
    console.log(this.controlsAreBinded);
    if(!this.controlsAreBinded){
        return;
    }
    let newHour = this.startTime.hour + this.fixedHourInterval;
    let newMinute = this.startTime.minute + this.fixedMinuteInterval;
    // let newEndTime = { hour : newHour,
    //                    minute : newMinute }
    this.endTime = { hour : newHour,
      minute : newMinute };
      this.endTime = { hour : newHour,
        minute : newMinute };
    this.refresh.next();
  //this.TodayendTime.hour = this.TodaystartTime.hour + this.fixedHourInterval;
    console.log("Today end hour: " + this.endTime.hour);
  //this.TodayendTime.minute = this.TodaystartTime.minute + this.fixedMinuteInterval;
    console.log("Today end minute: " + this.endTime.minute);
   
  }

  refreshMe(){
    console.log("i want to refresh");
  }

  onEndTimeChange(){

    if(!this.controlsAreBinded){
        return;
    }
    let newHour = this.endTime.hour - this.fixedHourInterval;
    let newMinute = this.endTime.minute - this.fixedMinuteInterval;
    let newEndTime = { hour : newHour,
                       minute : newMinute }
    this.startTime = newEndTime;

    //this.TodaystartTime.hour = this.TodayendTime.hour - this.fixedHourInterval;
    console.log("Today start hour: " + this.startTime.hour);
    //this.TodaystartTime.minute = this.TodayendTime.minute - this.fixedMinuteInterval;
    console.log("Today start minute: " + this.startTime.minute);
    
  }



  AddNewTimeSlip(){
    console.log("I want to add a new timeslip");
    console.log(this.viewDate);
    //console.log(this.startTime)
    let startDate : Date = new Date(this.viewDate.valueOf());
    console.log(startDate);
    console.log(this.startTime.hour)
    startDate.setHours(this.startTime.hour, this.startTime.minute);
    let endDate : Date = new Date(this.viewDate.valueOf());
    endDate.setHours(this.endTime.hour, this.endTime.minute);
    console.log(startDate);

    let validationEvent : CalendarEvent= {
      start:startDate,
      end:endDate,
      title: " test"
    }

   let result : boolean =  this.validateNewEvent(validationEvent,this.events);

   if (result != true){
     alert("please ensure that there is not time overlap!");
   }else {
    let newTimeSlip: TimeslipModel  = {
      StartDate : startDate.toLocaleString(),
      EndDate : endDate.toLocaleString(),
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
        this.quickRemarks = "";
        this.selectedProject = "";
        this.selectedWBI = "";
        this.wbiRemainingHours = "" ;
        this.ClearAllEvents();
        this.startTime = this.endTime;
        this.endTime = {hour:endDate.getHours() + DEFAULT_HOUR_INTERVAL,minute:endDate.getMinutes()}
      },error =>{
        alert(error);
      }
    )
   }
  }

  validateNewEvent (validationEvent : CalendarEvent, events : Array<CalendarEvent<{ timeSlipId: string,WBIId : string }>>): boolean{
    if (events.length == 0){
      return true;
    }
    for (let oneEvent of events){
      if (oneEvent.start>= validationEvent.end || oneEvent.end <= validationEvent.start){

      }else {
        return false;
      }
    }
    return true;
  }

  searchWBI(){

    if (this.searchString == null || this.searchString == ""){
      alert("you can't search for empty WBI!");
      return ;
    }
    this.selectedWBI = null;
    this.wbiList = null;
    this.selectedProject = null;

    this.wbiService.searchWBI(this.searchString).subscribe(
      data=> {
        console.log(data);
        this.wbiList = (data);
        this.searchWBIs = true;
        if (data.length != 0){
          this.WBIDisabled = false;
          this.projectDisabled = true;
          //this.openWBI = true;
          // this.popup.show();
          this.modalService.open(this.searchSuccess);
        }
        else{
          this.WBIDisabled = true;
          this.projectDisabled = false;
          this.modalService.open(this.searchFail);
          this.ClearAllEvents();
        }
      },
      error =>{
        alert(error);
      }
    )
  }

  locateProject(){
    console.log("i want to locate project");
    if (this.selectedWBI == null || this.selectedWBI == ""){
      this.wbiRemainingHours = "";
    }
    this.wbiRemainingHours = "Remaining Hours: "+ this.getRemainingWBIHour(this.selectedWBI);
    if(this.getRemainingWBIHour(this.selectedWBI) <= 0){
     this.remainingHourInvalid = true;
    }else {
      this.remainingHourInvalid = false;
    } 
    if (!this.searchWBIs){
      return ;
    }


    this.projectService.getOneProjectByWBIId(this.selectedWBI).subscribe(
      data=>{
        console.log(data);
        //this.fixedProject = true;
        //this.ngselectProject = false;
        this.selectedProject = data["newName"];
        //this.selectedProject = data;
        //let dataArray  = [];
        //dataArray.push(data);
        //ng-select only accept arrays, that's why i need to define an array here.
        //this. = dataArray;
      },
      error =>{
        alert(error);
      }
    )
  }

  getRemainingWBIHour(WBI : string) : number{
    if (this.selectedWBI == ""){
      return 0;
    }else {
      let wbi = this.wbiList.filter(i=> i.newChangeRequestId == WBI);
      //return wbi.
      console.log("I want to get remaining wbi hours");
      //console.log(wbi);
      //console.log(wbi[0]["newActualHours"]);
      console.log(Number.parseInt(wbi[0]["newActualHours"])  - Number.parseInt(wbi[0]["newEstimatedHours"]));
      return Number.parseInt(wbi[0]["newEstimatedHours"])  - Number.parseInt(wbi[0]["newActualHours"])
      //return 1;
    }
  }

  scrollTo(){
      setTimeout(function(){
         var scrollContainer = document.getElementById("day_view_scroll")
         scrollContainer.scrollTop = 465 
         console.log("scroll " + scrollContainer.scrollTop)
        }, 300);
      
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
    this.spinner.show();
    this.timeSlipService.getTimeSlipsByUserId(this.userId).subscribe(
      data=> {
        console.log(data);
        if (data[0]["newTimesheetEntryId"] == null){
          this.allTimeSlips = "";
        }else {
          this.allTimeSlips = data;
        }
        this.spinner.hide();
        this.showInCalendar();
      },
    error => {
      alert(error);
    }
  )
  }

  getAllCustomDays(){
    this.customdayService.getCustomdays(sessionStorage.getItem('userId')).subscribe(
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
    if (this.allTimeSlips == ""){
      return ;
    }else {
      console.log(this.allTimeSlips);
      for (let oneTimeSlip of this.allTimeSlips){
        //this.getTitleName(oneTimeSlip.newRemarks,oneTimeSlip.newStartTask,oneTimeSlip.newEndTask,oneTimeSlip.newTimesheetEntryId,oneTimeSlip.newChangeRequestId,colors.blue,true);
        this.addNewEvent(oneTimeSlip.newRemarks,oneTimeSlip.newStartTask,oneTimeSlip.newEndTask,oneTimeSlip.newTimesheetEntryId,oneTimeSlip.newChangeRequestId,oneTimeSlip.wbiName, colors.blue);
      }
    }

    console.log(this.events);
  }

  addNewEvent(title,start,end,timeSlipId,WBIId,WBIName, color)
  {
   // console.log(start);
      this.events.push({
      title: WBIName,
      start: new Date(start),
      end: new Date(end),
      meta:{
        timeSlipId :timeSlipId,
        WBIId :WBIId,
        remark: title
      },
      color: color,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: this.actions
    });
    this.refresh.next(); 
   // console.log(this.events);
  }

  addFakeEvent(title,start,end,timeSlipId,WBIId,WBIName,color){
    //console.log(start);
      this.events.push({
      title: WBIName,
      start: new Date(start),
      end: new Date(end),
      meta:{
        timeSlipId :timeSlipId,
        WBIId :WBIId,
        remark: title
      },
      color: color,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      
    });
    this.refresh.next(); 
   //console.log(this.events);    
  }

  showFakeCalendar(){
    this.getAllTimeSlips(); //each time call this method with make the this.events to be empty first.
    this.originalEvents = this.events;
    if (this.selectedCustomday == null){
      return ;
    }
    console.log("I want to show fake custom day");
    this.timeSlipTemplateService.getAllTimeSlips(this.selectedCustomday).subscribe(
      data => {
        console.log(data);
        this.fakeTimeSlips = data;
        for (let fakeTimeSlip of this.fakeTimeSlips){
          let fakeStart = new Date(fakeTimeSlip.startTime);
          console.log(fakeStart);
          let fakeEnd = new Date(fakeTimeSlip.endTime);
          let startHour = fakeStart.getHours();
          let startMinute = fakeStart.getMinutes();
          let endHour = fakeEnd.getHours();
          let endMinute = fakeEnd.getMinutes();
          
          fakeStart.setFullYear(this.viewDate.getFullYear(), this.viewDate.getMonth(),this.viewDate.getDate());
          console.log(fakeStart);
          console.log(startHour);
          fakeStart.setHours(startHour);
          fakeStart.setMinutes(startMinute);
          console.log(fakeStart);
         
          fakeEnd.setFullYear(this.viewDate.getFullYear(), this.viewDate.getMonth(),this.viewDate.getDate());
          fakeEnd.setHours(endHour);
          fakeEnd.setMinutes(endMinute);

          //this.getTitleName(fakeTimeSlip.remarks,fakeStart,fakeEnd,fakeTimeSlip.TimeslipTemplateId,fakeTimeSlip.NewChangeRequestId,colors.red,false)

          this.addFakeEvent(fakeTimeSlip.remarks,fakeStart,fakeEnd,fakeTimeSlip.TimeslipTemplateId,fakeTimeSlip.NewChangeRequestId,fakeTimeSlip.wbiName,colors.red);
          
        }
        ///this.ShowAllTemplates();
      },
      error =>{
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
    this.EditRemark = event.meta.remark;
    this.EditStartDate = event.start;
    this.EditEndDate = event.end;
    this.EditStartTime = {hour: event.start.getHours(),minute: event.start.getMinutes()};
    this.EditEndTime = {hour: event.end.getHours(),minute: event.end.getMinutes()};
    
    let reuslt = this.validateEditEvent(event);
    if (reuslt == false){
      alert("Please Ensure there is no time overlap!");
      this.getAllTimeSlips();
      return ;
    }
    else {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  validateEditEvent(event :CalendarEvent) :boolean{
    for (let oneEvent of this.events.filter(ev=> ev.meta.timeSlipId != event.meta.timeSlipId)){
      if (oneEvent.start>= event.end || oneEvent.end <= event.start){
      }else {
        return false;
      }
    }
    return true;
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
        this.EditWBIName = data["newName"];
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
    let result = this.validateCustomDay(this.events.filter(event=> event.color == colors.red),this.events.filter(event=> event.color == colors.blue));
    if (result == false){
      alert("Please confirm that time will not overlap!");
      return ;
    }
    else {
      console.log(this.clickedDate.toISOString());
      let CustomdayTimeslip : customdayTimeslip = {
        CustomdayId :this.selectedCustomday,
        Date :this.clickedDate.toISOString()
      }
      this.timeSlipTemplateService.applyTimeTemplate(CustomdayTimeslip).subscribe(
        data=> {
          console.log(data);
          this.getAllTimeSlips();
          this.selectedCustomday = null;
        },error =>{
          alert(error);
        }
      )
    }
  }

  validateCustomDay(originalEvents : CalendarEvent[], newEvents : CalendarEvent[]):boolean{
    for(let originalEvent of originalEvents){
      for (let newEvent of newEvents){
        if //(newEvent.start < originalEvent.end && newEvent.end > originalEvent.start){
        (originalEvent.start >= newEvent.end || originalEvent.end <= newEvent.start){

        }else {
          return false;
        }
      }
    }
    return true;
  }

  confirmEdit(){
    this.EditStartDate.setHours(this.EditStartTime.hour,this.EditStartTime.minute);
    this.EditEndDate.setHours(this.EditEndTime.hour,this.EditEndTime.minute);
    if (this.EditStartDate >= this.EditEndDate){
      alert("please input correct time start time and end time!!");
      this.getAllTimeSlips();
      return ;
    }

    let event: CalendarEvent = {
      start : this.EditStartDate,
      end : this.EditEndDate,
      title : "test",
      meta : {
        timeSlipId: this.EditTimeSlipId
      }
    }

    let reuslt = this.validateEditEvent(event);
    if (reuslt == false){
      alert("Please Ensure there is no time overlap!");
      this.getAllTimeSlips();
      return ;
    }else {
      let newTimeSlip: TimeslipModel = {
        TimeSlipId : this.EditTimeSlipId,
        StartDate : this.EditStartDate.toLocaleString(),
        EndDate : this.EditEndDate.toLocaleString(),
        Remarks : this.EditRemark,
        //WBIId :this.selectedWBI,
        // this uerId need to be changed each time push/pull from github
        UserId : sessionStorage.getItem('userId'),
        DayId : ""      
      }
      console.log("i want to comfirm edit");
      console.log(newTimeSlip);
      this.spinner.show();
      this.timeSlipService.updateTimeslip(newTimeSlip).subscribe(
        data=>{
          console.log(data);
          this.getAllTimeSlips();
          //this.mr.close();
          this.spinner.hide();
        },error =>{
          alert(error);
        }
      )
    }
  }

  cancelAddEvent(){
    this.newEvent = [];
    this.newEventForm = false;
  }

  ClearAllEvents(){
    this.selectedProject = "";
    this.selectedWBI = "";
    this.quickRemarks = "";
    this.searchString = "";
    this.searchWBIs = false;
    this.WBIDisabled = true;
    this.searchDisabled = false;
    this.projectDisabled = false;
    this.wbiRemainingHours = null;
  }

  changeProject(){
    console.log("hello");
    this.selectedWBI = "";
    this.wbiRemainingHours = "please select a WBI";
    if (this.selectedProject == null || this.selectedProject== ""){
      this.wbiList = null;
      this.WBIDisabled = true;
      this.searchDisabled = false;
      this.wbiRemainingHours = null;
      return ;
    }else {
      this.wbiService.GetAllWBIsByProjectId(this.selectedProject).subscribe(data=>{

        console.log(data);
        this.projectDropdown = false;
        this.wbiList = data;
        if (data != null){
          this.WBIDisabled = false;
          this.searchDisabled = true;
        }
        
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
