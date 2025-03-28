<script lang="ts">
	import { enhance } from '$app/forms';
	import { notifications } from '$lib/components/notifications.js';
	import Toast from '$lib/components/Toast.svelte';

	export let data;
	let dane = data.props;
</script>

<svelte:head>
	<title>Ustawienia</title>
	<meta name="description" content="Ustawienia" />
</svelte:head>

<Toast></Toast>
<section>
	<form
		method="POST"
		action="?/ustawienia"
		use:enhance={() => {
			const nId = notifications.wait('Zapisywanie danych', null);
			return async ({ result }) => {
				if (result.type === 'success') {
					notifications.remove(nId);
					notifications.success('Dane zostały zapisane', 3000);
				} else {
					notifications.remove(nId);
					notifications.error('Błąd zapisu', 3000);
				}
			};
		}}
	>
		<label for="serwer">Serwer</label>
		<input
			type="text"
			id="serwer"
			name="serwer"
			placeholder="Serwer"
			value={dane.serwer ? dane.serwer : ''}
			required
		/>

		<label for="token">Token</label>
		<input
			type="text"
			id="token"
			name="token"
			placeholder="Token"
			value={dane.token ? dane.token : ''}
			required
		/>

		<label for="mies_rozl">Miesiąc rozliczeniowy</label>
		<input
			type="text"
			id="mies_rozl"
			name="mies_rozl"
			placeholder="Miesiąc rozliczeniowy"
			value={dane.mies_rozl ? dane.mies_rozl : ''}
			required
		/>

		<label for="data_raport">Data raportu</label>
		<input
			type="text"
			id="data_raport"
			name="data_raport"
			placeholder="Data raportu"
			value={dane.data_raport ? dane.data_raport : ''}
			required
		/>

		<label for="email">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			placeholder="Email"
			value={dane.email ? dane.email : ''}
			required
		/>

		<button type="submit">Zapisz</button>
	</form>
</section>
