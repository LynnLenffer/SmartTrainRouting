import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * auth-service verwaltet den aktuell eingeloggten Nutzer
 * **/

export class User {
  username: string;
  userId: string;
  department: string;   //Unterscheidung zwischen Abteilungen
  title: string;         //Unterscheidung zwischen normalen Mitarbeitern und Fachbereichsleitern
  jwt: any;

  constructor(username: string, userId: string, department: string, title: string, jwt: any) {
    this.username = username;
    this.userId = userId;
    this.department = department;
    this.title = title;
    this.jwt = jwt;
  }
}

@Injectable()
export class AuthService {
    currentUser: User;

    //Erstellen des aktuellen Nutzer
    public login(username, userId, department, title, jwt) {

        return Observable.create(observer => {
            this.currentUser = new User(username, userId, department, title, jwt);
            observer.next(true);
            observer.complete();
        });
    }

    //Aktuellen Nutzer zurückgeben
    public getUserInfo() : User {
        return this.currentUser;
    }

    public logout() {
        return Observable.create(observer => {
        this.currentUser = null;
        observer.next(true);
        observer.complete();
          });
    }
}
