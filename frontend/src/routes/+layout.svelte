<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '@fontsource/ibm-plex-sans/400.css';
	import '@fontsource/ibm-plex-sans/600.css';
	import '../app.postcss';
	import { AppShell, AppBar, AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { LockIcon, BookOpenIcon, FileIcon } from 'svelte-feather-icons';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css'; // highlight.js theme
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import * as config from '../lib/config';

	import { browser } from '$app/environment';

	storeHighlightJs.set(hljs);

	function generateServiceUrl(): string {
		if (!browser) {
			return '';
		}

		const serviceUrlFromConfig = config.SFTPGO_URL;

		// Case 1: If the URL is specified in the config, use it.
		if (serviceUrlFromConfig !== undefined) {
			return serviceUrlFromConfig;
		}

		// Case 2: If it's localhost
		const localhostMatch = window.location.host.match(/^(localhost|127\.0\.0\.\d+|::1)(:\d+)?$/);
		if (localhostMatch) {
			return 'http://localhost:8083';
		}

		// Case 3: If the URL is a dns and uses the default port (443)
		const url = new URL(window.location.href);
		if (url.port === '' || url.port === '443') {
			const domainParts = url.hostname.split('.');
			const deepestSubdomain = domainParts[0];
			return `https://${deepestSubdomain}-sftpgo.${domainParts.slice(1).join('.')}`;
		}

		// Case 4: Otherwise, current url /sftgo
		return `${window.location.origin}/sftgo`;
	}
</script>

<AppShell>
	<!-- (header) -->
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex justify-start">
					<h1 class="text-blue-500"><a href="/">SIM</a></h1>
					<h1><a href="/">PIPE</a></h1>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- (sidebarLeft) -->
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailTile label="Projects" href="/projects"><BookOpenIcon size="1.5x" /></AppRailTile>
			<AppRailTile label="Registry Key Vault" href="/secrets"><LockIcon size="1.5x" /></AppRailTile>
			<!-- TO DO: temporary redirect to sftp go web interface; will be replaced by files manager when api is ready -->
			<AppRailTile label="Sample Files" href={generateServiceUrl()}
				><FileIcon size="1.5x" /></AppRailTile
			>
		</AppRail>
	</svelte:fragment>

	<!-- Router Slot -->
	<slot />

	<!-- (pageFooter) -->
	<svelte:fragment slot="footer" />
</AppShell>
