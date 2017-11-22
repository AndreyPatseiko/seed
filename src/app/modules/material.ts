import {NgModule} from '@angular/core';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdTabsModule,
  MdSnackBarModule,
  MdChipsModule,
  MdMenuModule,
  MdSortModule,
  MdCardModule,
  MdSidenavModule,
  MdDialogModule,
  MdSelectModule,
  MdSlideToggleModule,
  MdProgressSpinnerModule,
  MdExpansionModule,
  MatRadioModule,
  MatProgressBarModule,
  MatSliderModule
} from '@angular/material';

@NgModule({
  imports: [
    MdSortModule,
    MdMenuModule,
    MdButtonModule,
    MdCheckboxModule,
    MdTabsModule,
    MdSnackBarModule,
    MdChipsModule,
    MdCardModule,
    MdSidenavModule,
    MdDialogModule,
    MdSelectModule,
    MdSlideToggleModule,
    MdProgressSpinnerModule,
    MdExpansionModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSliderModule
  ],
  exports: [
    MdSortModule,
    MdMenuModule,
    MdButtonModule,
    MdCheckboxModule,
    MdTabsModule,
    MdSnackBarModule,
    MdChipsModule,
    MdCardModule,
    MdSidenavModule,
    MdDialogModule,
    MdSelectModule,
    MdSlideToggleModule,
    MdProgressSpinnerModule,
    MdExpansionModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSliderModule
  ],
})

export class CustomMaterialModule {
}
