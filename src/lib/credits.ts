export type TeamMember = {
	name: string;
	role: string;
	imageUrl?: string;
	contributions: string[];
};

export const teamMembers: TeamMember[] = [
	{
		name: 'Lay Sopanha',
		role: 'Developer & Team Lead',
		imageUrl: '/images/team/laysopanha.png',
		contributions: [
			'Project setup, CI configuration, and D1 database schema',
			'Built backend quiz engine, scoring logic, and grading algorithms',
			'Prepared production release, deployed database migrations, and configured secrets',
			'Documented architecture, game flow, and created README screenshots'
		]
	},
	{
		name: 'Chea Virakbott',
		role: 'Developer',
		imageUrl: '/images/team/cheavirakbott.png',
		contributions: [
			'Built the Start Screen and nickname flow',
			'Built Multiple-Choice and Word-Ordering components',
			'Implemented play screen and results routing flow'
		]
	},
	{
		name: 'Has Sereivathana',
		role: 'Developer',
		imageUrl: '/images/team/hassereivathana.png',
		contributions: [
			'Built the Typing Question component',
			'Implemented typed answer grading and Romaji/Hiragana normalization'
		]
	},
	{
		name: 'Chhin Menghour',
		role: 'Developer',
		imageUrl: '/images/team/chhinmenghour.png',
		contributions: [
			'Built the Leaderboard page and UI',
			'Built the Results screen',
			'Designed mobile layout improvements',
			'Implemented full accessibility (a11y) support and keyboard navigation'
		]
	},
	{
		name: 'LY_LEAB',
		role: 'Developer',
		imageUrl: '/images/team/lyleab.png',
		contributions: [
			'Created the Timer component for the play screen',
			'Added the Progress Bar for quiz tracking',
			'Built the responsive Credits page',
			'Managed content creation and entry of 120 N3/N4 quiz questions',
			'Conducted cross-device manual QA testing on mobile phones and multiple browsers'
		]
	},
	{
		name: 'Thaikarona',
		role: 'Developer',
		imageUrl: '/images/team/thaikarona.png',
		contributions: [
			'Implemented HMAC-signed value helpers for authentication and security',
			'Wrote automated End-to-End (E2E) tests for gameplay and admin flows'
		]
	}
];
