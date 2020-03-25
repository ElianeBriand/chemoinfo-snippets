import {Component, Input, OnInit} from '@angular/core';
import {SnippetData} from '../snippet-loader.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterPersistenceService} from '../filter-persistence-service.service';

import { HighlightResult } from 'ngx-highlightjs';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';


@Component({
  selector: 'app-snippet-card',
  templateUrl: './snippet-card.component.html',
  styleUrls: ['./snippet-card.component.sass'],
  animations: [
    trigger('codeFlashTrig', [
      state('normal', style({
        filter: 'invert(0%)'
      })),
      state('inverted', style({
        filter: 'invert(50%)'
      })),
      transition('normal => inverted', [
        animate('0.2s')
      ]),
      transition('inverted => normal', [
        animate('0.2s')
      ]),
    ])
  ]
})
export class SnippetCardComponent implements OnInit {

  @Input() snippet: SnippetData;
  @Input() isSingleSnippet: boolean;

  constructor( private snackBar: MatSnackBar,
               private router: Router,
               private fps: FilterPersistenceService,
               private sanitizer: DomSanitizer) { }

  public codeFlashing = false;
  public tagsInSearch: string[] = [];
  public searchString = '';
  public shouldHighlightTag: boolean[] = [];
  public shouldHighlightTool: boolean[] = [];
  public postProcessedMainCode: SafeHtml = '';
  public currentDetailsHTML = '';
  public codeBlocksPrelude: [SafeHtml, SafeHtml, SafeHtml, SafeHtml][] = [];
  public codeBlocksMain: [SafeHtml, SafeHtml, SafeHtml, SafeHtml][] = [];

  ngOnInit(): void {
    for (const _ of this.snippet.tags) {
      this.shouldHighlightTag.push(false);
    }
    for (const _ of this.snippet.tool) {
      this.shouldHighlightTool.push(false);
    }

    this.fps.filterSubject.subscribe((res: [string, string[], string[]]) => {
      const searchStr = res[0];
      const words = res[1];
      const tags = res[2];
      this.searchString = searchStr;
      this.tagsInSearch = tags;

      for (const [i, tag] of this.snippet.tags.entries()) {
        this.shouldHighlightTag[i] = false;
      }
      for (const [i, tag] of this.snippet.tags.entries()) {
        if (tags.includes(tag)) {
          this.shouldHighlightTag[i] = true;
        }
      }

      for (const [i, tool] of this.snippet.tool.entries()) {
        this.shouldHighlightTool[i] = false;
      }
      for (const [i, tool] of this.snippet.tool.entries()) {
        if (tags.includes(tool)) {
          this.shouldHighlightTool[i] = true;
        }
      }
    });

  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    const snackBarRef = this.snackBar.open('Code copied', 'Dismiss', {
      duration: 1000
    });
  }

  public makeCodeFlash() {
    this.codeFlashing = true;
    setTimeout(() => { this.codeFlashing = false; }, 200);
  }

  public tagToolClickAction(tagtool: string) {
    if (this.isSingleSnippet) {
      console.log(' SNIPPET_CARD Navigating to multi view with search str: ' + '[' + tagtool + ']');
      this.router.navigate(['/']).then((fulfilled: boolean) => {
        this.fps.replaceSearchString('');
        this.fps.appendATags(tagtool);
        this.fps.rebroadcast();
      });
    } else {
      this.fps.appendATags(tagtool);
      this.fps.rebroadcast();
    }
  }

  public goPermalink() {
    if (this.isSingleSnippet) {
      console.log('Precondition violation: permalink should not be clickable in single snippet view');
    } else {
      console.log('SNIPPET_CARD : Preparing to navigate to single snippet');
      this.fps.replaceSearchString('');
      this.router.navigate(['snippet/', this.snippet.shorthand ]);
    }
    this.fps.rebroadcast();
  }

  onHighlight_main(e: HighlightResult, codeBlocks: [SafeHtml, SafeHtml, SafeHtml, SafeHtml][], codeDetails: [string, string] | string[] | undefined) {
    let remainingCode: string = e.value;
    if (this.snippet.codeDetails === [] || !this.snippet.codeDetails || !this.snippet.codeDetails.length) {
      codeBlocks.push([this.sanitizer.bypassSecurityTrustHtml(remainingCode),
        this.sanitizer.bypassSecurityTrustHtml(''),
        this.sanitizer.bypassSecurityTrustHtml(''),
        this.sanitizer.bypassSecurityTrustHtml('')]);
    }
    const numberTooltip = codeDetails.length;
    let i = 0;
    for ( const tooltipBlock of codeDetails) {
      const pattern = tooltipBlock[0];
      const tooltipText = tooltipBlock[1];
      const regex = new RegExp('(' + pattern + ')', '');
      const found = remainingCode.match(regex);
      const before = remainingCode.substr(0, found.index);
      const matchedPattern = remainingCode.substr(found.index, pattern.length);
      const after = remainingCode.substr(found.index + pattern.length);
      i++;
      if (i !== numberTooltip) {
        // If this is not the last tooltip, after is empty
        codeBlocks.push([this.sanitizer.bypassSecurityTrustHtml(before),
          this.sanitizer.bypassSecurityTrustHtml(matchedPattern),
          this.sanitizer.bypassSecurityTrustHtml(tooltipText),
          this.sanitizer.bypassSecurityTrustHtml('')]);
      } else {
        // If this is the last tooltip, we must add the end of the code
        codeBlocks.push([this.sanitizer.bypassSecurityTrustHtml(before),
          this.sanitizer.bypassSecurityTrustHtml(matchedPattern),
          this.sanitizer.bypassSecurityTrustHtml(tooltipText),
          this.sanitizer.bypassSecurityTrustHtml(after)]);
        break;
      }
      remainingCode = after;
    }
  }

  onDetailHover(key: string) {
    this.currentDetailsHTML = key;
  }

}
