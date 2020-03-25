import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import YAML from 'yaml';
import { debounceTime, throttleTime } from 'rxjs/operators';

export class SnippetData {
  private static lastSnipID = 0;

  public snipID: number;
  public shorthand: string;
  public title: string;
  public authors: string;
  public description: string;
  public preludeCode: string;
  public preludeDetails: string[];
  public code: string;
  public codeDetails: string[];
  public url: string[];
  public tool: string[];
  public tags: string[];
  public highlightLang: string;

  constructor(shorthand: string,
              title: string,
              authors: string,
              description: string,
              preludeCode: string,
              preludeDetails: string[],
              code: string,
              codeDetails: string[],
              url: string[],
              tool: string[],
              tags: string[],
              highlightLang: string) {
    this.snipID = SnippetData.lastSnipID;
    SnippetData.lastSnipID++;
    this.shorthand = shorthand;
    this.title = title;
    this.authors = authors;
    this.description = description;
    this.preludeCode = preludeCode;
    this.preludeDetails = preludeDetails;
    this.code = code;
    this.codeDetails = codeDetails;
    this.url = url;
    this.tool = tool;
    this.tags = tags;
    this.highlightLang = highlightLang;
  }
}

export let errorSnippet = new SnippetData(
  'ErrorSnippet',
  'Snippet : not found',
  'E. Rror',
  'This snippet is not found.',
  ' # No code',
  [],
  '#No code',
  [],
  ['http://error.404'],
  ['ErrorTool'],
  ['snippetNotFound', 'error'],
  'text');



@Injectable({
  providedIn: 'root'
})
export class SnippetLoaderService {

  static singletonInstance: SnippetLoaderService;

  public sniplist: Promise<SnippetData[]>;

  private internalSniplist: SnippetData[];
  private started = false;
  private finished = false;
  private numList = 100;
  private numError = 0;
  private numCompleted = 0;

  public errsnip = errorSnippet;


  constructor(private http: HttpClient) {
    if (SnippetLoaderService.singletonInstance) {
      return SnippetLoaderService.singletonInstance;
    }
    SnippetLoaderService.singletonInstance = this;


    this.sniplist = new Promise<SnippetData[]>((resolve, reject) => {
      this.fetchSniplist(resolve, reject);
    });


  }

  private fetchSniplist(resolve: any, reject: any) {
    if (!this.started && !this.finished) {
      console.log('Initiating fetch');
      this.started = true;
      this.http.get('assets/snipListsIndex.yaml', {responseType: 'text'})
        .subscribe((data: any) => {
          const indexObj = YAML.parse(data);
          const listOfList = indexObj.filelist;
          this.numList = listOfList.length;
          for (const listUrl of listOfList) {
            this.http.get(listUrl, {responseType: 'text'}).subscribe((data2: any) => {
              if (!this.internalSniplist) {
                this.internalSniplist = YAML.parse(data2);
              } else {
                this.internalSniplist.push(...YAML.parse(data2));
              }
              this.numCompleted++;
              if (this.numList === (this.numCompleted + this.numError)) {
                // All file have been loaded or have error out
                // We can resolve:
                this.finished = true;
                this.internalSniplist.sort((elem1, elem2) => { return elem1.snipID - elem2.snipID; } )
                resolve(this.internalSniplist);
              }
            }, error2 => { console.log(error2); this.numError++; });
          }
        }, error1 => console.log(error1));
    } else if (this.started && !this.finished) {
      // Processing already underway, wait until it is complete
      console.log('Subsequent call, but not finished');
      setTimeout(() => { this.fetchSniplist(resolve, reject); }, 200);
    } else {
      // started && finished: We can deliver the results:
      console.log('Subsequent call, finished already');
      resolve(this.internalSniplist);
    }
  }

  public getSnipFromShorthand(shorthand: string): Promise<SnippetData> {
    console.log('getSnipFromShorthand called with ' + shorthand);
    const returnPromise = new Promise<SnippetData>((resolve, reject) => {
      this.sniplist.then((snipl: SnippetData[]) => {
        const snipIndex = snipl.findIndex( (element: SnippetData) => {
          return element.shorthand === shorthand;
        });
        if (snipIndex === -1) {
          console.log('SnippetLoaderService::getSnipFromShorthand : Failed to get snippet. (shorthand = ' + shorthand + ')');
          resolve(this.errsnip);
        }
        resolve(snipl[snipIndex]);
      }, error1 => console.log(error1));
    });

    return returnPromise;
  }

}
