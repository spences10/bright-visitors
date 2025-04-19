<script lang="ts">
	let { data } = $props();

	const Content = data.content;
</script>

<svelte:head>
	<title>{data.frontmatter.title}</title>
	<meta name="description" content={data.frontmatter.description} />
</svelte:head>

<div class="prose-container">
	<Content />
</div>
