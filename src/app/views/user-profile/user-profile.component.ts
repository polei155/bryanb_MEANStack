import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router'
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/app/shared/user.service';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  nationalityControl = new FormControl();
  countryControl = new FormControl();
  cityControl = new FormControl();

  profileInformationForm: FormGroup;

  countryFilteredOption: Observable<string[]>;
  natFilteredOptions: Observable<string[]>;
  cityFilteredOption: Observable<string[]>;

  userName: any;
  fileNameUpload = [];
  userFullname: any;
  getProfileDatas: any;
  getGenInfoDatas: any;
  selectedCountry: any;
  isEditEduc: boolean = false; 
  isMarriedStatus: boolean = false;
  isEducationAdded: boolean = false;
  minBirthDate = new Date(1970, 0, 1);
  maxBirthDate = new Date(2002, 0, 1);
  maritalStatus = ['Single', 'Married']

  educationValues: any;

  natOptions: string[] = [ 'American','Canadian', 'Chinese','Filipino', 'Indian' ]
  countryOptions: string[] = [ 'America','Canada', 'China','Philippines', 'India' ]
  cityOptions = new Array();

  public educForm: FormGroup;
  constructor( private userService: UserService, private router: Router, private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.autorun();
  }

  autorun(){
    this.initialisers();
    this.listeners();
  }

  initialisers(){
    this.getProfile();
    this.initForm();
    this.initAutoCompleteFields();
    this.getProfileGeneralDatas();
    this.initArrayForm();
  }

  listeners(){ }

  async initForm(){
    this.profileInformationForm = this.fb.group({
      statusMarital: ['', Validators.required],
      yearsExp: ['', Validators.required],
      birthDate: ['', Validators.required],
      nationality: new FormControl(),
      country: new FormControl(),
      city: new FormControl(),
      mobileNumber: ['', Validators.required],
      username: new FormControl() 
    })
    await this.listenUsernameForm();
  }

  initArrayForm(){
    this.educForm = this.fb.group({
      educations: this.fb.array([this.createEducFormGroup()])
    });
  }

  private createEducFormGroup(): FormGroup {
    return new FormGroup({
      'degree': new FormControl('', Validators.required),
      'universityName': new FormControl('', Validators.required),
      'gpa': new FormControl('', Validators.required),
    })
  }

  addEducFormGroup() {
    const educations = this.educForm.get('educations') as FormArray
    educations.push(this.createEducFormGroup())
  }

  removeOrClearEduc(i: number) {
    const educations = this.educForm.get('educations') as FormArray
    if (educations.length > 1) {
      educations.removeAt(i)
    } else {
      educations.reset()
    }
  }

  onsubmitEducation(educForms){
    this.educationValues = Object.assign({}, educForms);
    this.isEducationAdded = true;
    this.educForm.reset()
  }
  
  editEducation(educObj, i){
    this.isEditEduc = true;

    this.educForm = this.fb.group({
      educations: this.fb.array([this.editEducFormGroup(educObj, i)])
    });
  }

  private editEducFormGroup(educNumber, index): FormGroup {
    return new FormGroup({
      'degree': new FormControl(`${educNumber.degree}`, Validators.required),
      'universityName': new FormControl(`${educNumber.universityName}`, Validators.required),
      'gpa': new FormControl(`${educNumber.gpa}`, Validators.required),
    })
  }

  onsubmit(formValue){
    this.userService.postUserProfileDatas(formValue).subscribe((res) => {
      console.log('resres getUserProfileDatas', res)
    })
    this.getProfileGeneralDatas();
    this.resetUserProfileForm();
  }

  getProfile(){
    this.userService.getUserProfile().subscribe((res: any) => {
      this.userFullname = res.user.fullName;
      this.getProfileDatas = res.user;
      this.userName = res.user.userName;
    })
  }

  listenUsernameForm(){
    setTimeout(() => {
      this.profileInformationForm.patchValue({
        username: `${this.getProfileDatas.userName}`
      })
    }, 2000);
  }

  getProfileGeneralDatas(){
    setTimeout(() => {
      this.userService.getUserProfileDatas(this.userName).subscribe((res: any) => {
        if(res){
          this.getGenInfoDatas = res;
          console.log('this.getGenInfoDatas', this.getGenInfoDatas)
        }
      })
    });
  }

  signOut(){
    this.userService.deleteToken();
    this.router.navigateByUrl('/login')
  }

  nationalityEvent(value){
    this.profileInformationForm.patchValue({
      nationality: value
    })
  }

  countryEvent(value){
    console.log('coutnryvalue', value)
    this.cityOptions = [];
    let americaCities: string[] = [ 'California', 'Chicago', 'Los Angeles', 'New Jersey', 'New York' ]
    let canadaCities: string[] = [ 'Calgary', 'Montreal', 'Ottawa', 'Quebec', 'Victoria' ]
    let chinaCities: string[] = [ 'Beijing', 'Shanghai', 'Chengdu', 'Chongqing', 'Tianjin' ]
    let indiaCities: string[] = [ 'Bengaluru', 'Chennai', 'Jaipur', 'Mumbai', 'New Delhi', ]
    let philCities: string[] = [ 'Cavite City', 'Dasmarinas City', 'Davao City', 'Naga City' ]
    this.profileInformationForm.patchValue({
      country: value
    })

    switch(value) {
      case 'America':
        this.cityOptions = americaCities
        break;
      case 'Canada':
        this.cityOptions = canadaCities
        break;
      case 'China':
        this.cityOptions = chinaCities
        break;
      case 'India':
        this.cityOptions = indiaCities
        break;
      case 'Philippines':
        this.cityOptions = philCities
        break;
      default:
        // code block
    }

    this.initCityAutoComplete();
  }

  cityEvent(value){
    this.profileInformationForm.patchValue({
      city: value
    })
  }

  initAutoCompleteFields(){
    this.initAutoComplete();
    this.initCountryAutoComplete();
    this.initCityAutoComplete();
  }

  initAutoComplete(){
    this.natFilteredOptions = this.nationalityControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.natOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  initCountryAutoComplete(){
    this.countryFilteredOption = this.countryControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCountry(value))
      );
  }
  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countryOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  initCityAutoComplete(){
    this.cityFilteredOption = this.cityControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCity(value))
      );
  }
  private _filterCity(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cityOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  maritalStatusEvent(event){
    if(event == 'Married'){
      this.isMarriedStatus = true;
      this.profileInformationForm.addControl('dependents', new FormControl('', Validators.required));
    }
  }

  resetUserProfileForm(){
    this.profileInformationForm.reset();
  }

  selectFile(e){
    this.fileNameUpload = e.target.files;
  }

  uploadFiles(){
    if(this.fileNameUpload.length < 1){
      console.log('NOT UPLOADED')
    }
    console.log('this.fileNameUpload', this.fileNameUpload)
  }

}
