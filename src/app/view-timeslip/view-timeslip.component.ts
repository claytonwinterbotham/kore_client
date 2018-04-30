import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-timeslip',
  templateUrl: './view-timeslip.component.html',
  styleUrls: ['./view-timeslip.component.css']
})
export class ViewTimeslipComponent implements OnInit {

  constructor() { }

  ngOnInit() {
   // this.dateRangePicker();
  }

//   dateRangePicker(){
//     let picker:any=$('#startEndTime');
//     let dataRageOption:Object={
//       "timePicker": true,
//       "timePicker24Hour": true,
//       "drops": "down",
//       "opens": "left",
//       "locale": {
//         "format": "YYYY-MM-DD HH:mm:ss",
//         "separator": " -- ",
//         "applyLabel": "Apply",
//         "cancelLabel": "Cancel",
//         "fromLabel": "From",
//         "toLabel": "To",
//         "customRangeLabel": "Custom",
//         "daysOfWeek": [
//           "日",
//           "一",
//           "二",
//           "三",
//           "四",
//           "五",
//           "六"
//         ],
//         "monthNames": [
//           "一月",
//           "二月",
//           "三月",
//           "四月",
//           "五月",
//           "六月",
//           "7月",
//           "八月",
//           "九月",
//           "十月",
//           "十一月",
//           "十二月"
//         ],
//         "firstDay": 1
//       },
//       "startDate": "2017-01-25 09:00:00",
//       "endDate": "2017-01-25 09:46:00"
//   };
//   picker.daterangepicker(dataRageOption,function (start,end,label) {
//     console.info(`start:${start.format('YYYY-MM-DD')}, end:${end}, label:${label}`);
//   });
// }

}
