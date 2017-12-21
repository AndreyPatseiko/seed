import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {CustomMaterialModule} from './modules/material';
import {SimpleInputComponent} from './components/simple-input/simple-input.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UIPageComponent} from './components/ui-elements/ui-elements.component';
import {appRoutsModule} from './components/app.routs';
import {SharedWalletComponent} from './components/shared-wallet/shared-wallet.component';
import {WalletsComponent} from './components/wallets/wallets.component';
import {TokensComponent} from './components/tokens/tokens.component';
import {GreetingComponent} from './components/greeting/greeting.component';
import {WorkSharedWalletsComponent} from './components/work-shared-wallets/work-shared-wallets.component';

// import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";

@NgModule({
  declarations: [
    AppComponent,
    SimpleInputComponent,
    UIPageComponent,
    SharedWalletComponent,
    WalletsComponent,
    TokensComponent,
    GreetingComponent,
    WorkSharedWalletsComponent
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
