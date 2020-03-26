import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {SnippetData, SnippetLoaderService} from '../snippet-loader.service';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {trigger, transition, animate, style, state} from '@angular/animations';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

import {ActivatedRoute, Router} from '@angular/router';
import {FilterPersistenceService} from '../filter-persistence-service.service';
import {GmxTimeCalcComponent} from '../gmx-time-calc/gmx-time-calc.component';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-snippet-list',
  templateUrl: './snippet-list.component.html',
  styleUrls: ['./snippet-list.component.sass'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-200%)'}),
        animate('200ms ease-in', style({ transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-200%)'}))
      ])
    ])
  ]
})


export class SnippetListComponent implements OnInit {


  public localSnips: SnippetData[];

  public breakpoint: number;

  expandedElement: SnippetData;

  public showLoader = true;

  public searchDebounceSubject: Subject<string> = new Subject();

  public isSearchActive = false;
  public numSearchRes = 0;
  public displayedSearchRes = 0;
  public wordsToSearch: string[] = [];
  public tagsToSearch: string[] = [];
  private initialCountLimit = 10;
  public countLimit = this.initialCountLimit;

  public filteredSnippets: SnippetData[];

  public searchFilterText = '';


  public updateFilteredSnippets() {
    console.log('updateFilteredSnippets called');
    if (! this.localSnips) {
      return [];
    }
    let tempNumSearchRes = 0;
    let tempNumDisplayed = 0;
    this.filteredSnippets = this.localSnips.filter((item, index) => {
      const rawItemText = JSON.stringify(item);
      const itemTags = item.tags;
      const itemTools = item.tool;
      for (const word of this.wordsToSearch) {
        if (!rawItemText.includes(word)) {
          return false;
        }
      }
      for (const tag of this.tagsToSearch) {
        if ((!itemTags.includes(tag)) && (!itemTools.includes(tag))) {
          return false;
        }
      }
      // If we reach here, the snippet is a candidate:
      tempNumSearchRes++;
      if (tempNumSearchRes > this.countLimit) {
        return false;
      }
      tempNumDisplayed++;
      return true;
    } );
    this.numSearchRes = tempNumSearchRes;
    this.displayedSearchRes = tempNumDisplayed;
  }


  constructor(private sniploader: SnippetLoaderService,
              private route: ActivatedRoute,
              private router: Router,
              private fps: FilterPersistenceService,
              private bottomSheet: MatBottomSheet) {
    this.route.params.subscribe((params) =>  {
      if (params.searchstr) {
        console.log('Route search string = ' + params.searchstr);
        //this.searchDebounceSubject.next(params.searchstr);
        this.fps.replaceSearchString(params.searchstr);
        this.fps.rebroadcast();
      }
    });
    sniploader.sniplist.then((snippets: SnippetData[]) => {
      this.showLoader = false;
      this.localSnips = snippets;
      this.updateFilteredSnippets();
    }, error1 => console.log(error1));
  }

  directUpdateSearch(searchTextValue: string, words: string[], tags: string[]) {
    if (searchTextValue.trim() === '') {
      this.isSearchActive = false;
    } else {
      this.isSearchActive = true;
    }
    this.searchFilterText = searchTextValue;
    this.wordsToSearch = words;
    this.tagsToSearch = tags;
    this.updateFilteredSnippets();
  }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 1000) ? 1 : 2;


    // pipe(
    //       debounceTime(50)
    //     )
    this.searchDebounceSubject.pipe(
      debounceTime(800)
    ).subscribe((searchTextValue: string) => {
      this.countLimit = this.initialCountLimit;
      this.fps.replaceSearchString(searchTextValue);
      this.router.navigate(['sniplist/', searchTextValue], { skipLocationChange: false });
    });

    this.fps.filterSubject.subscribe((res: [string, string[], string[]]) => {
      const searchStr = res[0];
      const words = res[1];
      const tags = res[2];
      this.filteredSnippets = [];
      this.searchFilterText = searchStr;
      this.directUpdateSearch(searchStr, words, tags);
    });
  }

  onKeyUpSearch(searchTextValue: string) {
    this.searchDebounceSubject.next(searchTextValue);
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1000) ? 1 : 2;
  }

  public clearSearch() {
    this.searchFilterText = '';
    this.countLimit = this.initialCountLimit;
    this.fps.replaceSearchString('');
  }

  seeMore() {
    if (this.displayedSearchRes < this.numSearchRes) {
      if (this.displayedSearchRes + 10 >= this.numSearchRes) {
        this.countLimit = this.numSearchRes;
      } else {
        this.countLimit += 10;
      }
      this.updateFilteredSnippets();
    } else {
      // Should not be callable ???
      console.log('Precondition violation: See more called but everything is already displayed');
    }
    this.fps.rebroadcast();
  }

  openGmxTimeSheet(): void {
    this.bottomSheet.open(GmxTimeCalcComponent);
  }

}
