declare module 'page-flip' {
	export interface PageFlipEventData {
		page: number;
		oldPage: number;
		// Add other properties if available in the library
	}

	export interface PageFlipConfig {
		width: number;
		height: number;
		flippingTime: number;
		showCover: boolean;
		usePortrait: boolean;
		// Add other config options as needed
	}

	export class PageFlip {
		constructor(element: HTMLElement, config: PageFlipConfig);

		// Core methods
		flipNext(): void;
		flipPrev(): void;
		turnToPage(page: number): void;
		loadFromHTML(elements: NodeListOf<Element>): void;
		destroy(): void;

		// Event handling
		on(event: 'flip', callback: (data: PageFlipEventData) => void): void;
		on(event: 'startFlipping', callback: (data: PageFlipEventData) => void): void;
		on(event: string, callback: (data: any) => void): void;

		// Add other methods as needed
		getCurrentPageIndex(): number;
		update(): void;
	}
}
