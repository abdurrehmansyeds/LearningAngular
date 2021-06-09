import { IEmployee } from './model/IEmployee';
import { EmployeeService } from './../services/employee.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'util';
import { ISkill } from './model/ISkill';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeGroup: FormGroup;
  currentEmployee: IEmployee;
  pageTitle:string;
  validationMessages = {
    "fullName": {
      "required": "Full Name is required",
      "minlength": "Full Name must be grater than 2 characters"
    },
    "email": {
      "emailDomain": "Email domain should be avaali.com",
      "required": "Email is required."
    },
    "emailGroup": {
      "emailMismatch": "Email and Confirm Email do not match"
    },
    "confirmEmail": {
      "emailDomain": "Confirm email domain should be avaali.com",
      "required": "Confirm email is required."
    },
    "phone": {
      "required": "Phone is required."
    }
  };

  formErrors = {
  };

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router) { }

  ngOnInit() {
    this.employeeGroup = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, this.emailDomain("avaali.com")]],
        confirmEmail: ['', Validators.required]
      }, { validators: this.matchEmail }),
      phone: [''],
      contactPreference: ['email'],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    })
    this.employeeGroup.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeGroup);
    })
    this.employeeGroup.controls.contactPreference.valueChanges.subscribe((data: string) => {
      this.onPreferenceChange(data);
    })
    this.activatedRoute.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle='Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle='reate Employee';
       this.currentEmployee={
         id:null,
         fullName:'',
         phone:null,
         contactPreference:'',
         email:'',
         skills:[]
       }

      }
    })
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeGroup.get('skills')).push(this.addSkillFormGroup());
  }
  addSkillFormGroup(): AbstractControl {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    })
  }

  removeSkillButtonClick(skillIndex: number) {
    console.log(skillIndex);
    (<FormArray>this.employeeGroup.get('skills')).removeAt(skillIndex);
  }

  onPreferenceChange(value: string) {
    const phoneControl = this.employeeGroup.controls.phone;
    if (value === 'phone') {
      phoneControl.setValidators(Validators.required)
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key)
      this.formErrors[key] = '';
      if (abstractControl && abstractControl.invalid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + " ";
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl)
      }
    })
  }


  emailDomain(value: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1)
      if (email === '' || domain.toLowerCase() === "avaali.com") {
        return null
      } else {
        return { "emailDomain": true };
      }

    }
  }

  matchEmail(group: AbstractControl): { [key: string]: any } | null {
    const email = group.get('email');
    const confirmEmail = group.get('confirmEmail');
    if (email.value === confirmEmail.value ||
      (confirmEmail.pristine && confirmEmail.value === '')) {
      return null;
    } else {
      return { "emailMismatch": true }
    }
  }


  onLoadFormData(): void {

  }

  onSubmit(): void {
    this.mapValuesForCurrentEmp();
    if (this.currentEmployee.id) {
      this.employeeService.updateEmployee(this.currentEmployee).subscribe(
        () => this.router.navigate(['employees']),
        (err) => console.log(err)
      )
    } else {
      this.employeeService.addEmployee(this.currentEmployee).subscribe(
        () => this.router.navigate(['employees']),
        (err) => console.log(err)
      )
    }
  }

  mapValuesForCurrentEmp() {
    this.currentEmployee.fullName = this.employeeGroup.value.fullName;
    this.currentEmployee.email = this.employeeGroup.value.emailGroup.email;
    this.currentEmployee.phone = this.employeeGroup.value.phone;
    this.currentEmployee.contactPreference = this.employeeGroup.value.contactPreference;
    this.currentEmployee.skills = this.employeeGroup.value.skills;

  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        this.bindEmployee(employee);
        this.currentEmployee = employee;        
      },
      (error) => console.log(error)

    )
  }
  bindEmployee(emp: IEmployee) {
    this.employeeGroup.patchValue({
      fullName: emp.fullName,
      contactPreference: emp.contactPreference,
      emailGroup: {
        email: emp.email,
        confirmEmail: emp.email
      },
      phone: emp.phone
    });
    this.employeeGroup.setControl('skills', this.setExistingSkills(emp.skills))
  }

  setExistingSkills(skills: ISkill[]): FormArray {
    const skillsArray = new FormArray([]);
    skills.forEach(skill => {
      skillsArray.push(this.fb.group({
        skillName: skill.skillName,
        experienceInYears: skill.experienceInYears,
        proficiency: skill.proficiency
      }))
    })
    return skillsArray;
  }

}
