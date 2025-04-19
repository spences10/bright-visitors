<script lang="ts">
	import Layout from '$lib/components/layout.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Layout>
	{@render children()}
</Layout>
