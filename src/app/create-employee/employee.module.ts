import { EmployeeRoutingModule } from './employee-routing.module';
import { ListEmployeeComponent } from './../list-employee/list-employee.component';
import { CreateEmployeeComponent } from './create-employee.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    CreateEmployeeComponent,
    ListEmployeeComponent
  ],
  imports: [
    EmployeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeModule { }
