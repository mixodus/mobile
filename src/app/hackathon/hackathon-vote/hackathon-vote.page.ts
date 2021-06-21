import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import{ HomeService} from '../../home/home.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, Platform, ToastController } from '@ionic/angular';


 
@Component({
  selector: 'app-hackathon-vote',
  templateUrl: './hackathon-vote.page.html',
  styleUrls: ['./hackathon-vote.page.scss'],
})
export class HackathonVotePage implements OnInit {
  unformatedcandidates: any[];
  formattedCandidates: any [] =  [];
  colorHex:any[] = ["#0AB773", "#FB768B","#FFC200", "#9F69D8", "#27D7D2","#00A3E6"];
  counter: number = 0;
  bannerURL: any;
  name='';
  title='';
  topicId= '';
  voteStatus= '';
  voteResult: any;



  constructor(private homeService: HomeService, private alertCtrl: AlertController, private _route: ActivatedRoute, ) { }

  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      this.topicId = params.get('topic_id');
    });
    this.getCandidates();
  }

  getCandidates(){
    this.homeService.getCandidate(this.topicId).pipe().subscribe((data:any)=> {
      this.unformatedcandidates = data.data.choices;
      this.formattingCandidates();
      console.log(this.unformatedcandidates);
      console.log(data);
      this.bannerURL = data.data.banner_url;
      this.title = data.data.title;
      this.name = data.data.name;
      this.voteStatus = data.data.is_already_vote;
      console.log(this.voteStatus);
    });
  }

  formattingCandidates(){
    for (const candidate of this.unformatedcandidates) {
      this.formattedCandidates.push(
        {
          candidateName: candidate.name,
          candidateChoice_id: candidate.choice_id,
          candidateIconURL: candidate.icon_url,
          candidateColor: this.colorHex[this.counter],
        }
      )
      this.counter += 1;
      //console.log(this.formattedCandidates);
    }
  }
  //Set Color on Cards
  setColor(p:any){
    let styles = {
      'border-top': '15px solid '+  p,
      'border-radius': '13px',
    };
    return styles;
  }

  async voteClick(candidateIconURL: any, candidateName: any, candidateChoice_id: any){
    const alert = await this.alertCtrl.create({
      message: '<div class="vote-alert-body">'+ 
                    '<img src="'+(candidateIconURL)+'" alt="">' + 
                    '<p>' + candidateName +  '</p>' + 
                    '<p>Apakah kamu yakin memilih kandidat ini?<p>' + 
                '</div>' ,
      cssClass:'vote-alert',
      buttons: [
        {
          cssClass: 'alert-button-outline',
          text: 'Batal',
        },
        {
          cssClass: 'alert-button-fill',
          text: 'Vote',
          handler: () => {
            let postdata = {choice_id:candidateChoice_id};
            this.homeService.postVoteCandidate(postdata)
            .pipe().subscribe(() => {
            }, (err) => {
              let message = '';
              if (err.error.message === undefined) {
                message = 'Network Problem, Please Try Again.';
              } else {
                message = err.error.message;
                console.log(message);
                //if no more votes left
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

}
