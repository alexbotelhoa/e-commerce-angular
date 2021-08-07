import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-update',
  templateUrl: './button-update.component.html',
  styleUrls: ['./button-update.component.css'],
})
export class ButtonUpdateComponent implements OnInit {
  @Input()
  disabled: boolean | null = true;

  constructor() {}

  ngOnInit(): void {}
}
