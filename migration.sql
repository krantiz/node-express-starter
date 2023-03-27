CREATE TABLE `user_feedback_mapping` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint(20) UNSIGNED,
  `teacher_id` bigint(20) UNSIGNED,
  `topic_id` int NOT NULL,
  `subtopic_id` int NOT NULL,
  `feedback_type` varchar(255) NOT NULL,
  `feedback_value` varchar(255) NOT NULL,
  `text_value` varchar(1000),
  `viewed` tinyint NOT NULL DEFAULT false,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES wp_users(ID),
  FOREIGN KEY (teacher_id) REFERENCES wp_users(ID)
);