import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * voting-service verwaltet die aktuell ausgewählte Abstimmung
 * **/

export class votingdata {
  object: any;

  constructor(object: any) {
    this.object = object;
  }
}

@Injectable()
export class VotingService {
  currentObject: votingdata;

  //Erstellen des aktuellen Nutzer
  public create(object) {

    return Observable.create(observer => {
      this.currentObject = new votingdata(object);
      observer.next(true);
      observer.complete();
    });
  }

  //Aktuellen Nutzer zurückgeben
  public getVotingInfo() : votingdata {
    return this.currentObject;
  }

  public setNull() {
    return Observable.create(observer => {
      this.currentObject = null;
      observer.next(true);
      observer.complete();
    });
  }
}
