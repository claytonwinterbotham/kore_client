import { Injectable }     from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class WBIModel {
    Description : String;
    EstimatedHours : String;
    ActualHours : String
    ProjectId : string;
}

@Injectable()
export class MyWBIService {
    public site:string;
    constructor(private http: Http) {
        // for aws:
        this.site = 'https://yuu5n724ub.execute-api.us-east-1.amazonaws.com/Prod/wbi/';
        // for local host:
        //this.site = "http://localhost:64779/wbi/"
     }

    //add a wbi
    postWBI(_wbi: WBIModel): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));       
        let dataUrl = this.site + "Create";
        let WBIJson = {         
            "Description": _wbi.Description,
            "EstimatedHours": Number(_wbi.EstimatedHours),
            "ActualHours": 0, 
            "ProjectId": _wbi.ProjectId,
        }
        // console.log(WBIJson)
        return this.http.post(dataUrl, WBIJson,options)
            .map(this.extractData) 
            .catch(this.handleError); 
    }
    
    searchWBI(wbiString : string): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "GetWBIBySearchString/" + wbiString;
        return this.http.get(dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);

    }

    //get all wbi
    getWBIs(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        let dataUrl = this.site + "List";
        return this.http.get(dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //get wbi by project id

    //get all wbi
    GetAllWBIsByProjectId(projectId : string): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        let dataUrl = this.site + "GetAllWBIsByProjectId/" + projectId;
        return this.http.get(dataUrl, options)
                .map(this.extractData)
                .catch(this.handleError);
    }

    //get one wbi
    getOneWBI(wbiId : string): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        wbiId = wbiId.toUpperCase();
        // console.log("WBI ID is "+ wbiId);
        let dataUrl = this.site + "GetOneWBI/" + wbiId;
        return this.http.get(dataUrl, options)
                .map(this.extractData)
                .catch(this.handleError);
    }


    //update one wbi
    updateWBI(_wbi : any): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));  
        let dataUrl = this.site + "Update";
        let WBIJson = {         
            "Description": _wbi.Description,
            "EstimatedHours": Number(_wbi.EstimatedHours),
            "ActualHours": Number(_wbi.ActualHours), 
            "ProjectId": _wbi.ProjectId,
        };
        return this.http.put(dataUrl,WBIJson, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

    //delete a WBI
    deleteWBI(id: String): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        // headers.append( 'Authorization', 'Bearer ' 
        // + sessionStorage.getItem('token'));
        // console.log("WBI id:" + id);
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
        // console.log(error._body);
        // console.log(JSON.parse(error._body).message);
        //console.error(errMsg); // log to console instead
        return Observable.throw(JSON.parse(error._body).message);
    }
}