import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SnippetListComponent} from './snippet-list/snippet-list.component';
import {AboutComponent} from './about/about.component';
import {SnippetComponent} from './snippet/snippet.component';
import {YamlCardViewerComponent} from './yaml-card-viewer/yaml-card-viewer.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent},
  { path: 'yamltool', component: YamlCardViewerComponent},
  { path: 'snippet/:shorthand', component: SnippetComponent },
  { path: 'sniplist', component: SnippetListComponent },
  { path: 'sniplist/:searchstr', component: SnippetListComponent },
  { path: '', redirectTo: 'sniplist' ,  pathMatch: 'full' },
  {path: '**', redirectTo: 'sniplist' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
