import { Component } from '@angular/core';
import {App, Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../providers/auth-service';

import {VotePage} from "../vote/vote";
import {VotingService} from "../../providers/voting-service";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {GraphenPage} from "../graph/graph";
import {VotingsPage} from "../votings/votings";

@Component({
  selector: 'page-vote',
  templateUrl: 'votings_fb.html',
})
export class VotingsFbPage {

  loading: Loading;

  loaded: boolean = false;        //Ion-Card solange verbergen bis alles geladen ist
  votegroupdata: any;            //Liste aller aktuellen Abstimmungen
  info: any;                      //Aktuelle Nutzerdaten
  hostaddress: any;

  constructor(public app: App, private nav: NavController, private voting: VotingService, public http: Http, private loadingCtrl: LoadingController, public toastCtrl: ToastController, private auth: AuthService, private storage: Storage) {

    /** Laden der aktuellen nutzerdaten */
    this.info = this.auth.getUserInfo();

    /** Hostadresse aus dem Storage holen */
    storage.get('hostaddress').then((val) => {

      this.hostaddress = val;

      /** HTTP Anfrage zum Laden der Abstimmungen */
      let headers = new Headers();
      headers.append('Authorization', "Bearer " + this.info.jwt);
      this.http.get(this.hostaddress+'votegroup/all/dep/'+this.info.department, { headers: headers}).map(res => res.json()).subscribe(
        data =>
        {
          console.log(data);

          //Datum formatieren
          for (var t=0; t<data.length; t++){
            data[t].startdate = this.formatDate(data[t].startdate);
            data[t].enddate = this.formatDate(data[t].enddate);
          }
          this.votegroupdata = data;
        },
        err =>
        {
          console.log(err.toString());
          this.ErrorMsg("Fehler beim Laden der aktuellen Abstimmungen.");
        });
    });
  }

  /** Bei fehlerhaften Laden eine definierte Nachricht ausgeben */
  ErrorMsg(content) {
    let toast = this.toastCtrl.create({
      message: content,
      duration: 1200,
      position: 'bottom'
    });
    toast.present();
  }

  public showGraph(id: any, name: any, category: any, creator:any, startdate: any, enddate: any)
  {
    this.voting.create(id).subscribe(allowed =>
      {
        if (allowed) {
          this.nav.push(GraphenPage);
        }
        else{
          console.log('Id konnte nicht gesetzt werden.');
        }
      },
      err => {
        console.log(err.toString());
      });
  }

  private formatDate(dateString: any){
    var d = new Date(dateString),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('.');
  }

  public logout()
  {
    this.storage.set('jwt', null);
    //this.showLoading();
    this.app.getRootNavs()[0].setRoot(LoginPage);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait for Logout...'
    });
    this.loading.present();
  }

  //Seite erneut laden
  refreshPage(){
    this.nav.setRoot(VotingsFbPage);
  }
}
