import { Component } from '@angular/core';

import { QRPage } from '../qr/qr';
import { VotingsPage} from '../votings/votings';

/**
 * Wird in Version 1 nicht verwendet, da der Standard Nutzer nur eine Page benutzen darf.
 * Bleibt für spätere Erweiterungen enthalten.
 */


@Component({
  templateUrl: 'tabssimple.html',
})
export class TabsSimpelPage {

    tab1Root = VotingsPage;
    tab2Root = QRPage;

    constructor() {}
}


