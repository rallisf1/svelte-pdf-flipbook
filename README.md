# Svelte PDF Flipbook 📖

A beautiful, interactive PDF flipbook component for Svelte 5+ that provides a realistic page-turning experience using `pdfjs-dist` and `page-flip`.

## Features

- **Realistic Page Flip Animation** - Smooth, natural page turning effects
- **Fully Customizable** - Adjust size, flip timing, and styling

> Live demo - https://svelte-pdf-flipbook.vercel.app/

## Installation

### Install the flipbook component

```bash
pnpm install svelte-pdf-flipbook
```
### Install required dependencies

```bash
pnpm install page-flip pdfjs-dist
```

## Peer Dependencies

This component requires Svelte 5 to work properly.

## Basic Usage

```svelte
<script>
  import { PDFFlipbook } from 'svelte-pdf-flipbook';
</script>

<PDFFlipbook 
  pdfUrl="/path/to/your/document.pdf"
  width={800}
  height={600}
  flippingTime={800}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pdfUrl` | `string` | **Required** | URL or path to the PDF document |
| `width` | `number` | `500` | Width of the flipbook in pixels |
| `height` | `number` | `300` | Height of the flipbook in pixels |
| `flippingTime` | `number` | `1000` | Page flip animation duration in milliseconds |
| `onFlip` | `(event: CustomEvent<FlipEventData>) => void` | `() => {}` | Called when a page is flipped |
| `onStateChange` | `(event: CustomEvent<{ state: string }>) => void` | `() => {}` | Called when flipbook state changes |
| `onLoadingComplete` | `(event: CustomEvent<{ pageCount: number }>) => void` | `() => {}` | Called when PDF loading completes |
| `onError` | `(event: CustomEvent<{ message: string }>) => void` | `() => {}` | Called when an error occurs |

## Events

### Flip Event
```svelte
<PDFFlipbook
  onFlip={(e) => console.log('Flipped to page:', e.detail.page)}
/>
```
**Event Data:**
```typescript
interface FlipEventData {
  page: number;      // Current page (0-indexed)
  oldPage: number;   // Previous page
}
```

### State Change Event
```svelte
<PDFFlipbook
  onStateChange={(e) => console.log('State:', e.detail.state)}
/>
```
**Possible States:** `flipping`, `user_fold`, `fold_corner`, `read`

### Loading Complete Event
```svelte
<PDFFlipbook
  onLoadingComplete={(e) => console.log('Total pages:', e.detail.pageCount)}
/>
```

### Error Event
```svelte
<PDFFlipbook
  onError={(e) => console.error('Error:', e.detail.message)}
/>
```

## Programmatic Control

The component exposes several methods for programmatic control:

```svelte
<script>
  import { PDFFlipbook } from 'svelte-pdf-flipbook';
  
  let flipbook;
  
  function nextPage() {
    flipbook.flipNext();
  }
  
  function prevPage() {
    flipbook.flipPrev();
  }
  
  function goToPage(page) {
    flipbook.goToPage(page);
  }
</script>

<PDFFlipbook bind:this={flipbook} pdfUrl="/document.pdf" />

<button on:click={nextPage}>Next Page</button>
<button on:click={prevPage}>Previous Page</button>
<button on:click={() => goToPage(5)}>Go to Page 5</button>
```

## Available Methods

- `flipNext()` - Flip to the next page
- `flipPrev()` - Flip to the previous page  
- `goToPage(pageNumber: number)` - Go to specific page (1-indexed)

## Advanced Usage

### Custom Styling
```svelte
<PDFFlipbook
  pdfUrl="/document.pdf"
  class="my-custom-flipbook"
/>

<style>
  .my-custom-flipbook {
    border: 2px solid #333;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .my-custom-flipbook :global(.page-content) {
    background: #f8f8f8;
  }
</style>
```

### Handling Multiple Events
```svelte
<PDFFlipbook
  pdfUrl={pdfUrl}
  onFlip={handleFlip}
  onStateChange={handleStateChange}
  onLoadingComplete={handleLoadingComplete}
  onError={handleError}
/>

<script>
  function handleFlip(e) {
    console.log('Page flipped from', e.detail.oldPage, 'to', e.detail.page);
    currentPage = e.detail.page + 1; // Convert to 1-indexed for display
  }
  
  function handleStateChange(e) {
    isFlipping = e.detail.state === 'flipping';
  }
  
  function handleLoadingComplete(e) {
    totalPages = e.detail.pageCount;
    console.log(`PDF loaded with ${totalPages} pages`);
  }
  
  function handleError(e) {
    console.error('Flipbook error:', e.detail.message);
    error = e.detail.message;
  }
</script>
```

## Error Handling

The component provides comprehensive error handling:

```svelte
{#if error}
  <div class="error">
    <p>Failed to load PDF: {error}</p>
    <button on:click={() => loadPdf()}>Retry</button>
  </div>
{:else}
  <PDFFlipbook
    pdfUrl={pdfUrl}
    onError={(e) => error = e.detail.message}
  />
{/if}
```

## Troubleshooting

### Common Issues

1. **PDF fails to load**
   - Check CORS headers if loading from external URL
   - Verify PDF path is correct

2. **Page flip not working**
   - Ensure `page-flip` dependency is installed
   - Check browser console for errors

3. **TypeScript errors**
   - Make sure you're using Svelte 5+
   - Check import statements

## Development

```bash
# Install dependencies
pnpm install

# Develop
pnpm run dev

# Build
pnpm run build

```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This library uses:
- [page-flip](https://github.com/Nodlik/StPageFlip) - [MIT License](https://github.com/Nodlik/StPageFlip/blob/master/LICENSE)
- [pdfjs-dist](https://github.com/mozilla/pdf.js) - [Apache 2.0 License](https://github.com/mozilla/pdf.js/blob/master/LICENSE)

## Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/temesgen-982/svelte-pdf-flipbook/issues)
2. Create a new issue with a detailed description
3. Include browser version and reproduction steps

## Changelog

### v1.0.0-beta.0
- Initial beta release
- Svelte 5 compatibility
- TypeScript support
- Comprehensive event system
- Programmatic control methods

---

Built with ❤️ using Svelte 5, PDF.js, and PageFlip.
