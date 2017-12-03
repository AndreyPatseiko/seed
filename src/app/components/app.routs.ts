import {Routes, RouterModule} from '@angular/router';

import {UIPageComponent} from './ui-elements/ui-elements.component';
import {SharedWalletComponent} from './shared-wallet/shared-wallet.component';
import {WalletsComponent} from './wallets/wallets.component';
import {TokensComponent} from './tokens/tokens.component';
import {GreetingComponent} from './greeting/greeting.component';

const appRouts: Routes = [
  {path: '', component: WalletsComponent, pathMatch: 'full'},
  {path: 'ui-elements', component: UIPageComponent},
  {path: 'shared-wallet', component: SharedWalletComponent},
  {path: 'tokens', component: TokensComponent},
  {path: 'greeting', component: GreetingComponent},
];

export const appRoutsModule = RouterModule.forRoot(appRouts);
