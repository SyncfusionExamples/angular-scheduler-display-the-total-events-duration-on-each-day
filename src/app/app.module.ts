import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScheduleModule, DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, ScheduleModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService]
})
export class AppModule { }
