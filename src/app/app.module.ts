import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LocalNotifications, Device } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { FormPage } from '../pages/form/form';
import { SignupPage } from '../pages/signup/signup';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@NgModule({
  declarations: [
    MyApp,
    SignupPage,
    HomePage,
    FormPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignupPage,
    HomePage,
    FormPage
  ],
  providers: [LocalNotifications,Device,{
    provide: ErrorHandler, useClass: IonicErrorHandler
  }]
})
export class AppModule {}
