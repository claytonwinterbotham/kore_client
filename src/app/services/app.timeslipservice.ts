import { Injectable }     from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class TimeslipModel {
    TimeSlipId? : string
    StartDate:string;
    EndDate:string;
    Remarks: string;
    WBIId? : string;
    UserId: String;
    DayId: String;
}

@Injectable()
export class MyTimeslipService {
    public site:string;
    constructor(private http: Http) {
        // for aws:
        //this.site = 'https://yuu5n724ub.execute-api.us-east-1.amazonaws.com/Prod/timeslip/';
        // for local host:
        this.site = "http://localhost:64779/timeslip/"
     }

    //add a Timeslip
    postTimeslip(_timeslip: any): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));       
        let dataUrl = this.site + "Create";
        let TimeslipJson = {         
            "StartTime": _timeslip.StartDate,
            "EndTime": _timeslip.EndDate,
            "Remarks": _timeslip.Remarks,
            "WBI_Id": _timeslip.WBIId,
            "UserId": _timeslip.UserId,
            "DayId": _timeslip.DayId,
        }
        console.log(TimeslipJson)
        return this.http.post(dataUrl, TimeslipJson,options)
            .map(this.extractData) 
            .catch(this.handleError); 
    } 

    createTimeslipByCustomday(_customdayTimeslipVM : any): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));    
        let dataUrl = this.site + "CreateByCustomday";    
        let TimeslipByCustomday = {
            "CustomdayId":  _customdayTimeslipVM.CustomdayId,
            "Date": _customdayTimeslipVM.Date
        }
        return this.http.post(dataUrl, TimeslipByCustomday,options)
        .map(this.extractData) 
        .catch(this.handleError);        
    }

    //get all Timeslips
    getTimeslips(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        let dataUrl = this.site + "List";
        return this.http.get(dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTimeSlipsByUserId(UserId : string):Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});     
        let dataUrl = this.site + "GetAllTimeslipsByUserId/" + UserId;
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        return this.http.get(dataUrl, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

    //get one Timeslip
    getOneTimeslip(TimeslipId : string): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        let dataUrl = this.site + "GetOneTimeslip/" + TimeslipId;
        return this.http.get(dataUrl, options)
                .map(this.extractData)
                .catch(this.handleError);
    }


    //update one Timeslip
    updateTimeslip(_timeslip : any): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));  
        let dataUrl = this.site + "Edit";
        let TimeslipJson = {  
            "TimeslipId":_timeslip.TimeSlipId,       
            "StartTime": _timeslip.StartDate,
            "EndTime": _timeslip.EndDate,
            "Remarks": _timeslip.Remarks,
            "UserId": _timeslip.UserId,
            "DayId": _timeslip.DayId,
        }
        return this.http.put(dataUrl,TimeslipJson, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

    //delete a Timeslip
    deleteTimeslip(id: String): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        id = id.toUpperCase();
        console.log("Timeslip id:" + id);
        let timeslipVM = {
            "TimeSlipId" : id
        };
        let dataUrl = this.site + "Delete";
        return this.http.post(dataUrl,timeslipVM,options)
            .map(this.extractData)
            .catch(this.handleError);            
    }
    
    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
    
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // console.log(error.json().err)
        // let errMsg = error.json().err
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        // console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}

