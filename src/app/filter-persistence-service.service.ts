import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FilterPersistenceService {

  public filterSubject: Subject<[string, string[], string[]]> = new Subject();
  public searchSubject: Subject<string> = new Subject();
  public wordsSubject: Subject<string[]> = new Subject();
  public tagsSubject: Subject<string[]> = new Subject();

  private currSearchString = '';
  private currWords: string[] = [];
  private currTags: string[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute) {
    /*
    // Every 500 ms, send fresh values
    const closure = () => {
      this.publishChanges();
      setTimeout(() => { closure(); }, 500);
    };
    closure();
    */
  }

  public rebroadcast() {
    // this.publishChanges();
    setTimeout(() => { this.publishChanges(); }, 200);
  }

  tokenizeFilterString(fstring: string) {
    const tagArr = [];
    const wordArr = [];
    if (fstring === '') {
      return [[], []];
    }
    const tokens = fstring.split(' ');
    for (const token of tokens) {
      if (token.trim() === '') {
        continue;
      }
      if (token[0] === '[' && token.slice(-1) === ']') {
        // its a tag
        tagArr.push(token.slice(1, -1));
      } else {
        // its just text
        wordArr.push(token);
      }
    }
    return [wordArr, tagArr];
  }

  publishChanges() {
    this.searchSubject.next(this.currSearchString);
    this.wordsSubject.next(this.currWords);
    this.tagsSubject.next(this.currTags);
    this.filterSubject.next([this.currSearchString, this.currWords, this.currTags]);
  }


  public replaceSearchString(str: string) {
    this.currSearchString = str;
    const res = this.tokenizeFilterString(this.currSearchString);
    this.currWords = res[0];
    this.currTags = res[1];
    this.removeSuperflousSpace();
    this.publishChanges();
  }

  public appendToSearchString(str: string) {
    this.currSearchString += str;
    const res = this.tokenizeFilterString(this.currSearchString );
    this.currWords = res[0];
    this.currTags = res[1];
    this.removeSuperflousSpace();
    this.publishChanges();
  }

  public isTagAlreadySet(tag: string): boolean {
    return this.currTags.includes(tag);
  }

  public removeTag(tag: string) {
    const index = this.currTags.indexOf(tag);
    if (index > -1) {
      this.currTags.splice(index, 1);
    }
    this.currSearchString = this.currSearchString.replace('[' + tag + ']', ' ');
    this.removeSuperflousSpace();
    this.rebroadcast();
  }

  public removeSuperflousSpace() {
    this.currSearchString.replace('  ', ' ');
  }


  public appendATags(tag: string) {
    if (this.currTags.includes(tag)) {
      // Do not add duplicate tags
      return;
    }
    if (this.currSearchString === '') {
      this.currSearchString += '[' + tag + ']';
    } else {
      this.currSearchString += ' [' + tag + ']';
    }
    const res = this.tokenizeFilterString(this.currSearchString);
    this.currWords = res[0];
    this.currTags = res[1];
    this.removeSuperflousSpace();
    this.publishChanges();
  }

  public getCurrSearchString() {
    return this.currSearchString;
  }
}
