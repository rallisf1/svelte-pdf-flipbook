export async function setupPDFWorker(): Promise<string> {
	try {
		// Method 1: Vite's worker import (best for modern builds)
		const workerModule = await import('pdfjs-dist/build/pdf.worker.mjs?worker&url');
		return workerModule.default;
	} catch (error) {
		console.warn('Vite worker import failed, trying fallback...', error);

		try {
			// Method 2: Traditional URL resolution
			return new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
		} catch (fallbackError) {
			// Method 3: CDN fallback
			console.warn('vite worker import failed, using CDN fallback', fallbackError);
			return 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.min.mjs';
		}
	}
}
