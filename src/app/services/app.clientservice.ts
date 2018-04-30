import { Injectable }     from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class ClientModel {
    AccountId: string;
}

@Injectable()
export class MyClientService {
    public site:string;
    constructor(private http: Http) {
        // for aws:
        this.site = 'https://yuu5n724ub.execute-api.us-east-1.amazonaws.com/Prod/client/';
        // for local host:
        // this.site = "http://localhost:64779/client/"        
     }

    //get all clients
    getClients(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "List";
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('token'));
        return this.http.get(dataUrl, options)
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