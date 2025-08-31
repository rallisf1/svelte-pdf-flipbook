export interface FlipEventData {
	page: number;
	oldPage: number;
}

export interface PDFFlipbookProps {
	pdfUrl: string;
  workerSrc?: string;
	width?: number;
	height?: number;
	flippingTime?: number;
	onFlip?: (event: CustomEvent<FlipEventData>) => void;
	onStateChange?: (event: CustomEvent<{ state: string }>) => void;
	onLoadingComplete?: (event: CustomEvent<{ pageCount: number }>) => void;
	onError?: (event: CustomEvent<{ message: string }>) => void;
}

export interface PDFFlipbookComponent {
	flipNext: () => void;
	flipPrev: () => void;
	goToPage: (pageNumber: number) => void;
}
