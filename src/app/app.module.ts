import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {CustomMaterialModule} from './modules/material';
import {SimpleInputComponent} from './components/simple-input/simple-input.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SaveImageComponent} from './components/save-image/save-image.component';
import {appRoutsModule} from './components/app.routs';
import {SharedWalletComponent} from './components/shared-wallet/shared-wallet.component';

// import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";

@NgModule({
  declarations: [
    AppComponent,
    SimpleInputComponent,
    SaveImageComponent,
    SharedWalletComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CustomMaterialModule,
    appRoutsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
