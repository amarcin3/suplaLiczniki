<script lang="ts">
	import Navbar from './../lib/components/Navbar.svelte';
	import { navigating } from '$app/state';
	import '../styles.css';

	let { children } = $props();
</script>

<div class="app">
	<Navbar spinning={!!navigating.to} />

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
