<script lang="ts">
	import type { PDFFlipbookProps } from './types.ts';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import type * as PDFJS from 'pdfjs-dist';
	import { onMount, onDestroy, tick } from 'svelte';

	// Use $props() for component properties including event handlers
	let {
		pdfUrl,
		width = 500,
		height = 300,
		flippingTime = 1000,
		onFlip = () => {},
		onStateChange = () => {},
		onLoadingComplete = () => {},
		onError = () => {}
	}: PDFFlipbookProps = $props();

	let status = $state({
		isInitialLoading: true,
		error: null as string | null,
		isFlipping: false
	});

	let bookElement: HTMLElement;
	let pageFlipInstance: any = null;
	let pdfjs: typeof PDFJS;
	let pdfDoc = $state<PDFDocumentProxy | null>(null);
	let pages = $state<number[]>([]);

	// Track previous page for flip events
	let previousPage = 0;

	// Export functions
	export function flipNext() {
		if (pageFlipInstance) pageFlipInstance.flipNext();
	}

	export function flipPrev() {
		if (pageFlipInstance) pageFlipInstance.flipPrev();
	}

	export function goToPage(pageNumber: number) {
		if (pageFlipInstance) pageFlipInstance.turnToPage(pageNumber - 1);
	}

	// Helper function to dispatch events
	function dispatchEvent<T>(handler: (event: CustomEvent<T>) => void, detail: T) {
		handler(new CustomEvent('event', { detail }));
	}

	// Function to initialize page-flip after pages are rendered
	async function initializePageFlip() {
		if (!bookElement || !pageFlipInstance) return;

		try {
			// Wait a bit for the pages to be rendered in DOM
			await tick();

			const pageElements = bookElement.querySelectorAll('.page-content');

			if (pageElements.length === 0) {
				// If no elements found, try again after a short delay
				await new Promise((resolve) => setTimeout(resolve, 100));
				const retryElements = bookElement.querySelectorAll('.page-content');

				if (retryElements.length === 0) {
					throw new Error('No page elements found after retry');
				}
			}

			// Explicitly set data-density for first and last pages to ensure hard covers
			if (pageElements.length > 0) {
				// First page as hard cover
				pageElements[0].setAttribute('data-density', 'hard');
				// Last page as hard cover
				pageElements[pageElements.length - 1].setAttribute('data-density', 'hard');
			}

			// Load content into PageFlip
			pageFlipInstance.loadFromHTML(pageElements);
			pageFlipInstance.turnToPage(0);

			// Store current page
			previousPage = pageFlipInstance.getCurrentPageIndex() || 0;
		} catch (error) {
			console.error('Error initializing page-flip:', error);
			dispatchEvent(onError, { message: 'Failed to initialize flipbook' });
		}
	}

	async function setupPDFWorker(): Promise<string> {
		try {
			return new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
		} catch (error) {
			// Fallback for environments where URL resolution fails
			console.warn(error);
			return 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.mjs';
		}
	}

	onMount(async () => {
		try {
			// Dynamically import pdfjs-dist and set worker source
			pdfjs = await import('pdfjs-dist');
			pdfjs.GlobalWorkerOptions.workerSrc = await setupPDFWorker();

			// Dynamically import page-flip
			const pageFlipModule = await import('page-flip');
			const PageFlip = pageFlipModule.PageFlip;

			// Load PDF document
			const loadingTask = pdfjs.getDocument(pdfUrl);
			pdfDoc = await loadingTask.promise;

			// Populate pages array (1-indexed for display)
			pages = Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1);

			// Dispatch loading complete event
			dispatchEvent(onLoadingComplete, { pageCount: pdfDoc.numPages });

			// Wait for DOM to update with page elements
			await tick();

			if (bookElement) {
				// Initialize PageFlip instance with showCover: true
				pageFlipInstance = new PageFlip(bookElement, {
					width: width,
					height: height,
					flippingTime: flippingTime,
					showCover: true, // Required by PageFlipConfig
					usePortrait: false
				});

				// Listen to flip events
				pageFlipInstance.on('flip', (e: any) => {
					status.isFlipping = false;
					const currentPage = e.data;

					dispatchEvent(onFlip, { page: currentPage, oldPage: previousPage });
					previousPage = currentPage;
				});

				// Listen to state change events
				pageFlipInstance.on('changeState', (e: any) => {
					const state = e.data;
					if (state === 'flipping' || state === 'user_fold' || state === 'fold_corner') {
						status.isFlipping = true;
					} else if (state === 'read') {
						status.isFlipping = false;
					}
					dispatchEvent(onStateChange, { state });
				});

				// Initialize page-flip after pages are rendered
				// Use setTimeout to ensure DOM is fully updated
				setTimeout(() => {
					initializePageFlip();
					status.isInitialLoading = false;
				}, 100);
			}
		} catch (e: unknown) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to load document';
			status.error = errorMessage;
			dispatchEvent(onError, { message: errorMessage });
			status.isInitialLoading = false;
		}
	});

	onDestroy(() => {
		if (pageFlipInstance) pageFlipInstance.destroy();
	});

	// Svelte action to render PDF pages onto canvases
	function asyncRender(node: HTMLElement, pageNumber: number) {
		const canvas = document.createElement('canvas');
		node.appendChild(canvas);

		if (!pdfDoc) return { update() {} };

		// Render the page
		pdfDoc
			.getPage(pageNumber)
			.then((page) => {
				const viewport = page.getViewport({ scale: 1.5 });
				const context = canvas.getContext('2d');
				if (!context) return;

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				canvas.style.maxWidth = '100%';
				canvas.style.height = 'auto';

				const renderContext = {
					canvasContext: context,
					viewport: viewport,
					canvas: canvas
				};

				page.render(renderContext).promise.catch((error) => {
					console.error(`Error rendering page ${pageNumber}:`, error);
				});
			})
			.catch((error) => {
				console.error(`Error getting page ${pageNumber}:`, error);
			});

		return {
			destroy() {
				// Cleanup if needed
			}
		};
	}
</script>

<div class="page-flip-container" bind:this={bookElement}>
	{#if status.isInitialLoading}
		<p class="loading-message">Loading...</p>
	{:else if status.error}
		<p class="error-message">{status.error}</p>
	{:else}
		{#each pages as pageNumber (pageNumber)}
			<div class="page-content" use:asyncRender={pageNumber}></div>
		{/each}
	{/if}
</div>

<style>
	.page-flip-container {
		margin: 40px auto;
		width: fit-content;
		height: fit-content;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 8px;
		overflow: hidden;
	}

	.page-content {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		border-radius: 4px;
	}

	.loading-message,
	.error-message {
		text-align: center;
		padding: 20px;
		font-size: 1.2em;
		color: #555;
	}
</style>
