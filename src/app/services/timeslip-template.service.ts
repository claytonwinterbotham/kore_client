import { Injectable } from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class TimeslipTemplateService {

  public site:string;
  constructor(private http: Http) {
      // for aws:
      this.site = 'https://yuu5n724ub.execute-api.us-east-1.amazonaws.com/Prod/customDay_WBI/';
      // for local host:
      //this.site = "http://localhost:64779/wbi/"
   }

   applyTimeTemplate(_customdayTimeslipVM : any): Observable<Comment[]>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});
    // headers.append( 'Authorization', 'Bearer ' 
    // + sessionStorage.getItem('token'));    
    let dataUrl = this.site + "CreateAllTimeslipsUsingCustomDay";    
    let TimeslipByCustomday = {
        "CustomdayId":  _customdayTimeslipVM.CustomdayId,
        "Date": _customdayTimeslipVM.Date
    }
    return this.http.post(dataUrl, TimeslipByCustomday,options)
    .map(this.extractData) 
    .catch(this.handleError);        
}

  postTemplate(tt: TimeSlipTemplate): Observable<Comment[]>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});
    // headers.append( 'Authorization', 'Bearer ' 
    // + sessionStorage.getItem('token'));       
    let dataUrl = this.site + "Create";
    return this.http.post(dataUrl, tt,options)
    .map(this.extractData) 
    .catch(this.handleError);         
  }

  getAllTimeSlips(id : string): Observable<Comment[]>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});
    // headers.append( 'Authorization', 'Bearer ' 
    // + sessionStorage.getItem('token'));   
    //id =  encodeURIComponent(id);    
    let dataUrl = (this.site + "GetAllTimeslipTemplateByCustomDay/" + id);
    console.log(dataUrl);
    return this.http.get(dataUrl,options)
    .map(this.extractData) 
    .catch(this.handleError);         
  }

  // update a TimeSlip Template
  updateTimeSlipTemplate(timeSlipTemplate: TimeSlipTemplate): Observable<Comment[]>{
    let headers = new Headers({ 'Content-Type': 'application/json' }); 
    let options = new RequestOptions({headers: headers});
    let dataUrl = this.site + "Update";
    console.log("here is the detail to be updated:" );
    console.log(timeSlipTemplate);
    return this.http.put(dataUrl,timeSlipTemplate,options)
        .map(this.extractData)
        .catch(this.handleError);        
  }

      //delete a Timeslip Template
      deleteTimeslipTemplate(id: String): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        id = id.toUpperCase();
        console.log("Timeslip id:" + id);
        // let timeslipVM = {
        //     "TimeSlipId" : id
        // };
        let dataUrl = this.site + "Delete/" + id;
        return this.http.delete(dataUrl,options)
            .map(this.extractData)
            .catch(this.handleError);            
      }

  private extractData(res: Response) {
    let body = res.json();
    return body;
}

private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
console.log(error._body);
console.log(JSON.parse(error._body).message);
//console.error(errMsg); // log to console instead
return Observable.throw(JSON.parse(error._body).message);
}

  

}

export class TimeSlipTemplate{
  TimeslipTemplateId? : string;  
  WBI_Id? : string;
  CustomDayId? : string;
  StartTime : string;
  EndTime : string;
  Remarks : string;
}
