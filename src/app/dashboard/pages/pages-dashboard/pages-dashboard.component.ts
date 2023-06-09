import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { GridActionType, GridColumnDataType, GridColumnType, Pagination } from 'src/app/constants/constant';
import { HttpService } from 'src/app/service/http.service';
import { ModalDialogService } from 'src/app/service/modal-dialog.service';
import { TeamsComponent } from '../teams/teams.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { OurListComponent } from '../our-list/our-list.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './pages-dashboard.component.html',
  styleUrls: ['./pages-dashboard.component.scss']
})
export class PagesDashboardComponent {
  
  pages: Array<any> = [];
  teams: any;
  columns: Array<{
    title: string, dataField: string, type: string, dataType?: string, rowChild?: { component: any, show: boolean }, sort?: boolean,
    actions?: Array<{ event: string, type: string, title: string, class: string, conditionalDisplay?: { dataField: string, value: any } }>
  }> = [];
  totalCount: number;
  pageIndex: number = 1;
  pageSize = Pagination.PageSize;

  constructor(private httpService: HttpService, private modalDialogService: ModalDialogService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.setColumn();
    this.getAllPages();
  }

  setColumn() {
    this.columns = [
      { title: 'Page Name', dataField: 'name', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      // { title: 'Images', dataField: 'name', type: GridColumnType.DATA, dataType: GridColumnDataType.TEXT },
      { title: 'Description', dataField: 'description', type: GridColumnType.EDITOR, dataType: GridColumnDataType.TEXT },
      {
        title: 'Action', dataField: '', type: GridColumnType.ACTION, actions: [
          { title: "edit", event: "edit", type: GridActionType.ICON, class: "fa fa-pencil" },
          // { title: "delete", event: "delete", type: GridActionType.ICON, class: "fa fa-trash" },
        ]
      }
    ];

    //Set Initial pages
    this.pages = [
      {name: "About us",description: ""},
      {name: "Teams", description: ""},
      {name: "Our List", description: ""}, 
      {name: "Home", description: ""},
    ]
  }

  getAllPages() {
    // this.httpService.httpGet(ApiUrls.pages.getPages, null).subscribe((res: any) => {
    //   if (res['success']) {
    //     this.pages = res['data'];
    //     this.totalCount = res['count'];
    //   }
    // })
    
    this.getAboutUs();
    this.getTeams();
    this.getOurLink();
    this.getHomePage();
  }

  getTeams(){
    this.httpService.httpGet(ApiUrls.teams.getTeams,null).subscribe((res: any) => {
      if(res['success']){
        const index = this.pages.findIndex(m => m.name == 'Teams' );
        if(index > -1){
          this.pages[index]['description'] = res['data']['header'];
          this.pages[index]['data'] = res['data'];

          return;
        }
        this.pages.push({
          name: 'Teams',
          description: res['data']['header'],
          data: res['data'],
        });
      }
    });
  }

  getAboutUs(){
    this.httpService.httpGet(ApiUrls.pages.getAboutus,null).subscribe((res: any) => {
      if(res['success']){
        const index = this.pages.findIndex(m => m.name == 'About us' );
        if(index > -1){
          this.pages[index]['description'] = res['data']['header'];
          this.pages[index]['data'] = res['data'];

          return;
        }
        this.pages.push({
          name: 'About us',
          description: res['data']['header'],
          data: res['data'],
        });
      }
    });
  }
  getOurLink(){
    this.httpService.httpGet(ApiUrls.pages.getOurList,null).subscribe((res: any) => {
      if(res['success']){
        const index = this.pages.findIndex(m => m.name == 'Our List' );
        if(index > -1){
          this.pages[index]['description'] = res['data']['header'];
          this.pages[index]['data'] = res['data'];

          return;
        }
        this.pages.push({
          name: 'Our List',
          description: res['data']['header'],
          data: res['data'],
        });
      }
    });
  }

  getHomePage(){
    this.httpService.httpGet(ApiUrls.pages.getHome,null).subscribe((res: any) => {
      if(res['success']){
        const index = this.pages.findIndex(m => m.name == 'Home' );
        if(index > -1){
          this.pages[index]['description'] = res['data']['header'];
          this.pages[index]['data'] = res['data'];

          return;
        }
        this.pages.push({
          name: 'Home',
          description: res['data']['header'],
          data: res['data'],
        });
      }
    });
  }

  paginationEventHandler(evt: any) {

  }

  gridEvent(evt: any) {
    if (evt.event == "delete") {
      const dialogRef = this.modalDialogService.openDialog({
        title: "Delete",
        message: "Are you sure you want to delete this company!",
        buttons: [
          { title: "YES", result: "YES", class: "btn-success" },
          { title: "NO", result: "NO", class: "btn-danger" },
        ]
      })
      dialogRef.subscribe(res => {
        if (res == "YES") {
          this.httpService.httpPost(ApiUrls.pages.deletePages, { id: evt.data._id }).subscribe((res: any) => {
            if (res['success']) {
              // this.getAllCompanies();
              this.getAllPages();
            }
          });
        }
      });
    }
    if (evt.event == 'edit') {
      this.addUpdate(evt.data);
    }
  }

  addUpdate(data: any = null) {
    let component: any;

    switch(data?.name??""){
      case "About us": component = AboutUsComponent;
      break;
      case "Teams": component = TeamsComponent;
      break;
      case "Our List": component = OurListComponent;
      break;
      case "Home": component = HomeComponent;
      break;
      default: component = HomeComponent;
      break;

    }

    const dialogRef = this.dialog.open(component, {
      height: "80%",
      width: "80%",
      data: data == null ? { name: "", description: "" } : data['data']
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        switch(data?.name??""){
          case "About us": this.getAboutUs();
          break;
          case "Teams": this.getTeams();
          break;
          case "Our List": this.getOurLink;
          break;
          case "Our List": this.getOurLink;
          break;
          default: this.getHomePage();
          break;
    
        }
        // let apiUrl = ApiUrls.pages.updatePage;
        // if (res.id == undefined || res.id == null || res.id == "") {
        //   apiUrl = ApiUrls.pages.savePage
        // }
        // this.httpService.httpPostFormData(apiUrl, res).subscribe(res => {

        //   this.getAllPages();
        // });
      }
    });
  }
}
