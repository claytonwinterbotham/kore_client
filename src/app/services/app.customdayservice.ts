import { Injectable }     from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { CustomDayVM} from "../add-customday/add-customday.component"
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class MyCustomDayService {
    public site:string;
    constructor(private http: Http) {
        // for aws:
        this.site = 'https://yuu5n724ub.execute-api.us-east-1.amazonaws.com/Prod/customDay/';
        // for local host:
        // this.site = "http://localhost:64779/customDay/"
     }

    //create new customday
    create(_customday : CustomDayVM): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "Create";
        console.log(_customday);
        return this.http.post(dataUrl,_customday, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //get all customdays by this user
    getCustomdays(id : string) :Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "GetOneUserCustomDays/" + id ;
        return this.http.get(dataUrl,options)  
            .map(this.extractData)
            .catch(this.handleError); 
    }
    
    //delete a custom day
    deleteCustomDay(id: String): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        console.log("Custom day id:" + id);
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