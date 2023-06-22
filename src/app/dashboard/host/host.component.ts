import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { GridActionType, GridColumnDataType, GridColumnType, Pagination } from 'src/app/constants/constant';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';
import { HostDetailsComponent } from 'src/app/shared/host-details/host-details.component';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent {

  hosts: Array<any> = [];
  columns: Array<{
    title: string, dataField: string, type: string, dataType?: string, rowChild?: { component: any, show: boolean }, sort?: boolean,
    actions?: Array<{ event: string, type: string, title: string, class: string, conditionalDisplay?: { dataField: string, value: any } }>
  }> = [];
  totalCount: number;
  pageIndex: number = 1;
  pageSize = Pagination.PageSize;
  // @ViewChild('modalBtn') modalBtn: ElementRef;

  constructor(private httpService: HttpService, private modalDialogService: ModalDialogService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.setColums();
    this.getAllHost();
  }

  setColums() {
    this.columns = [
      { title: 'User', dataField: 'userName', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Maker', dataField: 'make', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Model', dataField: 'model', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Year', dataField: 'year', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      // { title: 'Driving License', dataField: 'dirverDetails["drivingLicense"]', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Mobile', dataField: 'ownerMobile', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Status', dataField: 'status', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      {
        title: 'Action', dataField: '', type: GridColumnType.ACTION, actions: [
          { title: "View", event: "view", type: GridActionType.ICON, class: "fa fa-eye" },
          { title: "Accept", event: "accept", type: GridActionType.ICON, class: "fa fa-check-circle-o" },
          { title: "Reject", event: "reject", type: GridActionType.ICON, class: "fa fa-ban" },
        ]
      }
    ];
  }

  getAllHost() {
    this.httpService.httpGet(ApiUrls.host.getAllHost, null).subscribe((res: any) => {
      if (res['success']) {
        this.hosts = res['data']
      }
    })
  }

  paginationEventHandler(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getAllHost();
  }

  gridEvent(evt: any) {
    if (evt.event == "delete") {
      const dialogRef = this.modalDialogService.openDialog({
        title: "Delete Model",
        message: "Are you sure you want to delete this Vehicle Model!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      })
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpGet(ApiUrls.brand.deleteModel, { id: evt.data._id }).subscribe((res: any) => {
            if (res['success']) {
              // this.getAllModels();
            }
          });
        }
      });
    }
    if (evt.event == 'accept') {
      // this.modalBtn.nativeElement.click();
      this.httpService.httpPost(ApiUrls.host.updateHostStatus, { id: evt.data._id, status: "Accepted" }).subscribe((res: any) => {
        if (res['success']) {
          this.getAllHost();
          // this.getAllModels();
        }
      });
    }
    if (evt.event == 'reject') {
      // this.modalBtn.nativeElement.click();
      const dialogRef = this.modalDialogService.openDialog({
        title: "Reject Host",
        message: "Are you sure you want to reject this host!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      })
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpPost(ApiUrls.host.updateHostStatus, { id: evt.data._id, status: "Rejected" }).subscribe((res: any) => {
            if (res['success']) {
              this.getAllHost();
              // this.getAllModels();
            }
          });
        }
      });
    }
    if(evt.event == 'view'){
      const dialogRef = this.dialog.open(HostDetailsComponent, {
        height: "80%",
        width: "80%",
        data: evt.data
      });

      dialogRef.afterClosed();
    }
  }
}
