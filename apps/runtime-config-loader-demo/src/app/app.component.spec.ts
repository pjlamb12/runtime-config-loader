import { TestBed } from '@angular/core/testing';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { AppComponent, TEST_VALUE } from './app.component';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
			providers: [
				{
					provide: RuntimeConfigLoaderService,
					useValue: {
						getConfig: () => ({ testValue: 'mock-test' }),
					},
				},
				{
					provide: TEST_VALUE,
					useValue: 'mock-test',
				},
			],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'runtime-config-loader-demo'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app.title).toEqual('runtime-config-loader-demo');
	});
});
