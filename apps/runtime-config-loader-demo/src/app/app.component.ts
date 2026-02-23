import { Component, OnInit, inject, InjectionToken } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

export const TEST_VALUE = new InjectionToken<string>('TEST_VALUE');

@Component({
	selector: 'runtime-config-loader-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false,
})
export class AppComponent implements OnInit {
	title = 'runtime-config-loader-demo';

	private _configService = inject(RuntimeConfigLoaderService);
	private _testValue = inject(TEST_VALUE);

	ngOnInit() {
		console.log('Full config object:', this._configService.getConfig());
		console.log('Injected testValue token:', this._testValue);
	}
}
