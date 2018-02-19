import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensComponent } from './tokens.component';
import { Routes, RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  { path: '', component: TokensComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TokensComponent
  ]
})
export class TokensModule { }
