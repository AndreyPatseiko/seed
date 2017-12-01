import {Routes, RouterModule} from '@angular/router';

import {UIPageComponent} from './ui-elements/ui-elements.component';
import {SharedWalletComponent} from './shared-wallet/shared-wallet.component';
import {WalletsComponent} from './wallets/wallets.component';
import {TokensComponent} from './tokens/tokens.component';

const appRouts: Routes = [
  {path: '', component: WalletsComponent},
  {path: 'ui-elements', component: UIPageComponent},
  {path: 'shared-wallet', component: SharedWalletComponent},
  {path: 'tokens', component: TokensComponent},
];

export const appRoutsModule = RouterModule.forRoot(appRouts);
