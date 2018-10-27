import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import {Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import {TabsSimpelPage} from "../tabssimple/tabssimple";
import {TabsPage} from "../tabs_fb/tabs_fb";
import {VotingsPage} from "../votings/votings";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loading: Loading;
    jwt: any;

    keepLogin: boolean;

    hostaddress: String;

    /** Werte aus dem Inputfeldern */
    username_input:any;
    password_input:any;

    constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public http: Http, private storage: Storage) {

      storage.get('hostaddress').then((val1) =>
      {
        console.log('Hostadresse beim Start der App: ', val1);

        /** Setze die Host-Adresse wenn nicht vorhanden auf DEFAULT */
        if(val1 == null)
        {
          console.log("Setze Hostadresse auf Standard.");

          /** Für das Deployment */
          //storage.set('hostaddress', 'https://mood.mt-ag.com/');

          /** Für die Entwicklung */
          storage.set('hostaddress', 'https://localhost:8443/')
        }

        /** Setze die globale Variable der Hostadresse*/
        storage.get('hostaddress').then((val2) => {
          this.hostaddress = val2;

          /** Überprüfe ob der Nutzer bereits eingeloggt ist */
          storage.get('jwt').then((jwt) =>
          {
            console.log('JWToken beim Start der App: ', jwt);

            /** Wenn ein jwt gespeichert ist, überprüfe seine Gültigkeit */
            if(jwt != null)
            {
              this.http.post(this.hostaddress+'auth/validate', jwt).map(res => res.text()).subscribe(
                data =>
                {
                  console.log('Antwort des Servers - JWT gültig: ', data);
                  if(data == 'true') /** Wenn das JWT gültig ist*/
                  {
                    this.jwt = jwt;
                    this.navigateToNextPage();
                  }
                },
                error =>
                {
                  console.log("Kein Token oder ein nicht valides Token vorhanden.");
                });
            }
          });
        });
      });

    }

    public login()
    {
      /** HTTP Header konfigurieren*/
      let headers = new Headers();

      /** Header Value "Basic B64(username:password)"*/
      var headerValue = "Basic " + btoa(this.username_input + ":" + this.password_input);

      headers.append('Authorization', headerValue)
      //headers.append('username', this.username_input);
      //headers.append('password', this.password_input);
      console.log("Hostadresse: " + this.hostaddress);

      /** Authentifizieren im Webservice */
      this.http.get(this.hostaddress+'auth/token', { headers: headers }).map(res => res.text()).subscribe(
        data => {
            //console.log("Response vom login Webservice: " + data);

            /** Bei falschen Logindaten gibt der Webserbice ein: "invalid username and password" zurück */
            if(data != "invalid username and password")
            {
              this.jwt = data;
              if(this.keepLogin == true) //Wenn "Remember me" angekreuzt ist
              {
                this.storage.set('jwt', this.jwt); //Speichere das JWT im Storage
              }
              this.navigateToNextPage();
            }
            else {
              this.showError("Eingegebener Nutzername oder Passwort ist falsch. Bitte Anmeldedaten überprüfen.");
            }
        },
        err => {
          console.log("Login Anfrage fehlgeschlagen.");
        }
        );

    }

    navigateToNextPage()
    {
      /** Setze visuelle Ladeanimation */
      this.showLoading();

      /** Extrahiere den Payload aus dem JWT */
      var felder = this.jwt.split('.', 3);

      /** Decode den Payload aus Base64 und speichere diesen als JSON-Objekt*/
      var jwtUserdataJson = JSON.parse(atob(felder[1]));
      //console.log(atob(felder[1]));

      /** Entnehme dem Json die Nutzerdaten */
      var username = jwtUserdataJson.sub;
      var userId = jwtUserdataJson.userId;
      var department = jwtUserdataJson.department;
      var title = jwtUserdataJson.title;

      /** Speichere im Authservice alle wichtigen Nutzerdaten + JWT */
      this.auth.login(username, userId, department, title, this.jwt).subscribe(allowed => {
          if (allowed) {
            setTimeout(() => {
              this.loading.dismiss();

              /** Handelt es sich um einen Fachbereichsleiter oder um einen Mitarbeiter? Leite an die richtige View weiter. */

              //TODO: Auskommentieren DEBUG
              if(title == "Fachbereichsleiter")
              //TODO: einkommentieren
              //if(true)
              {
                this.nav.setRoot(TabsPage);
              } else
              {
                //TODO: Auskommentieren DEBUG
                this.nav.setRoot(VotingsPage);
              }
            });
          } else {
            this.showError("Access Denied");
          }
        },
        error => {
          this.showError(error);
        });
    }

    /** Ruft den Alert zum Einstellen der Host-Adresse auf */
    showSettings(){
        let alert = this.alertCtrl.create({
          title: 'Host',
          inputs: [
            {
              name: 'hostaddress',
              placeholder: 'http://localhost:8080/'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: data => {
                this.storage.set('hostaddress', data.hostaddress);
                this.hostaddress = data.hostaddress;
                console.log('Die Hostadresse wurde auf ' + data.hostaddress + ' geändert.');
              }
            }
          ]
        });
        alert.present();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
        content: 'Please wait for Login...'
      });
      this.loading.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: 'Failed',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    }
}
