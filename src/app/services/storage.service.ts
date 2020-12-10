import { Injectable } from '@angular/core';
import { promises } from 'fs';
import { Storage } from '@ionic/storage';

export interface Friend {
  id: number
} 

export interface FriendReq{
  id: number
}

const ITEMS_KEY ='my-items';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  addItem(friend: Friend): Promise<any>{
    this.storage.remove(ITEMS_KEY);
    return this.storage.get(ITEMS_KEY).then((friends:Friend[]) => {
      if(friends){
        friends.push(friend);
        return this.storage.set(ITEMS_KEY, friends);
      }
      else{
        return this.storage.set(ITEMS_KEY, [friend]);
      }
    })
  }
  getItem(): Promise<Friend[]>{
    return this.storage.get(ITEMS_KEY);
  }
  updateItem(friend: Friend): Promise<any>{
    return this.storage.get(ITEMS_KEY).then((friends:Friend[]) => {
      if(!friends || friends.length === 0){
        return null;
      }
      let newFriend: Friend[]=[];
      for(let i of friends){
        if(i.id === friend.id){
          newFriend.push(friend);
        }
        else{
          newFriend.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, newFriend);
    })
  }
  deleteItem(id:number): Promise<Friend>{
    return this.storage.get(ITEMS_KEY).then((friends: Friend[]) =>{
      if(!friends || friends.length ===0){
        return null;
      }

      let toKeep: Friend[] = [];

      for (let i of friends){
        if(i.id !== id){
          toKeep.push(i);
        }
      }

      return this.storage.set(ITEMS_KEY, friends);
    });
  }
}
