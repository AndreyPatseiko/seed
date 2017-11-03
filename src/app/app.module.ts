import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
