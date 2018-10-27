import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import {GraphenWeeklyPage} from '../pages/graph_weekly/graph_weekly';
import { addVotegroupPage } from '../pages/voting_add/voting_add';
import { VotingsPage } from '../pages/votings/votings';
import { VotePage } from '../pages/vote/vote';
import { QRPage } from '../pages/qr/qr';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs_fb/tabs_fb';
import { TabsSimpelPage } from '../pages/tabssimple/tabssimple';

import { AuthService } from '../providers/auth-service';
import {ChartsModule} from 'ng2-charts/charts/charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NgxQRCodeModule} from "ngx-qrcode2";
import { BarcodeScanner} from "@ionic-native/barcode-scanner";
import {VotingService} from "../providers/voting-service";
import {VotingsFbPage} from "../pages/votings_fb/votings_fb";
import {GraphenPage} from "../pages/graph/graph";


@NgModule({
  declarations: [
    MyApp,
    GraphenWeeklyPage,
    GraphenPage,
    addVotegroupPage,
    QRPage,
    VotingsPage,
    VotingsFbPage,
    VotePage,
    LoginPage,
    TabsPage,
    TabsSimpelPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ChartsModule,
    NgxQRCodeModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GraphenWeeklyPage,
    GraphenPage,
    addVotegroupPage,
    QRPage,
    VotingsPage,
    VotingsFbPage,
    VotePage,
    LoginPage,
    TabsPage,
    TabsSimpelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    VotingService,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
