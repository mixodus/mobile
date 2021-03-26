import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-hackathon-more-detail',
  templateUrl: './hackathon-more-detail.page.html',
  styleUrls: ['./hackathon-more-detail.page.scss'],
})
export class HackathonMoreDetailPage implements OnInit {
  url: SafeResourceUrl;
  constructor( private domSatizer: DomSanitizer,) { }

  ngOnInit() {
    this.url = this.domSatizer.bypassSecurityTrustResourceUrl("https://icstar.oneindonesia.id/");
  }

}
