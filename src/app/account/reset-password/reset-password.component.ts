import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, of } from 'rxjs';
import { EncryptionService } from 'src/app/service/encryption.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';
import { CustomValidators } from 'src/app/validators/customvalidator';
import * as crypto from "crypto-js";
import { HttpService } from 'src/app/service/http.service';
import { ApiUrls } from 'src/app/constants/apiRoutes';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  resetForm: FormGroup;
  decrypUserId: string;
  expiryDateTime: any;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private encryptionService: EncryptionService,
    private modalDialogService: ModalDialogService, private router: Router, private httpService: HttpService) {
    activatedRoute.params.subscribe((params) => {
      let encId = params["id"];
      let dt = params["date"];
      this.decrypUserId = this.encryptionService.decrypt(encId);
      this.expiryDateTime = new Date(this.encryptionService.decrypt(dt));

    });
  }

  ngOnInit() {
    // let today: any = new Date();
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    let today:any = new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    let time = today - this.expiryDateTime;
    let interval = time > 900000 ? 0 : time;

    of(([])).pipe(
      delay(interval)
    ).subscribe((results) => {
      this.modalDialogService.error("Link expired");
      this.router.navigate(['/']);
    });

    this.initForm();
  }

  initForm() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      confirmPassword: ['', []],
    });

    this.setConfirmPwdValidator();
  }

  get resetFrm() { return this.resetForm.controls }

  matchPassword(): boolean {
    if (this.resetFrm['confirmPassword'].value != '') {
      return this.resetFrm['password'].value == this.resetFrm['confirmPassword'].value;
    }
    else {
      return true;
    }
  }

  setConfirmPwdValidator() {
    this.resetForm.controls['confirmPassword'].setValidators([Validators.required, CustomValidators.ConfirmPassword(m => this.matchPassword())]);
    this.resetForm.controls['confirmPassword'].updateValueAndValidity();
  }

  confirm() {
    this.submitted = true;

    if (this.resetForm.invalid)
      return;

    let param = {
      id: this.decrypUserId,
      password: this.resetFrm['password'].value,//crypto.SHA1(this.resetFrm['password'].value).toString()
    }

    this.httpService.httpPost(ApiUrls.account.updatePassword, param).subscribe(res => { })
  }
}
