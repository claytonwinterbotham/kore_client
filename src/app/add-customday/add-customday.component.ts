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
import {customdayTimeslip} from "../add-timeslip/add-timeslip.component"
import { MyProjectService } from "../services/app.projectservice";
import { MyWBIService } from "../services/app.wbiservice";
import { MyTimeslipService } from "../services/app.timeslipservice";
import { TimeslipModel } from "../services/app.timeslipservice";
import {MyCustomDayService} from "../services/app.customdayservice";
import {TimeslipTemplateService,TimeSlipTemplate} from "../services/timeslip-template.service"
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { Router, NavigationExtras } from '@angular/router';
import { Inject} from "@angular/core";
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
// import { Popup} from "ng2-opd-popup";

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
@Component({
  selector: 'app-add-customday',
  templateUrl: './add-customday.component.html',
  styleUrls: [
    './add-customday.component.css'],
})
export class AddCustomdayComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('searchSuccess') searchSuccess: TemplateRef<any>;
  @ViewChild('searchFail') searchFail: TemplateRef<any>;
  view: string = 'day';

  //variables 
  activeDayIsOpen: boolean = true;
  projectService : MyProjectService;
  wbiService : MyWBIService;
  timeSlipService : MyTimeslipService;
  mycustomdayService : MyCustomDayService;
  timeSlipTemplateService : TimeslipTemplateService;
  projectList : any;
  wbiList : any;
  selectedProject : string;
  selectedWBI : string;
  newEventForm :boolean = false;
  newEvent : CalendarEvent[]= [];
  events: CalendarEvent[] = [];
  timeslipModel: TimeslipModel;
  userId : string = sessionStorage.getItem('userId');
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
        this.timeSlipTemplateService.deleteTimeslipTemplate(event.meta.timeSlipId).subscribe(
          data=> {
            console
            console.log(data);
            this.getAllTemplates();
          },error =>{
            alert(error);
          }
        )
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  customDayName :string;
  customDayDescription : string;
  myTimeSlips :TimeslipBackEndModel[] = [];
  TodaystartTime : any = {hour: 9, minute: 30};
  TodayendTime :any = {hour: 13, minute: 30};
  meridian = true;
  newEventTitle : string ;
  selectedWBIs : string[] = [];
  showSelect : boolean = false;
  showInput : boolean = true;
  searchString : string;
  ngselectProject : boolean = true;
  fixedProject :boolean = false;
  fixedProjectName : string;
  searchWBIs :boolean = false;
  customDayId : any;
  customdayList : any;
  selectedCustomday : string ;
  selected : boolean = false;
  isSelect : boolean = false;
  timeSlipTemplates : any;
  selectCustomDayItem : any;
  EditRemark : string;
  EditProjectName : string;
  EditWBIName : string;
  EditStartTime : any;
  EditEndTime : any;
  EditTimeSlipId : string;
  EditStartDate : Date;
  EditEndDate : Date;
  customDayNameEmpty : boolean = true;
  titleName : string;
  WBIDisabled : boolean = true;
  searchDisabled : boolean = false;
  projectDisabled : boolean = false;
  openWBI :boolean = false;
  confirmDisabled : boolean = true;

  fixedHourInterval : number;
  fixedMinuteInterval : number;

  controlsAreBinded : boolean;

 
  constructor(private modal: NgbModal,_projectService:MyProjectService,_wbiService:MyWBIService, _timeslipService:MyTimeslipService,
    public router:Router,_customdayService:MyCustomDayService, @Inject(DOCUMENT) private document: Document,private route: ActivatedRoute,
   _timeSlipTemplateService : TimeslipTemplateService,private modalService: NgbModal) { 
    this.projectService = _projectService;
    this.wbiService = _wbiService;
    this.timeSlipService = _timeslipService;
    this.mycustomdayService = _customdayService;
    this.timeSlipTemplateService = _timeSlipTemplateService;
    this.route.params.subscribe(res =>{
      console.log(res.id);
      this.customDayId = res.id;
      this.selectedCustomday = res.id;
      //this.isSelect = true;
      this.customDayName = res.name;
      this.customDayDescription = res.description;
      if (res.id != ""  && res.id != null){
        this.confirmDisabled = false;
        this.customDayNameEmpty = false;
      }
    } )
  }

  ngOnInit() {
   //this.mySecretDay = new Date(this.randomDate(new Date(1, 1, 1),new Date(2000, 1, 1)))  ;
   console.log(this.mySecretDay);
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
   this.getAllCustomDays();
   this.scrollTo();
  }
  onCheckboxChange(){
    console.log("In the checkbox change method...");
    console.log("Are controls binded = " + this.controlsAreBinded);
    this.fixedHourInterval = this.TodayendTime.hour - this.TodaystartTime.hour;
    this.fixedMinuteInterval = this.TodayendTime.minute - this.TodaystartTime.minute;
    console.log("Fixed hour interval: " + this.fixedHourInterval);
    console.log("Fixed minute interval: " + this.fixedMinuteInterval);
  }
  onStartTimeChange(){
    console.log("In the onstartimechange method...");
    if(!this.controlsAreBinded){
        return;
    }
    let newHour = this.TodaystartTime.hour + this.fixedHourInterval;
    let newMinute = this.TodaystartTime.minute + this.fixedMinuteInterval;
    let newEndTime = { hour : newHour,
                       minute : newMinute }
    this.TodayendTime = newEndTime;
  //this.TodayendTime.hour = this.TodaystartTime.hour + this.fixedHourInterval;
    console.log("Today end hour: " + this.TodayendTime.hour);
  //this.TodayendTime.minute = this.TodaystartTime.minute + this.fixedMinuteInterval;
    console.log("Today end minute: " + this.TodayendTime.minute);
   
  }

  onEndTimeChange(){

    if(!this.controlsAreBinded){
        return;
    }
    let newHour = this.TodayendTime.hour - this.fixedHourInterval;
    let newMinute = this.TodayendTime.minute - this.fixedMinuteInterval;
    let newEndTime = { hour : newHour,
                       minute : newMinute }
    this.TodaystartTime = newEndTime;

    //this.TodaystartTime.hour = this.TodayendTime.hour - this.fixedHourInterval;
    console.log("Today start hour: " + this.TodaystartTime.hour);
    //this.TodaystartTime.minute = this.TodayendTime.minute - this.fixedMinuteInterval;
    console.log("Today start minute: " + this.TodaystartTime.minute);
    
  }
  scrollTo(){
    var scrollContainer = document.getElementById("day_view_scroll")
    setTimeout(function(){ scrollContainer.scrollTop = 465 }, 500);
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

  searchWBI(){

    if (this.searchString == null || this.searchString == ""){
      this.WBIDisabled = true;
      this.projectDisabled = false;
      this.searchWBIs = false;
      alert("you can't search for empty WBI!");
      return ;
    }


    this.wbiService.searchWBI(this.searchString).subscribe(
      data=> {
        console.log(data);
        this.wbiList = (data);
        this.searchWBIs = true;
        if (data.length != 0){
          this.WBIDisabled = false;
          this.projectDisabled = true;
          this.openWBI = true;
          // this.popup.show();
          this.modalService.open(this.searchSuccess);
        }
        else{
          this.WBIDisabled = true;
          this.projectDisabled = false;
          this.modalService.open(this.searchFail);
          this.searchWBIs = false;
        }
      },
      error =>{
        alert(error);
      }
    )
  }

  locateProject(){
    console.log("i want to locate project");
    if (!this.searchWBIs){

      return ;
    }

    if (this.selectedWBI == null){
      this.selectedProject = null;
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

  getThisCustomDay(){
    this.selected = true;
    this.events = [];
    if (this.selectedCustomday == null){
      this.confirmDisabled = true;
      this.selected = false;

      this.customDayNameEmpty = true;

      this.customDayName = "";
      this.customDayDescription = "";
      return ;
    }
    else {

      this.customDayNameEmpty = false;
      
      this.confirmDisabled = false;
      for(let oneCustomDay of this.customdayList){
        if (oneCustomDay.customDayId == this.selectedCustomday){
          //this.selectCustomDayItem = oneCustomDay;
         // console.log(this.selectCustomDayItem);
        this.customDayName = oneCustomDay.name;
        this.customDayDescription = oneCustomDay.description;

        

        this.getAllTemplates();          
        }
        
    }
    }
  }

  deleteCustomDay(){
    console.log("I want to delete this custom day!");
    this.mycustomdayService.deleteCustomDay(this.selectedCustomday).subscribe(
      data=>{
        console.log(data);
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };
        this.router.navigate(['addtimeslip'],navigationExtras);
      },error =>{
        alert(error);
      }
    )
  }

    getAllTemplates(){
       // this.timeSlipTemplates 
       this.events = [];
       console.log("i want to get all the timeslip template for this customday");
       this.timeSlipTemplateService.getAllTimeSlips(this.selectedCustomday).subscribe(
         data => {
           console.log(data);
           this.timeSlipTemplates = data;
           if (data.length == 0){
             return ;
           }
           this.ShowAllTemplates();
         },
         error =>{
           alert(error);
         }
       )
    }

      ShowAllTemplates(){
          console.log("I want to show all ts");
          this.events = [];

          //if (this.timeSlipTemplates)

           for (let oneTimeSlip of this.timeSlipTemplates){
            let startTime : string = oneTimeSlip.startTime;
            let endTime : string = oneTimeSlip.endTime;
           console.log("I want to get the sliced string");
            let startHour =  parseInt(startTime.slice(11,13));
            let startMinute= parseInt(startTime.slice(14,16));
            let endHour = parseInt(endTime.slice(11,13));
            let endMinute = parseInt(endTime.slice(14,16));
            console.log(startHour);
            console.log(startMinute);
            //this.mySecretDay.setHours()
            let startDate : Date = new Date(this.mySecretDay.valueOf()) ;
            let endDate : Date =  new Date (this.mySecretDay.valueOf());
            startDate.setHours(startHour,startMinute);
            //startDate.setMinutes(startMinute);
            endDate.setHours(endHour,endMinute);
            //endDate.setMinutes(endMinute);
            console.log(startDate);
            console.log(endDate);
            console.log("I want to see what is in one time slip");
            console.log(oneTimeSlip);
            //this.getTitleName(oneTimeSlip.remarks,startDate,endDate,oneTimeSlip.timeslipTemplateId,oneTimeSlip.newChangeRequestId);
            
            this.addNewEvent(oneTimeSlip.remarks,startDate,endDate,oneTimeSlip.timeslipTemplateId,oneTimeSlip.newChangeRequestId,oneTimeSlip.wbiName);
          }   
        }

  addToTemplate(){
    let startDate = new Date(this.viewDate.valueOf());
    startDate.setHours(this.TodaystartTime.hour,this.TodaystartTime.minute);
    let endDate = new Date(this.viewDate.valueOf());
    endDate.setHours(this.TodayendTime.hour,this.TodayendTime.minute);
    let validationEvent : CalendarEvent= {
      start:startDate,
      end:endDate,
      title: " test"
    }   
        let result = this.validateNewEvent(validationEvent,this.events);
        if (result == false){
          alert("you need to ensure there is no time overlap Or Time is correct!!");
          return ;
        }else {
          let oneTemplate : TimeSlipTemplate = {
            WBI_Id : this.selectedWBI,
            CustomDayId : this.selectedCustomday,
            StartTime : this.padNumber(this.TodaystartTime.hour)  + ":"+ this.padNumber(this.TodaystartTime.minute),
            EndTime :  this.padNumber(this.TodayendTime.hour) + ":"+ this.padNumber(this.TodayendTime.minute),
            Remarks : this.newEventTitle  
          }
          console.log("I want to post a timeslip template");
          console.log(oneTemplate);
          this.timeSlipTemplateService.postTemplate(oneTemplate).subscribe(
            data=>{
              console.log(data);
              this.getAllTemplates();
              this.ClearAllEvents();
              this.TodaystartTime = this.TodayendTime;
              //this doesn't work yet
              this.TodayendTime = {hour:endDate.getHours() + DEFAULT_HOUR_INTERVAL,minute:endDate.getMinutes()};
            },
            error =>{
              alert(error);
            }
          )    
        }
  }

  validateNewEvent(validationEvent : CalendarEvent, events : Array<CalendarEvent<{ timeSlipId: string,WBIId : string }>>): boolean{
    if (validationEvent.start >= validationEvent.end){
      return false;
    }
    for (let oneEvent of events){
      if (oneEvent.start>= validationEvent.end || oneEvent.end <= validationEvent.start){

      }else {
        return false;
      }
    }
    return true;
  }

  confirmEdit(){
    console.log("i want to see what's start time hour");
    console.log(this.EditStartTime.hour)
    this.EditStartDate.setHours(this.EditStartTime.hour,this.EditStartTime.minute);
    console.log(this.EditStartDate);
    this.EditEndDate.setHours(this.EditEndTime.hour,this.EditEndTime.minute);

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
      this.getAllTemplates();
      return ;
    }else {
      let editedTimeSlipTemplate: TimeSlipTemplate = {
        TimeslipTemplateId : this.EditTimeSlipId,
        StartTime : this.EditStartDate.toLocaleString(),
        EndTime : this.EditEndDate.toLocaleString(),
        Remarks : this.EditRemark    
      }
      console.log("i want to comfirm edit");
      console.log(editedTimeSlipTemplate);
      this.timeSlipTemplateService.updateTimeSlipTemplate(editedTimeSlipTemplate).subscribe(
        data=>{
          console.log(data);
          this.getAllTemplates();
          //this.mr.close();
        },error =>{
          alert(error);
        }
      )    
    }    
  }


  addNewEvent(title,start,end,timeSlipId,WBIId,WBIName){
      console.log(start);
      //this.getWBIName(WBIId);
      //console.log("wbi name is : "+this.EditWBIName)
      this.events.push({
      title: WBIName,
      start: start,
      end: end,
      meta:{
        timeSlipId :timeSlipId,
        WBIId : WBIId,
        remark:title
      },
      color: colors.blue,
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
    //this.selectedWBIs.push(WBI);
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
      this.getAllTemplates();
      return ;
    }else {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });    
    }
  }

  validateEditEvent(event :CalendarEvent): boolean{
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

  getWBIName(WBIId : string){
    console.log("I want to get WBI Name!")
    let name ;
    this.wbiService.getOneWBI(WBIId).subscribe(
      data=> {
        console.log(data);
        this.EditWBIName = data["newName"];
        name=data["newName"];
      },
      error =>{
        alert (error);
        
      }
    ) 
  }

  getTitleName(remarks: any,startDate: Date,endDate:Date,timeslipTemplateId:any, WBIId : string) {
    console.log("I want to get WBI Name!")
    let WbiName ;
    this.wbiService.getOneWBI(WBIId).subscribe(
      data=> {
        console.log(data);
        //this.titleName = data["newRemarks"];
        //name=data["newRemarks"];
        WbiName = data["newName"];
        this.addNewEvent(remarks,startDate,endDate,timeslipTemplateId,WBIId,WbiName)

      },
      error =>{
        alert (error);
        
      }
    )     
  }

  changeProject(){
    this.showSelect = true;
    this.showInput = false;
    console.log("hello");
    this.selectedWBI = null;
    if (this.selectedProject == null || this.selectedProject== ""){
        this.wbiList = null;
        this.WBIDisabled = true;
        this.searchDisabled = false;
        return ;
    }else {
      this.wbiService.GetAllWBIsByProjectId(this.selectedProject).subscribe(data=>{

        console.log(data);
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

  getAllCustomDays(){
    this.mycustomdayService.getCustomdays(sessionStorage.getItem('userId')).subscribe(
      data=> {
      console.log(data);
      this.customdayList = data;
      },
      error => {
        alert(error);
      }
    )
  }

  AddToEvent(){
    //console.log(this.mySecretDay.getFullYear().toString());
    //console.log((this.mySecretDay.getUTCMonth()+1).toString());
    //console.log(this.mySecretDay.getDate().toString());
    //console.log("i am in addding to event!")
    //this.newEvent[0].title = this.newEventTitle;
    //console.log(this.newEvent[0].start.getFullYear().toString())
   // console.log(new Date(Date.parse(this.newEvent[0].start.getFullYear().toString() + "/" + this.newEvent[0].start.getMonth().toString() + "/" + this.newEvent[0].start.getDate().toString() + " " + this.TodaystartTime.hour + ":"+ this.TodayendTime.minute))  )
    this.showProjectList();
    this.newEvent[0].start = new Date(new Date(Date.parse(this.newEvent[0].start.getFullYear().toString() + "/" + (this.newEvent[0].start.getMonth()+1).toString() + "/" + this.newEvent[0].start.getDate().toString() + " " + this.TodaystartTime.hour + ":"+ this.TodaystartTime.minute)));
    console.log(this.newEvent[0].start);
    this.newEvent[0].end = new Date(new Date(Date.parse(this.newEvent[0].start.getFullYear().toString() + "/" + (this.newEvent[0].start.getMonth()+1).toString() + "/" + this.newEvent[0].start.getDate().toString() + " " + this.TodayendTime.hour + ":"+ this.TodayendTime.minute))); 
    console.log(this.newEvent[0].end);     
    //this.addNewEvent(this.newEventTitle,this.newEvent[0].start,this.newEvent[0].end,this.selectedWBI);
    this.newEvent = [];
    //this.newEventForm = false;
    this.refresh.next(); 
    //console.log(this.events);
    this.newEventTitle = "";
    this.selectedProject = "";
    this.selectedWBI = "";
    this.TodaystartTime = "";
    this.TodayendTime = "";
    this.searchWBIs = false;

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

  }

  ClearAllEvents(){
    // this.events = [];
    // this.selectedWBIs = [];
    this.newEventTitle = "";
    this.selectedProject = "";
    this.selectedWBI = "";
    this.searchString = "";
    this.searchWBIs = false;
    this.searchDisabled = false;
    this.projectDisabled = false;
  }

  confirmAndReturn(){ 

    if (this.customDayName == ""){
      this.customDayNameEmpty = true;
      return ;
    }else {

      let customDay : CustomDayVM = {
        Name : this.customDayName,
        Description : this.customDayDescription,
        UserId : sessionStorage.getItem('userId'),
        CustomDayId: this.selectedCustomday
      }
      this.mycustomdayService.upDateCustomday(customDay).subscribe(
        data=>{
          console.log(data);
          let navigationExtras: NavigationExtras = {
            queryParamsHandling: 'preserve',
            preserveFragment: true
          };
          this.router.navigate(['addtimeslip'],navigationExtras);
        },error=>{
          alert(error);
        }
      )
    }  
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

    padNumber(n:number){
      return (n < 10) ? ("0" + n) : n;
    }

}    

export class CustomDayVM{
  Name : string;
  Description : string;
  UserId : string;
  TimeSlip? :TimeslipBackEndModel[];
  CustomDayId?:  string;
}

export class TimeslipBackEndModel {
  StartTime:string;
  EndTime:string;
  Remarks: string;
  WBI_Id : string;
  UserId: String;
  
}