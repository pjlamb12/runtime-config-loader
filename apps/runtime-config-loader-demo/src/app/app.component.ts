import { Component, OnInit } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
	selector: 'runtime-config-loader-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'runtime-config-loader-demo';

	constructor(private _config: RuntimeConfigLoaderService) {}

	ngOnInit() {
		console.log(this._config.getConfig());
	}
}
