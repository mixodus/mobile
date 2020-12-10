import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import { EventsService } from './services/events.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, EventRoutingModule],
  providers: [EventsService],
})
export class EventModule {}
