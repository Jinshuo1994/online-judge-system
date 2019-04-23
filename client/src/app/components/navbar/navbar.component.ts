import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = "COJ";

  username = "user";
  profile: any;

  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    this.auth.handleAuthentication()
      .then((result) => {
        console.log(result);
      if (this.auth.isAuthenticated()) {
        if (this.auth.userProfile) {
          this.profile = this.auth.userProfile;
        } else {
          this.auth.getProfile((err, profile) => {
            this.profile = profile;
            this.username = this.profile.nickname;
          });
        }
        if (this.profile) {
          this.username = this.profile.nickname;
        }
      }
    })
      .catch((error) => {
        console.log("NOT LOGGED IN \n", error);
      })

  }

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}
