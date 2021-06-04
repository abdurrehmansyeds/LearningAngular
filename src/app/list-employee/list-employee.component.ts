import { EmployeeService } from './../services/employee.service';
import { IEmployee } from './../create-employee/model/IEmployee';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  employees:IEmployee[];
  constructor(private employeeService:EmployeeService,private router:Router) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (listEmployees)=>this.employees=listEmployees,
      (err)=>console.log(err)
      
    )
  }

  editEmployeeClick(id:number){
    this.router.navigate(['employees/edit/',id]);
  }
}
