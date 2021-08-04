import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../services/global.service'; 
import { AuthenticationService } from '../services/auth/authentication.service';
import { Observable } from 'rxjs';
import { UserProfileModel } from '../user/profile/user-profile.model';

@Injectable()
export class ConnectionService {
  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
  ) {
  }

  public token = '';

  public getConnected(page){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });

    const options = { headers: headers };

    const connectionEndpoint =
      this.globalService.apiUrl +
      'api/connection?page='+page;
      console.log(connectionEndpoint);
    return this.http.get(connectionEndpoint, options);
  }
  public getConnectedDetails(user_id): Observable<UserProfileModel>{
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });

    const options = { headers: headers };

    const connectionEndpoint =
      this.globalService.apiUrl +
      'api/profile/friend/'+user_id;
      console.log(connectionEndpoint);
    return this.http.get<UserProfileModel>(connectionEndpoint, options);
  }

  public getConnection(page){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });

    const options = { headers: headers };

    const connectionEndpoint =
      this.globalService.apiUrl +
      'api/connection/discover?page='+page;
      console.log(connectionEndpoint);
    return this.http.get(connectionEndpoint, options);
  }

  getRequestList(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const requestsEndpoint =
      this.globalService.apiUrl +
      'api/connection/requests';

    return this.http.get(requestsEndpoint, options);
  }
  postConnectionRequest(formData: any) {
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token,
    });
    const options = { headers: headers };

    const RequestConnectionEndpoint =
      this.globalService.apiUrl +
      'api/connection/request';
    return this.http.post(RequestConnectionEndpoint, formData, options);
  }
  cancelPostConnectionRequest(formData: any) {
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token,
    });
    const options = { headers: headers };

    const RequestConnectionEndpoint =
      this.globalService.apiUrl +
      'api/connection/request-cancel';
    return this.http.post(RequestConnectionEndpoint, formData, options);
  }
  postAcceptConnection(formData: any){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token,
    });
    const options = { headers: headers };

    const AcceptConnectionEndpoint =
      this.globalService.apiUrl +
      'api/connection/accept-request';
    return this.http.post(AcceptConnectionEndpoint, formData, options);
  }
  postRejectConnection(formData: any){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token,
    });
    const options = { headers: headers };

    const rejectConnectionEndpoint =
      this.globalService.apiUrl +
      'api/connection/reject-request';
    return this.http.post(rejectConnectionEndpoint, formData, options);
  }
  postUnconnectConnection(fromData: any){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token,
    });
    const options = { headers: headers };

    const rejectConnectionEndpoint =
      this.globalService.apiUrl +
      'api/connection/unconnect';
    return this.http.post(rejectConnectionEndpoint, fromData, options);
  }
}
