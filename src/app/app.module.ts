import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device';
//import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { MyOrderPage } from '../pages/my-order/my-order';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AddMenuPage } from '../pages/add-menu/add-menu';
import { MenuDescPage } from '../pages/menu-desc/menu-desc';
import { EditMenuPage } from '../pages/edit-menu/edit-menu';
import { FoodPage } from '../pages/food/food';
import { MakeOrderPage } from '../pages/make-order/make-order';
import { OrderListPage } from '../pages/order-list/order-list';
import { FoodTypePage } from '../pages/food-type/food-type';
import { MenuPage } from '../pages/menu/menu';
import { SettingPage } from '../pages/setting/setting';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { RunnerPage } from '../pages/runner/runner';
import { FdspPage } from '../pages/fdsp/fdsp';
import { ManageDeliveryPage } from '../pages/manage-delivery/manage-delivery';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { MakePaymentPage } from '../pages/make-payment/make-payment';
import { SelectMapPage } from '../pages/select-map/select-map';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
import { SelectRunnerPage } from '../pages/select-runner/select-runner';
import { SelfDeliveryPage } from '../pages/self-delivery/self-delivery';
import { TrackRunnerPage } from '../pages/track-runner/track-runner';
import { ViewDirectionsPage } from '../pages/view-directions/view-directions';
import { ViewAddressPage } from '../pages/view-address/view-address';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { LoginPageModule } from '../pages/login/login.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MyOrderPageModule } from '../pages/my-order/my-order.module';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { GeocoderProvider } from '../providers/geocoder/geocoder';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    MyOrderPage,
    WelcomePage,
    RegisterPage,
    AddMenuPage,
    MenuDescPage,
    EditMenuPage,
    FoodPage,
    MakeOrderPage,
    OrderListPage,
    FoodTypePage,
    MenuPage,
    SettingPage,
    EditUserPage,
    EditProfilePage,
    RunnerPage,
    FdspPage,
    ManageDeliveryPage,
    HelpPage,
    CartPage,
    MakePaymentPage,
    SelectMapPage,
    CreateProfilePage,
    SelectRunnerPage,
    SelfDeliveryPage,
    TrackRunnerPage,
    ViewDirectionsPage,
    ViewAddressPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LoginPageModule,
    ProfilePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    MyOrderPage,
    WelcomePage,
    RegisterPage,
    AddMenuPage,
    MenuDescPage,
    EditMenuPage,
    FoodPage,
    MakeOrderPage,
    OrderListPage,
    FoodTypePage,
    MenuPage,
    SettingPage,
    EditUserPage,
    EditProfilePage,
    RunnerPage,
    FdspPage,
    ManageDeliveryPage,
    HelpPage,
    CartPage,
    MakePaymentPage,
    SelectMapPage,
    CreateProfilePage,
    SelectRunnerPage,
    SelfDeliveryPage,
    TrackRunnerPage,
    ViewDirectionsPage,
    ViewAddressPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler },
    ConnectivityServiceProvider,
    Device,
    //Storage,
    GeocoderProvider,
    NativeGeocoder
  ]
})
export class AppModule {}
