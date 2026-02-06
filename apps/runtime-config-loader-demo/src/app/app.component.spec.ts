import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
	let app: AppComponent;
	const mockRuntimeConfigService = {} as RuntimeConfigLoaderService;
	beforeEach(() => {
		app = new AppComponent(
			mockRuntimeConfigService as RuntimeConfigLoaderService
		);
	});
	it('should create the app', () => {
		expect(app).toBeTruthy();
	});
});
