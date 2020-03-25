import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnippetData, SnippetLoaderService} from '../snippet-loader.service';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {FilterPersistenceService} from '../filter-persistence-service.service';


const emptySnippet = new SnippetData(
  '',
  '',
  '',
  '',
  '',
  [],
  '',
  [],
  [''],
  [''],
  [''],
  '');

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.sass'],
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
export class SnippetComponent implements OnInit {


  public snippet: SnippetData = emptySnippet;

  constructor(private route: ActivatedRoute,
              private sniploader: SnippetLoaderService,
              private router: Router,
              private snackBar: MatSnackBar,
              private fps: FilterPersistenceService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
       this.sniploader.getSnipFromShorthand(params.get('shorthand')).then((snippetRes: SnippetData) => {
         this.snippet = snippetRes;
      }, error1 => {
         console.log(error1);
         this.snippet = this.sniploader.errsnip;
       });
    });
  }


}
