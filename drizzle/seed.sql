-- Clean up any existing seed data
DELETE FROM attempt_answers;
DELETE FROM quiz_attempts;
DELETE FROM choices;
DELETE FROM questions;

-- 1. N4 Multiple Choice (Vocabulary)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_mc_01',
    'N4',
    'vocabulary',
    'multiple_choice',
    'What is the meaning of 「案内する」 (あんないする)?',
    '案内する',
    NULL,
    '「案内する (あんないする)」 means to guide or show around.',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES
    ('c_n4_mc_01_1', 'q_n4_mc_01', 'To guide / show around', 1, 0),
    ('c_n4_mc_01_2', 'q_n4_mc_01', 'To invite', 0, 1),
    ('c_n4_mc_01_3', 'q_n4_mc_01', 'To prepare', 0, 2),
    ('c_n4_mc_01_4', 'q_n4_mc_01', 'To decide', 0, 3);

-- 2. N4 Gap Fill (Grammar)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gf_01',
    'N4',
    'grammar',
    'gap_fill',
    'Choose the correct particle for the blank.',
    '日曜日 [ ___ ] 友達と映画を見に行きます。',
    NULL,
    'Specific time expressions (like days of the week) take the particle 「に」.',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES
    ('c_n4_gf_01_1', 'q_n4_gf_01', 'に', 1, 0),
    ('c_n4_gf_01_2', 'q_n4_gf_01', 'で', 0, 1),
    ('c_n4_gf_01_3', 'q_n4_gf_01', 'を', 0, 2),
    ('c_n4_gf_01_4', 'q_n4_gf_01', 'へ', 0, 3);

-- 3. N4 Typing (Kanji Reading)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_ty_01',
    'N4',
    'vocabulary',
    'typing',
    'Type the hiragana reading for the word:',
    '週末',
    '["しゅうまつ","shuumatsu","syuumatsu"]',
    '「週末」 is read 「しゅうまつ」 and means weekend.',
    1,
    strftime('%s', 'now')
);

-- 4. N4 Word Ordering (Grammar)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_wo_01',
    'N4',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order to say "I want to become able to speak Japanese well".',
    '私は日本語 [ 1 ] [ 2 ] [ 3 ] なりたいです。',
    NULL,
    'The correct pattern is: 日本語 + を + 上手に + 話せるように + なります。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES
    ('c_n4_wo_01_1', 'q_n4_wo_01', 'を', 1, 0),
    ('c_n4_wo_01_2', 'q_n4_wo_01', '上手に', 1, 1),
    ('c_n4_wo_01_3', 'q_n4_wo_01', '話せるように', 1, 2);

-- 5. N3 Multiple Choice (Grammar)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_mc_01',
    'N3',
    'grammar',
    'multiple_choice',
    'Select the correct expression to complete the sentence.',
    '日本に来てから、納豆が食べられる [ ___ ] なりました。',
    NULL,
    '「〜ようになる」 indicates a change in state or ability over time.',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES
    ('c_n3_mc_01_1', 'q_n3_mc_01', 'ように', 1, 0),
    ('c_n3_mc_01_2', 'q_n3_mc_01', 'ことに', 0, 1),
    ('c_n3_mc_01_3', 'q_n3_mc_01', 'ために', 0, 2),
    ('c_n3_mc_01_4', 'q_n3_mc_01', 'そうに', 0, 3);

-- 6. N3 Gap Fill (Vocabulary)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gf_01',
    'N3',
    'vocabulary',
    'gap_fill',
    'Choose the onomatopoeia / adverb that best fits the blank.',
    '新商品の開発が [ ___ ] 進んでいます。',
    NULL,
    '「着々と (ちゃくちゃくと)」 means steadily or step-by-step according to plan.',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES
    ('c_n3_gf_01_1', 'q_n3_gf_01', '着々と', 1, 0),
    ('c_n3_gf_01_2', 'q_n3_gf_01', 'ぞくぞくと', 0, 1),
    ('c_n3_gf_01_3', 'q_n3_gf_01', 'すらすら', 0, 2),
    ('c_n3_gf_01_4', 'q_n3_gf_01', 'ぎっしり', 0, 3);

-- 7. N3 Typing (Kanji Reading)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_ty_01',
    'N3',
    'vocabulary',
    'typing',
    'Type the hiragana reading for the word:',
    '透明',
    '["とうめい","toumei"]',
    '「透明」 is read 「とうめい」 and means transparent.',
    1,
    strftime('%s', 'now')
);

-- 8. N3 Word Ordering (Grammar)
INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_wo_01',
    'N3',
    'grammar',
    'word_ordering',
    'Arrange the words to complete the sentence.',
    '雨が [ 1 ] [ 2 ] [ 3 ] 傘を持っていきます。',
    NULL,
    '「雨が降るかもしれないので、傘を持っていきます。」 (Because it might rain, I will take an umbrella.)',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES
    ('c_n3_wo_01_1', 'q_n3_wo_01', '降る', 1, 0),
    ('c_n3_wo_01_2', 'q_n3_wo_01', 'かもしれない', 1, 1),
    ('c_n3_wo_01_3', 'q_n3_wo_01', 'ので', 1, 2);
