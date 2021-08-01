import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-edit',
  templateUrl: './button-edit.component.html',
  styleUrls: ['./button-edit.component.css'],
})
export class ButtonEditComponent implements OnInit {
  @Input()
  itemId: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  buttonEdit({ itemId }: any) {
    return this.router.navigate(['user/edit/' + itemId]);
  }
}
