import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';

@Component({
  selector: 'app-teams-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {

  public Editor = ClassicEditor;
  teamsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<TeamsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private httpService: HttpService,
    private modalDialogService: ModalDialogService) {
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
        arr.controls[arr.length - 1].disable();
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
        arr.controls[arr.length - 1].disable();
      });
      arr.push(this.fb.group({
        name: [],
        profile: [''],
        designation: [''],
        description: [''],
        id: ['']
      }));
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
    const dialogRef = this.modalDialogService.openDialog({
      title: "Delete Vehicle",
      message: "Are you sure you want to delete this Vehicle!",
      buttons: [
        { title: "YES", result: "YES", class: "btn-success" },
        { title: "NO", result: "NO", class: "btn-danger" },
      ]
    })
    dialogRef.subscribe(resp => {
      if (resp == "YES") {
        let arr = (this.teamsForm.controls[type] as FormArray);
        let fb = (arr.controls[index] as FormGroup).controls;
        if (fb['id'].value && fb['id'].value != '') {
          this.httpService.httpGet(ApiUrls.teams.deleteTeamMember + "?id=" + fb['id'].value + "&teamId=" + this.data._id, null).subscribe((res: any) => {
            if (res['success']) {
              arr.removeAt(index);
            }
          });
        }
        else {
          arr.removeAt(index);
        }
      }
    });

  }

  validateAndPushDataToFormArray(type: string, index: number) {
    let array = this.teamsForm.get(type) as FormArray;
    let fb = (array.controls[index] as FormGroup).controls;
    if (fb['name'].value && fb['name'].value != "" && fb['designation'].value && fb['designation'].value != ""
      && fb['description'].value && fb['description'].value != "") {
      let formData = new FormData();
      formData.append(`name`, fb['name'].value);
      formData.append(`designation`, fb['designation'].value);
      formData.append(`description`, fb['description'].value);
      formData.append(`profile`, fb['profile'].value);
      formData.append(`teamId`, this.data._id);
      formData.append(`title`, type == 'leadersFormArray' ? 'leaders' : 'boardOfDirectors');
      if (fb['id'].value && fb['id'].value != "")
        formData.append(`id`, fb['id'].value);

      this.httpService.httpPostFormData(ApiUrls.teams.addUpdateTeamMember, formData).subscribe((res: any) => {
        if (res['success']) {

          fb['id'].setValue(res['data']['_id']);
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


  }

  submit() {
    let formData = new FormData();

    formData.append(`header`, this.teamsForm.controls['header'].value);
    if (this.teamsForm.controls['bannerImg'].value && this.teamsForm.controls['bannerImg'].value != '')
      formData.append(`bannerImg`, this.teamsForm.controls['bannerImg'].value);


    this.validateAndPushDataToFormArray('leadersFormArray', (this.teamsForm.get('leadersFormArray') as FormArray).controls.length - 1);
    this.validateAndPushDataToFormArray('boardFormArray', (this.teamsForm.get('boardFormArray') as FormArray).controls.length - 1);
    

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
