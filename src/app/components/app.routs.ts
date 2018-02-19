import {Routes, RouterModule} from '@angular/router';

import {UIPageComponent} from './ui-elements/ui-elements.component';
import {SharedWalletComponent} from './shared-wallet/shared-wallet.component';
import {WalletsComponent} from './wallets/wallets.component';
import {TokensComponent} from './tokens/tokens.component';
import {GreetingComponent} from './greeting/greeting.component';
import {WorkSharedWalletsComponent} from './work-shared-wallets/work-shared-wallets.component';
// import {} from './tokens/tokens.module'

const appRouts: Routes = [
  {path: '', component: WalletsComponent, pathMatch: 'full'},
  {path: 'ui-elements', component: UIPageComponent},
  {path: 'shared-wallet', component: SharedWalletComponent},
  {path: 'tokens', loadChildren: './tokens/tokens.module#TokensModule'},
  {path: 'greeting', component: GreetingComponent},
  {path: 'smartPay', component: WorkSharedWalletsComponent},
];

export const appRoutsModule = RouterModule.forRoot(appRouts);
