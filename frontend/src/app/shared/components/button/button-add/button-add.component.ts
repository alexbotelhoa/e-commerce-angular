import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.css'],
})
export class ButtonAddComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  buttonAdd() {
    return this.router.navigate(['user/add']);
  }
}
