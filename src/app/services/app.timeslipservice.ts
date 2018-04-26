import { Injectable }     from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class TimeslipModel {
    StartDate:string;
    EndDate:string;
    Remarks: string;
    WBIId : string;
    UserId: String;
    DayId: String;
}

@Injectable()
export class MyTimeslipService {
    public site:string;
    constructor(private http: Http) {
        this.site = 'http://localhost:64779/timeslip/';
     }

    //add a Timeslip
    postTimeslip(_timeslip: TimeslipModel): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});       
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

    //get all Timeslips
    getTimeslips(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "List";
        return this.http.get(dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTimeSlipsByUserId(UserId : string):Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});     
        let dataUrl = this.site + "GetAllTimeslipsByUserId/" + UserId;
        return this.http.get(dataUrl, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

    //get one Timeslip
    getOneTimeslip(TimeslipId : string): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "GetOneTimeslip/" + TimeslipId;
        return this.http.get(dataUrl, options)
                .map(this.extractData)
                .catch(this.handleError);
    }


    //update one Timeslip
    updateTimeslip(_timeslip : any): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});  
        let dataUrl = this.site + "Update";
        let TimeslipJson = {         
            "StartDate": _timeslip.StartDate,
            "EndDate": _timeslip.EndDate,
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
        console.log("Timeslip id:" + id);
        let dataUrl = this.site + "Delete";
        let idJson = {
            "id": id
        };
        return this.http.post(dataUrl,idJson,options)
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