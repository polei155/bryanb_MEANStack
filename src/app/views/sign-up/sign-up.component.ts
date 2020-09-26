import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  
  constructor(private userService: UserService, private formBuilder: FormBuilder) { }
  value: any;
  signupForm: FormGroup;
  hide = true;
  hasError: boolean = false;
  registrationSuccess: boolean = false;
  resError: any;

  ngOnInit(): void {
    this.autorun();
  }

  autorun(){
    this.initialisers();
    this.listeners();
  }

  initialisers(){
    this.initForm()
  }

  listeners(){ }

  onsubmit(formValue){
    this.userService.postUser(formValue).subscribe(
      (res) => {
        this.registrationSuccess = true;
        this.resetForm()
      },
      (err) => {
        this.hasError = true;
        this.resError = err.error;
      }
    )
    setTimeout(() => {
      this.hasError = false;
      this.registrationSuccess = false;
    }, 4000);
  }

  initForm(){
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    })
  }

  closeErrorModal(){
    this.hasError = false
  }
  resetForm(){
    this.signupForm.reset();
  }

  get email(){
    return this.signupForm.get('email');
  }
  get userName(){
    return this.signupForm.get('userName');
  }
  get password(){
    return this.signupForm.get('password');
  }
  get fullName(){
    return this.signupForm.get('fullName');
  }

}
