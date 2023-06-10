import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { GridActionType, GridColumnDataType, GridColumnType, Pagination } from 'src/app/constants/constant';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-car-models',
  templateUrl: './car-models.component.html',
  styleUrls: ['./car-models.component.scss']
})
export class CarModelsComponent {
  
  filteredCompanies: Array<any> = [];
  allCompanies: Array<any> = [];
  models: Array<any> = [];
  columns: Array<{
    title: string, dataField: string, type: string, dataType?: string, rowChild?: { component: any, show: boolean },sort?:boolean,
    actions?: Array<{ event: string, type: string, title: string, class: string, conditionalDisplay?: { dataField: string, value: any } }>
  }> = [];
  totalCount: number;
  pageIndex: number = 1;
  pageSize = Pagination.PageSize;
  
  carModelForm: FormGroup;
  file: File;
  submitted: boolean = false;
  isLoading:boolean = false;

  @ViewChild('modalBtn') modalBtn: ElementRef;
  
  constructor(private httpService: HttpService, private fb: FormBuilder){}

  ngOnInit(){
    this.setColums();
    this.getAllCompanies();
    this.getAllModels();
    this.initForm();
    this.initizeTypeAhead();
  }

  initForm(){
    this.carModelForm = this.fb.group({
      carCompany: ['',[Validators.required]],
      carModel: ['',[Validators.required]]
    });
  }

  initizeTypeAhead(){
    this.carModelForm.controls['carCompany'].valueChanges.pipe().subscribe(res => {
      if(typeof res == 'string' && res.length > 1){
        this.isLoading = true;
        this.filteredCompanies = this.allCompanies.filter(m => m.name.toLowerCase().includes(res.toLowerCase()));
        this.isLoading = false;
      }
    })
  }

  setColums(){
    this.columns = [
      {title: 'Car Company', dataField: 'name', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      {title: 'MOdel', dataField: 'name', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      {title: 'Action', dataField: '', type: GridColumnType.ACTION, actions : [
        {title: "edit", event: "edit", type:  GridActionType.ICON, class:"fa fa-pencil"},
        {title: "delete", event: "delete", type: GridActionType.ICON, class:"fa fa-trash"},
      ]}
    ]
  }

  getAllCompanies(){
    this.httpService.httpPost(ApiUrls.brand.getAllBrands,null).subscribe((res: any) => {
      if(res['success']){
        this.filteredCompanies = res['data'];
      }
    });
  }

  getAllModels(){
    this.httpService.httpPost(ApiUrls.brand.getAllModels,null).subscribe((res: any) => {
      if(res['success']){
        this.models = res['data'];
        this.totalCount = res['count'];
      }
    });
  }

  displayTypeAheadCompay(val: any){
    if(val != null && val != undefined && val != ''){
      const res = this.filteredCompanies.find(m => m._id == val);
      return res != null && res != undefined ? res.name : val;
    }
  }

  paginationEventHandler(event: {pageIndex: number, pageSize: number}){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getAllCompanies();
  }

  gridEvent(evt: any){
    if(evt.event == "delete"){
      this.httpService.httpPost(ApiUrls.brand.deleteBrand,{id: evt.data._id}).subscribe((res: any) => {
        if(res['success']){
          this.getAllCompanies();
        }
      });
    }
    if(evt.event == 'edit'){
      this.modalBtn.nativeElement.click();
      // this.httpService.httpPost(ApiUrls.brand.deleteBrand,evt.data).subscribe((res: any) => {
      //   if(res['success']){
      //     this.getAllCompanies();
      //   }
      // });
    }
  }

  addModels(){
    this.submitted = true;

    if(this.carModelForm.invalid) return;

    let param = {
      brandId: this.carModelForm.controls['carCompany'].value,
      name: this.carModelForm.controls['carModel'].value,
    }

    this.httpService.httpPost(ApiUrls.brand.setModels,param).subscribe(res => {
      this.modalBtn.nativeElement.click();
    });
  }
}