import {Component, Input, OnInit} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-gmx-time-calc',
  templateUrl: './gmx-time-calc.component.html',
  styleUrls: ['./gmx-time-calc.component.sass']
})
export class GmxTimeCalcComponent implements OnInit {

  public timeStepCalc = 100;
  public timestepStepCalc = 2;
  public stepResStepCalc = 0;
  public stepMDPResStepCalc = '';

  constructor(private bottomSheetRef: MatBottomSheetRef<GmxTimeCalcComponent>,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.calcStep();
  }

  dismissWindow(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  calcStep() {
    this.stepResStepCalc = Math.round((this.timeStepCalc / this.timestepStepCalc) * (1000000));
    this.stepMDPResStepCalc = 'nsteps                  = ' +  this.stepResStepCalc
      + '    ; '
      + this.timestepStepCalc
      + ' * '
      + this.stepResStepCalc
      + ' = '
      + Math.round((this.timeStepCalc * 1000))
      + ' ps ('
      + this.timeStepCalc + 'ns)';
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    const snackBarRef = this.snackBar.open('Code copied', 'Dismiss', {
      duration: 500, verticalPosition: 'top'
    });
  }



}
