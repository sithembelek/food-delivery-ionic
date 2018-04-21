import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackRunnerPage } from './track-runner';

@NgModule({
  declarations: [
    TrackRunnerPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackRunnerPage),
  ],
})
export class TrackRunnerPageModule {}
