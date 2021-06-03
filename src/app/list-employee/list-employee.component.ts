import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  departments = ['IT','Finance']
  constructor() { }

  ngOnInit() {
  }

  addNewDepartment(value:string){
    this.departments.push(value);
  }
}
