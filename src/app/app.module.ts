import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {CustomMaterialModule} from './modules/material';
import { SimpleInputComponent } from './components/simple-input/simple-input.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";

@NgModule({
  declarations: [
    AppComponent,
    SimpleInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CustomMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
