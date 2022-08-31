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
      index:[null],
      titre: ['', [Validators.required, Validators.minLength(5)]],
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      prix: [0, Validators.required]

    })
  }

  onSubmitForm ():void {
    const i = this.offerForm.value.index
    if (i === null){
      delete this.offerForm.value.index
      this.carsService.addCar(this.offerForm.value)
        .catch(console.error)
    }else {
      delete this.offerForm.value.index
      this.cars = this.carsService.editCar(this.offerForm.value, i)
    }

    this.offerForm.reset()
  }

  onEditOffers(offer:Car, index:number):void {
    this.offerForm.setValue({...offer,  index})
  }

  onDeleteOffers (index:number) {
    this.cars = this.carsService.deleteCar(index)
  }
}
