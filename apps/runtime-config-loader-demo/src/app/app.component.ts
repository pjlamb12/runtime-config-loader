import { Component, OnInit, inject } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
	selector: 'runtime-config-loader-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false,
})
export class AppComponent implements OnInit {
	title = 'runtime-config-loader-demo';

	private _config = inject(RuntimeConfigLoaderService);

	ngOnInit() {
		console.log(this._config.getConfig());
	}
}
