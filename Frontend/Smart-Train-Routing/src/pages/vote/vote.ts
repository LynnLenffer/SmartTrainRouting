import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../providers/auth-service';
import {VotingService} from "../../providers/voting-service";
import {VotingsPage} from "../votings/votings";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-vote',
  templateUrl: 'vote.html',
})
export class VotePage {

    rangeValueMood = 3;
    valueReason = "";
    loaded: boolean = false;

    alternativ: boolean = false;

    votingInfo: any;
    body: any;
    hostaddress: any;

    constructor( private nav: NavController, public http: Http, public toastCtrl: ToastController, private auth: AuthService, private voting: VotingService, private storage: Storage) {

      this.votingInfo = this.voting.getVotingInfo().object;

      console.log("Übergebene Strecke");
      this.vote();
      //console.log(this.votingInfo.votingId);
    }

    public vote()
    {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.body = "{\"travel_data\": {\"start\": \"Köln Hbf\",\"end\": \"Düsseldorf Hbf\",\"time\": \"1404\"}}";
      console.log(this.body);

      this.http.post('http://127.0.0.1:5000/', this.body ).map(res => res.json()).subscribe(
        data =>
        {
          console.log(data.toString());
        },
        err =>
        {
          console.log(err.toString());
        });
    }

  changeAlternativ(){
    this.alternativ = true;
  }

  SuccessMsg() {
    let toast = this.toastCtrl.create({
      message: `Stimme erfolgreich abgegeben!`,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
  /*
  //Bei fehlerhaften Laden eine definierte Nachricht ausgeben
  ErrorMsg(content) {
    let toast = this.toastCtrl.create({
      message: content,
      duration: 1200,
      position: 'bottom'
    });
    toast.present();
  }
    //Auth Nutzer zur�cksetzen Testzwecke
      /**
    public logout(){
        this.auth.logout().subscribe(succ => {
        });
    }**/


}
