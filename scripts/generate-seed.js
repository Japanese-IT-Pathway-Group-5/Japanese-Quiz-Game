/* eslint-disable */
import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('./scripts/excel_rows.json', 'utf8'));

// Helper to escape SQL single quotes
function esc(str) {
	if (str === null || str === undefined) return 'NULL';
	return `'${String(str).replace(/'/g, "''")}'`;
}

const sqlLines = [
	'DELETE FROM attempt_answers;',
	'DELETE FROM quiz_attempts;',
	'DELETE FROM choices;',
	'DELETE FROM questions;',
	''
];

const headers = rows[0];
const dataRows = rows.slice(1);

console.log(`Processing ${dataRows.length} questions...`);

dataRows.forEach((r, idx) => {
	const [
		empty,
		level,
		category,
		type,
		questionRaw,
		optionsRaw,
		correctRaw,
		acceptedRaw,
		explRaw,
		author
	] = r;

	const qNum = idx + 1;
	const qId = `q_${level.toLowerCase()}_${type}_${qNum}`;

	let prompt = 'Answer the question.';
	let promptJa = questionRaw ? questionRaw.trim() : '';
	let acceptedAnswers = null;
	const explanation = explRaw
		? explRaw.trim()
		: acceptedRaw && !acceptedRaw.includes(',')
			? acceptedRaw.trim()
			: '';

	const choices = [];

	if (type === 'multiple_choice') {
		prompt = 'Choose the correct option.';
		const opts = (optionsRaw || '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const correct = (correctRaw || '').trim();
		opts.forEach((optText, optIdx) => {
			choices.push({
				id: `c_${qId}_${optIdx + 1}`,
				question_id: qId,
				text: optText,
				is_correct: optText === correct ? 1 : 0,
				order: optIdx
			});
		});
	} else if (type === 'gap_fill') {
		prompt = 'Fill in the blank.';
		const opts = (optionsRaw || '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const correct = (correctRaw || '').trim();
		opts.forEach((optText, optIdx) => {
			choices.push({
				id: `c_${qId}_${optIdx + 1}`,
				question_id: qId,
				text: optText,
				is_correct: optText === correct ? 1 : 0,
				order: optIdx
			});
		});
	} else if (type === 'typing') {
		prompt = 'Type the correct answer.';
		// Options / Accepted answers
		const list = (optionsRaw || acceptedRaw || correctRaw || '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		acceptedAnswers = JSON.stringify(list);
	} else if (type === 'word_ordering') {
		prompt = 'Arrange the words in the correct order.';

		// Correct word sequence
		let words = [];
		if (correctRaw && correctRaw.trim()) {
			words = correctRaw
				.trim()
				.split(/\s+/)
				.map((s) => s.trim())
				.filter(Boolean);
		} else if (optionsRaw) {
			words = optionsRaw
				.split('/')
				.map((s) => s.trim())
				.filter(Boolean);
		}

		// Handle special case if WO #4 has 4 options vs 3 in correct
		if (qId === 'q_n4_word_ordering_16' || promptJa.includes('packed with people')) {
			words = ['電車は', '満員で', '人で', 'いっぱいでした'];
		}

		words.forEach((word, wIdx) => {
			choices.push({
				id: `c_${qId}_${wIdx + 1}`,
				question_id: qId,
				text: word,
				is_correct: 1,
				order: wIdx
			});
		});
	}

	// Build SQL for Question
	sqlLines.push(
		`INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)`
	);
	sqlLines.push(`VALUES (`);
	sqlLines.push(`    ${esc(qId)},`);
	sqlLines.push(`    ${esc(level)},`);
	sqlLines.push(`    ${esc(category)},`);
	sqlLines.push(`    ${esc(type)},`);
	sqlLines.push(`    ${esc(prompt)},`);
	sqlLines.push(`    ${esc(promptJa)},`);
	sqlLines.push(`    ${acceptedAnswers ? esc(acceptedAnswers) : 'NULL'},`);
	sqlLines.push(`    ${esc(explanation)},`);
	sqlLines.push(`    1,`);
	sqlLines.push(`    strftime('%s', 'now')`);
	sqlLines.push(`);`);
	sqlLines.push('');

	// Build SQL for Choices
	choices.forEach((c) => {
		sqlLines.push(`INSERT INTO choices (id, question_id, text, is_correct, "order")`);
		sqlLines.push(
			`VALUES (${esc(c.id)}, ${esc(c.question_id)}, ${esc(c.text)}, ${c.is_correct}, ${c.order});`
		);
	});

	if (choices.length > 0) {
		sqlLines.push('');
	}
});

const generatedSql = sqlLines.join('\n');
fs.writeFileSync('./drizzle/seed.sql', generatedSql, 'utf8');
console.log('Successfully generated clean ./drizzle/seed.sql');
