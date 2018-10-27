import { Component } from '@angular/core';
import {App, Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../providers/auth-service';

import {VotePage} from "../vote/vote";
import {VotingService} from "../../providers/voting-service";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-vote',
  templateUrl: 'votings.html',
})
export class VotingsPage {

    loading: Loading;

    loaded: boolean = false;        //Ion-Card solange verbergen bis alles geladen ist

    wetterIcon: any;

    routen: any;

    constructor(public app: App, private nav: NavController, private voting: VotingService, public http: Http, private loadingCtrl: LoadingController, public toastCtrl: ToastController, private auth: AuthService, private storage: Storage) {

      var testRouten = "[{" +
        "  \"routenId\": \"1\"," +
        "  \"routenName\": \"Meine Route - Arbeit\"," +
        "  \"startBf\": \"Düsseldorf HBF\"," +
        "  \"endBf\": \"Köln HBF\"," +
        "  \"startDatum\": \"Montag bis Freitag\"," +
        "  \"startZeit\": \"10 Uhr\"," +
        "  \"Routenpunkte\": [" +
        "    {" +
        "      \"abfahrtBf\": \"Düsseldorf HBF\"," +
        "      \"abfahrtGleis\": \"Gleis 3\"," +
        "      \"abfahrtUhrzeit\": \"10:23 Uhr\"," +
        "      \"Zug\": \"RE1\"," +
        "      \"pünktlich\": \"vorraussichtlich pünktlich\"," +
        "      \"ankunftBf\": \"Solingen HBF\"," +
        "      \"ankunftGleis\": \"Gleis 5\"," +
        "      \"ankunftUhrzeit\": \"10:40 Uhr\"" +
        "    }," +
        "    {" +
        "       \"abfahrtBf\": \"Solingen HBF\"," +
        "      \"abfahrtGleis\": \"Gleis 2\"," +
        "      \"abfahrtUhrzeit\": \"10:42 Uhr\"," +
        "      \"Zug\": \"RB48\"," +
        "      \"pünktlich\": \"5 min Verspätung\"," +
        "      \"ankunftBf\": \"Köln HBF\"," +
        "      \"ankunftGleis\": \"Gleis 5\"," +
        "      \"ankunftUhrzeit\": \"11:10 Uhr\"" +
        "    }" +
        "  ]" +
        "}]";
      //this.storage.set("routen", JSON.parse(testRouten));
      this.routen = JSON.parse(testRouten);

      /** Routen aus dem Storage holen
      storage.get('routen').then((val) => {
        this.routen = val;
        console.log(this.routen);
      });
       */
      this.getWeather();
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

    public detail(x)
    {
      this.voting.create(x).subscribe(allowed =>
      {
        this.nav.push(VotePage);
      },
        err => {
          console.log(err.toString());
      });
    }

    showLoading() {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait for Logout...'
      });
      this.loading.present();
    }

  //Seite erneut laden
  refreshPage(){
    this.nav.setRoot(VotingsPage);
  }

  public getWeather()
  {
    this.http.get('http://api.openweathermap.org/data/2.5/weather?id=3247434&appid=7be80d336e0523fc34c6a840a5dd8933&units=Metric&mode=json&lang=de', ).map(res => res.json()).subscribe(
      data => {
        console.log("Response vom Wetter Webservice: ");
        console.log(data);
        this.wetterIcon = data.weather[0].icon;
      },
      err => {
        console.log("Login Anfrage fehlgeschlagen.");
      }
    );

  }
}
