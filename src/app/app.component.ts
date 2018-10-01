import { Component, OnInit } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader-lib';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'runtime-config-loader';

	constructor(private _configSvc: RuntimeConfigLoaderService) {}

	ngOnInit() {
		const config = this._configSvc.getConfig();
		console.log('config: ', config);
	}
}
