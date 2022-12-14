import { Injectable } from '@angular/core';
import {Car} from "../interfaces/car";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import { BehaviorSubject } from 'rxjs';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {remove} from "@angular/fire/database";


@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private cars:Car[] = []

  carsSubject: BehaviorSubject<Car[]> = new BehaviorSubject(<Car[]>[]);

  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage ) {

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

  async addCar (car:Car, carPhoto?:any): Promise<Car> {

    try {
      const photoUrl =  carPhoto ? await this.uploadPhoto(carPhoto) : ''
      const response =   this.db.list('cars').push({...car, photo:photoUrl})
      const createdCar = {...car, photo:photoUrl, id:<string>response.key}
      this.cars.push(createdCar)
      this.dispatchCars()
      return createdCar

    } catch (error) {
      throw error
    }


  }

  async editCar (car:Car, index:string, newCarPhoto?:any): Promise<any>{

    try {

      if (newCarPhoto && car.photo && car.photo !== ''){
          await this.removePhoto(car.photo)

      }

      if (newCarPhoto){
        const newPhotoUrl = await this.uploadPhoto(newCarPhoto)
        car.photo = newPhotoUrl
      }

      await this.db.list('cars').update(index, car)

      const carIndexToUpdate = this.cars.findIndex(el => el.id === index);
      this.cars[carIndexToUpdate] = {...car, id: index};
      this.dispatchCars();
      return {...car, id: index};

    }catch (error){
      console.log(error)
    }

  }

  async deleteCar ( index:string): Promise<Car> {
    try {
      const carDeleteIndex = this.cars.findIndex(el => el.id === index);
      const carToDelete = this.cars[carDeleteIndex];
      if (carToDelete.photo && carToDelete.photo !== '') {
        await this.removePhoto(carToDelete.photo);
      }
      await this.db.list('cars').remove(index);
      this.cars.splice(carDeleteIndex, 1);
      this.dispatchCars();
      return carToDelete;
    } catch (error) {
      throw error;
    }
  }

  private uploadPhoto (photo:any):Promise<string> {
      return new Promise( (resolve, reject) => {
        const upload = this.storage.upload('cars/' + Date.now() + "_" + photo.name, photo)
        upload.then(res => {
          resolve(res.ref.getDownloadURL())
        }).catch(reject)
      })
  }

  private removePhoto (photoUrl:string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.refFromURL(photoUrl).delete().subscribe({
        complete: ()=> resolve('Supprimer'),
        error: reject
      })
    })
  }
}
