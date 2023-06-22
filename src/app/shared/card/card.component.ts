import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  // domain: string = environment.url;
  @Input() cardsData: any
  @Input() loc: boolean = false;
  @Output() clickCard: EventEmitter<any> = new EventEmitter

  constructor() { }

  ngOnInit(): void {
  }
  
  clickingCard() {
    this.clickCard.emit(this.cardsData)
  }
}
