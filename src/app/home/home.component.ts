import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { 
    // const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    // var p = snapshot.root.queryParams["redirectUrl"];
    // console.log(p);  // <-- hope it helps
  }

  ngOnInit() {
    
  }
}
