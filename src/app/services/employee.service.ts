import { IEmployee } from './../create-employee/model/IEmployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = "http://localhost:3000/employees";
  constructor(private httpClient: HttpClient) { }

  getEmployees():Observable<IEmployee[]> {
    return this.httpClient.get<IEmployee[]>(this.baseUrl)
      .pipe(catchError(this.handlerError));
  }

  getEmployee(id: number):Observable<IEmployee> {
    return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handlerError));
  }

  addEmployee(employee:IEmployee):Observable<IEmployee>{
    return this.httpClient.post<IEmployee>(this.baseUrl,employee,{
      headers:new HttpHeaders({'Content-Type':'application/json'})
    }).pipe(catchError(this.handlerError));
  }

  updateEmployee(employee:IEmployee):Observable<void>{
    return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`,employee,
      {headers:new HttpHeaders({'Content-Type':'application/json'})})
      .pipe(catchError(this.handlerError));
  }

  deleteEmployee(id:number):Observable<void>{
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
    .pipe(catchError(this.handlerError))
  }

  private handlerError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log("Client side error: ", errorResponse.error);
    } else {
      console.log("Server side error: ", errorResponse);
    }
    return throwError('There is some problem with service')
  }

}
