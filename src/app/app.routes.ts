import { Routes } from '@angular/router';
import { LandingpageComponent } from './main/landingpage/landingpage.component';
import { ImprintComponent } from './shared/imprint/imprint.component';
import { PolicyComponent } from './shared/policy/policy.component';

export const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'policy', component: PolicyComponent },
];
