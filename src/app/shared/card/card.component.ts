import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardsData: any
  @Output() clickCard: EventEmitter<any> = new EventEmitter

  constructor() { }

  ngOnInit(): void {
  }
  
  clickingCard() {
    this.clickCard.emit(this.cardsData)
  }
}
