import { Injectable }     from '@angular/core';
import { Component }      from '@angular/core';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class UserModel {
    UserId: string;
    Email: string;
    Password: string;
    FirstName: string;
    LastName: string;
}

export class LoginModel {
    Email : string;
    Password : string;
}

@Injectable()
export class MyUserService {
    public site:string;
    constructor(private http: Http) {

        //for asw:
        this.site = "https://yuu5n724ub.execute-api.us-east-1.amazonaws.com/Prod/user/"

        //for localhost:
        //this.site = 'http://localhost:64779/user/';
     }

     login(userInfo : LoginModel): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "Login";
        return this.http.post(dataUrl,userInfo,options)
                .map(this.extractData)
                .catch(this.handleError);         
     }

    //get all users
    getUsers(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "List";
        return this.http.get(dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    //get one user
    getOneUser(UserId : string): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 
        let options = new RequestOptions({headers: headers});
        let dataUrl = this.site + "GetOneProject/" + UserId;
        return this.http.get(dataUrl, options)
                .map(this.extractData)
                .catch(this.handleError);
    }
 //update one user
    updateUser(_user : any): Observable<Comment[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});  
        let dataUrl = this.site + "Update";
        let UserJson = {     
            "UserId": _user.UserId,    
            "Email": _user.Email,
            "Password": _user.Password,
            "FirstName": _user.FirstName,
            "LastName": _user.LastName
               
        };
        return this.http.put(dataUrl,UserJson, options)
        .map(this.extractData)
        .catch(this.handleError);
    }
//delete one user

deleteUser(id: String): Observable<Comment[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' }); 
    let options = new RequestOptions({headers: headers});
    console.log("User id:" + id);
    let dataUrl = this.site + "Delete/" + id;
    
    return this.http.delete(dataUrl,options)
        .map(this.extractData)
        .catch(this.handleError);
        
}
    //create a user
    registerUser(_user: UserModel): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});       
        let dataUrl = this.site + "Create";
        let UserJson = {         
            "Email": _user.Email,
            "Password": _user.Password,
            "FirstName": _user.FirstName,
            "LastName": _user.LastName
        }
        console.log(UserJson)
        return this.http.post(dataUrl, UserJson,options)
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