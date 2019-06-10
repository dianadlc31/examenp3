import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import * as firebase from 'firebase';

export const firebaseConfig={
  apiKey: "AIzaSyB9YllDIQlE5BcAf3lymQBvYoqUKW4iR3k",
  authDomain: "examenp3-4d3ff.firebaseapp.com",
  databaseURL: "https://examenp3-4d3ff.firebaseio.com",
  projectId: "examenp3-4d3ff",
  storageBucket: "examenp3-4d3ff.appspot.com",
  messagingSenderId: "1037796765273",
  appId: "1:1037796765273:web:d71f1c7f483f91de"
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(firebaseConfig);
  }
}

