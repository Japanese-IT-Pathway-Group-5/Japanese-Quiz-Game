export type TeamMember = {
	id: string;
	name: string;
	katakanaName?: string;
	japaneseRole?: string;
	role: string;
	imageUrl?: string;
	cutoutUrl?: string;
	box: { x: number; y: number; width: number; height: number };
	contributions: string[];
};

export const teamMembers: TeamMember[] = [
	{
		id: 'panha',
		name: 'Lay Sopanha',
		katakanaName: 'レイ・ソパンハ',
		japaneseRole: 'チームリーダー・DevOps・UI/UXリーダー',
		role: 'Team Lead · DevOps · UX/UI Lead',
		imageUrl: '/images/team/laysopanha.png',
		cutoutUrl: '/images/team/panha.svg',
		box: { x: 340, y: 285, width: 286, height: 372 },
		contributions: [
			'Project architecture, Cloudflare D1 database schema, and CI/CD pipelines',
			'Led the full UI/UX revamp and redesign across all pages of the application',
			'Created the Tsukimi & Kin-paku design system, color tokens, and custom components',
			'Built backend quiz engine, scoring logic, and grading algorithms',
			'Prepared production release, deployed database migrations, and configured secrets',
			'Documented architecture, game flow, and created README screenshots'
		]
	},
	{
		id: 'virakbot',
		name: 'Chea Virakbott',
		katakanaName: 'チア・ヴィラクボット',
		japaneseRole: 'フロントエンド・ゲームプレイ開発',
		role: 'Frontend & Gameplay Developer',
		imageUrl: '/images/team/cheavirakbott.png',
		cutoutUrl: '/images/team/virakbot.svg',
		box: { x: 134, y: 328, width: 247, height: 269 },
		contributions: [
			'Built the Start Screen and nickname onboarding flow',
			'Built Multiple-Choice and Word-Ordering interactive question components',
			'Implemented play screen mechanics and results routing flow'
		]
	},
	{
		id: 'vathana',
		name: 'Has Sereivathana',
		katakanaName: 'ハス・セレイヴァタナ',
		japaneseRole: 'テキスト解析・入力判定開発',
		role: 'Frontend & NLP/Grading Developer',
		imageUrl: '/images/team/hassereivathana.png',
		cutoutUrl: '/images/team/vathana.svg',
		box: { x: 0, y: 578, width: 344, height: 345 },
		contributions: [
			'Built the interactive Typing Question component',
			'Implemented typed answer grading algorithms and Romaji/Hiragana text normalization'
		]
	},
	{
		id: 'menghour',
		name: 'Chhin Menghour',
		katakanaName: 'チン・メンホー',
		japaneseRole: 'アクセシビリティ・UI開発',
		role: 'Frontend & Accessibility Engineer',
		imageUrl: '/images/team/chhinmenghour.png',
		cutoutUrl: '/images/team/menghour.svg',
		box: { x: 971, y: 284, width: 309, height: 508 },
		contributions: [
			'Built the Leaderboard page and interactive ranking UI',
			'Built the Results celebration and review screen',
			'Designed mobile responsive layout improvements',
			'Implemented full accessibility (a11y) support and keyboard navigation'
		]
	},
	{
		id: 'lyleab',
		name: 'Ly Leab',
		katakanaName: 'リー・リアップ',
		japaneseRole: 'コンテンツ制作・QAエンジニア',
		role: 'Content Specialist & QA Engineer',
		imageUrl: '/images/team/lyleab.png',
		cutoutUrl: '/images/team/lyleab.svg',
		box: { x: 0, y: 313, width: 375, height: 609 },
		contributions: [
			'Created the Timer component for the play screen',
			'Added the Progress Bar for quiz tracking',
			'Built the responsive Credits page structure',
			'Managed content creation and entry of 120 N3/N4 quiz questions',
			'Conducted cross-device manual QA testing on mobile phones and multiple browsers'
		]
	},
	{
		id: 'karona',
		name: 'Thaikarona',
		katakanaName: 'タイカロナ',
		japaneseRole: 'セキュリティ・E2Eテスト開発',
		role: 'Security & QA/Testing Engineer',
		imageUrl: '/images/team/thaikarona.png',
		cutoutUrl: '/images/team/karona.svg',
		box: { x: 606, y: 304, width: 308, height: 412 },
		contributions: [
			'Implemented HMAC-signed value helpers for authentication and tamper-proof security',
			'Wrote automated End-to-End (E2E) tests for gameplay and admin flows'
		]
	}
];
