import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { ICacheContent } from 'src/app/interface/cacheInterface';
import { CacheService } from 'src/app/service/cache.service';
import { EncryptionService } from 'src/app/service/encryption.service';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';
import { UserInfoService } from 'src/app/service/user-info.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  cacheKey: string = environment.cacheKey;
  submitted: boolean = false;
  returnUrl: string = "/";

  constructor(private fb: FormBuilder, private httpService: HttpService, private cacheService: CacheService,
    private encryptionService: EncryptionService, private modalDialogService: ModalDialogService,
    private userInfoService: UserInfoService, private router: Router, public activatedRoute: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.initForm()
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

    // Check if user is already logged in
    var user = this.userInfoService.getLoggedInUser();
    if (user != undefined && user != null && user != 'null') {
      this.router.navigateByUrl(this.returnUrl).then(
        success => {
          if (!success)
            this.router.navigateByUrl('/');
        });
    }
  }

  initForm() {
    let cacheData = this.cacheService.get(this.cacheKey);
    this.loginForm = this.fb.group({
      email: [cacheData != null ? cacheData.email : '', [Validators.required]],
      password: [cacheData != null ? this.encryptionService.decrypt(cacheData.password) : '', [Validators.required]],
      rememberMe: [false]
    });
  }

  get loginFrm() { return this.loginForm.controls }

  submit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
      // this.modalDialogService.error("Invalid Input");
    }

    let param = {
      email: this.loginFrm['email'].value,
      password: this.loginFrm['password'].value //crypto.SHA1(this.loginFrm['password'].value).toString()
    }

    this.httpService.httpPost(ApiUrls.account.login, param).subscribe((res: any) => {
      if (res['success']) {
        if (this.loginFrm['rememberMe'].value) {
          const param: ICacheContent = {
            email: this.loginFrm['email'].value,
            password: this.encryptionService.encrypt(this.loginFrm['password'].value)
          }
          this.cacheService.set(this.cacheKey, param);
        }
        else {
          this.cacheService.delete(this.cacheKey);
        }

        this.userInfoService.setUser(res['data']);
        this.returnUrl  = this.returnUrl == "/" ? res['data'].isAdmin ? '/admin' : this.returnUrl : this.returnUrl
        this.router.navigateByUrl(this.returnUrl).then(
          success => {
            if (!success) 
              this.router.navigateByUrl('/');
          });
      }
    });
  }

  back(){
    this.location.back();
  }
}
