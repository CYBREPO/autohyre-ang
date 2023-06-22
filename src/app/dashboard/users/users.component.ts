import { Component } from '@angular/core';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { GridActionType, GridColumnDataType, GridColumnType, Pagination } from 'src/app/constants/constant';
import { HttpService } from 'src/app/service/http.service';
import { EditProfileComponent } from '../account/edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  users: Array<any> = [];
  columns: Array<{
    title: string, dataField: string, type: string, dataType?: string, rowChild?: { component: any, show: boolean }, sort?: boolean,
    actions?: Array<{ event: string, type: string, title: string, class: string, conditionalDisplay?: { dataField: string, value: any } }>
  }> = [];
  totalCount: number;
  pageIndex: number = 1;
  pageSize = Pagination.PageSize;
  searchText: string = "";

  constructor(private httpService: HttpService, private dialog: MatDialog, private modalDialogService: ModalDialogService) { }

  ngOnInit() {
    this.setColums();
    this.getAllUsers();
  }

  setColums() {
    this.columns = [
      { title: 'Name', dataField: 'name', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Email', dataField: 'email', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Active', dataField: 'isActive', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Last Login', dataField: 'lastLogin', type: GridColumnType.DATA, dataType: GridColumnDataType.DATETIME },
      {
        title: 'Action', dataField: '', type: GridColumnType.ACTION, actions: [
          { title: "block", event: "block", type: GridActionType.ICON, class: "fa fa-ban",
          conditionalDisplay: {dataField: 'isActive',value: true}},
          { title: "un-block", event: "un-block", type: GridActionType.ICON, class: "fa fa-check-circle",
          conditionalDisplay: {dataField: 'isActive',value: false} },
          { title: "edit", event: "edit", type: GridActionType.ICON, class: "fa fa-pencil" },
          { title: "delete", event: "delete", type: GridActionType.ICON, class: "fa fa-trash" },
        ]
      }
    ]
  }

  getAllUsers() {
    let param = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText
    }
    this.httpService.httpPost(ApiUrls.account.getUsers, param).subscribe((res: any) => {
      if (res['success']) {
        this.users = res['data'];
        this.totalCount = res['count'];
      }
    });
  }

  paginationEventHandler(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getAllUsers();
  }

  gridEvent(evt: any) {
    if (evt.event == "delete") {
      const dialogRef = this.modalDialogService.openDialog({
        title: "Delete User",
        message: "Are you sure you want to delete this user!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      });
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpGet(ApiUrls.account.deleteUser, { id: evt.data._id }).subscribe((res: any) => {
            if (res['success']) {
              this.getAllUsers();
            }
          });
        }
      });

    }
    if (evt.event == 'edit') {
      this.openUser(evt.data);
    }
    if (evt.event == 'block' || evt.event == 'un-block') {
      let param = {
        id: evt.data._id,
        isActive: !evt.data.isActive
      }
      const dialogRef = this.modalDialogService.openDialog({
        title: "Block User",
        message: "Are you sure you want to block this user!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      })
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpPost(ApiUrls.account.updateUserStatus, param).subscribe((res: any) => {
            if (res['success']) {
              this.getAllUsers();
            }
          });
        }
      });
    }
  }

  openUser(data: any) {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      height: "80%",
      width: "80%",
      data: data
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.getAllUsers();
      }
    })
  }
}
