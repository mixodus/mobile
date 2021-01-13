import { Component, OnInit } from '@angular/core';
import { SkillModel } from '../skills.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../../app/services/global.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../../../../app/shell/data-store';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../app/services/auth/authentication.service';
import { finalize } from 'rxjs/operators';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.page.html',
  styleUrls: ['./add-skills.page.scss'],
})
export class AddSkillsPage implements OnInit {

  skillForm: FormGroup;
  hideSuggestion = true;
  skillDataStore: DataStore<SkillModel>;
  searchValue: string;
  searchResult = [];
  isSkillShell = false;
  selectedSkills: Array<string>;

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private router: Router,
    private auth: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private navCtrl: NavController,
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.selectedSkills = this.router.getCurrentNavigation().extras.state.data;
    }
  }

  ngOnInit() {
    this.skillForm = new FormGroup({
      skill: new FormControl('', Validators.compose([]))
    });
  }

  searchList(ev: any): void {
    // let searchValue : string = ev.detail.value;
    // if(searchValue.length >= 1){
    //   this.filterSearch(searchValue);
    //   this.hideSuggestion = false;
    // } else if (searchValue.length <= 0){
    //   this.hideSuggestion = true;
    // }
    if (this.searchValue != undefined && this.searchValue != '') {
      // search
      this.hideSuggestion = false;
      this.filterSearch(this.searchValue);
    } else {
      this.hideSuggestion = true;
    }
  }

  filterSearch(filter: string) {
    /**
     * get data source with filter
     * load datasource to datastore
     * subscribe datastore value to jobs
     */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const skillSearchEndpoint =
      this.globalService.apiUrl +
      'search/reference?q=' + filter + '&cat=skill';

    const skillDataSource: Observable<SkillModel> = this.http.get<SkillModel>(skillSearchEndpoint, options);
    const shellModel: SkillModel = new SkillModel();
    this.skillDataStore = new DataStore(shellModel);
    // Trigger the loading mechanism (with shell) in the dataStore
    this.skillDataStore.load(skillDataSource);
    this.skillDataStore.state.subscribe(
      (state) => {
        console.log('state: ', state);
        const result = [];
        let flag = false;
        if (state.data.length > 0) {
          result.push(state.data[0].name);
          for (let i = 0; i < state.data.length; i++) {
            flag = false;
            for (let j = 0; j < result.length; j++) {
              if (state.data[i].name.toLowerCase() === result[j].toLowerCase()) {
                flag = true;
              }
            }
            if (flag === false) {
              result.push(state.data[i].name);
            }
          }
        }
        this.isSkillShell = state.isShell;
        this.searchResult = result;
      });
  }

  showSuggestion() {
    this.hideSuggestion = false;
  }

  addSkill() {
    const skill = this.skillForm.value.skill;
    if (this.selectedSkills.includes(skill)) {
      return;
    }
    this.selectedSkills.push(skill);

    this.skillForm.reset();
  }

  selectItem(item: string) {
    if (this.selectedSkills.includes(item)) {
      return;
    }
    this.selectedSkills.push(item);
    this.searchValue = '';
    this.hideSuggestion = true;
  }

  removeItem(item: string) {
    this.selectedSkills.splice(this.selectedSkills.indexOf(item), 1);
  }

  async saveSkills() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    // tslint:disable-next-line:prefer-const
    let savedSkills = this.selectedSkills.join(',');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = { 'skill': savedSkills };

    const options = { headers: headers };

    const skillUpdateEndpoint =
      this.globalService.apiUrl +
      'api/profile/skill';

    this.http.post(skillUpdateEndpoint, body, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data['message']);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.home = true;
        this.globalService.refreshFlag.level = true;
        this.globalService.refreshFlag.leaderboard = true;
        this.navCtrl.back();
      }, err => {
        console.log('JS Call error: ', err);

        let message = '';
        if (err.error.message === undefined) {
          message = 'Permasalahan jaringan, mohon coba lagi.';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  goBack() {
    this.router.navigateByUrl('app/user');
  }
}
