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
  TodaystartTime: any;
  TodayendTime : any;
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
  selectedCustomday : string;
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

  constructor(private modal: NgbModal,_projectService:MyProjectService,_wbiService:MyWBIService, _timeslipService:MyTimeslipService,
    public router:Router,_customdayService:MyCustomDayService, @Inject(DOCUMENT) private document: Document,private route: ActivatedRoute,
   _timeSlipTemplateService : TimeslipTemplateService) { 
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
    this.wbiService.searchWBI(this.searchString).subscribe(
      data=> {
        console.log(data);
        this.wbiList = (data);
        this.searchWBIs = true;
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

    getAllTemplates(){
       // this.timeSlipTemplates 
       console.log("i want to get all the timeslip template for this customday");
       this.timeSlipTemplateService.getAllTimeSlips(this.selectedCustomday).subscribe(
         data => {
           console.log(data);
           this.timeSlipTemplates = data;
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
            console.log("I want to see what is in one tiem slip");
            console.log(oneTimeSlip);
            
            this.addNewEvent(oneTimeSlip.remarks,startDate,endDate,oneTimeSlip.timeslipTemplateId,oneTimeSlip.newChangeRequestId);
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
          alert("you need to ensure there is no time overlap!");
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
            },
            error =>{
              alert(error);
            }
          )    
        }
  }

  validateNewEvent(validationEvent : CalendarEvent, events : Array<CalendarEvent<{ timeSlipId: string,WBIId : string }>>): boolean{
    for (let oneEvent of events){
      if (oneEvent.start> validationEvent.end || oneEvent.end < validationEvent.start){

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


  addNewEvent(title,start,end,timeSlipId,WBIId){
    console.log(start);
      this.events.push({
      title: title,
      start: start,
      end: end,
      meta:{
        timeSlipId :timeSlipId,
        WBIId : WBIId
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
    this.EditRemark = event.title;
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
      if (oneEvent.start> event.end || oneEvent.end < event.start){
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
        this.EditWBIName = data["newRemarks"];
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

    //this.selectedWBI = "";
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
    this.events = [];
    this.selectedWBIs = [];
  }

  confirmAndReturn(){ 
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