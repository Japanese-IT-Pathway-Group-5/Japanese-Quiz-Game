<svelte:head>
	<title>Credits</title>
</svelte:head>

<main class="page-shell">
	<div class="info-card">
		<h1>Credits</h1>
		<p>This page will list the team members and their contributions.</p>
		<a href="/">Back to start</a>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%);
	}

	.page-shell {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.info-card {
		width: min(100%, 560px);
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid #dbeafe;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
	}

	h1 {
		margin-top: 0;
	}

	a {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.8rem 1rem;
		background: #2563eb;
		color: white;
		border-radius: 0.75rem;
		text-decoration: none;
		font-weight: 700;
	}
</style>
