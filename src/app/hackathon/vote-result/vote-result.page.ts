import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Chart } from 'chart.js';

import{ HomeService} from '../../home/home.service';


@Component({
  selector: 'vote-result',
  templateUrl: 'vote-result.page.html',
  styleUrls: ['vote-result.page.scss'],
})
export class VoteResultPage implements OnInit{
  canvas: any;
  ctx: any;
  topicId = '';
  topicName = '';
  topicTitle = '';
  topicChoices = [];
  ChoiceName = [];
  ChoiceTotalVote = [];
  ChoiceTotalVotePercent = [];
  totalVote = 0;

  constructor(private homeService: HomeService, private _route: ActivatedRoute) {}

  ngOnInit(){
    this._route.paramMap.subscribe(params => {
      this.topicId = params.get('topic_id');
      console.log(this.topicId);
    });
    this.getVoteResult();
  }

  getVoteResult(){
    this.homeService.getVoteResult(this.topicId).pipe().subscribe((data:any)=> {
      this.topicName = data.data.topic_name;
      this.topicTitle = data.data.topic_title;
      this.topicChoices = data.data.choice;
      this.topicChoices.forEach((value) => {
        this.ChoiceName.push(value.name);
        this.ChoiceTotalVote.push(value.total_vote);
        this.totalVote = this.totalVote + value.total_vote;
      });
      this.ChoiceTotalVote.forEach((value) => {
        this.ChoiceTotalVotePercent.push(Math.round((value/this.totalVote)*100));
      });
      this.topicChoices.forEach((value, index) => {
        value.percent = this.ChoiceTotalVotePercent[index];
      });
      
      this.showChart();
      console.log(data);
      console.log(this.topicChoices);
    });
  }


  showChart (){
    this.ctx = document.getElementById('myChart');
    var myChart = new Chart(this.ctx, {
    type: 'horizontalBar',  
    data: {
        labels: this.ChoiceName,
        datasets: [{
            data: this.ChoiceTotalVote,
            backgroundColor: [
                'rgba(10, 183, 115, 1)',
                'rgba(251, 118, 139, 1)',
                'rgba(255, 194, 0, 1)',
                'rgba(159, 105, 216, 1)',
                'rgba(39, 215, 210, 1)',
                'rgba(0, 163, 230, 1)'
            ],
            borderWidth: 1
        }]
    },
    options : {
      legend: {
        display: false
      },
      tooltips: {
          callbacks: {
            label: function(tooltipItem) {
                    return tooltipItem.yLabel;
            }
          }
      },
      scales: {
          xAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }],
          yAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }]
      }
  }
});
  }

  showChart1(){
    this.ctx = document.getElementById('myChart-1');
    var myChart = new Chart(this.ctx, {
    type: 'horizontalBar',  
    data: {
        labels: this.ChoiceName,
        datasets: [{
            data: this.ChoiceTotalVote,
            backgroundColor: [
                'rgba(10, 183, 115, 1)',
                'rgba(251, 118, 139, 1)',
                'rgba(255, 194, 0, 1)',
                'rgba(159, 105, 216, 1)',
                'rgba(39, 215, 210, 1)',
                'rgba(0, 163, 230, 1)'
            ],
            borderWidth: 1
        }]
    },
    options : {
      legend: {
        display: false
      },
      tooltips: {
          callbacks: {
            label: function(tooltipItem) {
                    return tooltipItem.yLabel;
            }
          }
      },
      scales: {
          xAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }],
          yAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }]
      }
  }
  });
  }

}
