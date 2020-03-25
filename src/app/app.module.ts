import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  APP_INITIALIZER} from '@angular/core';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnippetListComponent } from './snippet-list/snippet-list.component';
import { AboutComponent } from './about/about.component';
import {SnippetLoaderService, SnippetData} from './snippet-loader.service';
import {isPlatformBrowser} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MaterialModule} from '../material-modules';
import { SnippetComponent } from './snippet/snippet.component';
import { ClarityModule } from '@clr/angular';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import {FormsModule} from '@angular/forms';
import { NgxMasonryModule } from 'ngx-masonry';
import { YamlCardViewerComponent } from './yaml-card-viewer/yaml-card-viewer.component';
import { SnippetCardComponent } from './snippet-card/snippet-card.component';
import {FilterPersistenceService} from './filter-persistence-service.service';
import { CodeEditorModule } from '@ngstack/code-editor';

/**
 * Import specific languages to avoid importing everything
 * The following will lazy load highlight.js core script (~9.6KB) + the selected languages bundle (each lang. ~1kb)
 */
export function getHighlightLanguages() {
  return {
    python: () => import('highlight.js/lib/languages/python'),
    bash: () => import('highlight.js/lib/languages/bash')
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SnippetListComponent,
    AboutComponent,
    SnippetComponent,
    YamlCardViewerComponent,
    SnippetCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MaterialModule,
    HighlightModule,
    ClarityModule,
    FormsModule,
    NgxMasonryModule,
    CodeEditorModule.forRoot()
  ],
  providers: [
    SnippetLoaderService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages()
      }
    },
    FilterPersistenceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private refmanservice: SnippetLoaderService;

  constructor(private refman: SnippetLoaderService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
    this.refmanservice = refman;


  }

}
