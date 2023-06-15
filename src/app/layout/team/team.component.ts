import { Component } from '@angular/core';
import { ApiUrls } from 'src/app/constants/apiRoutes';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {

  data: any;
  domain: string = environment.url;
  constructor(private httpService: HttpService){}

  ngOnInit(){
    this.getTeams();
  }

  getTeams(){
    this.httpService.httpGet(ApiUrls.teams.getTeams,null).subscribe((res: any) => {
      if(res['success']){
        this.data = res['data'];
      }
    });
  }

}
