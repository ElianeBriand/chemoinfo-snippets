import { Component } from '@angular/core';
import { filter} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Chemoinformatics Snippets';



  constructor(private router: Router, private route: ActivatedRoute)  {

  }

}
