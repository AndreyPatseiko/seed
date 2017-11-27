import {Routes, RouterModule} from '@angular/router';

import {SaveImageComponent} from './save-image/save-image.component';
import {SharedWalletComponent} from './shared-wallet/shared-wallet.component';

const appRouts: Routes = [
  {path: '', component: SharedWalletComponent},
  {path: 'save-image', component: SaveImageComponent},
  {path: 'shared-wallet', component: SharedWalletComponent}
];

export const appRoutsModule = RouterModule.forRoot(appRouts);
