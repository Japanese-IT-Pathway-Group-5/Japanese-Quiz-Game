CREATE INDEX `choices_question_id_idx` ON `choices` (`question_id`);
--> statement-breakpoint
CREATE INDEX `quiz_attempts_status_level_idx` ON `quiz_attempts` (`status`, `level`);
--> statement-breakpoint
CREATE INDEX `attempt_answers_attempt_question_idx` ON `attempt_answers` (`attempt_id`, `question_id`);
