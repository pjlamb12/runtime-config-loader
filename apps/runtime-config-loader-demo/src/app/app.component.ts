import { Component, Inject, OnInit } from '@angular/core';
import {
	RuntimeConfigLoaderService,
	RUNTIME_APP_CONFIG,
} from 'runtime-config-loader';

@Component({
	selector: 'runtime-config-loader-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'runtime-config-loader-demo';

	constructor(
		private _config: RuntimeConfigLoaderService,
		@Inject(RUNTIME_APP_CONFIG) private appConfigObject: any
	) {}

	ngOnInit() {
		console.log('from the service', this._config.getConfig());
		console.log('from the injection token', this.appConfigObject);
	}
}
