DELETE FROM attempt_answers;
DELETE FROM quiz_attempts;
DELETE FROM choices;
DELETE FROM questions;

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_1',
    'N4',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '毎朝、パンを（ ）コーヒーを飲みます。',
    NULL,
    '【正解】「食べて」
文脈に最も適した選択肢は「食べて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_1_1', 'q_n4_multiple_choice_1', '食べて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_1_2', 'q_n4_multiple_choice_1', '食べたら', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_1_3', 'q_n4_multiple_choice_1', '食べると', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_1_4', 'q_n4_multiple_choice_1', '食べた', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_2',
    'N4',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '辞書を（ ）言葉の意味を調べました。',
    NULL,
    '【正解】「引いて」
文脈に最も適した選択肢は「引いて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_2_1', 'q_n4_gap_fill_2', '引いて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_2_2', 'q_n4_gap_fill_2', '取って', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_2_3', 'q_n4_gap_fill_2', '見て', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_2_4', 'q_n4_gap_fill_2', '呼んで', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_3',
    'N4',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「いしゃ」の漢字を書いてください。',
    '["医者","いしゃ","isha"]',
    '【正解】「医者」
「いしゃ」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_4',
    'N4',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Please take an umbrella.)',
    NULL,
    '【正解の文】「傘を 持って 行って ください」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_4_1', 'q_n4_word_ordering_4', '傘を', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_4_2', 'q_n4_word_ordering_4', '持って', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_4_3', 'q_n4_word_ordering_4', '行って', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_4_4', 'q_n4_word_ordering_4', 'ください', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_5',
    'N4',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '暗くなりましたから、電気を（ ）ください。',
    NULL,
    '【正解】「つけて」
文脈に最も適した選択肢は「つけて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_5_1', 'q_n4_multiple_choice_5', 'つけて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_5_2', 'q_n4_multiple_choice_5', 'けして', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_5_3', 'q_n4_multiple_choice_5', '開けて', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_5_4', 'q_n4_multiple_choice_5', 'しめて', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_6',
    'N4',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '風邪を（ ）ので、会社を休みます。',
    NULL,
    '【正解】「ひいた」
文脈に最も適した選択肢は「ひいた」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_6_1', 'q_n4_gap_fill_6', 'ひいた', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_6_2', 'q_n4_gap_fill_6', 'とった', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_6_3', 'q_n4_gap_fill_6', 'もった', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_6_4', 'q_n4_gap_fill_6', 'かけた', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_7',
    'N4',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「ぎんこう」の漢字を書いてください。',
    '["銀行","ぎんこう","ginkou","ginko"]',
    '【正解】「銀行」
「ぎんこう」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_8',
    'N4',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I returned the wallet to the police station.)',
    NULL,
    '【正解の文】「交番の 警察に 財布を 届けました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_8_1', 'q_n4_word_ordering_8', '交番の', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_8_2', 'q_n4_word_ordering_8', '警察に', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_8_3', 'q_n4_word_ordering_8', '財布を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_8_4', 'q_n4_word_ordering_8', '届けました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_9',
    'N4',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '荷物が重いので、（ ）手伝ってください。',
    NULL,
    '【正解】「少し」
文脈に最も適した選択肢は「少し」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_9_1', 'q_n4_multiple_choice_9', '少し', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_9_2', 'q_n4_multiple_choice_9', '早く', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_9_3', 'q_n4_multiple_choice_9', '決して', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_9_4', 'q_n4_multiple_choice_9', 'たぶん', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_10',
    'N4',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    'エレベーターが（ ）ので階段を使いました。',
    NULL,
    '【正解】「故障した」
文脈に最も適した選択肢は「故障した」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_10_1', 'q_n4_gap_fill_10', '故障した', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_10_2', 'q_n4_gap_fill_10', '準備した', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_10_3', 'q_n4_gap_fill_10', '散歩した', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_10_4', 'q_n4_gap_fill_10', '出発した', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_11',
    'N4',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「くすり」の漢字を書いてください。',
    '["薬","くすり","kusuri"]',
    '【正解】「薬」
「くすり」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_12',
    'N4',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I brushed my teeth after eating.)',
    NULL,
    '【正解の文】「ご飯を 食べた後で 歯を 磨きました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_12_1', 'q_n4_word_ordering_12', 'ご飯を', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_12_2', 'q_n4_word_ordering_12', '食べた後で', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_12_3', 'q_n4_word_ordering_12', '歯を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_12_4', 'q_n4_word_ordering_12', '磨きました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_13',
    'N4',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    'この料理の（ ）方を教えてください。',
    NULL,
    '【正解】「作り」
文脈に最も適した選択肢は「作り」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_13_1', 'q_n4_multiple_choice_13', '作り', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_13_2', 'q_n4_multiple_choice_13', '作る', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_13_3', 'q_n4_multiple_choice_13', '作った', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_13_4', 'q_n4_multiple_choice_13', '作れ', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_14',
    'N4',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '靴を脱いで、（ ）を履いてください。',
    NULL,
    '【正解】「スリッパ」
文脈に最も適した選択肢は「スリッパ」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_14_1', 'q_n4_gap_fill_14', 'スリッパ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_14_2', 'q_n4_gap_fill_14', 'ネクタイ', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_14_3', 'q_n4_gap_fill_14', 'スカート', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_14_4', 'q_n4_gap_fill_14', 'メガネ', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_15',
    'N4',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「しんぶん」の漢字を書いてください。',
    '["新聞","しんぶん","shinbun","shimbun"]',
    '【正解】「新聞」
「しんぶん」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_16',
    'N4',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The train was packed with people.)',
    NULL,
    '【正解の文】「電車は 満員で 人で いっぱいでした」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_16_1', 'q_n4_word_ordering_16', '電車は', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_16_2', 'q_n4_word_ordering_16', '満員で', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_16_3', 'q_n4_word_ordering_16', '人で', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_16_4', 'q_n4_word_ordering_16', 'いっぱいでした', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_17',
    'N4',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    'バスに乗り（ ）ので、走りました。',
    NULL,
    '【正解】「遅れた」
文脈に最も適した選択肢は「遅れた」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_17_1', 'q_n4_multiple_choice_17', '遅れた', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_17_2', 'q_n4_multiple_choice_17', '落ちた', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_17_3', 'q_n4_multiple_choice_17', '忘れた', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_17_4', 'q_n4_multiple_choice_17', '止まった', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_18',
    'N4',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '約束の時間を（ ）しまいました。',
    NULL,
    '【正解】「忘れて」
文脈に最も適した選択肢は「忘れて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_18_1', 'q_n4_gap_fill_18', '忘れて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_18_2', 'q_n4_gap_fill_18', '捨てて', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_18_3', 'q_n4_gap_fill_18', '壊して', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_18_4', 'q_n4_gap_fill_18', '負けて', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_19',
    'N4',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「みち」の漢字を書いてください。',
    '["道","みち","michi"]',
    '【正解】「道」
「みち」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_20',
    'N4',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Turn right at the corner.)',
    NULL,
    '【正解の文】「角を 右へ 曲がって ください」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_20_1', 'q_n4_word_ordering_20', '角を', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_20_2', 'q_n4_word_ordering_20', '右へ', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_20_3', 'q_n4_word_ordering_20', '曲がって', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_20_4', 'q_n4_word_ordering_20', 'ください', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_21',
    'N4',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「図書館」の正しい読み方はどれですか。',
    NULL,
    '【正解】「としょかん」
文脈に最も適した選択肢は「としょかん」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_21_1', 'q_n4_multiple_choice_21', 'としょかん', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_21_2', 'q_n4_multiple_choice_21', 'としょけん', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_21_3', 'q_n4_multiple_choice_21', 'ずしょかん', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_21_4', 'q_n4_multiple_choice_21', 'としょがん', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_22',
    'N4',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    'このビルはとても（高い＝たかい）です。下線部の反対語は？',
    NULL,
    '【正解】「低い」
文脈に最も適した選択肢は「低い」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_22_1', 'q_n4_gap_fill_22', '低い', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_22_2', 'q_n4_gap_fill_22', '短い', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_22_3', 'q_n4_gap_fill_22', '狭い', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_22_4', 'q_n4_gap_fill_22', '軽い', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_23',
    'N4',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「危険」の読み方をひらがなで書いてください。',
    '["きけん","危険","キケン","kiken"]',
    '【正解】「きけん」
「危険」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_24',
    'N4',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The bicycle was repaired.)',
    NULL,
    '【正解の文】「壊れた 自転車が 自転車屋で 修理されました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_24_1', 'q_n4_word_ordering_24', '壊れた', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_24_2', 'q_n4_word_ordering_24', '自転車が', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_24_3', 'q_n4_word_ordering_24', '自転車屋で', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_24_4', 'q_n4_word_ordering_24', '修理されました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_25',
    'N4',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「案内」の正しい読み方はどれですか。',
    NULL,
    '【正解】「あんない」
文脈に最も適した選択肢は「あんない」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_25_1', 'q_n4_multiple_choice_25', 'あんない', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_25_2', 'q_n4_multiple_choice_25', 'あんないん', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_25_3', 'q_n4_multiple_choice_25', 'かんない', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_25_4', 'q_n4_multiple_choice_25', 'べんない', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_26',
    'N4',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「出発」の反対の意味を持つ漢字の言葉は？',
    NULL,
    '【正解】「到着」
文脈に最も適した選択肢は「到着」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_26_1', 'q_n4_gap_fill_26', '到着', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_26_2', 'q_n4_gap_fill_26', '予定', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_26_3', 'q_n4_gap_fill_26', '参加', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_26_4', 'q_n4_gap_fill_26', '案内', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_27',
    'N4',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「安全」の読み方をひらがなで書いてください。',
    '["あんぜん","安全","アンゼン","anzen"]',
    '【正解】「あんぜん」
「安全」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_28',
    'N4',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Please open the window.)',
    NULL,
    '【正解の文】「そこの 窓を 開けて ください」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_28_1', 'q_n4_word_ordering_28', 'そこの', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_28_2', 'q_n4_word_ordering_28', '窓を', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_28_3', 'q_n4_word_ordering_28', '開けて', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_28_4', 'q_n4_word_ordering_28', 'ください', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_29',
    'N4',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「急行」の正しい読み方はどれですか。',
    NULL,
    '【正解】「きゅうこう」
文脈に最も適した選択肢は「きゅうこう」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_29_1', 'q_n4_multiple_choice_29', 'きゅうこう', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_29_2', 'q_n4_multiple_choice_29', 'きょうこう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_29_3', 'q_n4_multiple_choice_29', 'いそぎこう', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_29_4', 'q_n4_multiple_choice_29', 'きゅうぎょう', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_30',
    'N4',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '兄は（大学＝だいがく）に通っています。「大」の訓読みは？',
    NULL,
    '【正解】「おおきい」
文脈に最も適した選択肢は「おおきい」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_30_1', 'q_n4_gap_fill_30', 'おおきい', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_30_2', 'q_n4_gap_fill_30', 'ちいさい', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_30_3', 'q_n4_gap_fill_30', 'たかい', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_30_4', 'q_n4_gap_fill_30', 'ひろい', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_31',
    'N4',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「目的」の読み方をひらがなで書いてください。',
    '["もくてき","目的","モクテキ","mokuteki"]',
    '【正解】「もくてき」
「目的」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_32',
    'N4',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The meeting started at 10.)',
    NULL,
    '【正解の文】「会議室で 会議が 10時に 始まりました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_32_1', 'q_n4_word_ordering_32', '会議室で', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_32_2', 'q_n4_word_ordering_32', '会議が', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_32_3', 'q_n4_word_ordering_32', '10時に', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_32_4', 'q_n4_word_ordering_32', '始まりました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_33',
    'N4',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「複雑」の正しい読み方はどれですか。',
    NULL,
    '【正解】「ふくざつ」
文脈に最も適した選択肢は「ふくざつ」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_33_1', 'q_n4_multiple_choice_33', 'ふくざつ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_33_2', 'q_n4_multiple_choice_33', 'ふくぞう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_33_3', 'q_n4_multiple_choice_33', 'ふくさつ', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_33_4', 'q_n4_multiple_choice_33', 'ぶくざつ', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_34',
    'N4',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「（禁止＝きんし）」の意味はどれですか。',
    NULL,
    '【正解】「してはいけない」
文脈に最も適した選択肢は「してはいけない」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_34_1', 'q_n4_gap_fill_34', 'してはいけない', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_34_2', 'q_n4_gap_fill_34', 'してもよい', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_34_3', 'q_n4_gap_fill_34', 'しなければならない', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_34_4', 'q_n4_gap_fill_34', 'したい', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_35',
    'N4',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「都合」の読み方をひらがなで書いてください。',
    '["つごう","都合","ツゴウ","tsugou","tsugo"]',
    '【正解】「つごう」
「都合」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_36',
    'N4',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I sent a letter by airmail.)',
    NULL,
    '【正解の文】「海外へ 航空便で 手紙を 送りました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_36_1', 'q_n4_word_ordering_36', '海外へ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_36_2', 'q_n4_word_ordering_36', '航空便で', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_36_3', 'q_n4_word_ordering_36', '手紙を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_36_4', 'q_n4_word_ordering_36', '送りました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_37',
    'N4',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「相談」の正しい読み方はどれですか。',
    NULL,
    '【正解】「そうだん」
文脈に最も適した選択肢は「そうだん」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_37_1', 'q_n4_multiple_choice_37', 'そうだん', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_37_2', 'q_n4_multiple_choice_37', 'しょうだん', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_37_3', 'q_n4_multiple_choice_37', 'そうたん', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_37_4', 'q_n4_multiple_choice_37', 'しょだん', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_38',
    'N4',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「（返事＝へんじ）」をする相手は誰ですか。',
    NULL,
    '【正解】「質問した人」
文脈に最も適した選択肢は「質問した人」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_38_1', 'q_n4_gap_fill_38', '質問した人', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_38_2', 'q_n4_gap_fill_38', '寝ている人', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_38_3', 'q_n4_gap_fill_38', '走っている人', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_38_4', 'q_n4_gap_fill_38', '見ていない人', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_39',
    'N4',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「注意」の読み方をひらがなで書いてください。',
    '["ちゅうい","注意","チュウイ","chuui","chui"]',
    '【正解】「ちゅうい」
「注意」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_40',
    'N4',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I reserved a hotel room.)',
    NULL,
    '【正解の文】「インターネットで ホテルの 部屋を 予約しました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_40_1', 'q_n4_word_ordering_40', 'インターネットで', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_40_2', 'q_n4_word_ordering_40', 'ホテルの', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_40_3', 'q_n4_word_ordering_40', '部屋を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_40_4', 'q_n4_word_ordering_40', '予約しました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_41',
    'N4',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '日本へ行ったことが（ ）。',
    NULL,
    '【正解】「あります」
文脈に最も適した選択肢は「あります」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_41_1', 'q_n4_multiple_choice_41', 'あります', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_41_2', 'q_n4_multiple_choice_41', 'います', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_41_3', 'q_n4_multiple_choice_41', 'します', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_41_4', 'q_n4_multiple_choice_41', 'できます', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_42',
    'N4',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '明日テストがあるので、勉強し（ ）なりません。',
    NULL,
    '【正解】「なければ」
文脈に最も適した選択肢は「なければ」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_42_1', 'q_n4_gap_fill_42', 'なければ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_42_2', 'q_n4_gap_fill_42', 'なくては', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_42_3', 'q_n4_gap_fill_42', 'ないと', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_42_4', 'q_n4_gap_fill_42', 'ないで', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_43',
    'N4',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「ここに入って（ ）いいですか。」の空欄の助詞を一文字入れなさい。',
    '["も","mo"]',
    '【正解】「も」
「ここに入って（ ）いいですか。」の空欄の助詞を一文字入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_44',
    'N4',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Please don''t forget your homework.)',
    NULL,
    '【正解の文】「明日の 宿題を 忘れないで ください」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_44_1', 'q_n4_word_ordering_44', '明日の', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_44_2', 'q_n4_word_ordering_44', '宿題を', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_44_3', 'q_n4_word_ordering_44', '忘れないで', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_44_4', 'q_n4_word_ordering_44', 'ください', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_45',
    'N4',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '雨が降って（ ）、傘を持っていきます。',
    NULL,
    '【正解】「いるから」
文脈に最も適した選択肢は「いるから」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_45_1', 'q_n4_multiple_choice_45', 'いるから', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_45_2', 'q_n4_multiple_choice_45', 'いるのに', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_45_3', 'q_n4_multiple_choice_45', 'いたら', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_45_4', 'q_n4_multiple_choice_45', 'いれば', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_46',
    'N4',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '窓が（ ）います。風が入ってきます。',
    NULL,
    '【正解】「開いて」
文脈に最も適した選択肢は「開いて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_46_1', 'q_n4_gap_fill_46', '開いて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_46_2', 'q_n4_gap_fill_46', '開けて', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_46_3', 'q_n4_gap_fill_46', '閉まって', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_46_4', 'q_n4_gap_fill_46', '閉めて', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_47',
    'N4',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「傘を持た（ ）に出かけました。」の空欄に入る平仮名2文字を書きなさい。',
    '["ずに","ない","zuni","nai"]',
    '【正解】「ずに」
「傘を持た（ ）に出かけました。」の空欄に入る平仮名2文字を書きなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_48',
    'N4',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I will go after eating dinner.)',
    NULL,
    '【正解の文】「夕食を 食べてから 駅へ 行きます」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_48_1', 'q_n4_word_ordering_48', '夕食を', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_48_2', 'q_n4_word_ordering_48', '食べてから', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_48_3', 'q_n4_word_ordering_48', '駅へ', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_48_4', 'q_n4_word_ordering_48', '行きます', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_49',
    'N4',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '先生、（ ）質問してもよろしいですか。',
    NULL,
    '【正解】「一つ」
文脈に最も適した選択肢は「一つ」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_49_1', 'q_n4_multiple_choice_49', '一つ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_49_2', 'q_n4_multiple_choice_49', '一度', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_49_3', 'q_n4_multiple_choice_49', '一人', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_49_4', 'q_n4_multiple_choice_49', '一杯', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_50',
    'N4',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '日本語が上手に（ ）たいです。',
    NULL,
    '【正解】「なり」
文脈に最も適した選択肢は「なり」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_50_1', 'q_n4_gap_fill_50', 'なり', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_50_2', 'q_n4_gap_fill_50', 'なりそう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_50_3', 'q_n4_gap_fill_50', 'なる', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_50_4', 'q_n4_gap_fill_50', 'なって', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_51',
    'N4',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「先生は本を読（ ）いらっしゃいます。」尊敬語の助詞を1字入れなさい。',
    '["んで","nde"]',
    '【正解】「んで」
「先生は本を読（ ）いらっしゃいます。」尊敬語の助詞を1字入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_52',
    'N4',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Even if it is cold, I run.)',
    NULL,
    '【正解の文】「寒くても 毎朝 公園を 走ります」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_52_1', 'q_n4_word_ordering_52', '寒くても', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_52_2', 'q_n4_word_ordering_52', '毎朝', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_52_3', 'q_n4_word_ordering_52', '公園を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_52_4', 'q_n4_word_ordering_52', '走ります', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_53',
    'N4',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    'この本は難し（ ）読めません。',
    NULL,
    '【正解】「すぎて」
文脈に最も適した選択肢は「すぎて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_53_1', 'q_n4_multiple_choice_53', 'すぎて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_53_2', 'q_n4_multiple_choice_53', 'そうで', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_53_3', 'q_n4_multiple_choice_53', 'ながら', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_53_4', 'q_n4_multiple_choice_53', 'みたいで', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_54',
    'N4',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    'テレビを（ ）ながらご飯を食べます。',
    NULL,
    '【正解】「見」
文脈に最も適した選択肢は「見」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_54_1', 'q_n4_gap_fill_54', '見', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_54_2', 'q_n4_gap_fill_54', '見て', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_54_3', 'q_n4_gap_fill_54', '見る', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_54_4', 'q_n4_gap_fill_54', '見た', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_55',
    'N4',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「彼が来（ ）どうか分かりません。」の接続助詞を平仮名2文字で入れなさい。',
    '["るか","ruka"]',
    '【正解】「るか」
「彼が来（ ）どうか分かりません。」の接続助詞を平仮名2文字で入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_56',
    'N4',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I was praised by the teacher.)',
    NULL,
    '【正解の文】「よくできたので テストで 先生に 褒められました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_56_1', 'q_n4_word_ordering_56', 'よくできたので', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_56_2', 'q_n4_word_ordering_56', 'テストで', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_56_3', 'q_n4_word_ordering_56', '先生に', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_56_4', 'q_n4_word_ordering_56', '褒められました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_multiple_choice_57',
    'N4',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '明日は雨が降る（ ）です。天気予報で言っていました。',
    NULL,
    '【正解】「そう」
文脈に最も適した選択肢は「そう」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_57_1', 'q_n4_multiple_choice_57', 'そう', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_57_2', 'q_n4_multiple_choice_57', 'よう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_57_3', 'q_n4_multiple_choice_57', 'らしい', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_multiple_choice_57_4', 'q_n4_multiple_choice_57', 'みたい', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_gap_fill_58',
    'N4',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '母に部屋を掃除（ ）られました。',
    NULL,
    '【正解】「さ」
文脈に最も適した選択肢は「さ」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_58_1', 'q_n4_gap_fill_58', 'さ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_58_2', 'q_n4_gap_fill_58', 'せ', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_58_3', 'q_n4_gap_fill_58', 'し', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_gap_fill_58_4', 'q_n4_gap_fill_58', 'す', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_typing_59',
    'N4',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「どうぞお茶を（ ）あがりください。」の平仮名2文字を書きなさい。',
    '["お召","おめ","おめし","omeshi","ome"]',
    '【正解】「お召」
「どうぞお茶を（ ）あがりください。」の平仮名2文字を書きなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n4_word_ordering_60',
    'N4',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (It looks like it will rain soon.)',
    NULL,
    '【正解の文】「空が暗くて 今にも 雨が 降りそうです」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_60_1', 'q_n4_word_ordering_60', '空が暗くて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_60_2', 'q_n4_word_ordering_60', '今にも', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_60_3', 'q_n4_word_ordering_60', '雨が', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n4_word_ordering_60_4', 'q_n4_word_ordering_60', '降りそうです', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_61',
    'N3',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '会議の資料を全員に（ ）してください。',
    NULL,
    '【正解】「配布」
文脈に最も適した選択肢は「配布」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_61_1', 'q_n3_multiple_choice_61', '配布', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_61_2', 'q_n3_multiple_choice_61', '整理', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_61_3', 'q_n3_multiple_choice_61', '収集', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_61_4', 'q_n3_multiple_choice_61', '延長', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_62',
    'N3',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    'お客様からの（ ）に対応する窓口を設置した。',
    NULL,
    '【正解】「苦情」
文脈に最も適した選択肢は「苦情」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_62_1', 'q_n3_gap_fill_62', '苦情', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_62_2', 'q_n3_gap_fill_62', '事情', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_62_3', 'q_n3_gap_fill_62', '友情', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_62_4', 'q_n3_gap_fill_62', '同情', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_63',
    'N3',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「えんき」の漢字を書いてください（日程を遅らせること）。',
    '["延期","えんき","enki"]',
    '【正解】「延期」
「えんき」の漢字を書いてください（日程を遅らせること）。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_64',
    'N3',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Expenses increased due to unexpected events.)',
    NULL,
    '【正解の文】「思いがけない 出来事で 出費が 重なりました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_64_1', 'q_n3_word_ordering_64', '思いがけない', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_64_2', 'q_n3_word_ordering_64', '出来事で', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_64_3', 'q_n3_word_ordering_64', '出費が', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_64_4', 'q_n3_word_ordering_64', '重なりました', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_65',
    'N3',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    'プロジェクトの成功に向けて、全員で（ ）した。',
    NULL,
    '【正解】「協力」
文脈に最も適した選択肢は「協力」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_65_1', 'q_n3_multiple_choice_65', '協力', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_65_2', 'q_n3_multiple_choice_65', '賛成', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_65_3', 'q_n3_multiple_choice_65', '承知', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_65_4', 'q_n3_multiple_choice_65', '契約', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_66',
    'N3',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '彼女の意見に強く（ ）した。',
    NULL,
    '【正解】「賛成」
文脈に最も適した選択肢は「賛成」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_66_1', 'q_n3_gap_fill_66', '賛成', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_66_2', 'q_n3_gap_fill_66', '反映', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_66_3', 'q_n3_gap_fill_66', '影響', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_66_4', 'q_n3_gap_fill_66', '批判', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_67',
    'N3',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「けいやく」の漢字を書いてください。',
    '["契約","けいやく","keiyaku"]',
    '【正解】「契約」
「けいやく」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_68',
    'N3',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (We are recruiting staff for the new project.)',
    NULL,
    '【正解の文】「新規プロジェクトの スタッフを 募集して います」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_68_1', 'q_n3_word_ordering_68', '新規プロジェクトの', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_68_2', 'q_n3_word_ordering_68', 'スタッフを', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_68_3', 'q_n3_word_ordering_68', '募集して', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_68_4', 'q_n3_word_ordering_68', 'います', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_69',
    'N3',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '電車のダイヤが（ ）、30分遅れて到着した。',
    NULL,
    '【正解】「乱れて」
文脈に最も適した選択肢は「乱れて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_69_1', 'q_n3_multiple_choice_69', '乱れて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_69_2', 'q_n3_multiple_choice_69', '倒れて', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_69_3', 'q_n3_multiple_choice_69', '折れて', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_69_4', 'q_n3_multiple_choice_69', '破れて', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_70',
    'N3',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '健康のために栄養の（ ）を考えることが大切だ。',
    NULL,
    '【正解】「バランス」
文脈に最も適した選択肢は「バランス」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_70_1', 'q_n3_gap_fill_70', 'バランス', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_70_2', 'q_n3_gap_fill_70', 'サンプル', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_70_3', 'q_n3_gap_fill_70', 'パターン', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_70_4', 'q_n3_gap_fill_70', 'チャンス', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_71',
    'N3',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「せつやく」の漢字を書いてください。',
    '["節約","せつやく","setsuyaku"]',
    '【正解】「節約」
「せつやく」の漢字を書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_72',
    'N3',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (He is trusted by everyone at work.)',
    NULL,
    '【正解の文】「彼は 職場の 皆から 信頼されています」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_72_1', 'q_n3_word_ordering_72', '彼は', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_72_2', 'q_n3_word_ordering_72', '職場の', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_72_3', 'q_n3_word_ordering_72', '皆から', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_72_4', 'q_n3_word_ordering_72', '信頼されています', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_73',
    'N3',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '上司に相談して、問題を（ ）した。',
    NULL,
    '【正解】「解決」
文脈に最も適した選択肢は「解決」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_73_1', 'q_n3_multiple_choice_73', '解決', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_73_2', 'q_n3_multiple_choice_73', '解散', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_73_3', 'q_n3_multiple_choice_73', '解約', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_73_4', 'q_n3_multiple_choice_73', '解答', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_74',
    'N3',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    'この製品は省エネ機能が（ ）いる。',
    NULL,
    '【正解】「優れて」
文脈に最も適した選択肢は「優れて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_74_1', 'q_n3_gap_fill_74', '優れて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_74_2', 'q_n3_gap_fill_74', '勝って', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_74_3', 'q_n3_gap_fill_74', '利いて', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_74_4', 'q_n3_gap_fill_74', '増えて', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_75',
    'N3',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「しんちょう」の漢字を書いてください（注意深いこと）。',
    '["慎重","しんちょう","shinchou","shincho"]',
    '【正解】「慎重」
「しんちょう」の漢字を書いてください（注意深いこと）。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_76',
    'N3',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The event was canceled due to bad weather.)',
    NULL,
    '【正解の文】「悪天候の ために イベントは 中止に なりました」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_76_1', 'q_n3_word_ordering_76', '悪天候の', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_76_2', 'q_n3_word_ordering_76', 'ために', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_76_3', 'q_n3_word_ordering_76', 'イベントは', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_76_4', 'q_n3_word_ordering_76', '中止に', 1, 3);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_76_5', 'q_n3_word_ordering_76', 'なりました', 1, 4);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_77',
    'N3',
    'vocabulary',
    'multiple_choice',
    'Choose the correct option.',
    '努力のかいがあって、試験に（ ）した。',
    NULL,
    '【正解】「合格」
文脈に最も適した選択肢は「合格」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_77_1', 'q_n3_multiple_choice_77', '合格', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_77_2', 'q_n3_multiple_choice_77', '成功', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_77_3', 'q_n3_multiple_choice_77', '卒業', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_77_4', 'q_n3_multiple_choice_77', '進行', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_78',
    'N3',
    'vocabulary',
    'gap_fill',
    'Fill in the blank.',
    '予算が大幅に（ ）してしまった。',
    NULL,
    '【正解】「超過」
文脈に最も適した選択肢は「超過」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_78_1', 'q_n3_gap_fill_78', '超過', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_78_2', 'q_n3_gap_fill_78', '進行', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_78_3', 'q_n3_gap_fill_78', '発展', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_78_4', 'q_n3_gap_fill_78', '増加', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_79',
    'N3',
    'vocabulary',
    'typing',
    'Type the correct answer.',
    '「きょうしゅく」の漢字を書いてください（恐縮です）。',
    '["恐縮","きょうしゅく","kyoushuku","kyoshuku"]',
    '【正解】「恐縮」
「きょうしゅく」の漢字を書いてください（恐縮です）。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_80',
    'N3',
    'vocabulary',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (I appreciate your prompt response.)',
    NULL,
    '【正解の文】「迅速な ご対応を いただき 感謝いたします」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_80_1', 'q_n3_word_ordering_80', '迅速な', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_80_2', 'q_n3_word_ordering_80', 'ご対応を', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_80_3', 'q_n3_word_ordering_80', 'いただき', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_80_4', 'q_n3_word_ordering_80', '感謝いたします', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_81',
    'N3',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「維持」の正しい読み方はどれですか。',
    NULL,
    '【正解】「いじ」
文脈に最も適した選択肢は「いじ」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_81_1', 'q_n3_multiple_choice_81', 'いじ', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_81_2', 'q_n3_multiple_choice_81', 'ゆじ', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_81_3', 'q_n3_multiple_choice_81', 'いし', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_81_4', 'q_n3_multiple_choice_81', 'ゆうじ', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_82',
    'N3',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「（規則＝きそく）」を守ることは大切だ。下線部の同義語は？',
    NULL,
    '【正解】「ルール」
文脈に最も適した選択肢は「ルール」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_82_1', 'q_n3_gap_fill_82', 'ルール', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_82_2', 'q_n3_gap_fill_82', 'アイデア', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_82_3', 'q_n3_gap_fill_82', 'スケジュール', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_82_4', 'q_n3_gap_fill_82', 'マナー', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_83',
    'N3',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「努力」の読み方をひらがなで書いてください。',
    '["どりょく","努力","ドリョク","doryoku"]',
    '【正解】「どりょく」
「努力」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_84',
    'N3',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The factory resumed production after inspection.)',
    NULL,
    '【正解の文】「工場は 点検の後に 生産を 再開した」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_84_1', 'q_n3_word_ordering_84', '工場は', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_84_2', 'q_n3_word_ordering_84', '点検の後に', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_84_3', 'q_n3_word_ordering_84', '生産を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_84_4', 'q_n3_word_ordering_84', '再開した', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_85',
    'N3',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「象徴」の正しい読み方はどれですか。',
    NULL,
    '【正解】「しょうちょう」
文脈に最も適した選択肢は「しょうちょう」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_85_1', 'q_n3_multiple_choice_85', 'しょうちょう', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_85_2', 'q_n3_multiple_choice_85', 'ぞうちょう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_85_3', 'q_n3_multiple_choice_85', 'しょうじょう', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_85_4', 'q_n3_multiple_choice_85', 'ぞうじょう', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_86',
    'N3',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「（冷静＝れいせい）」の対義語として適切なものはどれか。',
    NULL,
    '【正解】「興奮」
文脈に最も適した選択肢は「興奮」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_86_1', 'q_n3_gap_fill_86', '興奮', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_86_2', 'q_n3_gap_fill_86', '緊張', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_86_3', 'q_n3_gap_fill_86', '混乱', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_86_4', 'q_n3_gap_fill_86', '軽率', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_87',
    'N3',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「効率」の読み方をひらがなで書いてください。',
    '["こうりつ","効率","コウリツ","kouritsu","koritsu"]',
    '【正解】「こうりつ」
「効率」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_88',
    'N3',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The new policy had a major impact on society.)',
    NULL,
    '【正解の文】「新方針は 社会に 大きな影響を 与えた」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_88_1', 'q_n3_word_ordering_88', '新方針は', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_88_2', 'q_n3_word_ordering_88', '社会に', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_88_3', 'q_n3_word_ordering_88', '大きな影響を', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_88_4', 'q_n3_word_ordering_88', '与えた', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_89',
    'N3',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「傾向」の正しい読み方はどれですか。',
    NULL,
    '【正解】「けいこう」
文脈に最も適した選択肢は「けいこう」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_89_1', 'q_n3_multiple_choice_89', 'けいこう', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_89_2', 'q_n3_multiple_choice_89', 'げいこう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_89_3', 'q_n3_multiple_choice_89', 'けいごう', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_89_4', 'q_n3_multiple_choice_89', 'けんこう', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_90',
    'N3',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「環境を（保護＝ほご）する」の「保護」の意味は？',
    NULL,
    '【正解】「守ること」
文脈に最も適した選択肢は「守ること」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_90_1', 'q_n3_gap_fill_90', '守ること', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_90_2', 'q_n3_gap_fill_90', '壊すこと', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_90_3', 'q_n3_gap_fill_90', '調べること', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_90_4', 'q_n3_gap_fill_90', '変えること', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_91',
    'N3',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「謙虚」の読み方をひらがなで書いてください。',
    '["けんきょ","謙虚","ケンキョ","kenkyo"]',
    '【正解】「けんきょ」
「謙虚」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_92',
    'N3',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Natural resources must be used carefully.)',
    NULL,
    '【正解の文】「天然資源を 大切に 消費しなければ ならない」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_92_1', 'q_n3_word_ordering_92', '天然資源を', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_92_2', 'q_n3_word_ordering_92', '大切に', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_92_3', 'q_n3_word_ordering_92', '消費しなければ', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_92_4', 'q_n3_word_ordering_92', 'ならない', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_93',
    'N3',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「曖昧」の正しい読み方はどれですか。',
    NULL,
    '【正解】「あいまい」
文脈に最も適した選択肢は「あいまい」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_93_1', 'q_n3_multiple_choice_93', 'あいまい', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_93_2', 'q_n3_multiple_choice_93', 'あんまい', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_93_3', 'q_n3_multiple_choice_93', 'あいみ', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_93_4', 'q_n3_multiple_choice_93', 'めいまい', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_94',
    'N3',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「（具体的＝ぐたいてき）」の反対語はどれですか。',
    NULL,
    '【正解】「抽象的」
文脈に最も適した選択肢は「抽象的」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_94_1', 'q_n3_gap_fill_94', '抽象的', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_94_2', 'q_n3_gap_fill_94', '批判的', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_94_3', 'q_n3_gap_fill_94', '主観的', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_94_4', 'q_n3_gap_fill_94', '消極的', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_95',
    'N3',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「柔軟」の読み方をひらがなで書いてください。',
    '["じゅうなん","柔軟","ジュウナン","juunan","jyunan","junan"]',
    '【正解】「じゅうなん」
「柔軟」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_96',
    'N3',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Traffic restrictions were enforced downtown.)',
    NULL,
    '【正解の文】「今日から 都心で 交通規制が 実施された」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_96_1', 'q_n3_word_ordering_96', '今日から', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_96_2', 'q_n3_word_ordering_96', '都心で', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_96_3', 'q_n3_word_ordering_96', '交通規制が', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_96_4', 'q_n3_word_ordering_96', '実施された', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_97',
    'N3',
    'kanji',
    'multiple_choice',
    'Choose the correct option.',
    '「妥協」の正しい読み方はどれですか。',
    NULL,
    '【正解】「だきょう」
文脈に最も適した選択肢は「だきょう」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_97_1', 'q_n3_multiple_choice_97', 'だきょう', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_97_2', 'q_n3_multiple_choice_97', 'たいきょう', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_97_3', 'q_n3_multiple_choice_97', 'たきょう', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_97_4', 'q_n3_multiple_choice_97', 'だこう', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_98',
    'N3',
    'kanji',
    'gap_fill',
    'Fill in the blank.',
    '「（莫大＝ばくだい）」な費用の意味は？',
    NULL,
    '【正解】「非常に大きい」
文脈に最も適した選択肢は「非常に大きい」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_98_1', 'q_n3_gap_fill_98', '非常に大きい', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_98_2', 'q_n3_gap_fill_98', 'とても小さい', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_98_3', 'q_n3_gap_fill_98', 'ちょうどよい', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_98_4', 'q_n3_gap_fill_98', '不足している', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_99',
    'N3',
    'kanji',
    'typing',
    'Type the correct answer.',
    '「把握」の読み方をひらがなで書いてください。',
    '["はあく","把握","ハアク","haaku","haku"]',
    '【正解】「はあく」
「把握」の読み方をひらがなで書いてください。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_100',
    'N3',
    'kanji',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The experiment produced unexpected results.)',
    NULL,
    '【正解の文】「実験によって 予期せぬ結果が もたらされた」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_100_1', 'q_n3_word_ordering_100', '実験によって', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_100_2', 'q_n3_word_ordering_100', '予期せぬ結果が', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_100_3', 'q_n3_word_ordering_100', 'もたらされた', 1, 2);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_101',
    'N3',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '忙しい（ ）、手伝ってくれてありがとう。',
    NULL,
    '【正解】「ところを」
文脈に最も適した選択肢は「ところを」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_101_1', 'q_n3_multiple_choice_101', 'ところに', 0, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_101_2', 'q_n3_multiple_choice_101', 'ところで', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_101_3', 'q_n3_multiple_choice_101', 'ところへ', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_101_4', 'q_n3_multiple_choice_101', 'ところを', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_102',
    'N3',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '彼はお金持ちだが、必ずしも幸せな（ ）。',
    NULL,
    '【正解】「わけではない」
文脈に最も適した選択肢は「わけではない」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_102_1', 'q_n3_gap_fill_102', 'わけではない', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_102_2', 'q_n3_gap_fill_102', 'はずがない', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_102_3', 'q_n3_gap_fill_102', 'わけがない', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_102_4', 'q_n3_gap_fill_102', 'に違いない', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_103',
    'N3',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「この薬を飲めば飲む（ ）効き目が弱くなる。」の平仮名2文字を入れなさい。',
    '["ほど","hodo"]',
    '【正解】「ほど」
「この薬を飲めば飲む（ ）効き目が弱くなる。」の平仮名2文字を入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_104',
    'N3',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Finish it while the coffee is hot.)',
    NULL,
    '【正解の文】「コーヒーが 温かいうちに 飲んで ください」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_104_1', 'q_n3_word_ordering_104', 'コーヒーが', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_104_2', 'q_n3_word_ordering_104', '温かいうちに', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_104_3', 'q_n3_word_ordering_104', '飲んで', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_104_4', 'q_n3_word_ordering_104', 'ください', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_105',
    'N3',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '祖父は80歳である（ ）、足腰がとても丈夫だ。',
    NULL,
    '【正解】「にもかかわらず」
文脈に最も適した選択肢は「にもかかわらず」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_105_1', 'q_n3_multiple_choice_105', 'にもかかわらず', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_105_2', 'q_n3_multiple_choice_105', 'にしたがって', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_105_3', 'q_n3_multiple_choice_105', 'につれて', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_105_4', 'q_n3_multiple_choice_105', 'にとって', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_106',
    'N3',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '会議の資料は事前に目を通して（ ）べきだ。',
    NULL,
    '【正解】「おく」
文脈に最も適した選択肢は「おく」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_106_1', 'q_n3_gap_fill_106', 'おく', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_106_2', 'q_n3_gap_fill_106', 'ある', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_106_3', 'q_n3_gap_fill_106', 'いる', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_106_4', 'q_n3_gap_fill_106', 'みる', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_107',
    'N3',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「日本に滞在してい（ ）間に、富士山に登りたい。」の平仮名1文字を入れなさい。',
    '["る","ru"]',
    '【正解】「る」
「日本に滞在してい（ ）間に、富士山に登りたい。」の平仮名1文字を入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_108',
    'N3',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (The price is cheap relative to its high quality.)',
    NULL,
    '【正解の文】「品質が 高い わりに 値段が安い」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_108_1', 'q_n3_word_ordering_108', '品質が', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_108_2', 'q_n3_word_ordering_108', '高い', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_108_3', 'q_n3_word_ordering_108', 'わりに', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_108_4', 'q_n3_word_ordering_108', '値段が安い', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_109',
    'N3',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '彼の説明は初心者（ ）わかりやすかった。',
    NULL,
    '【正解】「にしては」
文脈に最も適した選択肢は「にしては」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_109_1', 'q_n3_multiple_choice_109', 'にしては', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_109_2', 'q_n3_multiple_choice_109', 'にかんして', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_109_3', 'q_n3_multiple_choice_109', 'にたいして', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_109_4', 'q_n3_multiple_choice_109', 'について', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_110',
    'N3',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '先生のアドバイスの（ ）勉強したら成績が伸びた。',
    NULL,
    '【正解】「とおりに」
文脈に最も適した選択肢は「とおりに」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_110_1', 'q_n3_gap_fill_110', 'とおりに', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_110_2', 'q_n3_gap_fill_110', 'ままに', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_110_3', 'q_n3_gap_fill_110', 'ほどに', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_110_4', 'q_n3_gap_fill_110', 'ように', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_111',
    'N3',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「山田さんに（ ）は、明日の会議で報告します。」の平仮名3文字を入れなさい。',
    '["ついて","tsuite"]',
    '【正解】「ついて」
「山田さんに（ ）は、明日の会議で報告します。」の平仮名3文字を入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_112',
    'N3',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (He acts as if he knows everything.)',
    NULL,
    '【正解の文】「彼は 何でも 知っている かのように 話す」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_112_1', 'q_n3_word_ordering_112', '彼は', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_112_2', 'q_n3_word_ordering_112', '何でも', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_112_3', 'q_n3_word_ordering_112', '知っている', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_112_4', 'q_n3_word_ordering_112', 'かのように', 1, 3);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_112_5', 'q_n3_word_ordering_112', '話す', 1, 4);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_113',
    'N3',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '子供（ ）公園で静かに遊ぶのは難しい。',
    NULL,
    '【正解】「にとって」
文脈に最も適した選択肢は「にとって」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_113_1', 'q_n3_multiple_choice_113', 'にとって', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_113_2', 'q_n3_multiple_choice_113', 'として', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_113_3', 'q_n3_multiple_choice_113', 'によって', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_113_4', 'q_n3_multiple_choice_113', 'に対して', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_114',
    'N3',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    'この靴はデザインが素敵な（ ）、歩きやすい。',
    NULL,
    '【正解】「うえに」
文脈に最も適した選択肢は「うえに」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_114_1', 'q_n3_gap_fill_114', 'うえに', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_114_2', 'q_n3_gap_fill_114', 'からに', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_114_3', 'q_n3_gap_fill_114', 'わりに', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_114_4', 'q_n3_gap_fill_114', 'くせに', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_115',
    'N3',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「台風の影響（ ）、電車が止まりました。」の助詞・接続平仮名2文字を入れなさい。',
    '["で","により","de","niyori"]',
    '【正解】「で」
「台風の影響（ ）、電車が止まりました。」の助詞・接続平仮名2文字を入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_116',
    'N3',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Don''t decide until you consult your family.)',
    NULL,
    '【正解の文】「家族と 相談した 上で 決めてください」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_116_1', 'q_n3_word_ordering_116', '家族と', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_116_2', 'q_n3_word_ordering_116', '相談した', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_116_3', 'q_n3_word_ordering_116', '上で', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_116_4', 'q_n3_word_ordering_116', '決めてください', 1, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_multiple_choice_117',
    'N3',
    'grammar',
    'multiple_choice',
    'Choose the correct option.',
    '練習を重ねる（ ）、次第に上達してきた。',
    NULL,
    '【正解】「につれて」
文脈に最も適した選択肢は「につれて」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_117_1', 'q_n3_multiple_choice_117', 'につれて', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_117_2', 'q_n3_multiple_choice_117', 'について', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_117_3', 'q_n3_multiple_choice_117', 'にたいして', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_multiple_choice_117_4', 'q_n3_multiple_choice_117', 'に反して', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_gap_fill_118',
    'N3',
    'grammar',
    'gap_fill',
    'Fill in the blank.',
    '熱がある（ ）、無理をして出勤した。',
    NULL,
    '【正解】「のに」
文脈に最も適した選択肢は「のに」です。前後の接続や文法規則を確認しましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_118_1', 'q_n3_gap_fill_118', 'のに', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_118_2', 'q_n3_gap_fill_118', 'から', 0, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_118_3', 'q_n3_gap_fill_118', 'ので', 0, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_gap_fill_118_4', 'q_n3_gap_fill_118', 'ため', 0, 3);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_typing_119',
    'N3',
    'grammar',
    'typing',
    'Type the correct answer.',
    '「一度決めた（ ）は、最後までやり抜くべきだ。」の平仮名2文字を入れなさい。',
    '["から","kara"]',
    '【正解】「から」
「一度決めた（ ）は、最後までやり抜くべきだ。」の平仮名2文字を入れなさい。に対する正しい表記です。漢字の読み書きと意味をしっかり確認しておきましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO questions (id, level, category, format, prompt, prompt_ja, accepted_answers, explanation, is_active, created_at)
VALUES (
    'q_n3_word_ordering_120',
    'N3',
    'grammar',
    'word_ordering',
    'Arrange the words in the correct order.',
    'Put in order: (Whether we go depends on tomorrow''s weather.)',
    NULL,
    '【正解の文】「明日の 天気 次第で 決めましょう」
文法構造と助詞の接続順序に注意して、正しい文を組み立てましょう。',
    1,
    strftime('%s', 'now')
);

INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_120_1', 'q_n3_word_ordering_120', '明日の', 1, 0);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_120_2', 'q_n3_word_ordering_120', '天気', 1, 1);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_120_3', 'q_n3_word_ordering_120', '次第で', 1, 2);
INSERT INTO choices (id, question_id, text, is_correct, "order")
VALUES ('c_q_n3_word_ordering_120_4', 'q_n3_word_ordering_120', '決めましょう', 1, 3);
