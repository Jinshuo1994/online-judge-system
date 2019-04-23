
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise'

declare var auth0: any;

const CLIENT_ID = 'DwMqO9K22SIfe61zBZGgfAHa36JH9Mp4';
const DOMAIN = 'super-collaborative-oj.auth0.com';
@Injectable()
export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: CLIENT_ID,
    domain: DOMAIN,
    responseType: 'token id_token',
    redirectUri: 'http://localhost:3003/',
    scope: 'openid profile email'
  });

  constructor(public router: Router, public http: Http) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): Promise<any> {
    return new Promise((res, rej) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          this.localLogin(authResult);
          res(authResult);
          //this.router.navigate(['/home']);
        } else if (err) {
          this.router.navigate(['/home']);
          rej(err);
        }
      });
    })

  }

  private localLogin(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;

    this.auth0.logout({
      return_to: window.location.origin
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this._accessToken && Date.now() < this._expiresAt;
  }


  public getProfile(cb): void {
    if (!this._accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self: any = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
        console.log(profile);
      }
      cb(err, profile);
    });
  }

  public resetPassword(): void {
    const self: any = this;
    let profile = self.userProfile;
    let url = `https://${DOMAIN}/dbconnections/change_password`;
    let headers = new Headers({'content-type': 'application/json'})
    let body = { client_id: `${CLIENT_ID}`,
        email: profile.email,
        connection: 'Username-Password-Authentication' ,
        json: true };

    this.http.post(url, body, headers)
      .toPromise()
      .then((res: Response) => {
        console.log(res)
      })
      .catch(this.handleError);

}

  private handleError(error: any): Promise<any> {
    console.log("Error occurred", error);
    return Promise.reject(error.message || error);
  }}
