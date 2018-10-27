import { Component } from '@angular/core';

import 'rxjs/add/operator/map';
import { AuthService } from '../../providers/auth-service';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";



@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html'
})
export class QRPage {

    info: any;      //Aktuelle Nutzerdaten
    qrData = null;
    createdCode = null;

    constructor(private auth: AuthService, private barcodeScanner: BarcodeScanner) {
        this.info = this.auth.getUserInfo();

        this.createdCode = this.info.jwt;
    }

}
