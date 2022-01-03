import {Component, OnInit} from '@angular/core';
import {MainService} from "./shared/main.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(private mainService: MainService) {
    }

    ngOnInit(): void {
        let localSaveProductFilter = localStorage.getItem('LocalSaveProductFilter');
        if (localSaveProductFilter == '1' || localSaveProductFilter == '0') {
            this.mainService.saveProductFilter = +localSaveProductFilter;
        } else {
            localStorage.setItem('LocalSaveProductFilter', '0');
            this.mainService.saveProductFilter = 0;
        }
    }
}
