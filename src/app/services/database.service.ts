import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

export interface Dev{
  id:number,
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  friendList = new BehaviorSubject([]);
  friendRequestList = new BehaviorSubject([]);
  
  constructor(
    private plt: Platform,
     private sqlitePorter: SQLitePorter,
      private sqlite: SQLite,
       private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

  seedDatabase(){
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(_ => {
        this.loadFriend();
        this.loadFriendRequest();
        this.dbReady.next(true);
      })
      .catch(e => console.error(e));
    });
  }

  getDatabaseState(){
    return this.dbReady.asObservable();
  }

  getFriend(): Observable<Dev[]>{
    return this.friendList.asObservable();
  }

  getFriendRequest(): Observable<any[]>{
    return this.friendRequestList.asObservable();
  }

  loadFriend(){
    return this.database.executeSql('SELECT * FROM friendList', []).then(data => {
      let friendList: Dev[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) { 
          friendList.push({ 
            id: data.rows.item(i).id
           });
        }
      }
      this.friendList.next(friendList);
    });
  }

  addFriend(id) {
    let data = [id];
    return this.database.executeSql('INSERT INTO friendList (id) VALUES (?)', data).then(data => {
      this.loadFriend();
    });
  }
 
  deleteFriend(id) {
    return this.database.executeSql('DELETE FROM friendList WHERE id = ?', [id]).then(_ => {
      this.loadFriend();
      this.loadFriendRequest();
    });
  }

  loadFriendRequest(){
    return this.database.executeSql('SELECT * FROM friendRequestList', []).then(data => {
      let friendRequestList: Dev[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) { 
          friendRequestList.push({ 
            id: data.rows.item(i).id
           });
        }
      }
      this.friendList.next(friendRequestList);
    });
  }

  addFriendRequest(id) {
    let data = [id];
    return this.database.executeSql('INSERT INTO friendRequestList (id) VALUES (?)', data).then(data => {
      this.loadFriendRequest();
    });
  }

  deleteFriendRequest(id) {
    return this.database.executeSql('DELETE FROM friendRequestList WHERE id = ?', [id]).then(_ => {
      this.loadFriend();
      this.loadFriendRequest();
    });
  }
 
}
