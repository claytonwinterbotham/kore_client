import { Injectable }     from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class MyProjectService {
     private dataUrl = 'https://localhost:65424/project/';
    // private dataUrl = 'http://localhost:3000/api/';  // URL to web API
    // private dataUrl = 'api/';
    constructor(private http: Http) { }

    //get all projects
    getProjects(): Observable<string[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        // Need to include 'Authorization' property with token in header.
        // Read token value from the JavaScript session.
    //    headers.append( 'Authorization',
    //                 sessionStorage.getItem('auth_token'))
        let options = new RequestOptions({headers: headers});
        console.log(headers);
    //    console.log(url);
        return this.http.get(this.dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //delete a project

    deleteProject(id: String): Observable<string[]> {
        console.log("Project id:" + id);

        return this.http.delete(this.dataUrl + id)
            .map(this.extractData)
            .catch(this.handleError);
            
    }

    //add a project

    // POST - Project
    // postProject(_project: Object): Observable<Comment[]> {
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
        
    //     let url     = this.dataUrl;

    //     let ProjectModel = {
    //          "ClientId": _project["clientId"]
    //         "Name": _project["name"],
    //         "StartDate": _project["startDate"],
    //         "EndDate": _project["endDate"],
    //        
    //     }
    //     return this.http.post(url, ProjectModel)
    //         .map(this.extractData) 
    //         .catch(this.handleError); 
    // } 
    
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
