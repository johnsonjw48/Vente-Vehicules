import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Car} from "../../interfaces/car";
import {CarsService} from "../../services/cars.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  offerForm!:FormGroup

  cars:Car[] = []

  subscription!:Subscription
  currentPhotoFile: any
  currentPhotoUrl!:string

  constructor(private fb: FormBuilder,
              private carsService: CarsService) { }

  ngOnInit(): void {
    this.initOfferForm()
    this.cars = []

    this.subscription = this.carsService.carsSubject.subscribe({
      next:(cars:Car[]) => {
        this.cars = cars
      },
      error: (error) => {
        console.log(error)
      }
    })
    this.carsService.getCars()
  }

  initOfferForm() {
    this.offerForm = this.fb.group({
      id:[null],
      titre: ['', [Validators.required, Validators.minLength(5)]],
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      photo: [],
      prix: [0, Validators.required]

    })
  }

  handleChangePhoto ($event:any): void {
    this.currentPhotoFile = $event.target.files[0]
    const fileReader =  new FileReader()
    fileReader.readAsDataURL(this.currentPhotoFile)
    fileReader.onloadend = (e) =>{
      this.currentPhotoUrl = <string>e.target?.result
    }
  }

  onSubmitForm ():void {
    const i = this.offerForm.value.id
    if (i === null || i === undefined){
      delete this.offerForm.value.index
      this.carsService.addCar(this.offerForm.value, this.currentPhotoFile)
        .catch(console.error)
    }else {
      delete this.offerForm.value.index
       this.carsService.editCar(this.offerForm.value, i).catch(console.error)
    }

    this.offerForm.reset()
    this.currentPhotoFile = null

  }

  onEditOffers(offer:Car):void {
    this.offerForm.setValue(offer)
  }

  onDeleteOffers (index?:string) {
     if (index){
       this.carsService.deleteCar(index).catch(console.error)
     }else {
       console.error('Il faut un id')
     }
  }
}
