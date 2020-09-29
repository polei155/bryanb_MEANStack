import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signinForm: FormGroup;
  hide = true;
  errorMessages: any;
  hasError = false;

  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.autorun();
  }

  autorun(){
    this.initialisers();
    this.listeners();
  }

  initialisers(){
    this.initSigninForm()
    this.isLoggedin();
  }

  listeners(){ }

  isLoggedin(){
    if(this.userService.isLoggedIn()){
      this.router.navigateByUrl('/userprofile');
    } 
  }

  onsubmit(formValues){
    console.log('formValues', formValues)
    this.userService.login(formValues).subscribe(
      (res) => {
        this.userService.setToken(res['token']);
        this.router.navigateByUrl('/userprofile');
    }),
    (err) => {
      console.log('ererererer', err)
      this.hasError = true;
      this.errorMessages = err.message;

      setTimeout(() => {
        this.hasError = false;
      }, 3000);
    }
  }

  initSigninForm(){
    this.signinForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    })
  }
  resetForm(){
    this.signinForm.reset();
  }
  get userName(){
    return this.signinForm.get('userName');
  }
  get password(){
    return this.signinForm.get('password');
  }

}
