import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class Communication {
  whenInfoChanged: EventEmitter<any> = new EventEmitter();
  currentInformation: any;

  constructor() {}

  get data(): any {
    return this.currentInformation;
  }

  set data(val: any) {
    this.currentInformation = val;
    this.whenInfoChanged.emit(val);
  }
}
