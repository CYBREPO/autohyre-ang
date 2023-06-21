import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-teams-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {

  public Editor = ClassicEditor;
  teamsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<TeamsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private httpService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const leadForm = this.fb.group({
      name: [],
      profile: [''],
      designation: [''],
      description: [''],
      id: ['']
    });

    this.teamsForm = this.fb.group({
      header: [this.data != null ? this.data.header : ''],
      bannerImg: [''],
      boardFormArray: this.fb.array([leadForm]),
      leadersFormArray: this.fb.array([leadForm])
    });

    if (this.data && this.data.leaders?.length > 0) {
      let arr = (this.teamsForm.controls['leadersFormArray'] as FormArray);
      arr.clear();
      this.data.leaders.forEach((m: any) => {
        arr.push(this.fb.group({
          name: m.name,
          designation: m.designation,
          description: m.description,
          profile: '',
          id: m._id
        }));
      });
      arr.push(this.fb.group({
        name: [],
        profile: [''],
        designation: [''],
        description: [''],
        id: ['']
      }));
    }

    if (this.data && this.data.boardOfDirectors?.length > 0) {
      let arr = (this.teamsForm.controls['boardFormArray'] as FormArray);
      arr.clear();
      this.data.boardOfDirectors.forEach((m: any) => {
        arr.push(this.fb.group({
          name: m.name,
          designation: m.designation,
          description: m.description,
          profile: '',
          id: m._id
        }));
        arr.push(this.fb.group({
          name: [],
          profile: [''],
          designation: [''],
          description: [''],
          id: ['']
        }));
      })
    }
  }

  get leadersFrm() { return (this.teamsForm.get('leadersFormArray') as FormArray).controls }

  get boardFrm() { return (this.teamsForm.get('boardFormArray') as FormArray).controls }

  closePopup(): void {
    this.dialogRef.close(null);
  }

  handleFileInput(event: any, type: string, index: number): void {
    if (index == -1) {
      this.teamsForm.controls[type].setValue(event?.target?.files[0]);
      return;
    }

    let arr = (this.teamsForm.controls[type] as FormArray);
    let fb = (arr.controls[index] as FormGroup)
    fb.controls['profile'].setValue(event?.target?.files[0]);
    // this.fileData = event?.target?.files;
  }

  deleteRow(type: string, index: number) {
    let arr = (this.teamsForm.controls[type] as FormArray);
    let fb = (arr.controls[index] as FormGroup).controls;
    if (fb['id'].value && fb['id'].value != '') {
      this.httpService.httpGet(ApiUrls.teams.deleteTeamMember + "?id=" + fb['id'].value, null).subscribe((res: any) => {
        if (res['success']) {
          arr.removeAt(index);
        }
      });
    }
    else {
      arr.removeAt(index);
    }

  }

  validateAndPushDataToFormArray(type: string, index: number) {
    let array = this.teamsForm.get(type) as FormArray;
    let fb = (array.controls[index] as FormGroup).controls;

    let formData = new FormData();
    formData.append(`name`, fb['name'].value);
    formData.append(`designation`, fb['designation'].value);
    formData.append(`description`, fb['description'].value);
    formData.append(`profile`, fb['profile'].value);
    formData.append(`title`, type == 'leadersFormArray' ? 'leaders' : 'boardOfDirectors');
    if(fb['id'].value && fb['id'].value != "") 
      formData.append(`id`, fb['id'].value);

    this.httpService.httpPostFormData(ApiUrls.teams.addUpdateTeamMember, formData).subscribe((res: any) => {
      if (res['success']) {
        array.push(this.fb.group({
          name: [''],
          profile: [''],
          designation: [''],
          description: [''],
          id: ['']
        }));
      }
    });

  }

  submit() {
    let formData = new FormData();

    formData.append(`header`, this.teamsForm.controls['header'].value);
    if (this.teamsForm.controls['bannerImg'].value && this.teamsForm.controls['bannerImg'].value != '')
      formData.append(`bannerImg`, this.teamsForm.controls['bannerImg'].value);

    let array = this.teamsForm.get('leadersFormArray') as FormArray;
    for (let i = 0; i < array.controls.length; i++) {
      let fb = (array.controls[i] as FormGroup).controls;

      formData.append(`leaders[${i}][name]`, fb['name'].value);
      formData.append(`leaders[${i}][designation]`, fb['designation'].value);
      formData.append(`leaders[${i}][description]`, fb['description'].value);
      formData.append(`leaders[${i}][id]`, fb['id'].value);
      if (fb['profile'] && fb['profile'].value != '')
        formData.append(`leadersProfile`, fb['profile'].value);
    }

    array = this.teamsForm.get('boardFormArray') as FormArray;
    for (let i = 0; i < array.controls.length; i++) {
      let fb = (array.controls[i] as FormGroup).controls;

      formData.append(`boardOfDirectors[${i}][name]`, fb['name'].value);
      formData.append(`boardOfDirectors[${i}][designation]`, fb['designation'].value);
      formData.append(`boardOfDirectors[${i}][description]`, fb['description'].value);
      formData.append(`boardOfDirectors[${i}][id]`, fb['id'].value);
      if (fb['profile'] && fb['profile'].value != '')
        formData.append(`boardsProfile`, fb['profile'].value);
    }

    let api = ApiUrls.teams.saveTeams;
    if (this.data?._id != null && this.data?._id != "") {
      formData.append(`id`, this.data._id);
      api = ApiUrls.teams.updateTeams;
    }
    this.httpService.httpPostFormData(api, formData).subscribe(res => {
      this.dialogRef.close(res);
    });
  }

}
