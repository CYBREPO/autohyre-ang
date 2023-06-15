import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public Editor = ClassicEditor;
  homeForm: FormGroup;
  files: FileList

  constructor(public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private httpService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.homeForm = this.fb.group({
      bannerContent: [this.data != null ? this.data.bannerContent : ''],
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
    this.homeForm.controls[type].setValue(event?.target?.files[0])
    this.files = event?.target?.files;
    return;
  }

  handleFileInputBanner(event: any): void {
    this.files = event?.target?.files;
    return;
  }

  submit(){
    let formData = new FormData();

    formData.append(`bannerContent`,this.homeForm.controls['bannerContent'].value);
    formData.append(`header`,this.homeForm.controls['header'].value);
    formData.append(`body`,this.homeForm.controls['body'].value);
    formData.append(`footer`,this.homeForm.controls['footer'].value);
    formData.append(`mainImg`,this.homeForm.controls['mainImg'].value);

    for(let i=0; i< this.files?.length; i++){
      formData.append(`bannerImages`,this.files[i]);
    }
    let api = ApiUrls.pages.saveHome;
    if(this.data?._id && this.data?._id != ""){
      formData.append(`id`,this.data._id);
      api = ApiUrls.pages.updateHome;
    }

    this.httpService.httpPostFormData(api,formData).subscribe(res => {
      this.dialogRef.close(res);
    });
  }
}
