import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-car-details-card',
  templateUrl: './car-details-card.component.html',
  styleUrls: ['./car-details-card.component.scss']
})
export class CarDetailsCardComponent {

  domain: string = environment.url;
  @Input() cardsData: any
  @Output() clickCard: EventEmitter<any> = new EventEmitter


  constructor() { }

  ngOnInit(): void {
  }


  clickingCard() {
    this.clickCard.emit(this.cardsData)
  }

}
