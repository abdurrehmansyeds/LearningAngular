import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { log } from 'util';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  @Input() departments = [] ;
  @Output() departmentEventEmitter = new EventEmitter();

  employeeGroup : FormGroup;
  validationMessages = {
    "fullName":{
      "required":"Full Name is required",
      "minlength":"Full Name must be grater than 2 characters"
    },
    "email":{
      "emailDomain":"Email domain should be avaali.com",
      "required":"Email is required."
    },
    "emailGroup":{
      "emailMismatch":"Email and Confirm Email do not match"
    },
    "confirmEmail":{
      "emailDomain":"Confirm email domain should be avaali.com",
      "required":"Confirm email is required."
    },
    "phone":{
      "required":"Phone is required."
    },
    "skillName":{
      "required":"Skill Name is required."
    },
    "experienceInYears":{
      "required":"Experience is required."
    },
    "proficiency":{
      "required":"Proficiency is required."
    },
  };

  formErrors = {
    "fullName":"",
    "email":"",
    "emailGroup":"",
    "confirmEmail":"",
    "phone":"",
    "skillName":"",
    "experienceInYears":"",
    "proficiency":""
  };

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.employeeGroup = this.fb.group({
      fullName:['',[Validators.required,Validators.minLength(2)]],
      emailGroup : this.fb.group({
        email:['',[Validators.required,this.emailDomain("avaali.com")]],
        confirmEmail:['',Validators.required]
      },{validators:this.matchEmail}),
      phone:[''],
      contactPreference:['email'],  
      skills:this.fb.group({
        skillName:['',Validators.required],
        experienceInYears:['',Validators.required],
        proficiency:['',Validators.required]
      })
    })
    this.employeeGroup.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.employeeGroup);
    })
    this.employeeGroup.controls.contactPreference.valueChanges.subscribe((data:string)=>{
      this.onPreferenceChange(data);
    })
  }

  addNewDepartment(value:string){
    console.log(value);
    
    this.departmentEventEmitter.emit(value);
  }

  onPreferenceChange(value:string){
    const phoneControl  = this.employeeGroup.controls.phone;
    if(value==='phone'){
      phoneControl.setValidators(Validators.required)
    }else{
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  logValidationErrors(group:FormGroup=this.employeeGroup):void{
    Object.keys(group.controls).forEach((key:string)=>{
      const abstractControl = group.get(key)
      this.formErrors[key] = '';
      if(abstractControl && abstractControl.invalid && 
        (abstractControl.touched || abstractControl.dirty)){
        const messages = this.validationMessages[key];
        for(const errorKey in abstractControl.errors){
          if(errorKey){             
            this.formErrors[key] +=messages[errorKey]+" ";
          }
        }
      }        
      if(abstractControl instanceof FormGroup){
        this.logValidationErrors(abstractControl)
      }
    })
  }


  emailDomain(value:string){
    return (control:AbstractControl): { [key:string]:any} | null => {
      const email : string  = control.value;
      const domain = email.substring(email.lastIndexOf('@')+1)
      if(email === '' || domain.toLowerCase()==="avaali.com"){
        return null
      }else{
        return {"emailDomain":true};
      }
  
    }
  }

  matchEmail(group:AbstractControl):{[key:string]:any}|null{
    const email = group.get('email');
    const confirmEmail = group.get('confirmEmail');
    if(email.value===confirmEmail.value || confirmEmail.pristine){
      return null;
    }else{
      return {"emailMismatch":true}
    }
  }
 

  onLoadFormData():void {
    
  }

  onSubmit():void{
    console.log(this.employeeGroup);
    
  }
}
