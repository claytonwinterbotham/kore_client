import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-timepicker',
  templateUrl: './timepicker.html'
})
export class NgbdTimepickerMeridian {
    time = {hour: 13, minute: 30};
    meridian = true;
}