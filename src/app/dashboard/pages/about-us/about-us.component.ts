import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OurListComponent } from '../our-list/our-list.component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpService } from 'src/app/service/http.service';
import { ApiUrls } from 'src/app/constants/apiRoutes';

@Component({
  selector: 'app-about-us-dashboard',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {

  public Editor = ClassicEditor;
  aboutusForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AboutUsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private httpService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.aboutusForm = this.fb.group({
      header: [this.data != null ? this.data.header : ''],
      bannerImg: [''],
      mainImg: [''],
      body: [this.data != null ? this.data.body : ''],
      footer: [this.data != null ? this.data.footer : '']
    });
  }



  closePopup(): void {
    this.dialogRef.close(null);
  }

  handleFileInput(event: any, type: string): void {
    this.aboutusForm.controls[type].setValue(event?.target?.files[0]);
    return;
  }

  submit(){
    let formData = new FormData();

    formData.append(`header`,this.aboutusForm.controls['header'].value);
    formData.append(`body`,this.aboutusForm.controls['body'].value);
    formData.append(`footer`,this.aboutusForm.controls['footer'].value);
    formData.append(`bannerImg`,this.aboutusForm.controls['bannerImg'].value);
    formData.append(`mainImg`,this.aboutusForm.controls['mainImg'].value);

    let api = ApiUrls.pages.saveAboutus;
    if(this.data._id && this.data._id != ""){
      formData.append(`id`,this.data._id);
      api = ApiUrls.pages.updateAboutus;
    }

    this.httpService.httpPostFormData(api,formData).subscribe(res => {
      this.dialogRef.close(res);
    });
  }
}
