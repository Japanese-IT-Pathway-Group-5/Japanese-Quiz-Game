<script lang="ts">
	import { resolve } from '$app/paths';
	import { teamMembers } from '$lib/credits';
</script>

<svelte:head>
	<title>Credits - Japanese Quiz Game</title>
</svelte:head>

<main class="page-shell">
	<div class="content-wrapper">
		<header class="header">
			<h1>Credits</h1>
			<p>Meet the team behind the Japanese Quiz Game and see what each member contributed.</p>
		</header>

		<div class="team-grid">
			{#each teamMembers as member (member.name)}
				<div class="member-card">
					<div class="member-header">
						{#if member.imageUrl}
							<img src={member.imageUrl} alt="{member.name} avatar" class="avatar" />
						{/if}
						<div class="member-info">
							<h2>{member.name}</h2>
							<span class="role">{member.role}</span>
						</div>
					</div>
					<div class="contributions">
						<h3>Contributions</h3>
						<ul>
							{#each member.contributions as contribution (contribution)}
								<li>{contribution}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>

		<div class="footer-actions">
			<a href={resolve('/')} class="back-link">Back to Start</a>
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%);
		min-height: 100vh;
	}

	.page-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem 1.5rem;
		box-sizing: border-box;
	}

	.content-wrapper {
		width: 100%;
		max-width: 1100px;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.header {
		text-align: center;
		animation: fadeInDown 0.8s ease-out;
	}

	.header h1 {
		margin: 0 0 1rem 0;
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 900;
		background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: -0.02em;
	}

	.header p {
		margin: 0 auto;
		font-size: 1.2rem;
		color: #475569;
		max-width: 600px;
		line-height: 1.6;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 2rem;
		animation: fadeIn 1s ease-out 0.2s backwards;
	}

	.member-card {
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.5);
		border-radius: 1.5rem;
		padding: 2rem;
		box-shadow:
			0 10px 30px rgba(15, 23, 42, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		position: relative;
		overflow: hidden;
	}

	.member-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(90deg, #3b82f6, #60a5fa);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.member-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
		background: rgba(255, 255, 255, 0.9);
	}

	.member-card:hover::before {
		opacity: 1;
	}

	.member-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #dbeafe;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.member-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.member-card h2 {
		margin: 0;
		font-size: 1.4rem;
		color: #1e293b;
		font-weight: 800;
	}

	.role {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		color: #1d4ed8;
		background: #dbeafe;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
		width: max-content;
		box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
	}

	.contributions {
		margin-top: 0.5rem;
		flex-grow: 1;
	}

	.contributions h3 {
		margin: 0 0 0.75rem 0;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #64748b;
	}

	.contributions ul {
		margin: 0;
		padding: 0 0 0 1.25rem;
		color: #334155;
		font-size: 1rem;
		line-height: 1.6;
	}

	.contributions li {
		margin-bottom: 0.5rem;
	}

	.contributions li:last-child {
		margin-bottom: 0;
	}

	.footer-actions {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		animation: fadeInUp 0.8s ease-out 0.4s backwards;
	}

	.back-link {
		display: inline-block;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: white;
		border-radius: 1rem;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.1rem;
		box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
		transition: all 0.3s ease;
	}

	.back-link:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 25px rgba(37, 99, 235, 0.3);
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
