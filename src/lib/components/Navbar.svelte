<!--suppress ALL -->
<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	export let spinning: boolean = false;

	// Show mobile icon and display menu
	let showMobileMenu: boolean = false;

	interface NavItem {
		label: string;
		href: string;
		regex: string;
	}

	// List of navigation items (regex for displaying active page)
	const navItems: NavItem[] = [
		{ label: 'Główna', href: '/', regex: '\\/(?!.)' },
		{ label: 'Zestawienie', href: '/zestawienie', regex: '/zestawienie' },
		{ label: 'Szczegóły', href: '/szczegoly', regex: '/szczegoly' },
		{ label: 'Ustawienia', href: '/ustawienia', regex: '/ustawienia' },
	];

	// Mobile menu click event handler
	function handleMobileIconClick(): void {
		showMobileMenu = !showMobileMenu;
	}

	// Media match query handler
	function mediaQueryHandler(e: MediaQueryListEvent): void {
		// Reset mobile state
		if (!e.matches) {
			showMobileMenu = false;
		}
	}

	let spinner: HTMLElement | null;
	// Attach media query listener on mount hook
	onMount((): void => {
		const mediaListener = window.matchMedia('(max-width: 767px)');
		mediaListener.addEventListener('change', mediaQueryHandler);

		spinner = document.querySelector('.spinner');
	});

	// When navigating, show spinner
	$: if (spinning && spinner) {
		spinner.style.opacity = '1';
	} else if (spinner) {
		spinner.style.opacity = '0';
	}
</script>

<nav class={showMobileMenu ? ' mobile' : ''}>
	<div class="inner">
		<button aria-label="Toggle navigation"
			on:click={handleMobileIconClick}
			class={`mobile-icon${showMobileMenu ? ' active' : ''}`}
		>
			<span class="middle-line" ></span>
		</button>

		<ul class={`navbar-list${showMobileMenu ? ' mobile' : ''}`}>
			{#each navItems as item}
				<li>
					<a
						aria-current={page.url.pathname.match(item.regex) ? 'page' : undefined}
						on:click={() => {
							showMobileMenu = false;
						}}
						href={item.href}>{item.label}</a
					>
				</li>
			{/each}
		</ul>
		<div class="spinner"></div>
	</div>
</nav>

<style>
	nav {
		background: rgb(0, 0, 0, 0.8);
		height: 45px;
		z-index: 9999;
	}

	.inner {
		padding-left: 20px;
		padding-right: 20px;
		margin: auto;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 100%;
	}

	.mobile-icon {
		background: none;
		border: none;
		display: flex;
		width: 25px;
		height: 14px;
		position: relative;
		cursor: pointer;
	}

	.mobile-icon:after,
	.mobile-icon:before,
	.middle-line {
		content: '';
		position: absolute;
		width: 100%;
		height: 2px;
		background-color: #fff;
		transition: all 0.4s;
		transform-origin: center;
	}

	.mobile-icon:before,
	.middle-line {
		top: 0;
	}

	.mobile-icon:after,
	.middle-line {
		bottom: 0;
	}

	.mobile-icon:before {
		width: 66%;
	}

	.mobile-icon:after {
		width: 33%;
	}

	.middle-line {
		margin: auto;
	}

	.mobile-icon:hover:before,
	.mobile-icon:hover:after,
	.mobile-icon.active:before,
	.mobile-icon.active:after,
	.mobile-icon.active .middle-line {
		width: 100%;
	}

	.mobile-icon.active:before,
	.mobile-icon.active:after {
		top: 50%;
		transform: rotate(-45deg);
	}

	.mobile-icon.active .middle-line {
		transform: rotate(45deg);
	}

	.navbar-list {
		display: none;
		width: 100%;
		justify-content: center;
		margin: 0;
		padding: 0 40px;
	}

	.navbar-list.mobile {
		background-color: rgba(0, 0, 0, 0.8);
		position: fixed;
		display: block;
		height: calc(100% - 45px);
		bottom: 0;
		left: 0;
	}

	.navbar-list li {
		list-style-type: none;
		position: relative;
	}

	.navbar-list li:before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: #424245;
	}

	.navbar-list a {
		color: #fff;
		font-weight: bold;
		text-decoration: none;
		display: flex;
		height: 45px;
		align-items: center;
		padding: 0 10px;
		font-size: 1rem;
		transition: color 0.3s;
	}

	a[aria-current='page'] {
		color: #ff6464;
	}

	a:hover {
		color: #ff0000;
		text-decoration: none;
	}

	@media only screen and (min-width: 767px) {
		.mobile-icon {
			display: none;
		}

		.navbar-list {
			display: flex;
			padding: 0;
		}

		.navbar-list a {
			display: inline-flex;
		}
	}

	.spinner {
		position: absolute;
		width: 1rem;
		height: 1rem;
		right: 1rem;
		border: 3px solid transparent;
		border-radius: 50%;
		border-top-color: #fff;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
