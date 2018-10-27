import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../providers/auth-service';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-graphen',
  templateUrl: 'graph_weekly.html'
})
export class GraphenWeeklyPage {

    site = "graphen";   //Standardwert des Segment-Navigators
    reasonsData: any;   //Daten der Kommentare [id = Kalenderwoche,reason = Kommentar]

    info: any;          //Nutzerinformationen

    avg:any;            //Avg wert für alle Abstimmungen
    max:any;            //Max wert für alle Abstimmungen
    min:any;            //Min wert für alle Abstimmungen
    anz:any;            //Anzahl wert für alle Abstimmungen
    result=[];          //Werte für die Tabelle

    show = false;       //Ausblenden sofern keine Daten geladen wurden

    kw_Label=[];        //Kalenderwoche
    av_Data=[];         //Durchschnittswerte der Stimmung einer Kalenderwoche
    amount_Data=[];     //Anzahl der abgegebenen Stimmen in einer Kalenderwoche

    hostaddress: any;

    constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController, private auth: AuthService, private storage: Storage) {
      this.info = auth.getUserInfo();

      /** Hostadresse aus dem Storage holen */
      storage.get('hostaddress').then((val) => {
        this.hostaddress = val;
        this.loadHTTP();
      });
    }

    //Seite erneut laden
    refreshPage(){
        this.navCtrl.setRoot(GraphenWeeklyPage);
    }

    loadHTTP()
    {
        let headers = new Headers();
        headers.append('Authorization', "Bearer " + this.info.jwt);

        //Laden der Graphdaten
        this.http.get(this.hostaddress+'vote/stats/weekly/dep/'+this.info.department, { headers: headers}).map(res => res.json()).subscribe(
        data => {

            console.log("Weekly data:", data);

            this.avg = data.median;
            this.anz = data.anz;
            this.result = data.weekStats; //Daten für die Tabelle


            var i:number;
            for(i=data.weekStats.length-1; i > -1; i--){

                this.kw_Label.push(data.weekStats[i].kw);
                this.av_Data.push(data.weekStats[i].median);
                this.amount_Data.push(data.weekStats[i].anz);
                this.show = true;

            }
            this.SuccessMsg();
            this.show = true;
        },
        err => {
            console.log(err.toString());
            this.ErrorMsg("Fehler beim Laden der Daten!");
        }
        );

        //Laden der Kommentardaten
        this.http.get(this.hostaddress+'vote/weekly/dep/'+this.info.department, { headers: headers}).map(res => res.json()).subscribe(
        data => {
          console.log("Weekly Kommentar data:", data);
           this.reasonsData = data;

          for(var i=0; i < this.reasonsData.length; i++){
            this.reasonsData[i].date = this.formatCommentDate(this.reasonsData[i].date);
          }
        },
        err => {
          console.log(err.toString());
          this.ErrorMsg("Fehler beim Laden der Daten!");
        }
        );
    }

  private formatCommentDate(dateString: any){
    var d = new Date(dateString);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();


    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return day + '.' + month + '. - ' + d.getHours() + ":" + d.getMinutes() + ' Uhr'
  }

    //Bei erfolgreichen Laden eine Nachricht ausgeben
    SuccessMsg() {
        let toast = this.toastCtrl.create({
            message: `Laden erfolgreich!`,
            duration: 500,
            position: 'top'
        });
        toast.present();
    }

    //Bei nicht erfolgreichen Laden eine Nachricht ausgeben
    ErrorMsg(content) {
        let toast = this.toastCtrl.create({
            message: content,
            duration: 500,
            position: 'top'
        });
        toast.present();
    }

    //Line Chart ng2charts Funktionen
    public lineChartData:Array<any> = [
      /**
        {data: this.max_Data, label: 'Max'},
        {data: this.min_Data, label: 'Min'},
       **/
        {data: this.av_Data, label: 'AVG'}
    ];
    public lineChartLabels:Array<any> = this.kw_Label;
    public lineChartOptions:any = {
        responsive: true
    };
    public lineChartColors:Array<any> = [
        /**
        {   // gr�n
            backgroundColor: 'rgba(0, 204, 102,0.2)',
            borderColor: 'rgba(0, 204, 102,1)',
            pointBackgroundColor: 'rgba(0, 204, 102,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 204, 102,0.8)'
        },
        {   // rot
            backgroundColor: 'rgba(204, 0, 0,0.2)',
            borderColor: 'rgba(204, 0, 0,1)',
            pointBackgroundColor: 'rgba(204, 0, 0,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(204, 0, 0,0.8)'
        },
         **/
        {   // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';
}
