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

import {GreetingComponent} from './components/greeting/greeting.component';
import {WorkSharedWalletsComponent} from './components/work-shared-wallets/work-shared-wallets.component';
// import {TokensModule} from './components/tokens/tokens.module';

// import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";

@NgModule({
  declarations: [
    AppComponent,
    SimpleInputComponent,
    UIPageComponent,
    SharedWalletComponent,
    WalletsComponent,
    GreetingComponent,
    WorkSharedWalletsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CustomMaterialModule,
    appRoutsModule,
    // TokensModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
