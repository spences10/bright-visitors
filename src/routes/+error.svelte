<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status}: {page.error?.message || 'Error'}</title>
</svelte:head>

<div
	class="error-container flex flex-col items-center justify-center py-16 text-center"
>
	<h1 class="text-9xl font-bold text-primary mb-4">{page.status}</h1>
	<p class="text-2xl mb-8">
		{page.error?.message || 'An error occurred'}
	</p>

	<div class="max-w-md mb-8">
		<p class="mb-4">
			The page you're looking for might have been moved, deleted, or
			is temporarily unavailable.
		</p>
		<p>Try checking the URL for errors, or return to the homepage.</p>
	</div>

	<a href="/" class="btn btn-primary">Return to Homepage</a>
</div>
