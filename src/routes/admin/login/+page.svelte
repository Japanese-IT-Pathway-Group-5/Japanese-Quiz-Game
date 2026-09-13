<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin login</title>
</svelte:head>

<main>
	<h1>Admin login</h1>

	<form method="POST">
		<label for="password">Password</label>
		<input id="password" name="password" type="password" autocomplete="current-password" required />

		<button type="submit">Log in</button>

		{#if form?.error}
			<p role="alert">{form.error}</p>
		{/if}
	</form>
</main>
