import { Injectable } from '@angular/core';
import {Car} from "../interfaces/car";

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private cars:Car[] = [
    {
      titre: 'toyota 44',
      marque: 'toyota',
      modele: '108 DASH',
      prix: 3000
    }
  ]

  constructor() { }

  getCars () : Car[] {
      return this.cars
  }

  addCar (car:Car): Car[] {
    this.cars.push(car)
    return this.cars
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
