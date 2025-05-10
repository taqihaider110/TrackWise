import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { HeaderComponent } from "../../components/header/header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import{ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [SideBarComponent, HeaderComponent, BreadcrumbComponent, CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  isEditable = true; // Controls the editability of address fields
  isPersonalInfoReadOnly = false; // Controls the readonly state of personal info fields

  countryList: string[] = [];
  stateList: string[] = [];
  cityList: string[] = [];

  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  fullAddress: string = '';

  hasData: boolean = false; // Flag to check if data is available
  constructor(private api: ApiService, private fb: FormBuilder, private snackBar: MatSnackBar,) {}

  ngOnInit(): void {
    // Initialize the forms
    this.profileForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      dob: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    });

    this.addressForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      full_address: ['', Validators.required],
    });

    // Fetch profile information
    this.fetchProfileData();

    // Fetch address information
    this.fetchAddressData();

    // Fetch country list
    this.fetchCountryList();
  }

  fetchProfileData(): void {
    this.api.getProfile().subscribe((res: any) => {
      console.log('Profile Data:', res);
      if (res) {
        const formattedDob = res.dob ? new Date(res.dob).toISOString().split('T')[0] : '';

        this.profileForm.patchValue({
          firstname: res.firstname || '',
          lastname: res.lastname || '',
          dob: formattedDob,
          phone_no: res.phone_no || '',
        });
        console.log('Profile Form Value:', this.profileForm.value);

        this.checkPersonalInfo(); // Check if personal info fields are already filled
      }
    });
  }

  fetchAddressData(): void {
    this.api.getProfileAddress().subscribe((res: any) => {
      if (res) {
        this.addressForm.patchValue({
          country: res.country || '',
          state: res.state || '',
          city: res.city || '',
          full_address: res.full_address || '',
        });
        // Populate state and city lists based on the selected country and state
        if (res.country) {
          this.selectedCountry = res.country;
          this.fetchStateList(this.selectedCountry, res.state, res.city);
        }
      }
    });
  }

  fetchCountryList(): void {
    this.api.getCountries().subscribe((res: any) => {
      this.countryList = res.data.map((country: any) => country.name);
    });
  }

  fetchStateList(country: string, selectedState?: string, selectedCity?: string): void {
    this.api.getStates(country).subscribe((res: any) => {
      this.stateList = res.data.states.map((state: any) => state.name);

      if (selectedState) {
        this.selectedState = selectedState;
        this.fetchCityList(country, selectedState, selectedCity);
      }
    });
  }

  fetchCityList(country: string, state: string, selectedCity?: string): void {
    this.api.getCities(country, state).subscribe((res: any) => {
      this.cityList = res.data;

      if (selectedCity) {
        this.selectedCity = selectedCity;
      }
    });
  }

  checkPersonalInfo(): void {
    const firstname = this.profileForm.get('firstname')?.value;
    const lastname = this.profileForm.get('lastname')?.value;
    const dob = this.profileForm.get('dob')?.value;

    if (firstname || lastname || dob) {
      this.isPersonalInfoReadOnly = true; // Make personal info fields readonly
    }
  }

  onCountrySelect(event: any): void {
    this.selectedCountry = event.target.value;

    this.api.getStates(this.selectedCountry).subscribe((res: any) => {
      this.stateList = res.data.states.map((state: any) => state.name);
      this.cityList = []; // Clear previous cities
    });
    this.selectedState = ''; // Reset state and city when country changes
    this.selectedCity = ''; // Reset city when country changes
    this.addressForm.patchValue({
      state: '',
      city: '',
    });
  }

  onStateSelect(event: any): void {
    this.selectedState = event.target.value;

    this.api.getCities(this.selectedCountry, this.selectedState).subscribe((res: any) => {
      this.cityList = res.data;
    });
    this.selectedCity = ''; // Reset city when country changes
    this.addressForm.patchValue({
      city: '',
    });
  }

  onCitySelect(event: any): void {
    this.selectedCity = event.target.value;
  }

  saveProfileForm(event: Event): void {
    event.preventDefault(); // Prevent default form submission behavior

    console.log('Profile Form Value:', this.profileForm.value);
    if (this.profileForm.valid) {
      const profileData = {
        ...this.profileForm.value,
      };

      this.api.postProfile(profileData).subscribe((res: any) => {
        console.log('Profile saved successfully:', res);
        if(res){
          this.snackBar.open('Profile saved!', '', {
            duration: 2000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.isPersonalInfoReadOnly = true;
        }
      });

      // this.snackBar.open('Profile saved!', '', {
      //   duration: 2000,
      //   panelClass: ['snackbar-success'],
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      // });
      // this.isPersonalInfoReadOnly = true; // Make personal info fields readonly after saving
      // Submit to API here if needed
      // Example:
      // this.api.saveProfile(profileData).subscribe({
      //   next: (res) => console.log('Profile saved successfully:', res),
      //   error: (err) => console.error('Error saving profile:', err),
      // });
    } else {
      this.snackBar.open('Feilds Incomplete Or Invalid Data', '', {
        duration: 2000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  saveAddressForm(event: Event){
    event.preventDefault();

    // let addressData = {
    //   country: this.selectedCountry,
    //   state: this.selectedState,
    //   city: this.selectedCity,
    //   full_Address: this.fullAddress,
    // };
    if (this.addressForm.valid) {
       const addressData = {
        ...this.addressForm.value,
      };

    this.api.postProfileAddress(addressData).subscribe((res: any) => {
      console.log('Address saved successfully:', res);
      if(res){
        this.snackBar.open('Address saved!', '', {
          duration: 2000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }});
    }
    else{
      this.snackBar.open('Incomplete Address!', '', {
        duration: 2000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

}
