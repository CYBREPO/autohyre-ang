import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-our-list-dashboard',
  templateUrl: './our-list.component.html',
  styleUrls: ['./our-list.component.scss']
})
export class OurListComponent {

  public Editor = ClassicEditor;
  ourListForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<OurListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private httpService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const featureForm = this.fb.group({
      title: [''],
      description: ['']
    });

    this.ourListForm = this.fb.group({
      header: [this.data != null ? this.data.header : ''],
      bannerImg: [''],
      mainImg: [''],
      body: [this.data != null ? this.data.body : ''],
      FeatureFormArray: this.fb.array([featureForm]),
      footer: [this.data != null ? this.data.footer : '']
    });

    if (this.data && this.data.features) {
      let array = this.ourListForm.get('FeatureFormArray') as FormArray;
      array.clear();
      this.data.features.forEach((m : any) => {
        array.push(this.fb.group({
          title: m.title,
          description: m.description 
        }));
      });
    }
  }

  get featureFrm() { return (this.ourListForm.get('FeatureFormArray') as FormArray).controls }


  closePopup(): void {
    this.dialogRef.close(null);
  }

  handleFileInput(event: any, type: string): void {
    this.ourListForm.controls[type].setValue(event?.target?.files[0]);
    return;
  }

  deleteRow(type: string, index: number) {
    let arr = (this.ourListForm.controls[type] as FormArray);
    arr.removeAt(index);
  }

  validateAndPushDataToFormArray(type: string, index: number) {
    let array = this.ourListForm.get(type) as FormArray;
    array.push(this.fb.group({
      title: [''],
      description: ['']
    }));
  }

  submit() {
    let formData = new FormData();

    formData.append(`header`, this.ourListForm.controls['header'].value);
    formData.append(`body`, this.ourListForm.controls['body'].value);
    formData.append(`footer`, this.ourListForm.controls['footer'].value);
    formData.append(`bannerImg`, this.ourListForm.controls['bannerImg'].value);
    formData.append(`mainImg`, this.ourListForm.controls['mainImg'].value);

    let arr = (this.ourListForm.controls['FeatureFormArray'] as FormArray).controls;

    for (let i = 0; i < arr.length; i++) {
      const fb = (arr[i] as FormGroup).controls;
      formData.append(`features[${i}][title]`, fb['title'].value);
      formData.append(`features[${i}][description]`, fb['description'].value);
    }

    let api = ApiUrls.pages.saveOurLink;
    if (this.data?._id && this.data?._id != "") {
      formData.append(`id`, this.data._id);
      api = ApiUrls.pages.updateOurList;
    }

    this.httpService.httpPostFormData(api, formData).subscribe(res => {
      this.dialogRef.close(res);
    });
  }
}
