import { Injectable } from '@angular/core';
import {Car} from "../interfaces/car";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private cars:Car[] = []

  carsSubject: BehaviorSubject<Car[]> = new BehaviorSubject(<Car[]>[]);

  constructor(private db: AngularFireDatabase) {

  }

  dispatchCars() {
    this.carsSubject.next(this.cars);
  }

  getCars () : void {
      this.db.list('cars').query.limitToLast(10).once('value', snapshot => {
        const carsSnapshotValue = snapshot.val()
       if (carsSnapshotValue){
         const cars = Object.keys(carsSnapshotValue).map(id => ({id, ...carsSnapshotValue[id]}))
         this.cars = cars
       }
        this.dispatchCars()
      })
  }

  addCar (car:Car): Promise<Car> {
    return new Promise((resolve, reject) => {
      this.db.list('cars').push(car)
        .then(res => {
          this.cars.push({...car, id: <string>res.key})
          resolve({...car, id: <string>res.key});
          this.dispatchCars()
        })
        .catch(reject)
    })
  }

  editCar (car:Car, index:string): Promise<Car>{
    return  new Promise((resolve, reject)=>{
      this.db.list('cars').update(index, car)
        .then(res=>{
          const editId= this.cars.findIndex(el=> el.id === index)
          this.cars[editId] = {...car, id: index}
          this.dispatchCars()
          resolve({...car, id:index})
        }).catch(reject)
    })
  }

  deleteCar ( index:string): Promise<Car> {
    return new Promise((resolve, reject)=>{
      this.db.list('cars').remove(index)
        .then(res => {
          const deleteId = this.cars.findIndex(el=> el.id === index)
          this.cars.splice(deleteId, 1)
          this.dispatchCars()
        }).catch(console.error)
    })
  }
}
