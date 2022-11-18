import { dcUI } from "../dcUI";

export abstract class dcView extends dcUI {
	
	private onReadyCallback!: Function;
	
	protected constructor(parentElement: HTMLElement, mainElement: HTMLElement) {
		super(parentElement, mainElement);
	}
	
	public onReady(callback: Function): void {
		this.onReadyCallback = callback;
	}
	
	public executeOnReadyCallback(): void {
		if (this.onReadyCallback)
			this.onReadyCallback();
	}
	
	public init() {
		super.init();
		this.executeOnReadyCallback();
	}
	
}