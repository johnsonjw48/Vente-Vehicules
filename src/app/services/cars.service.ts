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
    this.getCars()
  }

  dispatchCars() {
    this.carsSubject.next(this.cars);
  }

  getCars () : void {
      this.db.list('cars').query.limitToLast(10).once('value', snapshot => {
        const carsSnapshotValue = snapshot.val()
        console.log(carsSnapshotValue)
        const cars = Object.keys(carsSnapshotValue).map(id => ({id, ...carsSnapshotValue[id]}))
        this.cars = cars
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

  editCar (car:Car, index:number): Car[] {
    this.cars[index] = car
    return  this.cars
  }

  deleteCar (index:number): Car[] {
    this.cars.splice(index, 1)
    return this.cars
  }
}
