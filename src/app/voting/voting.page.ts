import { Component, OnInit } from '@angular/core';
import { TopicModel } from './voting.model';
import { VotingService } from './voting.services';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.page.html',
  styleUrls: ['./voting.page.scss'],
})
export class VotingPage implements OnInit {
  topics: TopicModel;
  arr: any;
  data: any;

  constructor(private votingService: VotingService) {}

  ngOnInit() {
    this.getTopics();
  }

  getTopics(){
    this.votingService.getTopicsSource().pipe().subscribe((data: any) => {
      this.topics = data;
    });
  }

}
