import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../providers/auth-service';
import {Storage} from "@ionic/storage";
import {VotingService} from "../../providers/voting-service";

@Component({
  selector: 'page-graphen',
  templateUrl: 'graph.html'
})
export class GraphenPage {

  site = "graphen";   //Standardwert des Segment-Navigators
  reasonsData: any;   //Daten der Kommentare [id = Kalenderwoche,reason = Kommentar]

  info: any;          //Nutzerinformationen
  votingInfo: any = null; //Informationen zur ausgewählten Abstimmung

  avg:any;            //Avg wert für alle Abstimmungen
  anz:any;            //Anzahl wert für alle Abstimmungen

  show = false;       //Ausblenden sofern keine Daten geladen wurden

  kw_Label=[];        //Kalenderwoche
  av_Data=[];         //Durchschnittswerte der Stimmung einer Kalenderwoche
  max_Data=[];        //Maximalwert der Stimmung einer Kalenderwoche
  min_Data=[];        //Minimalwert der Stimmung einer kalenderwoche
  amount_Data=[];     //Anzahl der abgegebenen Stimmen in einer Kalenderwoche
  p0 = [];
  p1 = [];
  p2 = [];
  p3 = [];
  p4 = [];

  hostaddress: any;

  constructor(public navCtrl: NavController, public http: Http, private nav: NavController, public toastCtrl: ToastController, private auth: AuthService,  private voting: VotingService, private storage: Storage) {
    this.info = auth.getUserInfo();
    this.votingInfo = this.voting.getVotingInfo();

    /** Hostadresse aus dem Storage holen */
    storage.get('hostaddress').then((val) => {
      this.hostaddress = val;
      this.loadHTTP();
    });
  }

  //Seite erneut laden
  refreshPage(){
    this.navCtrl.setRoot(GraphenPage);
  }

  loadHTTP()
  {
    console.log("Id der Abstimmung: " + this.votingInfo.votingId);

    let headers = new Headers();
    headers.append('Authorization', "Bearer " + this.info.jwt);

    //Laden der Graphdaten
    this.http.get(this.hostaddress+'vote/stats/'+this.votingInfo.votingId, { headers: headers}).map(res => res.json()).subscribe(
      data => {

        console.log("Stats:",data);

        this.avg = data.median;
        this.anz = data.anz;

        this.p0[0] = Math.round((data.percentage.p0*this.anz)/100);
        this.p1[0] = Math.round((data.percentage.p1*this.anz)/100);
        this.p2[0] = Math.round((data.percentage.p2*this.anz)/100);
        this.p3[0] = Math.round((data.percentage.p3*this.anz)/100);
        this.p4[0] = Math.round((data.percentage.p4*this.anz)/100);

        this.SuccessMsg();
        this.show = true;
      },
      err => {
        console.log(err.toString());
        this.ErrorMsg("Fehler beim Laden der Daten!");
      }
    );

    //Laden der Kommentardaten
    this.http.get(this.hostaddress+'vote/'+this.votingInfo.votingId+'/dep/'+this.info.department, { headers: headers}).map(res => res.json()).subscribe(
      data => {
        console.log("Kommentardaten:",data);
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
  public barChartData:Array<any> = [
    {data: this.p0, label: '0'},
    {data: this.p1, label: '1'},
    {data: this.p2, label: '2'},
    {data: this.p3, label: '3'},
    {data: this.p4, label: '4'},
  ];
  public barChartLabels:Array<any>;
  public barChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'right',
    },
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };
  public barChartColors:Array<any> = [
    {
      backgroundColor: "#0AACFB",
    },
    {
      backgroundColor: "#00A4F3",
    },
    {
      backgroundColor: "#0073AA",
    },
    {
      backgroundColor: "#005B87",
    },
    {
      backgroundColor: "#004668",
    }
  ];
  public barChartLegend:boolean = true;
  public barChartType:string = 'bar';

  backPage(){
    this.nav.pop();
  }
}
