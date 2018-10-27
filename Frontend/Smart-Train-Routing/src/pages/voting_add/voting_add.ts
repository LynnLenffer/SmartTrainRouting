import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {VotingsPage} from "../votings/votings";
import {AuthService} from "../../providers/auth-service";
import {Storage} from "@ionic/storage";
import {VotingsFbPage} from "../votings_fb/votings_fb";


@Component({
  selector: 'page-votegroup-add',
  templateUrl: 'voting_add.html'
})
export class addVotegroupPage {

  //Daten aus den Eingabefeldern
  valueName:any;
  valueGroup:any;
  teilnehmer: any;
  multipleVoting: any;
  startdate: any;
  enddate: any;

  body: any; //Body des POST-Requests

  info:any; //Informationen über den Nutzer

  hostaddress: any;

    constructor(public nav: NavController, public http: Http, public toastCtrl: ToastController, private auth: AuthService, private storage: Storage) {
      this.info = this.auth.getUserInfo();
      /** Hostadresse aus dem Storage holen */
      storage.get('hostaddress').then((val) => {
        this.hostaddress = val;
      });
    }

    public create() {

      if (this.checkContent(this.valueName, this.multipleVoting, this.startdate, this.enddate, this.teilnehmer)) {
        let headers = new Headers();
        headers.append('Authorization', "Bearer " + this.info.jwt);
        headers.append('Content-Type', 'application/json');

        /** Datum formatieren für oracle-DB*/
        //this.startdate = this.formatDate(this.startdate);
        //this.enddate = this.formatDate(this.enddate);

        this.body = "{" +
          "\"votename\":\"" + this.valueName + "\", " +
          "\"category\":\"" + this.valueGroup + "\", " +
          "\"startdate\":\"" + this.startdate + "\", " +
          "\"enddate\":\"" + this.enddate + "\", " +
          "\"department\":\"" + this.teilnehmer + "\", " +
          "\"multipleVoting\": " + this.multipleVoting + " " +
          "}";
        console.log(this.body);

        this.http.post(this.hostaddress+'votegroup/create', this.body, {headers: headers}).map(res => res.text()).subscribe(
          data => {
            if (data) //Webservice gibt TRUE bei erfolgreichem Erstellen zurück
            {
              this.SuccessMsg();
              this.nav.setRoot(addVotegroupPage);
            }
            else {
              this.ErrorMsg();
            }

          },
          err => {
            console.log(err.toString());
          });
      }
    }

    private formatDate(dateString: any){
      var d = new Date(dateString);
      var month = '' + (d.getMonth() + 1);
      var day = '' + d.getDate();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return day + '.' + month + '.' + d.getFullYear();
    }

    //Überprüft ob alle Felder ausgefüllt wurden + ob das Startdatum vor dem Enddatum kommt
    public checkContent(valueName:any, multipleVoting:any, startdate:any, enddate:any, teilnehmer:any) {
      if (valueName == null || multipleVoting == null || startdate == null || enddate == null || teilnehmer == null) {
        this.FieldMissingErrorMsg();
        return false;
      }
      if (Date.parse(this.startdate) > Date.parse(this.enddate)) {
        this.TimeErrorMsg();
        return false;
      }
      return true;
    }



    //Bei erfolgreichen Laden eine Nachricht ausgeben
  SuccessMsg() {
    let toast = this.toastCtrl.create({
      message: `Eine neue Abstimmung wurde erfolgreich erstellt!`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  //Bei falscher Uhrzeit
  TimeErrorMsg() {
    let toast = this.toastCtrl.create({
      message: `Das Enddatum ist zeitlich vor dem Startdatum!`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  //Wenn ein Feld nicht ausgefüllt wurde
  FieldMissingErrorMsg() {
    let toast = this.toastCtrl.create({
      message: `Es müssen alle Felder ausgefüllt werden!`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  ErrorMsg(){
    let toast = this.toastCtrl.create({
      message: `Ein Fehler ist aufgetreten!`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
