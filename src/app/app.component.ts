import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { Internationalization } from '@syncfusion/ej2-base';
import {
  EventSettingsModel, ScheduleComponent, GroupModel, WeekService, MonthService, ResizeService, DayService, DragAndDropService, RenderCellEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { Query, Predicate, DataManager } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [WeekService, MonthService, DayService, ResizeService, DragAndDropService]
})

export class AppComponent {
  public selectedDate: Date = new Date(2018, 3, 1);
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public resourceDataSource: Object[] = [
    { AirlineName: 'Airways 1', AirlineId: 1, AirlineColor: '#EA7A57' },
    { AirlineName: 'Airways 2', AirlineId: 2, AirlineColor: '#357cd2' },
    { AirlineName: 'Airways 3', AirlineId: 3, AirlineColor: '#7fa900' }
  ];
  public instance: Internationalization = new Internationalization();
  public group: GroupModel = { resources: ['Airlines'] };
  public allowMultiple: Boolean = true;
  public eventSettings: EventSettingsModel = {
    dataSource: [{
      Id: 1,
      Subject: 'Explosion of Betelgeuse Star',
      StartTime: new Date(2018, 3, 2, 10, 0),
      EndTime: new Date(2018, 3, 2, 11, 30),
      AirlineId: 1
    }]
  };


  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'dateHeader' || args.elementType === 'monthCells') {
      let ele: Element = document.createElement('div');
      ele.id = this.scheduleObj.getResourcesByIndex(args.groupIndex).resourceData.AirlineId as any;
      ele.innerHTML = this.getDuration(args);
      (args.element).appendChild(ele.firstChild);
    }
  }

  getDuration: Function = (args: any) => {
    var id = this.scheduleObj.getResourcesByIndex(args.groupIndex).resourceData.AirlineId as any;
    id = id + '_' + args.date.getDate() + '_' + args.date.getMonth();
    return '<div id=' + id + '></div>'
  }

  eventRendered(args?: any) {
    let totalEvents = this.scheduleObj.eventsData;
    var dm = new DataManager({ json: totalEvents });
    let resources = this.scheduleObj.resources[0].dataSource;
    var dates = this.scheduleObj.getCurrentViewDates();
    (resources as any).forEach(function (resource) {
      var datasource = dm.executeLocal(
        new Query().where("AirlineId", "equal", resource.AirlineId)
      );
      dates.forEach(function (date) {
        var hours = 0;
        var id = resource.AirlineId.toString() + '_' + (date as any).getDate() + '_' + (date as any).getMonth();;
        var startDate, endDate;
        startDate = new Date(date as Date);
        endDate = new Date(date as Date);
        endDate = new Date((endDate as any).setHours(23, 59, 59));
        let predicate: Predicate = new Predicate("StartTime", 'greaterthanorequal', startDate).
          and(new Predicate("EndTime", 'greaterthanorequal', startDate)).
          and(new Predicate("StartTime", 'lessthan', endDate)).
          or(new Predicate("StartTime", 'lessthanorequal', startDate).
            and(new Predicate("EndTime", 'greaterthan', startDate)));
        let data: Object[] = new DataManager({ json: datasource }).executeLocal(new Query().where(predicate));
        data.forEach(function (data) {
          hours += Math.abs((data as any).EndTime - (data as any).StartTime) / 36e5;
        });
        document.getElementById(id).innerHTML = hours + " Hours";
      });
    });
  }

  dataBinding(args: any) {
    if (args.result.length == 0) {
      let resources = this.scheduleObj.resources[0].dataSource;
      var dates = this.scheduleObj.getCurrentViewDates();
      (resources as any).forEach(function (resource) {
        dates.forEach(function (date) {
          var id = resource.AirlineId.toString() + '_' + (date as any).getDate() + '_' + (date as any).getMonth();
          document.getElementById(id).innerHTML = 0 + " Hours";
        });
      });
    }
  }
}