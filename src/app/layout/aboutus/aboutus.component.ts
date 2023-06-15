import { Component } from '@angular/core';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent {
  
  data: any;
  domain: string = environment.url;
  constructor(private httpService: HttpService){}

  ngOnInit(){
    this.getAboutUs();
  }

  getAboutUs(){
    this.httpService.httpGet(ApiUrls.pages.getAboutus,null).subscribe((res: any) => {
      if(res['success']){
        this.data = res['data'];
      }
    });
  }
}
