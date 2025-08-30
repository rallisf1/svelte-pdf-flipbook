<script lang="ts">
	import PdfFlipbook from '$lib/Flipbook.svelte';
	import type PdfFlipbookComponent from '$lib/Flipbook.svelte';

	let currentPage = $state(1);
	let totalPages = $state(0);
	let errorMessage = $state('');
	let flipbookRef = $state<PdfFlipbookComponent | null>(null);

	function handleFlip(event: CustomEvent<{ page: number; oldPage: number }>) {
		currentPage = event.detail.page + 1;
		console.log('Flipped to page:', currentPage);
	}

	function handleStateChange(event: CustomEvent<{ state: string }>) {
		console.log('State changed to:', event.detail.state);
	}

	function handleLoadingComplete(event: CustomEvent<{ pageCount: number }>) {
		totalPages = event.detail.pageCount;
		console.log('PDF loaded with', totalPages, 'pages');
	}

	function handleError(event: CustomEvent<{ message: string }>) {
		errorMessage = event.detail.message;
		console.error('Error:', errorMessage);
	}

	// Test PDF URLs
	const testPdfs = [
		{ name: 'Sample PDF 1', url: '/sample.pdf' },
		{ name: 'Sample PDF 2', url: '/sample2.pdf' },
		{ name: 'Invalid PDF', url: '/invalid.pdf' }
	];

	let selectedPdf = $state(testPdfs[0].url);
</script>

<svelte:head>
	<title>PDF Flipbook</title>
</svelte:head>

<div class="page-container">
	<fieldset>
		<legend>Svelte PDF Flipbook component</legend>
		<div class="controls">
			<div class="control-group">
				<label for="pdf-select">Select PDF: </label>
				<select id="pdf-select" bind:value={selectedPdf}>
					{#each testPdfs as pdf (pdf.url)}
						<option value={pdf.url}>{pdf.name}</option>
					{/each}
				</select>
			</div>

			<div class="control-group">
				<button onclick={() => flipbookRef?.flipPrev()}>
					<span class="desktop-text">Previous Page</span>
					<span class="mobile-text">Prev</span>
				</button>
				<button onclick={() => flipbookRef?.flipNext()}>
					<span class="desktop-text">Next Page</span>
					<span class="mobile-text">Next</span>
				</button>
				<button onclick={() => flipbookRef?.goToPage(1)}>
					<span class="desktop-text">Go to Page 1</span>
					<span class="mobile-text">First</span>
				</button>
			</div>
		</div>
	</fieldset>

	<div class="flipbook-wrapper">
		{#key selectedPdf}
			<PdfFlipbook
				bind:this={flipbookRef}
				pdfUrl={selectedPdf}
				width={400}
				height={600}
				flippingTime={600}
				onFlip={handleFlip}
				onStateChange={handleStateChange}
				onLoadingComplete={handleLoadingComplete}
				onError={handleError}
			/>
		{/key}
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		min-height: 100vh;
	}

	fieldset {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.control-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		min-width: 0;
	}

	label {
		font-weight: 600;
		color: #495057;
		margin-bottom: 0.25rem;
	}

	select {
		padding: 0.5rem;
		border: 2px solid #dee2e6;
		border-radius: 6px;
		background: white;
		font-size: 0.95rem;
		min-width: 150px;
	}

	button {
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
	}

	button:active {
		transform: translateY(0);
	}

	.mobile-text {
		display: none;
	}

	.flipbook-wrapper {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
		min-height: 500px;
		width: 100%;
	}

	/* Tablet Responsive */
	@media (max-width: 1024px) {
		.page-container {
			padding: 0.75rem;
		}

		.controls {
			gap: 1rem;
			padding: 1.25rem;
		}

		.control-group {
			flex: 1;
			min-width: 200px;
		}

		button {
			padding: 0.6rem 1rem;
			font-size: 0.9rem;
		}
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.controls {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			padding: 1rem;
			margin-bottom: 1.5rem;
		}

		.control-group {
			width: 100%;
			min-width: unset;
		}

		select {
			width: 100%;
			min-width: unset;
		}

		.control-group:nth-child(2) {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.5rem;
		}

		.control-group:nth-child(2) button {
			flex: 1;
			min-width: 100px;
		}

		.desktop-text {
			display: none;
		}

		.mobile-text {
			display: inline;
		}

		.flipbook-wrapper {
			margin: 1rem 0;
			min-height: 400px;
		}
	}

	/* Small Mobile */
	@media (max-width: 480px) {
		.page-container {
			padding: 0.5rem;
		}

		.controls {
			padding: 0.75rem;
			gap: 0.75rem;
		}

		button {
			padding: 0.5rem 0.75rem;
			font-size: 0.8rem;
			min-width: 80px;
		}

		select {
			font-size: 0.9rem;
		}

		.flipbook-wrapper {
			min-height: 350px;
		}
	}
</style>
