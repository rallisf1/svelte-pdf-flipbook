export async function setupPDFWorker(): Promise<string> {
	try {
		return new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
	} catch (error) {
		// Fallback for environments where URL resolution fails
		console.warn(error);
		return 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.mjs';
	}
}
