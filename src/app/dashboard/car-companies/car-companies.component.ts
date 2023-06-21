import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { GridActionType, GridColumnDataType, GridColumnType, Pagination } from 'src/app/constants/constant';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';

@Component({
  selector: 'app-car-companies',
  templateUrl: './car-companies.component.html',
  styleUrls: ['./car-companies.component.scss']
})
export class CarCompaniesComponent {

  companies: Array<any> = [];
  columns: Array<{
    title: string, dataField: string, type: string, dataType?: string, rowChild?: { component: any, show: boolean }, sort?: boolean,
    actions?: Array<{ event: string, type: string, title: string, class: string, conditionalDisplay?: { dataField: string, value: any } }>
  }> = [];
  totalCount: number;
  pageIndex: number = 1;
  pageSize = Pagination.PageSize;

  carCompanyForm: FormGroup;
  file: File;
  submitted: boolean = false;
  searchText: string = '';
  currentCompany: any;

  @ViewChild('modalBtn') modalBtn: ElementRef;

  constructor(private httpService: HttpService, private fb: FormBuilder, private modalDialogService: ModalDialogService) { }

  ngOnInit() {
    this.setColums();
    this.getAllCompanies();
    this.initForm();
  }

  initForm() {
    this.carCompanyForm = this.fb.group({
      carCompany: ['', [Validators.required]],
      Profile: ['']
    });
  }

  setColums() {
    this.columns = [
      { title: 'Name', dataField: 'name', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      {
        title: 'Action', dataField: '', type: GridColumnType.ACTION, actions: [
          { title: "edit", event: "edit", type: GridActionType.ICON, class: "fa fa-pencil" },
          { title: "delete", event: "delete", type: GridActionType.ICON, class: "fa fa-trash" },
        ]
      }
    ]
  }

  getAllCompanies() {
    let param = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      searchText: this.searchText
    };

    this.httpService.httpPost(ApiUrls.brand.getAllBrands, param).subscribe((res: any) => {
      if (res['success']) {
        this.companies = res['data'];
        this.totalCount = res['count'];
      }
    });
  }

  paginationEventHandler(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getAllCompanies();
  }

  gridEvent(evt: any) {
    if (evt.event == "delete") {
      this.currentCompany = evt.data;
      const dialogRef = this.modalDialogService.openDialog({
        title: "Delete Company",
        message: "Are you sure you want to delete this company!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      })
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpPost(ApiUrls.brand.deleteBrand, { id: evt.data._id }).subscribe((res: any) => {
            if (res['success']) {
              this.getAllCompanies();
            }
          });
        }
      });
    }
    if (evt.event == 'edit') {
      this.modalBtn.nativeElement.click();
      this.currentCompany = evt.data;
      this.carCompanyForm.patchValue({
        carCompany: evt.data.name
      });
      
    }
  }

  addNewCompany() {
    this.submitted = true;
    if (this.carCompanyForm.invalid || !this.file) {
      return;
    }

    let formData = new FormData();
    let api = ApiUrls.brand.setBrands;
    formData.append(`name`, this.carCompanyForm.controls['carCompany'].value);
    formData.append(`image`, this.file);
    if(this.currentCompany){
      formData.append(`id`, this.currentCompany._id);
      api = ApiUrls.brand.updateBrand
    }
    

    this.httpService.httpPostFormData(api, formData).subscribe((res: any) => {
      if (res['success']) {
        this.modalBtn.nativeElement.click();
        this.getAllCompanies();
      }
    })
  }

  handleFileInputProfile(event: any): void {
    this.file = event?.target?.files[0];
  }
}
