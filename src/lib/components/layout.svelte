<script lang="ts">
	import Footer from './footer.svelte';
	import Header from './header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<main class="container mx-auto flex-1 p-4 prose prose-lg max-w-5xl">
		{@render children()}
	</main>

	<Footer />
</div>
