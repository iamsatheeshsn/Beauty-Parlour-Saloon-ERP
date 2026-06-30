CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `subject_type`, `subject_id`, `description`, `properties`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 06:21:52', '2026-06-29 06:21:52'),
(2, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 06:24:26', '2026-06-29 06:24:26'),
(3, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 06:24:29', '2026-06-29 06:24:29'),
(4, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 06:36:21', '2026-06-29 06:36:21'),
(5, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 06:36:50', '2026-06-29 06:36:50'),
(6, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 07:02:00', '2026-06-29 07:02:00'),
(7, 4, 'login', 'App\\Models\\User', 4, 'User Beauty Specialist logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 07:02:01', '2026-06-29 07:02:01'),
(8, 1, 'update', 'App\\Models\\Setting', 7, 'Update Setting: primary_color', '{\"resource\":\"Setting\",\"id\":7}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:06:46', '2026-06-29 07:06:46'),
(9, 1, 'update', 'App\\Models\\Setting', 7, 'Update Setting: primary_color', '{\"resource\":\"Setting\",\"id\":7}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:07:30', '2026-06-29 07:07:30'),
(10, 1, 'create', 'App\\Models\\Branch', 3, 'Create Branch: Kane Fitzpatrick', '{\"resource\":\"Branch\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:08:56', '2026-06-29 07:08:56'),
(11, 1, 'delete', 'App\\Models\\Branch', 3, 'Delete Branch: Kane Fitzpatrick', '{\"resource\":\"Branch\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:09:09', '2026-06-29 07:09:09'),
(12, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 07:47:09', '2026-06-29 07:47:09'),
(13, 1, 'update', 'App\\Models\\Setting', 7, 'Update Setting: primary_color', '{\"resource\":\"Setting\",\"id\":7}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:48:18', '2026-06-29 07:48:18'),
(14, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:48:34', '2026-06-29 07:48:34'),
(15, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:48:36', '2026-06-29 07:48:36'),
(16, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:48:50', '2026-06-29 07:48:50'),
(17, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:48:53', '2026-06-29 07:48:53'),
(18, 1, 'update', 'App\\Models\\Setting', 7, 'Update Setting: primary_color', '{\"resource\":\"Setting\",\"id\":7}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 07:49:38', '2026-06-29 07:49:38'),
(19, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 08:00:31', '2026-06-29 08:00:31'),
(20, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 08:01:50', '2026-06-29 08:01:50'),
(21, 1, 'create', 'App\\Models\\Customer', 1, 'Create Customer: Fatima Al Mansoori', '{\"resource\":\"Customer\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 08:01:51', '2026-06-29 08:01:51'),
(22, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 09:18:46', '2026-06-29 09:18:46'),
(23, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 09:19:11', '2026-06-29 09:19:11'),
(24, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 09:19:13', '2026-06-29 09:19:13'),
(25, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 09:23:43', '2026-06-29 09:23:43'),
(26, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-29 09:31:07', '2026-06-29 09:31:07'),
(27, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 10:03:50', '2026-06-29 10:03:50'),
(28, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 10:03:52', '2026-06-29 10:03:52'),
(29, 1, 'update', 'Spatie\\Permission\\Models\\Role', 2, 'Update role: admin', '{\"resource\":\"Role\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-29 10:07:02', '2026-06-29 10:07:02'),
(30, 1, 'update', 'App\\Models\\Setting', 6, 'Update Setting: vat_enabled', '{\"resource\":\"Setting\",\"id\":6}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 02:41:37', '2026-06-30 02:41:37'),
(31, 1, 'update', 'App\\Models\\Setting', 5, 'Update Setting: vat_rate', '{\"resource\":\"Setting\",\"id\":5}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 02:41:37', '2026-06-30 02:41:37'),
(32, 1, 'update', 'App\\Models\\Customer', 2, 'Update customer package CPKG0002', '{\"resource\":\"CustomerPackage\",\"id\":6,\"code\":\"CPKG0002\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 03:49:22', '2026-06-30 03:49:22'),
(33, 1, 'create', 'App\\Models\\Customer', 2, 'Completed POS sale INV2026-00001', '{\"resource\":\"Sale\",\"id\":13,\"code\":\"INV2026-00001\",\"visit_id\":18}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 03:49:22', '2026-06-30 03:49:22'),
(34, 1, 'create', 'App\\Models\\Customer', 11, 'Create Customer: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:05:23', '2026-06-30 04:05:23'),
(35, 1, 'update', 'App\\Models\\Customer', 11, 'Updated customer photo: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:05:39', '2026-06-30 04:05:39'),
(36, 1, 'update', 'App\\Models\\Customer', 11, 'Updated customer photo: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:11:23', '2026-06-30 04:11:23'),
(37, 1, 'update', 'App\\Models\\Customer', 11, 'Updated customer photo: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:11:26', '2026-06-30 04:11:26'),
(38, 1, 'update', 'App\\Models\\Customer', 11, 'Update Customer: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:11:38', '2026-06-30 04:11:38'),
(39, 1, 'update', 'App\\Models\\Customer', 11, 'Update Customer: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:11:42', '2026-06-30 04:11:42'),
(40, 1, 'update', 'App\\Models\\Customer', 11, 'Update Customer: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:11:56', '2026-06-30 04:11:56'),
(41, 1, 'update', 'App\\Models\\Customer', 11, 'Update Customer: Jennifer Lopez', '{\"resource\":\"Customer\",\"id\":11}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:11:57', '2026-06-30 04:11:57'),
(42, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:13:17', '2026-06-30 04:13:17'),
(43, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:13:22', '2026-06-30 04:13:22'),
(44, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.9.16 Chrome/144.0.7559.236 Electron/40.10.3 Safari/537.36', '2026-06-30 04:50:20', '2026-06-30 04:50:20'),
(45, 1, 'update', 'App\\Models\\SalonService', 1, 'Updated service image: Women\'s Haircut & Blow-dry', '{\"resource\":\"SalonService\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:55:55', '2026-06-30 04:55:55'),
(46, 1, 'update', 'App\\Models\\SalonService', 1, 'Update Salon Service: Women\'s Haircut & Blow-dry', '{\"resource\":\"Salon Service\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:55:57', '2026-06-30 04:55:57'),
(47, 1, 'update', 'App\\Models\\SalonService', 2, 'Updated service image: Balayage / Highlights', '{\"resource\":\"SalonService\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:56:29', '2026-06-30 04:56:29'),
(48, 1, 'update', 'App\\Models\\SalonService', 2, 'Update Salon Service: Balayage / Highlights', '{\"resource\":\"Salon Service\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:56:32', '2026-06-30 04:56:32'),
(49, 1, 'update', 'App\\Models\\SalonService', 2, 'Updated service image: Balayage / Highlights', '{\"resource\":\"SalonService\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:57:47', '2026-06-30 04:57:47'),
(50, 1, 'update', 'App\\Models\\SalonService', 2, 'Update Salon Service: Balayage / Highlights', '{\"resource\":\"Salon Service\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:57:49', '2026-06-30 04:57:49'),
(51, 1, 'update', 'App\\Models\\SalonService', 3, 'Updated service image: Keratin Treatment', '{\"resource\":\"SalonService\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:58:02', '2026-06-30 04:58:02'),
(52, 1, 'update', 'App\\Models\\SalonService', 3, 'Update Salon Service: Keratin Treatment', '{\"resource\":\"Salon Service\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:58:04', '2026-06-30 04:58:04'),
(53, 1, 'update', 'App\\Models\\SalonService', 12, 'Updated service image: Full Leg Wax', '{\"resource\":\"SalonService\",\"id\":12}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:59:41', '2026-06-30 04:59:41'),
(54, 1, 'update', 'App\\Models\\SalonService', 12, 'Update Salon Service: Full Leg Wax', '{\"resource\":\"Salon Service\",\"id\":12}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 04:59:43', '2026-06-30 04:59:43'),
(55, 1, 'update', 'App\\Models\\SalonService', 13, 'Updated service image: Eyebrow Threading', '{\"resource\":\"SalonService\",\"id\":13}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 05:00:49', '2026-06-30 05:00:49'),
(56, 1, 'update', 'App\\Models\\SalonService', 13, 'Update Salon Service: Eyebrow Threading', '{\"resource\":\"Salon Service\",\"id\":13}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 05:00:51', '2026-06-30 05:00:51'),
(57, 1, 'update', 'App\\Models\\Setting', 15, 'Update Setting: public_email', '{\"resource\":\"Setting\",\"id\":15}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 05:03:49', '2026-06-30 05:03:49'),
(58, 1, 'update', 'App\\Models\\Setting', 15, 'Update Setting: public_email', '{\"resource\":\"Setting\",\"id\":15}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 05:03:57', '2026-06-30 05:03:57'),
(59, 1, 'update', 'App\\Models\\Setting', 26, 'Update Setting: homepage_team_ids', '{\"resource\":\"Setting\",\"id\":26}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:00:43', '2026-06-30 06:00:43'),
(60, 1, 'update', 'App\\Models\\Setting', 26, 'Update Setting: homepage_team_ids', '{\"resource\":\"Setting\",\"id\":26}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:01:11', '2026-06-30 06:01:11'),
(61, 1, 'update', 'App\\Models\\Product', 8, 'Updated product image: Keratin Leave-In Serum 100ml', '{\"resource\":\"Product\",\"id\":8}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:15:28', '2026-06-30 06:15:28'),
(62, 1, 'update', 'App\\Models\\Product', 8, 'Update Product: Keratin Leave-In Serum 100ml', '{\"resource\":\"Product\",\"id\":8}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:15:30', '2026-06-30 06:15:30'),
(63, 1, 'update', 'App\\Models\\WebsiteInquiry', 1, 'Updated inquiry status: INQ0001 → read', '{\"resource\":\"WebsiteInquiry\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:34:36', '2026-06-30 06:34:36'),
(64, 1, 'update', 'App\\Models\\WebsiteInquiry', 1, 'Updated inquiry status: INQ0001 → responded', '{\"resource\":\"WebsiteInquiry\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:34:41', '2026-06-30 06:34:41'),
(65, NULL, 'create', 'App\\Models\\Customer', 12, 'Create Customer: Brianna Ayala', '{\"resource\":\"Customer\",\"id\":12}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:41:20', '2026-06-30 06:41:20'),
(66, NULL, 'create', 'App\\Models\\Customer', 12, 'Create appointment APPT0007', '{\"resource\":\"Appointment\",\"id\":7,\"code\":\"APPT0007\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 06:41:20', '2026-06-30 06:41:20'),
(67, 1, 'update', 'App\\Models\\GalleryItem', 1, 'Updated gallery image', '{\"resource\":\"GalleryItem\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:29:50', '2026-06-30 08:29:50'),
(68, 1, 'update', 'App\\Models\\GalleryItem', 1, 'Gallery item: Gallery 1', '{\"resource\":\"GalleryItem\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:29:51', '2026-06-30 08:29:51'),
(69, 1, 'update', 'App\\Models\\GalleryItem', 4, 'Updated gallery image', '{\"resource\":\"GalleryItem\",\"id\":4}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:30:16', '2026-06-30 08:30:16'),
(70, 1, 'update', 'App\\Models\\GalleryItem', 4, 'Gallery item: Gallery 4', '{\"resource\":\"GalleryItem\",\"id\":4}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:30:17', '2026-06-30 08:30:17'),
(71, 1, 'update', 'App\\Models\\GalleryItem', 6, 'Updated gallery image', '{\"resource\":\"GalleryItem\",\"id\":6}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:30:38', '2026-06-30 08:30:38'),
(72, 1, 'update', 'App\\Models\\GalleryItem', 6, 'Gallery item: Gallery 6', '{\"resource\":\"GalleryItem\",\"id\":6}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:30:39', '2026-06-30 08:30:39'),
(73, 1, 'update', 'App\\Models\\GalleryItem', 5, 'Updated gallery image', '{\"resource\":\"GalleryItem\",\"id\":5}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:31:11', '2026-06-30 08:31:11'),
(74, 1, 'update', 'App\\Models\\GalleryItem', 5, 'Gallery item: Gallery 5', '{\"resource\":\"GalleryItem\",\"id\":5}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:31:12', '2026-06-30 08:31:12'),
(75, 1, 'update', 'App\\Models\\GalleryItem', 3, 'Updated gallery image', '{\"resource\":\"GalleryItem\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:31:41', '2026-06-30 08:31:41'),
(76, 1, 'update', 'App\\Models\\GalleryItem', 3, 'Gallery item: Gallery 3', '{\"resource\":\"GalleryItem\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:31:42', '2026-06-30 08:31:42'),
(77, 1, 'update', 'App\\Models\\GalleryItem', 2, 'Updated gallery image', '{\"resource\":\"GalleryItem\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:33:29', '2026-06-30 08:33:29'),
(78, 1, 'update', 'App\\Models\\GalleryItem', 2, 'Gallery item: Gallery 2', '{\"resource\":\"GalleryItem\",\"id\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:33:31', '2026-06-30 08:33:31'),
(79, 1, 'update', 'App\\Models\\BlogPost', 1, 'Blog post: Summer Hair Care Tips for Dubai\'s Climate.', '{\"resource\":\"BlogPost\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:34:37', '2026-06-30 08:34:37'),
(80, 1, 'update', 'App\\Models\\BlogPost', 1, 'Blog post: Summer Hair Care Tips for Dubai\'s Climate', '{\"resource\":\"BlogPost\",\"id\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:34:57', '2026-06-30 08:34:57'),
(81, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:49:43', '2026-06-30 08:49:43'),
(82, 2, 'login', 'App\\Models\\User', 2, 'User System Admin logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:50:04', '2026-06-30 08:50:04'),
(83, 2, 'logout', 'App\\Models\\User', 2, 'User System Admin logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:50:41', '2026-06-30 08:50:41'),
(84, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:50:52', '2026-06-30 08:50:52'),
(85, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:52:11', '2026-06-30 08:52:11'),
(86, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 08:52:13', '2026-06-30 08:52:13'),
(87, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:02:56', '2026-06-30 09:02:56'),
(88, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:02:58', '2026-06-30 09:02:58'),
(89, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:03:32', '2026-06-30 09:03:32'),
(90, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:03:41', '2026-06-30 09:03:41'),
(91, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:04:00', '2026-06-30 09:04:00'),
(92, 4, 'login', 'App\\Models\\User', 4, 'User Beauty Specialist logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-30 09:08:08', '2026-06-30 09:08:08'),
(93, 4, 'login', 'App\\Models\\User', 4, 'User Beauty Specialist logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-30 09:08:29', '2026-06-30 09:08:29'),
(94, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.9.16 Chrome/144.0.7559.236 Electron/40.10.3 Safari/537.36', '2026-06-30 09:08:52', '2026-06-30 09:08:52'),
(95, 4, 'login', 'App\\Models\\User', 4, 'User Beauty Specialist logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.9.16 Chrome/144.0.7559.236 Electron/40.10.3 Safari/537.36', '2026-06-30 09:09:08', '2026-06-30 09:09:08'),
(96, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:12:17', '2026-06-30 09:12:17'),
(97, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:12:28', '2026-06-30 09:12:28'),
(98, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:13:13', '2026-06-30 09:13:13'),
(99, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:13:27', '2026-06-30 09:13:27'),
(100, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:13:30', '2026-06-30 09:13:30'),
(101, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:13:39', '2026-06-30 09:13:39'),
(102, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:13:42', '2026-06-30 09:13:42'),
(103, 1, 'update', 'Spatie\\Permission\\Models\\Role', 3, 'Update role: receptionist', '{\"resource\":\"Role\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:14:44', '2026-06-30 09:14:44'),
(104, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:14:46', '2026-06-30 09:14:46'),
(105, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:14:52', '2026-06-30 09:14:52'),
(106, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:15:11', '2026-06-30 09:15:11'),
(107, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:15:13', '2026-06-30 09:15:13'),
(108, 1, 'update', 'Spatie\\Permission\\Models\\Role', 3, 'Update role: receptionist', '{\"resource\":\"Role\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:16:11', '2026-06-30 09:16:11'),
(109, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:16:13', '2026-06-30 09:16:13'),
(110, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:16:18', '2026-06-30 09:16:18'),
(111, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:16:24', '2026-06-30 09:16:24'),
(112, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:16:27', '2026-06-30 09:16:27'),
(113, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:21:56', '2026-06-30 09:21:56'),
(114, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:21:58', '2026-06-30 09:21:58'),
(115, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:22:14', '2026-06-30 09:22:14'),
(116, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:22:21', '2026-06-30 09:22:21'),
(117, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:22:36', '2026-06-30 09:22:36'),
(118, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:22:38', '2026-06-30 09:22:38'),
(119, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-30 09:25:34', '2026-06-30 09:25:34'),
(120, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-30 09:25:50', '2026-06-30 09:25:50'),
(121, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8655', '2026-06-30 09:26:01', '2026-06-30 09:26:01'),
(122, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:33:24', '2026-06-30 09:33:24'),
(123, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:33:33', '2026-06-30 09:33:33'),
(124, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:33:46', '2026-06-30 09:33:46'),
(125, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:33:47', '2026-06-30 09:33:47'),
(126, 1, 'update', 'Spatie\\Permission\\Models\\Role', 3, 'Update role: receptionist', '{\"resource\":\"Role\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:33:59', '2026-06-30 09:33:59'),
(127, 1, 'update', 'Spatie\\Permission\\Models\\Role', 3, 'Update role: receptionist', '{\"resource\":\"Role\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:34:02', '2026-06-30 09:34:02'),
(128, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:34:04', '2026-06-30 09:34:04'),
(129, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:34:15', '2026-06-30 09:34:15'),
(130, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:36:16', '2026-06-30 09:36:16'),
(131, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:36:17', '2026-06-30 09:36:17'),
(132, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:38:42', '2026-06-30 09:38:42'),
(133, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:38:43', '2026-06-30 09:38:43'),
(134, 1, 'update', 'Spatie\\Permission\\Models\\Role', 3, 'Update role: receptionist', '{\"resource\":\"Role\",\"id\":3}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:22', '2026-06-30 09:42:22'),
(135, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:24', '2026-06-30 09:42:24'),
(136, 3, 'login', 'App\\Models\\User', 3, 'User Front Desk logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:29', '2026-06-30 09:42:29'),
(137, 3, 'logout', 'App\\Models\\User', 3, 'User Front Desk logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:32', '2026-06-30 09:42:32'),
(138, 4, 'login', 'App\\Models\\User', 4, 'User Beauty Specialist logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:39', '2026-06-30 09:42:39'),
(139, 4, 'logout', 'App\\Models\\User', 4, 'User Beauty Specialist logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:50', '2026-06-30 09:42:50'),
(140, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:42:52', '2026-06-30 09:42:52'),
(141, 1, 'update', 'Spatie\\Permission\\Models\\Role', 4, 'Update role: staff', '{\"resource\":\"Role\",\"id\":4}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:43:02', '2026-06-30 09:43:02'),
(142, 1, 'logout', 'App\\Models\\User', 1, 'User Salon Owner logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:43:13', '2026-06-30 09:43:13'),
(143, 4, 'login', 'App\\Models\\User', 4, 'User Beauty Specialist logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:43:17', '2026-06-30 09:43:17'),
(144, 4, 'logout', 'App\\Models\\User', 4, 'User Beauty Specialist logged out', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:43:22', '2026-06-30 09:43:22'),
(145, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-30 09:50:58', '2026-06-30 09:50:58'),
(146, 1, 'login', 'App\\Models\\User', 1, 'User Salon Owner logged in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36', '2026-06-30 09:54:46', '2026-06-30 09:54:46');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `staff_id` bigint(20) UNSIGNED DEFAULT NULL,
  `booked_by` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'scheduled',
  `status` varchar(20) NOT NULL DEFAULT 'scheduled',
  `scheduled_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `duration_minutes` smallint(5) UNSIGNED NOT NULL DEFAULT 30,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `checked_in_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `company_id`, `branch_id`, `customer_id`, `staff_id`, `booked_by`, `code`, `type`, `status`, `scheduled_at`, `ends_at`, `duration_minutes`, `total_amount`, `notes`, `cancellation_reason`, `checked_in_at`, `completed_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 4, 3, 'APPT0001', 'walk_in', 'in_progress', '2026-06-29 13:34:26', '2026-06-29 14:34:26', 60, 189.00, NULL, NULL, '2026-06-29 07:59:26', NULL, '2026-06-29 08:34:26', '2026-06-29 08:34:26', NULL),
(2, 1, 1, 2, 4, 3, 'APPT0002', 'scheduled', 'confirmed', '2026-06-29 16:04:26', '2026-06-29 17:04:26', 60, 367.50, NULL, NULL, NULL, NULL, '2026-06-29 08:34:26', '2026-06-29 08:34:26', NULL),
(3, 1, 1, 3, 4, 3, 'APPT0003', 'scheduled', 'scheduled', '2026-06-30 10:00:00', '2026-06-30 13:00:00', 180, 682.50, NULL, NULL, NULL, NULL, '2026-06-29 08:34:26', '2026-06-29 08:34:26', NULL),
(4, 1, 1, 4, 4, 3, 'APPT0004', 'scheduled', 'scheduled', '2026-06-30 14:30:00', '2026-06-30 16:45:00', 135, 393.75, NULL, NULL, NULL, NULL, '2026-06-29 08:34:26', '2026-06-29 08:34:26', NULL),
(5, 1, 1, 1, 4, 3, 'APPT0005', 'scheduled', 'completed', '2026-06-28 11:00:00', '2026-06-28 12:00:00', 60, 336.00, NULL, NULL, '2026-06-28 05:25:00', '2026-06-28 06:30:00', '2026-06-29 08:34:26', '2026-06-29 08:34:26', NULL),
(6, 1, 1, 5, 4, 3, 'APPT0006', 'scheduled', 'cancelled', '2026-07-01 16:00:00', '2026-07-01 17:30:00', 90, 472.50, NULL, 'Customer rescheduled', NULL, NULL, '2026-06-29 08:34:26', '2026-06-29 08:34:26', NULL),
(7, 1, NULL, 12, NULL, NULL, 'APPT0007', 'scheduled', 'scheduled', '2026-07-02 01:04:00', '2026-07-02 06:04:00', 300, 1200.00, 'Website booking: Est libero aute con', NULL, NULL, NULL, '2026-06-30 06:41:20', '2026-06-30 06:41:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `appointment_items`
--

CREATE TABLE `appointment_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `salon_service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `staff_id` bigint(20) UNSIGNED DEFAULT NULL,
  `service_name` varchar(255) NOT NULL,
  `duration_minutes` smallint(5) UNSIGNED NOT NULL DEFAULT 30,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointment_items`
--

INSERT INTO `appointment_items` (`id`, `appointment_id`, `salon_service_id`, `staff_id`, `service_name`, `duration_minutes`, `price`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 4, 'Women\'s Haircut & Blow-dry', 60, 189.00, 1, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(2, 2, 6, 4, 'Hydrating Facial', 60, 367.50, 1, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(3, 3, 2, 4, 'Balayage / Highlights', 180, 682.50, 1, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(4, 4, 5, 4, 'Gel Manicure & Pedicure', 90, 294.00, 1, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(5, 4, 4, 4, 'Classic Manicure', 45, 99.75, 2, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(6, 5, 8, 4, 'Swedish Massage 60 min', 60, 336.00, 1, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(7, 6, 10, 4, 'Evening Glam Makeup', 90, 472.50, 1, '2026-06-29 08:34:26', '2026-06-29 08:34:26'),
(8, 7, 14, NULL, 'Full Day Spa Package', 300, 1200.00, 1, '2026-06-30 06:41:20', '2026-06-30 06:41:20');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` varchar(500) DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `company_id`, `slug`, `title`, `excerpt`, `content`, `featured_image`, `author_name`, `category`, `tags`, `is_published`, `published_at`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'summer-hair-care-tips-dubai', 'Summer Hair Care Tips for Dubai\'s Climate', 'Protect your colour and keep hair hydrated through heat, humidity, and pool season with these salon-approved rituals.', '<p>Dubai summers are beautiful — but harsh on hair. Between sun exposure, air conditioning, and chlorinated pools, even the healthiest strands need extra care.</p>\n<h3>Hydrate from the inside out</h3>\n<p>Increase water intake and use a lightweight leave-in conditioner after every wash. Our stylists recommend a weekly deep-conditioning mask during peak summer months.</p>\n<h3>Shield your colour</h3>\n<p>UV rays fade balayage and highlights faster than you think. Wear a hat or use UV-protective styling products before heading outdoors.</p>\n<h3>Book a trim early</h3>\n<p>Split ends travel quickly in dry heat. A maintenance trim every 6–8 weeks keeps ends fresh and styles polished.</p>\n<p><strong>Ready for a summer refresh?</strong> Book a consultation with our colour team — we\'ll tailor a plan to your hair type and lifestyle.</p>', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80', 'Maya Fernandez', 'Hair Care', '[\"summer\",\"hair\",\"dubai\"]', 1, '2026-06-27 04:03:31', 1, '2026-06-30 04:03:31', '2026-06-30 08:34:57', NULL),
(2, 1, 'benefits-of-gold-facial', 'Why the Gold Facial Is Our Most Requested Treatment', 'Discover how 24K gold-infused skincare delivers radiance, firmness, and a red-carpet glow before your next event.', '<p>The gold facial has become a signature at Luxe Beauty Lounge — and for good reason. This luxurious treatment combines deep cleansing, gentle exfoliation, and gold-enriched serums that brighten dull skin.</p>\n<h3>Instant luminosity</h3>\n<p>Gold particles reflect light beautifully, giving skin an immediate glow that\'s perfect before weddings, galas, or photography sessions.</p>\n<h3>Anti-ageing support</h3>\n<p>Gold is known for its antioxidant properties. Regular sessions can help improve elasticity and reduce the appearance of fine lines over time.</p>\n<h3>Who is it for?</h3>\n<p>Ideal for all skin types seeking hydration and radiance. We customize each session based on a brief skin analysis at the start of your visit.</p>', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80', 'Lina Khoury', 'Skincare', '[\"facial\",\"skincare\",\"gold\"]', 1, '2026-06-22 04:03:31', 2, '2026-06-30 04:03:31', '2026-06-30 04:03:31', NULL),
(3, 1, 'bridal-beauty-timeline', 'The Ultimate Bridal Beauty Timeline', 'From trials to touch-ups — plan your wedding day look with our step-by-step bridal preparation guide.', '<p>Your wedding day deserves flawless beauty — and flawless beauty starts with planning. Here\'s the timeline our bridal specialists recommend.</p>\n<h3>3 months before</h3>\n<p>Book your bridal makeup and hair trial. Bring inspiration photos and discuss your dress neckline, venue lighting, and ceremony timing.</p>\n<h3>1 month before</h3>\n<p>Schedule a hydrating facial and manicure. Avoid major colour changes — focus on healthy, camera-ready skin and nails.</p>\n<h3>1 week before</h3>\n<p>Confirm your day-of schedule with our team. Pack a touch-up kit and arrange transportation to the salon if needed.</p>\n<h3>Wedding day</h3>\n<p>Arrive with clean, product-free skin and dry hair. Our artists will handle the rest — calm, precise, and on schedule.</p>', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80', 'Sara Al Hashimi', 'Bridal', '[\"bridal\",\"wedding\",\"makeup\"]', 1, '2026-06-16 04:03:31', 3, '2026-06-30 04:03:31', '2026-06-30 04:03:31', NULL),
(4, 1, 'self-care-sunday-rituals', 'Self-Care Sunday: Spa Rituals You Can Recreate at Home', 'Extend the salon experience between visits with aromatherapy, scalp massage, and mindful skincare steps.', '<p>Sundays are made for slowing down. While nothing replaces a professional treatment, these rituals help you maintain that post-spa feeling all week.</p>\n<h3>Scalp massage</h3>\n<p>Five minutes of circular massage with a nourishing oil stimulates circulation and eases tension — especially after a long week.</p>\n<h3>At-home face mask</h3>\n<p>Apply a hydrating mask while enjoying herbal tea. Focus on breathing and disconnecting from screens for twenty minutes.</p>\n<h3>Hand and foot care</h3>\n<p>Soak, exfoliate, and moisturize. Even a simple routine keeps nails and skin guest-ready between salon visits.</p>\n<p>When you\'re ready to level up, our Signature Ritual package combines all three in one indulgent session.</p>', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80', 'Noor Rahman', 'Wellness', '[\"spa\",\"wellness\",\"self-care\"]', 1, '2026-06-09 04:03:31', 4, '2026-06-30 04:03:31', '2026-06-30 04:03:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `emirate_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `is_head_office` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `company_id`, `name`, `code`, `email`, `phone`, `address`, `country_id`, `emirate_id`, `city_id`, `postal_code`, `is_head_office`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Dubai Marina — Head Office', 'HQ', 'marina@luxebeauty.ae', '+971 4 123 4567', 'Marina Walk, Dubai Marina', 1, 2, 1, NULL, 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, 'Jumeirah Branch', 'JUM', 'jumeirah@luxebeauty.ae', '+971 4 234 5678', 'Jumeirah Beach Road', 1, 2, 2, NULL, 0, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, 'Kane Fitzpatrick', 'Incididunt dolor quo', 'dodarabixu@mailinator.com', '+1 (895) 869-5367', 'Voluptatem earum do', 1, 2, 6, 'Dolore suscipit dese', 0, 1, '2026-06-29 07:08:56', '2026-06-29 07:09:09', '2026-06-29 07:09:09');

-- --------------------------------------------------------

--
-- Table structure for table `branch_product_stock`
--

CREATE TABLE `branch_product_stock` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity_on_hand` decimal(12,3) NOT NULL DEFAULT 0.000,
  `reorder_level_override` decimal(12,3) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branch_product_stock`
--

INSERT INTO `branch_product_stock` (`id`, `company_id`, `branch_id`, `product_id`, `quantity_on_hand`, `reorder_level_override`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 12.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(2, 1, 1, 2, 18.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(3, 1, 1, 3, 2.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(4, 1, 1, 4, 6.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(5, 1, 1, 5, 24.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(6, 1, 1, 6, 4.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(7, 1, 1, 7, 3.000, NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `company_id`, `name`, `code`, `description`, `website`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'L\'Oréal Professionnel', 'LOREAL', NULL, NULL, 1, 1, '2026-06-29 09:15:23', '2026-06-29 09:15:23', NULL),
(2, 1, 'Wella Professionals', 'WELLA', NULL, NULL, 1, 2, '2026-06-29 09:15:23', '2026-06-29 09:15:23', NULL),
(3, 1, 'Olaplex', 'OLAPLEX', NULL, NULL, 1, 3, '2026-06-29 09:15:23', '2026-06-29 09:15:23', NULL),
(4, 1, 'Dermalogica', 'DERMALOG', NULL, NULL, 1, 4, '2026-06-29 09:15:23', '2026-06-29 09:15:23', NULL),
(5, 1, 'OPI', 'OPI', NULL, NULL, 1, 5, '2026-06-29 09:15:23', '2026-06-29 09:15:23', NULL),
(6, 1, 'House Brand', 'GENERIC', NULL, NULL, 1, 6, '2026-06-29 09:15:23', '2026-06-29 09:15:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('beauty-salon-erp-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:1;', 1782807209),
('beauty-salon-erp-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1782807209;', 1782807209),
('beauty-salon-erp-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:126:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:14:\"dashboard.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:10:\"users.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"users.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:12:\"users.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:12:\"users.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:10:\"roles.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"roles.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:12:\"company.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:14:\"company.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:13:\"branches.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:15:\"branches.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:15:\"branches.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:15:\"branches.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:13:\"settings.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:15:\"settings.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:14:\"countries.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:16:\"countries.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:13:\"emirates.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:15:\"emirates.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:11:\"cities.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:13:\"cities.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:16:\"departments.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:18:\"departments.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:23:\"staff-designations.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:25:\"staff-designations.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:23:\"expense-categories.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:25:\"expense-categories.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:20:\"payment-methods.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:22:\"payment-methods.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:29;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:23:\"service-categories.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:30;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:25:\"service-categories.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:31;a:4:{s:1:\"a\";i:32;s:1:\"b\";s:18:\"activity-logs.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:32;a:4:{s:1:\"a\";i:33;s:1:\"b\";s:14:\"customers.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:33;a:4:{s:1:\"a\";i:34;s:1:\"b\";s:16:\"customers.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:34;a:4:{s:1:\"a\";i:35;s:1:\"b\";s:16:\"customers.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:35;a:4:{s:1:\"a\";i:36;s:1:\"b\";s:16:\"customers.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:36;a:4:{s:1:\"a\";i:37;s:1:\"b\";s:19:\"customer-notes.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:37;a:4:{s:1:\"a\";i:38;s:1:\"b\";s:21:\"customer-notes.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:38;a:4:{s:1:\"a\";i:39;s:1:\"b\";s:21:\"customer-notes.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:39;a:4:{s:1:\"a\";i:40;s:1:\"b\";s:21:\"customer-notes.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:40;a:4:{s:1:\"a\";i:41;s:1:\"b\";s:20:\"customer-visits.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:41;a:4:{s:1:\"a\";i:42;s:1:\"b\";s:22:\"customer-visits.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:42;a:4:{s:1:\"a\";i:43;s:1:\"b\";s:22:\"customer-visits.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:43;a:4:{s:1:\"a\";i:44;s:1:\"b\";s:22:\"customer-visits.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:44;a:4:{s:1:\"a\";i:45;s:1:\"b\";s:10:\"staff.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:45;a:4:{s:1:\"a\";i:46;s:1:\"b\";s:12:\"staff.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:46;a:4:{s:1:\"a\";i:47;s:1:\"b\";s:12:\"staff.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:47;a:4:{s:1:\"a\";i:48;s:1:\"b\";s:12:\"staff.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:48;a:4:{s:1:\"a\";i:49;s:1:\"b\";s:20:\"staff-documents.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:4;}}i:49;a:4:{s:1:\"a\";i:50;s:1:\"b\";s:22:\"staff-documents.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:50;a:4:{s:1:\"a\";i:51;s:1:\"b\";s:22:\"staff-documents.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:51;a:4:{s:1:\"a\";i:52;s:1:\"b\";s:22:\"staff-documents.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:52;a:4:{s:1:\"a\";i:53;s:1:\"b\";s:17:\"staff-salary.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:4;}}i:53;a:4:{s:1:\"a\";i:54;s:1:\"b\";s:19:\"staff-salary.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:54;a:4:{s:1:\"a\";i:55;s:1:\"b\";s:19:\"staff-salary.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:55;a:4:{s:1:\"a\";i:56;s:1:\"b\";s:19:\"staff-salary.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:56;a:4:{s:1:\"a\";i:57;s:1:\"b\";s:21:\"staff-attendance.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:57;a:4:{s:1:\"a\";i:58;s:1:\"b\";s:23:\"staff-attendance.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:58;a:4:{s:1:\"a\";i:59;s:1:\"b\";s:23:\"staff-attendance.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:59;a:4:{s:1:\"a\";i:60;s:1:\"b\";s:23:\"staff-attendance.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:60;a:4:{s:1:\"a\";i:61;s:1:\"b\";s:16:\"staff-leave.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:61;a:4:{s:1:\"a\";i:62;s:1:\"b\";s:18:\"staff-leave.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:62;a:4:{s:1:\"a\";i:63;s:1:\"b\";s:18:\"staff-leave.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:63;a:4:{s:1:\"a\";i:64;s:1:\"b\";s:18:\"staff-leave.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:64;a:4:{s:1:\"a\";i:65;s:1:\"b\";s:21:\"staff-commission.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:4;}}i:65;a:4:{s:1:\"a\";i:66;s:1:\"b\";s:23:\"staff-commission.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:66;a:4:{s:1:\"a\";i:67;s:1:\"b\";s:23:\"staff-commission.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:67;a:4:{s:1:\"a\";i:68;s:1:\"b\";s:23:\"staff-commission.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:68;a:4:{s:1:\"a\";i:69;s:1:\"b\";s:13:\"services.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:69;a:4:{s:1:\"a\";i:70;s:1:\"b\";s:15:\"services.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:70;a:4:{s:1:\"a\";i:71;s:1:\"b\";s:15:\"services.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:71;a:4:{s:1:\"a\";i:72;s:1:\"b\";s:15:\"services.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:72;a:4:{s:1:\"a\";i:73;s:1:\"b\";s:17:\"appointments.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:73;a:4:{s:1:\"a\";i:74;s:1:\"b\";s:19:\"appointments.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:74;a:4:{s:1:\"a\";i:75;s:1:\"b\";s:19:\"appointments.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:75;a:4:{s:1:\"a\";i:76;s:1:\"b\";s:19:\"appointments.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:76;a:4:{s:1:\"a\";i:77;s:1:\"b\";s:21:\"service-packages.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:77;a:4:{s:1:\"a\";i:78;s:1:\"b\";s:23:\"service-packages.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:78;a:4:{s:1:\"a\";i:79;s:1:\"b\";s:23:\"service-packages.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:79;a:4:{s:1:\"a\";i:80;s:1:\"b\";s:23:\"service-packages.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:80;a:4:{s:1:\"a\";i:81;s:1:\"b\";s:22:\"customer-packages.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:81;a:4:{s:1:\"a\";i:82;s:1:\"b\";s:26:\"customer-packages.purchase\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:82;a:4:{s:1:\"a\";i:83;s:1:\"b\";s:25:\"customer-packages.consume\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:83;a:4:{s:1:\"a\";i:84;s:1:\"b\";s:26:\"customer-packages.allocate\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:84;a:4:{s:1:\"a\";i:85;s:1:\"b\";s:10:\"sales.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:85;a:4:{s:1:\"a\";i:86;s:1:\"b\";s:12:\"sales.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:86;a:4:{s:1:\"a\";i:87;s:1:\"b\";s:23:\"product-categories.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:87;a:4:{s:1:\"a\";i:88;s:1:\"b\";s:25:\"product-categories.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:88;a:4:{s:1:\"a\";i:89;s:1:\"b\";s:11:\"brands.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:89;a:4:{s:1:\"a\";i:90;s:1:\"b\";s:13:\"brands.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:90;a:4:{s:1:\"a\";i:91;s:1:\"b\";s:14:\"suppliers.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:91;a:4:{s:1:\"a\";i:92;s:1:\"b\";s:16:\"suppliers.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:92;a:4:{s:1:\"a\";i:93;s:1:\"b\";s:13:\"products.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:93;a:4:{s:1:\"a\";i:94;s:1:\"b\";s:15:\"products.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:94;a:4:{s:1:\"a\";i:95;s:1:\"b\";s:15:\"products.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:95;a:4:{s:1:\"a\";i:96;s:1:\"b\";s:15:\"products.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:96;a:4:{s:1:\"a\";i:97;s:1:\"b\";s:20:\"stock-purchases.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:97;a:4:{s:1:\"a\";i:98;s:1:\"b\";s:22:\"stock-purchases.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:98;a:4:{s:1:\"a\";i:99;s:1:\"b\";s:22:\"stock-purchases.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:99;a:4:{s:1:\"a\";i:100;s:1:\"b\";s:20:\"stock-movements.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:100;a:4:{s:1:\"a\";i:101;s:1:\"b\";s:23:\"stock-movements.consume\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:101;a:4:{s:1:\"a\";i:102;s:1:\"b\";s:22:\"stock-movements.adjust\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:102;a:4:{s:1:\"a\";i:103;s:1:\"b\";s:14:\"inventory.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:103;a:4:{s:1:\"a\";i:104;s:1:\"b\";s:13:\"expenses.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:104;a:4:{s:1:\"a\";i:105;s:1:\"b\";s:15:\"expenses.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:105;a:4:{s:1:\"a\";i:106;s:1:\"b\";s:15:\"expenses.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:106;a:4:{s:1:\"a\";i:107;s:1:\"b\";s:15:\"expenses.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:107;a:4:{s:1:\"a\";i:108;s:1:\"b\";s:16:\"expenses.reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:108;a:4:{s:1:\"a\";i:109;s:1:\"b\";s:12:\"payroll.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:109;a:4:{s:1:\"a\";i:110;s:1:\"b\";s:13:\"payslips.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:110;a:4:{s:1:\"a\";i:111;s:1:\"b\";s:17:\"payslips.generate\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:111;a:4:{s:1:\"a\";i:112;s:1:\"b\";s:15:\"payslips.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:112;a:4:{s:1:\"a\";i:113;s:1:\"b\";s:15:\"payslips.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:113;a:4:{s:1:\"a\";i:114;s:1:\"b\";s:12:\"reports.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:114;a:4:{s:1:\"a\";i:115;s:1:\"b\";s:22:\"website-inquiries.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:115;a:4:{s:1:\"a\";i:116;s:1:\"b\";s:24:\"website-inquiries.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:116;a:4:{s:1:\"a\";i:117;s:1:\"b\";s:20:\"homepage-slides.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:117;a:4:{s:1:\"a\";i:118;s:1:\"b\";s:22:\"homepage-slides.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:118;a:4:{s:1:\"a\";i:119;s:1:\"b\";s:17:\"testimonials.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:119;a:4:{s:1:\"a\";i:120;s:1:\"b\";s:19:\"testimonials.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:120;a:4:{s:1:\"a\";i:121;s:1:\"b\";s:18:\"gallery-items.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:121;a:4:{s:1:\"a\";i:122;s:1:\"b\";s:20:\"gallery-items.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:122;a:4:{s:1:\"a\";i:123;s:1:\"b\";s:9:\"faqs.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:123;a:4:{s:1:\"a\";i:124;s:1:\"b\";s:11:\"faqs.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:124;a:4:{s:1:\"a\";i:125;s:1:\"b\";s:15:\"blog-posts.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:125;a:4:{s:1:\"a\";i:126;s:1:\"b\";s:17:\"blog-posts.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}}s:5:\"roles\";a:4:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"owner\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"receptionist\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:5:\"staff\";s:1:\"c\";s:3:\"web\";}}}', 1782904382);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `emirate_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `country_id`, `emirate_id`, `name`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 2, 'Dubai Marina', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, 2, 'Jumeirah', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, 2, 'Downtown Dubai', 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, 2, 'Deira', 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, 2, 'Business Bay', 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, 2, 'Al Barsha', 1, 6, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(7, 1, 2, 'JLT', 1, 7, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(8, 1, 1, 'Abu Dhabi City', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(9, 1, 1, 'Khalifa City', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(10, 1, 1, 'Al Reem Island', 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(11, 1, 1, 'Yas Island', 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(12, 1, 3, 'Sharjah City', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(13, 1, 3, 'Al Nahda', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(14, 1, 3, 'Muwaileh', 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(15, 1, 4, 'Ajman City', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(16, 1, 4, 'Al Nuaimiya', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(17, 1, 5, 'Umm Al Quwain City', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(18, 1, 6, 'Ras Al Khaimah City', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(19, 1, 6, 'Al Hamra', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(20, 1, 7, 'Fujairah City', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(21, 1, 7, 'Dibba', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `trade_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `emirate_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city` varchar(255) NOT NULL DEFAULT 'Dubai',
  `country` varchar(255) NOT NULL DEFAULT 'UAE',
  `trn_number` varchar(255) DEFAULT NULL COMMENT 'Tax Registration Number',
  `logo` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) NOT NULL DEFAULT 'Asia/Dubai',
  `currency` varchar(3) NOT NULL DEFAULT 'AED',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 5.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `code`, `name`, `trade_name`, `email`, `website`, `phone`, `address`, `postal_code`, `country_id`, `emirate_id`, `city_id`, `city`, `country`, `trn_number`, `logo`, `timezone`, `currency`, `vat_rate`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'LUXE001', 'Luxe Beauty Lounge Dubai', 'Luxe Beauty Lounge', 'info@luxebeauty.ae', 'https://luxebeauty.ae', '+971 4 123 4567', 'Sheikh Zayed Road, Dubai Marina', '00000', 1, 2, 1, 'Dubai', 'UAE', '100123456700003', NULL, 'Asia/Dubai', 'AED', 5.00, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `iso_code` char(2) NOT NULL,
  `iso3_code` char(3) DEFAULT NULL,
  `phone_code` varchar(8) DEFAULT NULL,
  `currency_code` varchar(3) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `iso_code`, `iso3_code`, `phone_code`, `currency_code`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'United Arab Emirates', 'AE', 'ARE', '+971', 'AED', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emirate_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `total_visits` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_spent` decimal(12,2) NOT NULL DEFAULT 0.00,
  `last_visit_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `company_id`, `branch_id`, `code`, `name`, `phone`, `email`, `gender`, `date_of_birth`, `address`, `emirate_id`, `city_id`, `photo`, `summary`, `total_visits`, `total_spent`, `last_visit_at`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'CUST0001', 'Fatima Al Mansoori', '+971501234567', 'fatima.mansoori@email.ae', 'female', '1992-03-15', 'Marina Gate Tower, Dubai Marina', 2, 1, NULL, 'Regular client — prefers evening appointments. Loves balayage.', 2, 830.00, '2026-06-15 08:06:43', 1, '2026-06-29 08:01:51', '2026-06-29 08:06:43', NULL),
(2, 1, 2, 'CUST0002', 'Sara Ahmed', '+971509876543', 'sara.ahmed@email.ae', 'female', '1988-07-22', 'Jumeirah Beach Residence', 2, 2, NULL, 'VIP member — monthly facial package.', 4, 2625.00, '2026-06-30 03:49:22', 1, '2026-06-29 08:06:43', '2026-06-30 03:49:22', NULL),
(3, 1, 1, 'CUST0003', 'Mariam Hassan', '+971551234567', 'mariam.hassan@email.ae', 'female', '1995-11-08', 'Bluewaters Island', 2, 1, NULL, 'Bridal package enquiry — wedding in December.', 1, 0.00, '2026-06-26 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(4, 1, 1, 'CUST0004', 'Layla Ibrahim', '+971523456789', 'layla.ibrahim@email.ae', 'female', '1990-01-30', NULL, 2, 1, NULL, 'Walk-in client. Interested in waxing services.', 1, 150.00, '2026-06-08 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(5, 1, 2, 'CUST0005', 'Noura Khalid', '+971545678901', NULL, 'female', '1985-05-12', 'Umm Suqeim Road', 2, 2, NULL, 'Spa regular — books massage every fortnight.', 2, 700.00, '2026-06-19 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(6, 1, 1, 'CUST0006', 'Aisha Mohammed', '+971567890123', 'aisha.m@email.ae', 'female', '1998-09-18', NULL, 2, 1, NULL, 'Student discount eligible.', 1, 95.00, '2026-05-15 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(7, 1, 1, 'CUST0007', 'Hessa Ali', '+971589012345', 'hessa.ali@email.ae', 'female', '1982-12-05', NULL, 2, 1, NULL, 'Inactive — moved abroad temporarily.', 1, 160.00, '2026-03-01 08:06:43', 0, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(8, 1, 2, 'CUST0008', 'Rania Faisal', '+971501112233', 'rania.faisal@email.ae', 'female', '1993-04-25', NULL, 2, 2, NULL, 'Makeup artist referral — brings friends often.', 2, 830.00, '2026-06-24 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(9, 1, 1, 'CUST0009', 'Dina Kareem', '+971554445566', 'dina.kareem@email.ae', 'other', '1991-08-14', NULL, 2, 1, NULL, 'New client — first visit last week.', 1, 75.00, '2026-06-21 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(10, 1, 2, 'CUST0010', 'Yasmine Omar', '+971527778899', 'yasmine.omar@email.ae', 'female', '1987-06-03', 'Palm Jumeirah', 2, 2, NULL, 'High spender — interested in premium packages.', 3, 2060.00, '2026-06-27 08:06:43', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(11, 1, 1, 'CUST0011', 'Jennifer Lopez', '+11125865612', 'dipu@mailinator.com', 'female', NULL, NULL, 3, 12, 'customers/11/Ur4U7brKtdRgl8UmiQJCVjfStp50EmJvoxyNA2hi.jpg', NULL, 0, 0.00, NULL, 1, '2026-06-30 04:05:23', '2026-06-30 04:11:38', NULL),
(12, 1, NULL, 'CUST0012', 'Brianna Ayala', '+17036719993', 'ruqysyrapi@mailinator.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0.00, NULL, 1, '2026-06-30 06:41:20', '2026-06-30 06:41:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_notes`
--

CREATE TABLE `customer_notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text NOT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_notes`
--

INSERT INTO `customer_notes` (`id`, `company_id`, `customer_id`, `user_id`, `note`, `is_pinned`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 3, 'Prefers stylist Aisha. Allergic to certain hair dyes — check patch test.', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(2, 1, 1, 4, 'Last balayage turned out great. Book 8-week touch-up.', 0, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(3, 1, 2, 3, 'VIP — offer complimentary beverage on arrival.', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(4, 1, 3, 1, 'Interested in bridal makeup trial. Follow up with package quote.', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(5, 1, 5, 4, 'Prefers firm pressure for massage. Room 3.', 0, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(6, 1, 7, 3, 'Client requested to pause appointments until March.', 0, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(7, 1, 8, 1, 'Referral source — offer loyalty points on group bookings.', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(8, 1, 10, 3, 'Always requests private room. Chardonnay preferred.', 1, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(9, 1, 10, 4, 'Completed full spa day package — very satisfied.', 0, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_packages`
--

CREATE TABLE `customer_packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `service_package_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sold_by` bigint(20) UNSIGNED DEFAULT NULL,
  `sale_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(20) NOT NULL,
  `purchase_amount` decimal(12,2) NOT NULL,
  `points_allocated` int(10) UNSIGNED NOT NULL,
  `points_remaining` int(10) UNSIGNED NOT NULL,
  `points_consumed` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `purchased_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_packages`
--

INSERT INTO `customer_packages` (`id`, `company_id`, `customer_id`, `service_package_id`, `branch_id`, `sold_by`, `sale_id`, `code`, `purchase_amount`, `points_allocated`, `points_remaining`, `points_consumed`, `status`, `purchased_at`, `expires_at`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(5, 1, 1, 9, 1, 3, NULL, 'CPKG0001', 1575.00, 100, 72, 28, 'active', '2026-06-15 08:46:28', '2026-12-12 08:46:28', NULL, '2026-06-29 08:46:28', '2026-06-29 08:46:28', NULL),
(6, 1, 2, 10, 1, 3, NULL, 'CPKG0002', 840.00, 60, 45, 15, 'active', '2026-06-30 05:19:22', '2026-09-13 08:46:28', NULL, '2026-06-29 08:46:28', '2026-06-30 03:49:22', NULL),
(7, 1, 2, 9, 1, 1, 13, 'CPKG0003', 1575.00, 100, 100, 0, 'active', '2026-06-30 03:49:22', '2026-12-27 03:49:22', 'Sold via invoice INV2026-00001', '2026-06-30 03:49:22', '2026-06-30 03:49:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_point_transactions`
--

CREATE TABLE `customer_point_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `customer_package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `appointment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sale_id` bigint(20) UNSIGNED DEFAULT NULL,
  `service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(30) NOT NULL,
  `points` int(11) NOT NULL,
  `balance_after` int(10) UNSIGNED NOT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_point_transactions`
--

INSERT INTO `customer_point_transactions` (`id`, `company_id`, `customer_id`, `customer_package_id`, `appointment_id`, `sale_id`, `service_id`, `created_by`, `type`, `points`, `balance_after`, `reference`, `description`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 5, NULL, NULL, NULL, 3, 'purchase', 100, 100, 'CPKG0001', 'Purchased Glow Essentials — 10 Sessions', NULL, '2026-06-15 08:46:28', '2026-06-15 08:46:28'),
(2, 1, 1, 5, NULL, NULL, NULL, 3, 'consumption', -28, 72, 'CPKG0001', 'Consumed 28 points', NULL, '2026-06-18 08:46:28', '2026-06-18 08:46:28'),
(3, 1, 2, 6, NULL, NULL, NULL, 3, 'purchase', 60, 60, 'CPKG0002', 'Purchased Hair Care Bundle', NULL, '2026-06-15 08:46:28', '2026-06-15 08:46:28'),
(4, 1, 2, 6, NULL, 13, 1, 1, 'consumption', -15, 45, 'CPKG0002', 'POS redemption — INV2026-00001', NULL, '2026-06-30 03:49:22', '2026-06-30 03:49:22'),
(5, 1, 2, 7, NULL, 13, NULL, 1, 'purchase', 100, 145, 'INV2026-00001', 'Purchased Glow Essentials — 10 Sessions via POS', NULL, '2026-06-30 03:49:22', '2026-06-30 03:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `customer_visits`
--

CREATE TABLE `customer_visits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `staff_id` bigint(20) UNSIGNED DEFAULT NULL,
  `visited_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `purpose` varchar(255) DEFAULT NULL,
  `services_summary` text DEFAULT NULL,
  `amount_spent` decimal(12,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_visits`
--

INSERT INTO `customer_visits` (`id`, `company_id`, `customer_id`, `branch_id`, `staff_id`, `visited_at`, `purpose`, `services_summary`, `amount_spent`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 4, '2026-06-15 08:06:43', 'Hair colour', 'Balayage + trim', 650.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(2, 1, 1, 1, 4, '2026-04-30 08:06:43', 'Haircut', 'Cut & blow-dry', 180.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(3, 1, 2, 2, 4, '2026-06-22 08:06:43', 'Facial', 'Gold facial + neck massage', 420.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(4, 1, 2, 2, 4, '2026-05-23 08:06:43', 'Facial', 'Hydrating facial', 350.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(5, 1, 2, 2, 4, '2026-04-23 08:06:43', 'Nails', 'Gel manicure & pedicure', 280.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(6, 1, 3, 1, 3, '2026-06-26 08:06:43', 'Consultation', 'Bridal package consultation', 0.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(7, 1, 4, 1, 4, '2026-06-08 08:06:43', 'Waxing', 'Full leg wax + underarms', 150.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(8, 1, 5, 2, 4, '2026-06-19 08:06:43', 'Spa', 'Swedish massage 60 min', 320.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(9, 1, 5, 2, 4, '2026-06-05 08:06:43', 'Spa', 'Hot stone massage', 380.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(10, 1, 6, 1, 4, '2026-05-15 08:06:43', 'Nails', 'Classic manicure', 95.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(11, 1, 7, 1, 4, '2026-03-01 08:06:43', 'Haircut', 'Trim & style', 160.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(12, 1, 8, 2, 4, '2026-06-24 08:06:43', 'Makeup', 'Evening glam makeup', 450.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(13, 1, 8, 2, 4, '2026-05-25 08:06:43', 'Makeup', 'Party makeup', 380.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(14, 1, 9, 1, 3, '2026-06-21 08:06:43', 'First visit', 'Consultation + eyebrow threading', 75.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(15, 1, 10, 2, 4, '2026-06-27 08:06:43', 'Spa package', 'Full day spa — massage, facial, nails', 1200.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(16, 1, 10, 2, 4, '2026-05-28 08:06:43', 'Hair & nails', 'Blow-dry, gel nails', 340.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(17, 1, 10, 2, 4, '2026-04-28 08:06:43', 'Facial', 'Anti-ageing facial', 520.00, NULL, '2026-06-29 08:06:43', '2026-06-29 08:06:43', NULL),
(18, 1, 2, 1, 1, '2026-06-30 03:49:22', 'POS Sale', 'Women\'s Haircut & Blow-dry (Package Redemption), Glow Essentials — 10 Sessions', 1575.00, 'Invoice INV2026-00001', '2026-06-30 03:49:22', '2026-06-30 03:49:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `company_id`, `name`, `code`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Hair Services', 'HAIR', 'Cutting, coloring, styling', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, 'Nail Services', 'NAILS', 'Manicure, pedicure, nail art', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, 'Skin & Facial', 'SKIN', 'Facials, skincare treatments', 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, 'Spa & Wellness', 'SPA', 'Massage, body treatments', 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, 'Makeup & Bridal', 'MAKEUP', 'Makeup, bridal packages', 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, 'Administration', 'ADMIN', 'Front desk and management', 1, 6, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `emirates`
--

CREATE TABLE `emirates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emirates`
--

INSERT INTO `emirates` (`id`, `country_id`, `name`, `code`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Abu Dhabi', 'AUH', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, 'Dubai', 'DXB', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, 'Sharjah', 'SHJ', 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, 'Ajman', 'AJM', 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, 'Umm Al Quwain', 'UAQ', 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, 'Ras Al Khaimah', 'RAK', 1, 6, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(7, 1, 'Fujairah', 'FUJ', 1, 7, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `expense_category_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `vendor_name` varchar(255) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `vat_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  `vat_inclusive` tinyint(1) NOT NULL DEFAULT 0,
  `expense_date` date NOT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `receipt_original_name` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `company_id`, `branch_id`, `expense_category_id`, `payment_method_id`, `created_by`, `code`, `vendor_name`, `reference`, `description`, `amount`, `vat_rate`, `vat_amount`, `total_amount`, `vat_inclusive`, `expense_date`, `receipt_path`, `receipt_original_name`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 2, 1, 'EXP2026-00001', 'Dubai Marina Properties', NULL, 'Monthly salon rent', 15000.00, 0.00, 0.00, 15000.00, 0, '2026-06-01', NULL, NULL, NULL, '2026-06-29 09:23:17', '2026-06-29 09:23:17', NULL),
(2, 1, 1, 3, 1, 1, 'EXP2026-00002', 'Beauty Supply UAE', NULL, 'Hair color and shampoo restock', 2450.00, 5.00, 122.50, 2572.50, 0, '2026-06-24', NULL, NULL, NULL, '2026-06-29 09:23:17', '2026-06-29 09:23:17', NULL),
(3, 1, 1, 5, 2, 1, 'EXP2026-00003', 'Instagram Ads', NULL, 'Social media campaign', 800.00, 0.00, 0.00, 800.00, 0, '2026-06-17', NULL, NULL, NULL, '2026-06-29 09:23:17', '2026-06-29 09:23:17', NULL),
(4, 1, 1, 6, 1, 1, 'EXP2026-00004', 'AC Services LLC', NULL, 'AC maintenance and filter replacement', 350.00, 5.00, 17.50, 367.50, 0, '2026-06-26', NULL, NULL, NULL, '2026-06-29 09:23:17', '2026-06-29 09:23:17', NULL),
(5, 1, 1, 3, 2, 1, 'EXP2026-00005', 'Spa Essentials Trading', NULL, 'Disposable towels and cotton pads', 420.00, 0.00, 0.00, 420.00, 0, '2026-06-28', NULL, NULL, NULL, '2026-06-29 09:23:17', '2026-06-29 09:23:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`id`, `company_id`, `parent_id`, `name`, `code`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 'Rent & Utilities', 'RENT', NULL, 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, NULL, 'Salaries & Wages', 'SALARY', NULL, 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, NULL, 'Salon Supplies', 'SUPPLIES', NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, NULL, 'Retail Products', 'PRODUCTS', NULL, 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, NULL, 'Marketing & Advertising', 'MARKETING', NULL, 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, NULL, 'Maintenance & Repairs', 'MAINT', NULL, 1, 6, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(7, 1, NULL, 'Insurance', 'INSURANCE', NULL, 1, 7, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(8, 1, NULL, 'Miscellaneous', 'MISC', NULL, 1, 8, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(9, 1, 3, 'Hair Products', 'HAIR_PROD', NULL, 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(10, 1, 3, 'Nail Products', 'NAIL_PROD', NULL, 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(11, 1, 3, 'Skincare Products', 'SKIN_PROD', NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `company_id`, `question`, `answer`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Do I need to book in advance?', 'We recommend booking online or via WhatsApp. Walk-ins are welcome based on availability.', 1, 1, '2026-06-30 08:24:42', '2026-06-30 08:24:42'),
(2, 1, 'What is your cancellation policy?', 'Please cancel or reschedule at least 4 hours before your appointment to avoid a fee.', 2, 1, '2026-06-30 08:24:42', '2026-06-30 08:24:42'),
(3, 1, 'Do you offer bridal packages?', 'Yes — we provide bridal trials, event styling, and full day-of packages. Contact us for a custom quote.', 3, 1, '2026-06-30 08:24:42', '2026-06-30 08:24:42'),
(4, 1, 'Is VAT included in prices?', 'All listed prices are in AED. VAT is applied at checkout where applicable per UAE regulations.', 4, 1, '2026-06-30 08:24:42', '2026-06-30 08:24:42');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_items`
--

CREATE TABLE `gallery_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery_items`
--

INSERT INTO `gallery_items` (`id`, `company_id`, `title`, `alt_text`, `image`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Gallery 1', 'Gallery 1', 'gallery-items/1/eOgc2i2Bfg5SGxyJvR6wl8rBkuT10Cux7Ea7R46m.webp', 1, 1, '2026-06-30 08:24:40', '2026-06-30 08:29:50'),
(2, 1, 'Gallery 2', 'Gallery 2', 'gallery-items/2/U6qQ9ktR2S9m4bdvJSz7OEiXFrU3beEqqPO21Jjc.webp', 2, 1, '2026-06-30 08:24:40', '2026-06-30 08:33:29'),
(3, 1, 'Gallery 3', 'Gallery 3', 'gallery-items/3/IfATLxOHXepzC2DgMvjga4GwuzSpYg2LB2NH8GIP.webp', 3, 1, '2026-06-30 08:24:40', '2026-06-30 08:31:41'),
(4, 1, 'Gallery 4', 'Gallery 4', 'gallery-items/4/RO805AsVKxXUAC1nImiPoyXk3iv0Za84435btFpd.webp', 4, 1, '2026-06-30 08:24:40', '2026-06-30 08:30:16'),
(5, 1, 'Gallery 5', 'Gallery 5', 'gallery-items/5/xkDH3Vlekq6D85cy6Q2QLJitluc48BUECrjl61B8.webp', 5, 1, '2026-06-30 08:24:40', '2026-06-30 08:31:11'),
(6, 1, 'Gallery 6', 'Gallery 6', 'gallery-items/6/HwMp7EXXHRN8jYQV54zrJKQg0neTRswk0mesKkQd.webp', 6, 1, '2026-06-30 08:24:40', '2026-06-30 08:30:38');

-- --------------------------------------------------------

--
-- Table structure for table `homepage_slides`
--

CREATE TABLE `homepage_slides` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `eyebrow` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` varchar(255) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `secondary_cta_text` varchar(255) DEFAULT NULL,
  `secondary_cta_link` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homepage_slides`
--

INSERT INTO `homepage_slides` (`id`, `company_id`, `eyebrow`, `title`, `subtitle`, `cta_text`, `cta_link`, `secondary_cta_text`, `secondary_cta_link`, `image`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Premium Beauty Experience', 'Reveal Your Natural Radiance', 'Expert hair, skin, and wellness treatments in the heart of Dubai Marina — where luxury meets artistry.', 'Book Appointment', '/contact', 'Explore Services', '/our-services', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80', 1, 1, '2026-06-30 06:30:13', '2026-06-30 06:30:13'),
(2, 1, 'Hair & Colour Studio', 'Crafted Cuts & Signature Colour', 'From balayage to keratin smoothing — our stylists create looks tailored to you.', 'View Services', '/our-services', 'Book Appointment', '/contact', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80', 2, 1, '2026-06-30 06:30:13', '2026-06-30 06:30:13');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_06_29_071751_create_permission_tables', 1),
(5, '2026_06_29_071752_create_personal_access_tokens_table', 1),
(6, '2026_06_29_080000_add_soft_deletes_and_fields_to_users_table', 1),
(7, '2026_06_29_080001_create_companies_table', 1),
(8, '2026_06_29_080002_create_settings_table', 1),
(9, '2026_06_29_080003_create_activity_logs_table', 1),
(10, '2026_06_29_100001_create_countries_table', 1),
(11, '2026_06_29_100002_create_emirates_table', 1),
(12, '2026_06_29_100003_create_cities_table', 1),
(13, '2026_06_29_100004_enhance_companies_table', 1),
(14, '2026_06_29_100005_create_branches_table', 1),
(15, '2026_06_29_100006_create_departments_table', 1),
(16, '2026_06_29_100007_create_staff_designations_table', 1),
(17, '2026_06_29_100008_create_expense_categories_table', 1),
(18, '2026_06_29_100009_create_payment_methods_table', 1),
(19, '2026_06_29_100010_create_service_categories_table', 1),
(20, '2026_06_29_100011_enhance_users_table', 1),
(21, '2026_06_29_100012_enhance_settings_table', 1),
(22, '2026_06_29_100013_create_customers_table', 2),
(23, '2026_06_29_100014_create_customer_notes_table', 2),
(24, '2026_06_29_100015_create_customer_visits_table', 2),
(25, '2026_06_29_100016_add_staff_profile_fields_to_users_table', 3),
(26, '2026_06_29_100017_create_staff_documents_table', 3),
(27, '2026_06_29_100018_create_staff_salaries_table', 3),
(28, '2026_06_29_100019_create_staff_attendance_table', 3),
(29, '2026_06_29_100020_create_staff_leave_requests_table', 3),
(30, '2026_06_29_100021_create_staff_commission_rules_table', 3),
(31, '2026_06_29_100022_create_services_table', 4),
(32, '2026_06_29_100023_create_appointments_table', 5),
(33, '2026_06_29_100024_create_appointment_items_table', 5),
(34, '2026_06_29_100025_create_service_packages_table', 6),
(35, '2026_06_29_100026_create_service_package_items_table', 6),
(36, '2026_06_29_100027_create_customer_packages_table', 6),
(37, '2026_06_29_100028_create_customer_point_transactions_table', 7),
(38, '2026_06_29_100029_create_sales_table', 8),
(39, '2026_06_29_100030_create_sale_items_table', 8),
(40, '2026_06_29_100031_create_sale_payments_table', 8),
(41, '2026_06_29_100032_add_sale_id_to_package_tables', 8),
(42, '2026_06_29_100033_create_product_categories_table', 9),
(43, '2026_06_29_100034_create_brands_table', 9),
(44, '2026_06_29_100035_create_suppliers_table', 9),
(45, '2026_06_29_100036_create_products_table', 9),
(46, '2026_06_29_100037_create_branch_product_stock_table', 9),
(47, '2026_06_29_100038_create_stock_purchases_table', 9),
(48, '2026_06_29_100039_create_stock_purchase_items_table', 9),
(49, '2026_06_29_100040_create_stock_movements_table', 9),
(50, '2026_06_29_100041_create_expenses_table', 10),
(51, '2026_06_29_100042_create_payslips_table', 11),
(52, '2026_06_29_200001_create_blog_posts_table', 12),
(53, '2026_06_30_100001_add_image_to_services_table', 13),
(54, '2026_06_30_120001_add_image_to_products_table', 14),
(55, '2026_06_30_140001_create_website_inquiries_table', 15),
(56, '2026_06_30_140002_create_homepage_slides_table', 15),
(57, '2026_06_30_160001_create_testimonials_table', 16),
(58, '2026_06_30_170001_create_gallery_items_table', 17),
(59, '2026_06_30_170002_create_faqs_table', 17);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 3),
(4, 'App\\Models\\User', 4),
(4, 'App\\Models\\User', 5),
(4, 'App\\Models\\User', 6),
(4, 'App\\Models\\User', 7),
(4, 'App\\Models\\User', 8),
(4, 'App\\Models\\User', 9),
(4, 'App\\Models\\User', 10),
(4, 'App\\Models\\User', 11),
(4, 'App\\Models\\User', 12);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'cash',
  `description` text DEFAULT NULL,
  `requires_reference` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `company_id`, `name`, `code`, `type`, `description`, `requires_reference`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Cash', 'CASH', 'cash', NULL, 0, 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, 'Credit / Debit Card', 'CARD', 'card', NULL, 1, 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, 'Bank Transfer', 'BANK', 'bank_transfer', NULL, 1, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, 'Online Payment', 'ONLINE', 'online', NULL, 1, 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, 'Apple Pay', 'APPLE_PAY', 'wallet', NULL, 0, 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, 'Tabby (BNPL)', 'TABBY', 'online', NULL, 1, 1, 6, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(7, 1, 'Cheque', 'CHEQUE', 'cheque', NULL, 1, 1, 7, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payslips`
--

CREATE TABLE `payslips` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `generated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `base_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `housing_allowance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `transport_allowance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `other_allowance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `gross_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `commission_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `leave_days` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `leave_deduction` decimal(12,2) NOT NULL DEFAULT 0.00,
  `other_deductions` decimal(12,2) NOT NULL DEFAULT 0.00,
  `other_additions` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_pay` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'AED',
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `calculation_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`calculation_snapshot`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payslip_items`
--

CREATE TABLE `payslip_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payslip_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `is_deduction` tinyint(1) NOT NULL DEFAULT 0,
  `reference_type` varchar(255) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'dashboard.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(2, 'users.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(3, 'users.create', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(4, 'users.update', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(5, 'users.delete', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(6, 'roles.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(7, 'roles.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(8, 'company.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(9, 'company.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(10, 'branches.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(11, 'branches.create', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(12, 'branches.update', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(13, 'branches.delete', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(14, 'settings.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(15, 'settings.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(16, 'countries.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(17, 'countries.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(18, 'emirates.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(19, 'emirates.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(20, 'cities.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(21, 'cities.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(22, 'departments.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(23, 'departments.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(24, 'staff-designations.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(25, 'staff-designations.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(26, 'expense-categories.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(27, 'expense-categories.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(28, 'payment-methods.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(29, 'payment-methods.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(30, 'service-categories.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(31, 'service-categories.manage', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(32, 'activity-logs.view', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(33, 'customers.view', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(34, 'customers.create', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(35, 'customers.update', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(36, 'customers.delete', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(37, 'customer-notes.view', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(38, 'customer-notes.create', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(39, 'customer-notes.update', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(40, 'customer-notes.delete', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(41, 'customer-visits.view', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(42, 'customer-visits.create', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(43, 'customer-visits.update', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(44, 'customer-visits.delete', 'web', '2026-06-29 08:00:20', '2026-06-29 08:00:20'),
(45, 'staff.view', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(46, 'staff.create', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(47, 'staff.update', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(48, 'staff.delete', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(49, 'staff-documents.view', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(50, 'staff-documents.create', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(51, 'staff-documents.update', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(52, 'staff-documents.delete', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(53, 'staff-salary.view', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(54, 'staff-salary.create', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(55, 'staff-salary.update', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(56, 'staff-salary.delete', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(57, 'staff-attendance.view', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(58, 'staff-attendance.create', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(59, 'staff-attendance.update', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(60, 'staff-attendance.delete', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(61, 'staff-leave.view', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(62, 'staff-leave.create', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(63, 'staff-leave.update', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(64, 'staff-leave.delete', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(65, 'staff-commission.view', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(66, 'staff-commission.create', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(67, 'staff-commission.update', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(68, 'staff-commission.delete', 'web', '2026-06-29 08:18:28', '2026-06-29 08:18:28'),
(69, 'services.view', 'web', '2026-06-29 08:29:00', '2026-06-29 08:29:00'),
(70, 'services.create', 'web', '2026-06-29 08:29:00', '2026-06-29 08:29:00'),
(71, 'services.update', 'web', '2026-06-29 08:29:00', '2026-06-29 08:29:00'),
(72, 'services.delete', 'web', '2026-06-29 08:29:00', '2026-06-29 08:29:00'),
(73, 'appointments.view', 'web', '2026-06-29 08:34:25', '2026-06-29 08:34:25'),
(74, 'appointments.create', 'web', '2026-06-29 08:34:25', '2026-06-29 08:34:25'),
(75, 'appointments.update', 'web', '2026-06-29 08:34:25', '2026-06-29 08:34:25'),
(76, 'appointments.delete', 'web', '2026-06-29 08:34:25', '2026-06-29 08:34:25'),
(77, 'service-packages.view', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(78, 'service-packages.create', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(79, 'service-packages.update', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(80, 'service-packages.delete', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(81, 'customer-packages.view', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(82, 'customer-packages.purchase', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(83, 'customer-packages.consume', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(84, 'customer-packages.allocate', 'web', '2026-06-29 08:45:59', '2026-06-29 08:45:59'),
(85, 'sales.view', 'web', '2026-06-29 08:59:43', '2026-06-29 08:59:43'),
(86, 'sales.create', 'web', '2026-06-29 08:59:43', '2026-06-29 08:59:43'),
(87, 'product-categories.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(88, 'product-categories.manage', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(89, 'brands.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(90, 'brands.manage', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(91, 'suppliers.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(92, 'suppliers.manage', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(93, 'products.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(94, 'products.create', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(95, 'products.update', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(96, 'products.delete', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(97, 'stock-purchases.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(98, 'stock-purchases.create', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(99, 'stock-purchases.update', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(100, 'stock-movements.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(101, 'stock-movements.consume', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(102, 'stock-movements.adjust', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(103, 'inventory.view', 'web', '2026-06-29 09:15:21', '2026-06-29 09:15:21'),
(104, 'expenses.view', 'web', '2026-06-29 09:23:15', '2026-06-29 09:23:15'),
(105, 'expenses.create', 'web', '2026-06-29 09:23:15', '2026-06-29 09:23:15'),
(106, 'expenses.update', 'web', '2026-06-29 09:23:15', '2026-06-29 09:23:15'),
(107, 'expenses.delete', 'web', '2026-06-29 09:23:15', '2026-06-29 09:23:15'),
(108, 'expenses.reports', 'web', '2026-06-29 09:23:15', '2026-06-29 09:23:15'),
(109, 'payroll.view', 'web', '2026-06-29 09:29:24', '2026-06-29 09:29:24'),
(110, 'payslips.view', 'web', '2026-06-29 09:29:24', '2026-06-29 09:29:24'),
(111, 'payslips.generate', 'web', '2026-06-29 09:29:24', '2026-06-29 09:29:24'),
(112, 'payslips.update', 'web', '2026-06-29 09:29:25', '2026-06-29 09:29:25'),
(113, 'payslips.delete', 'web', '2026-06-29 09:29:25', '2026-06-29 09:29:25'),
(114, 'reports.view', 'web', '2026-06-29 09:35:12', '2026-06-29 09:35:12'),
(115, 'website-inquiries.view', 'web', '2026-06-30 06:30:10', '2026-06-30 06:30:10'),
(116, 'website-inquiries.manage', 'web', '2026-06-30 06:30:11', '2026-06-30 06:30:11'),
(117, 'homepage-slides.view', 'web', '2026-06-30 06:30:11', '2026-06-30 06:30:11'),
(118, 'homepage-slides.manage', 'web', '2026-06-30 06:30:11', '2026-06-30 06:30:11'),
(119, 'testimonials.view', 'web', '2026-06-30 07:57:59', '2026-06-30 07:57:59'),
(120, 'testimonials.manage', 'web', '2026-06-30 07:57:59', '2026-06-30 07:57:59'),
(121, 'gallery-items.view', 'web', '2026-06-30 08:24:37', '2026-06-30 08:24:37'),
(122, 'gallery-items.manage', 'web', '2026-06-30 08:24:37', '2026-06-30 08:24:37'),
(123, 'faqs.view', 'web', '2026-06-30 08:24:37', '2026-06-30 08:24:37'),
(124, 'faqs.manage', 'web', '2026-06-30 08:24:37', '2026-06-30 08:24:37'),
(125, 'blog-posts.view', 'web', '2026-06-30 08:24:37', '2026-06-30 08:24:37'),
(126, 'blog-posts.manage', 'web', '2026-06-30 08:24:37', '2026-06-30 08:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(3, 'App\\Models\\User', 1, 'test', '1cc4ac1b20d99fc02d6963e505df61e31f3157c509c4f31c15b8757d7a26e6c5', '[\"*\"]', '2026-06-29 06:36:24', NULL, '2026-06-29 06:36:21', '2026-06-29 06:36:24'),
(4, 'App\\Models\\User', 1, 'test', '1bcc9bc6f9a8c0e10a461e6493592b119c583be1658b910442d28150d4bfcc38', '[\"*\"]', '2026-06-29 06:36:50', NULL, '2026-06-29 06:36:50', '2026-06-29 06:36:50'),
(5, 'App\\Models\\User', 1, 'test', '6c7bdf81c11047ab00dbf9748dd0dd98c338f5b34e7ccd95b6177c180d5bef31', '[\"*\"]', '2026-06-29 07:02:00', NULL, '2026-06-29 07:02:00', '2026-06-29 07:02:00'),
(6, 'App\\Models\\User', 4, 'test', 'f4dd2f61789f97c9ffd8e97a2d2c8e49066c92380e8094a4179d4ea341b184a8', '[\"*\"]', '2026-06-29 07:02:01', NULL, '2026-06-29 07:02:01', '2026-06-29 07:02:01'),
(7, 'App\\Models\\User', 1, 'test', 'a5281e60c39fc7859aac862ec052ac3baf9b51581e1a3bb612f77ffbfe1b9170', '[\"*\"]', '2026-06-29 07:47:10', NULL, '2026-06-29 07:47:09', '2026-06-29 07:47:10'),
(10, 'App\\Models\\User', 1, 'web', '5d8087c94c3a44d26528d528dc9dd4b35121f156068cd0b72719f4488aeed759', '[\"*\"]', '2026-06-29 08:00:31', NULL, '2026-06-29 08:00:31', '2026-06-29 08:00:31'),
(11, 'App\\Models\\User', 1, 'web', 'ef91505a20752a9015a9936f78f4dfc31b529a200ea321b38b87daf8704d86a5', '[\"*\"]', '2026-06-29 08:01:51', NULL, '2026-06-29 08:01:50', '2026-06-29 08:01:51'),
(12, 'App\\Models\\User', 1, 'web', 'c3e4559363f3fa975c23768b4c7b4e90a58dcc311de95e61863cb270983c3a60', '[\"*\"]', '2026-06-29 09:18:46', NULL, '2026-06-29 09:18:46', '2026-06-29 09:18:46'),
(14, 'App\\Models\\User', 1, 'web', '53dc8de2693e9ed2ae746e25be3f829e3634ebd72e4cce132ed4c0d6268792e8', '[\"*\"]', '2026-06-29 09:23:44', NULL, '2026-06-29 09:23:43', '2026-06-29 09:23:44'),
(15, 'App\\Models\\User', 1, 'web', '4a180b37f84bc11063540025056c1367a36c05687a9421f237f62831ab2ef3c4', '[\"*\"]', '2026-06-29 09:31:07', NULL, '2026-06-29 09:31:07', '2026-06-29 09:31:07'),
(17, 'App\\Models\\User', 1, 'test', '89d992b550b91cbaf59227571bf5119ff784ad77bc0e25e52ebef71982c147c6', '[\"*\"]', '2026-06-29 10:22:52', NULL, '2026-06-29 10:22:52', '2026-06-29 10:22:52'),
(25, 'App\\Models\\User', 4, 'web', 'c4e4515dc64013ac792f28e6978b84a06bfc39a9d6df580cc7ef54aadcac97d9', '[\"*\"]', '2026-06-30 09:08:08', NULL, '2026-06-30 09:08:08', '2026-06-30 09:08:08'),
(26, 'App\\Models\\User', 4, 'web', '4cefd1befc5c0166adf72c259adb80f6f3bc4b117b3d0536e5b2c73033090adc', '[\"*\"]', NULL, NULL, '2026-06-30 09:08:29', '2026-06-30 09:08:29'),
(27, 'App\\Models\\User', 4, 'web', '9ff0b552920a3e4b5bbb8fc9250fcead08aefee58cf9f0cbc6a608774978c790', '[\"*\"]', '2026-06-30 09:11:20', NULL, '2026-06-30 09:09:08', '2026-06-30 09:11:20'),
(57, 'App\\Models\\User', 1, 'web', 'ddef1b22e8b1bda1ba5b9061a07d49b293ad319f5f576e449313de0b726de02a', '[\"*\"]', '2026-06-30 09:51:01', NULL, '2026-06-30 09:50:58', '2026-06-30 09:51:01'),
(58, 'App\\Models\\User', 1, 'web', '3e11c55772f82ba9b6385f9855f8337e219190ab03a4c79fc8d9867bf218d6b8', '[\"*\"]', '2026-06-30 09:55:17', NULL, '2026-06-30 09:54:46', '2026-06-30 09:55:17');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `product_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `brand_id` bigint(20) UNSIGNED DEFAULT NULL,
  `default_supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `unit` varchar(20) NOT NULL DEFAULT 'pcs',
  `cost_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `retail_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 5.00,
  `vat_inclusive` tinyint(1) NOT NULL DEFAULT 0,
  `track_inventory` tinyint(1) NOT NULL DEFAULT 1,
  `is_sellable` tinyint(1) NOT NULL DEFAULT 0,
  `is_consumable` tinyint(1) NOT NULL DEFAULT 1,
  `reorder_level` decimal(12,3) NOT NULL DEFAULT 0.000,
  `reorder_quantity` decimal(12,3) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `company_id`, `product_category_id`, `brand_id`, `default_supplier_id`, `code`, `barcode`, `name`, `description`, `image`, `unit`, `cost_price`, `retail_price`, `vat_rate`, `vat_inclusive`, `track_inventory`, `is_sellable`, `is_consumable`, `reorder_level`, `reorder_quantity`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 1, 'PRD0001', NULL, 'Professional Shampoo 1L', 'Salon-strength cleansing shampoo for colour-treated and damaged hair. Sulfate-free formula with keratin proteins.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', 'bottle', 45.00, 85.00, 5.00, 0, 1, 1, 1, 5.000, NULL, 1, 1, '2026-06-29 09:15:24', '2026-06-30 06:11:59', NULL),
(2, 1, 1, 1, 1, 'PRD0002', NULL, 'Hair Color Tube 60ml', NULL, NULL, 'tube', 18.00, 0.00, 5.00, 0, 1, 0, 1, 20.000, NULL, 2, 1, '2026-06-29 09:15:24', '2026-06-29 09:15:24', NULL),
(3, 1, 1, 3, 1, 'PRD0003', NULL, 'Olaplex No.3 100ml', 'At-home bond-building treatment that reduces breakage and strengthens hair between salon visits.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 'bottle', 95.00, 165.00, 5.00, 0, 1, 1, 1, 3.000, NULL, 3, 1, '2026-06-29 09:15:24', '2026-06-30 06:11:59', NULL),
(4, 1, 2, 4, 1, 'PRD0004', NULL, 'Facial Cleanser 200ml', 'Gentle daily cleanser that removes impurities without stripping natural moisture. Ideal for all skin types.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 'bottle', 55.00, 110.00, 5.00, 0, 1, 1, 1, 4.000, NULL, 4, 1, '2026-06-29 09:15:24', '2026-06-30 06:11:59', NULL),
(5, 1, 3, 5, 1, 'PRD0005', NULL, 'Nail Polish 15ml', 'Long-wear, chip-resistant nail lacquer in salon-favourite shades. High-gloss finish with smooth application.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', 'bottle', 12.00, 35.00, 5.00, 0, 1, 1, 1, 10.000, NULL, 5, 1, '2026-06-29 09:15:24', '2026-06-30 06:11:59', NULL),
(6, 1, 6, 6, 1, 'PRD0006', NULL, 'Disposable Towels (Pack 50)', NULL, NULL, 'pack', 25.00, 0.00, 5.00, 0, 1, 0, 1, 8.000, NULL, 6, 1, '2026-06-29 09:15:24', '2026-06-29 09:15:24', NULL),
(7, 1, 6, 6, 1, 'PRD0007', NULL, 'Cotton Pads (Box 200)', NULL, NULL, 'box', 15.00, 0.00, 5.00, 0, 1, 0, 1, 5.000, NULL, 7, 1, '2026-06-29 09:15:24', '2026-06-29 09:15:24', NULL),
(8, 1, 1, 2, 1, 'PRD0008', NULL, 'Keratin Leave-In Serum 100ml', 'Lightweight leave-in serum that tames frizz, adds shine, and protects against heat styling up to 230°C.', 'products/8/ENDRiO3NPYVoq9IrMT0ss1jEIz9mYtlQ5CpPWc9h.png', 'bottle', 38.00, 72.00, 5.00, 0, 1, 1, 1, 4.000, NULL, 8, 1, '2026-06-30 06:11:58', '2026-06-30 06:15:28', NULL),
(9, 1, 4, 6, 1, 'PRD0009', NULL, 'Aromatherapy Body Oil 250ml', 'Nourishing blend of essential oils for massage and daily hydration. Absorbs quickly without greasy residue.', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', 'bottle', 42.00, 95.00, 5.00, 0, 1, 1, 1, 3.000, NULL, 9, 1, '2026-06-30 06:11:58', '2026-06-30 06:11:59', NULL),
(10, 1, 5, 5, 1, 'PRD0010', NULL, 'Luxury Lip Gloss 8ml', 'High-shine lip gloss with vitamin E and jojoba oil. Non-sticky formula in universally flattering nude rose.', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80', 'tube', 18.00, 45.00, 5.00, 0, 1, 1, 1, 6.000, NULL, 10, 1, '2026-06-30 06:11:58', '2026-06-30 06:11:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `company_id`, `parent_id`, `name`, `code`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 'Hair Products', 'HAIR_PROD', NULL, 1, 1, '2026-06-29 09:15:22', '2026-06-29 09:15:22', NULL),
(2, 1, NULL, 'Skin & Facial', 'SKIN_PROD', NULL, 1, 2, '2026-06-29 09:15:22', '2026-06-29 09:15:22', NULL),
(3, 1, NULL, 'Nail Products', 'NAIL_PROD', NULL, 1, 3, '2026-06-29 09:15:22', '2026-06-29 09:15:22', NULL),
(4, 1, NULL, 'Spa & Massage', 'SPA_PROD', NULL, 1, 4, '2026-06-29 09:15:22', '2026-06-29 09:15:22', NULL),
(5, 1, NULL, 'Retail & Accessories', 'RETAIL', NULL, 1, 5, '2026-06-29 09:15:22', '2026-06-29 09:15:22', NULL),
(6, 1, NULL, 'Salon Consumables', 'CONSUMABLE', NULL, 1, 6, '2026-06-29 09:15:22', '2026-06-29 09:15:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'owner', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(2, 'admin', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(3, 'receptionist', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48'),
(4, 'staff', 'web', '2026-06-29 06:20:48', '2026-06-29 06:20:48');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(5, 1),
(5, 2),
(6, 1),
(7, 1),
(8, 1),
(8, 2),
(9, 1),
(9, 2),
(10, 1),
(10, 2),
(11, 1),
(11, 2),
(12, 1),
(12, 2),
(13, 1),
(13, 2),
(14, 1),
(14, 2),
(15, 1),
(15, 2),
(16, 1),
(16, 2),
(17, 1),
(17, 2),
(18, 1),
(18, 2),
(19, 1),
(19, 2),
(20, 1),
(20, 2),
(21, 1),
(21, 2),
(22, 1),
(22, 2),
(23, 1),
(23, 2),
(24, 1),
(24, 2),
(25, 1),
(25, 2),
(26, 1),
(26, 2),
(27, 1),
(27, 2),
(28, 1),
(28, 2),
(29, 1),
(29, 2),
(30, 1),
(30, 2),
(31, 1),
(31, 2),
(32, 1),
(32, 2),
(33, 1),
(33, 2),
(33, 3),
(34, 1),
(34, 2),
(34, 3),
(35, 1),
(35, 2),
(35, 3),
(36, 1),
(36, 2),
(37, 1),
(37, 2),
(37, 3),
(38, 1),
(38, 2),
(38, 3),
(39, 1),
(39, 2),
(39, 3),
(40, 1),
(40, 2),
(41, 1),
(41, 2),
(41, 3),
(42, 1),
(42, 2),
(42, 3),
(43, 1),
(43, 2),
(43, 3),
(44, 1),
(44, 2),
(45, 1),
(45, 2),
(45, 3),
(45, 4),
(46, 1),
(46, 2),
(47, 1),
(47, 2),
(48, 1),
(48, 2),
(49, 1),
(49, 2),
(49, 4),
(50, 1),
(50, 2),
(51, 1),
(51, 2),
(52, 1),
(52, 2),
(53, 1),
(53, 2),
(53, 4),
(54, 1),
(54, 2),
(55, 1),
(55, 2),
(56, 1),
(56, 2),
(57, 1),
(57, 2),
(57, 3),
(57, 4),
(58, 1),
(58, 2),
(59, 1),
(59, 2),
(60, 1),
(60, 2),
(61, 1),
(61, 2),
(61, 3),
(61, 4),
(62, 1),
(62, 2),
(62, 3),
(62, 4),
(63, 1),
(63, 2),
(64, 1),
(64, 2),
(65, 1),
(65, 2),
(65, 4),
(66, 1),
(66, 2),
(67, 1),
(67, 2),
(68, 1),
(68, 2),
(69, 1),
(69, 2),
(69, 3),
(69, 4),
(70, 1),
(70, 2),
(71, 1),
(71, 2),
(72, 1),
(72, 2),
(73, 1),
(73, 2),
(73, 3),
(73, 4),
(74, 1),
(74, 2),
(74, 3),
(75, 1),
(75, 2),
(75, 3),
(76, 1),
(76, 2),
(77, 1),
(77, 2),
(77, 3),
(78, 1),
(78, 2),
(79, 1),
(79, 2),
(80, 1),
(80, 2),
(81, 1),
(81, 2),
(81, 3),
(82, 1),
(82, 2),
(82, 3),
(83, 1),
(83, 2),
(83, 3),
(84, 1),
(84, 2),
(85, 1),
(85, 2),
(86, 1),
(86, 2),
(87, 1),
(87, 2),
(88, 1),
(88, 2),
(89, 1),
(89, 2),
(90, 1),
(90, 2),
(91, 1),
(91, 2),
(92, 1),
(92, 2),
(93, 1),
(93, 2),
(93, 3),
(94, 1),
(94, 2),
(95, 1),
(95, 2),
(96, 1),
(96, 2),
(97, 1),
(97, 2),
(97, 3),
(98, 1),
(98, 2),
(98, 3),
(99, 1),
(99, 2),
(100, 1),
(100, 2),
(100, 3),
(101, 1),
(101, 2),
(101, 3),
(102, 1),
(102, 2),
(103, 1),
(103, 2),
(103, 3),
(104, 1),
(104, 2),
(104, 3),
(105, 1),
(105, 2),
(105, 3),
(106, 1),
(106, 2),
(107, 1),
(107, 2),
(108, 1),
(108, 2),
(109, 1),
(109, 2),
(109, 3),
(110, 1),
(110, 2),
(110, 3),
(111, 1),
(111, 2),
(112, 1),
(112, 2),
(113, 1),
(113, 2),
(114, 1),
(114, 2),
(114, 3),
(115, 1),
(115, 2),
(115, 3),
(116, 1),
(116, 2),
(116, 3),
(117, 1),
(117, 2),
(117, 3),
(118, 1),
(118, 2),
(119, 1),
(119, 2),
(119, 3),
(120, 1),
(120, 2),
(121, 1),
(121, 2),
(121, 3),
(122, 1),
(122, 2),
(123, 1),
(123, 2),
(123, 3),
(124, 1),
(124, 2),
(125, 1),
(125, 2),
(125, 3),
(126, 1),
(126, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sold_by` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'pos',
  `status` varchar(20) NOT NULL DEFAULT 'paid',
  `discount_type` varchar(20) NOT NULL DEFAULT 'none',
  `discount_value` decimal(12,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `vat_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `amount_paid` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(3) NOT NULL DEFAULT 'AED',
  `vat_rate_snapshot` decimal(5,2) NOT NULL DEFAULT 5.00,
  `trn_snapshot` varchar(50) DEFAULT NULL,
  `points_redeemed` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `company_id`, `branch_id`, `customer_id`, `appointment_id`, `sold_by`, `code`, `type`, `status`, `discount_type`, `discount_value`, `subtotal`, `discount_amount`, `vat_amount`, `total_amount`, `amount_paid`, `currency`, `vat_rate_snapshot`, `trn_snapshot`, `points_redeemed`, `notes`, `paid_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 2, NULL, 3, 'DEMO-INV2026-001', 'pos', 'paid', 'none', 0.00, 383.25, 0.00, 18.25, 383.25, 383.25, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-24 05:45:00', '2026-06-24 05:45:00', '2026-06-24 05:45:00', NULL),
(2, 1, 1, 3, NULL, 3, 'DEMO-INV2026-002', 'pos', 'paid', 'none', 0.00, 556.50, 0.00, 26.50, 556.50, 556.50, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-25 06:45:00', '2026-06-25 06:45:00', '2026-06-25 06:45:00', NULL),
(3, 1, 1, 4, NULL, 3, 'DEMO-INV2026-003', 'pos', 'paid', 'none', 0.00, 1023.75, 0.00, 48.75, 1023.75, 1023.75, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-26 07:45:00', '2026-06-26 07:45:00', '2026-06-26 07:45:00', NULL),
(4, 1, 1, 5, NULL, 3, 'DEMO-INV2026-004', 'pos', 'paid', 'none', 0.00, 1228.50, 0.00, 58.50, 1228.50, 1228.50, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-27 08:45:00', '2026-06-27 08:45:00', '2026-06-27 08:45:00', NULL),
(5, 1, 1, 6, NULL, 3, 'DEMO-INV2026-005', 'pos', 'paid', 'none', 0.00, 414.75, 0.00, 19.75, 414.75, 414.75, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-28 09:45:00', '2026-06-28 09:45:00', '2026-06-28 09:45:00', NULL),
(6, 1, 1, 7, NULL, 3, 'DEMO-INV2026-006', 'pos', 'paid', 'none', 0.00, 1417.50, 0.00, 67.50, 1417.50, 1417.50, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-29 04:45:00', '2026-06-29 04:45:00', '2026-06-29 04:45:00', NULL),
(7, 1, 1, 8, NULL, 3, 'DEMO-INV2026-007', 'pos', 'paid', 'none', 0.00, 955.50, 0.00, 45.50, 955.50, 955.50, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-30 05:45:00', '2026-06-30 05:45:00', '2026-06-30 05:45:00', NULL),
(8, 1, 1, 1, NULL, 3, 'DEMO-INV2026-008', 'pos', 'paid', 'none', 0.00, 871.50, 0.00, 41.50, 871.50, 871.50, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-20 09:00:00', '2026-06-20 09:00:00', '2026-06-20 09:00:00', NULL),
(9, 1, 1, 2, NULL, 3, 'DEMO-INV2026-009', 'pos', 'paid', 'none', 0.00, 1050.00, 0.00, 50.00, 1050.00, 1050.00, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-16 09:00:00', '2026-06-16 09:00:00', '2026-06-16 09:00:00', NULL),
(10, 1, 1, 3, NULL, 3, 'DEMO-INV2026-010', 'pos', 'paid', 'none', 0.00, 1228.50, 0.00, 58.50, 1228.50, 1228.50, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-12 09:00:00', '2026-06-12 09:00:00', '2026-06-12 09:00:00', NULL),
(11, 1, 1, 4, NULL, 3, 'DEMO-INV2026-011', 'pos', 'paid', 'none', 0.00, 393.75, 0.00, 18.75, 393.75, 393.75, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-08 09:00:00', '2026-06-08 09:00:00', '2026-06-08 09:00:00', NULL),
(12, 1, 1, 5, NULL, 3, 'DEMO-INV2026-012', 'pos', 'paid', 'none', 0.00, 1155.00, 0.00, 55.00, 1155.00, 1155.00, 'AED', 5.00, NULL, 0, 'Demo sale for dashboard analytics', '2026-06-04 09:00:00', '2026-06-04 09:00:00', '2026-06-04 09:00:00', NULL),
(13, 1, 1, 2, NULL, 1, 'INV2026-00001', 'pos', 'paid', 'none', 0.00, 1575.00, 0.00, 75.00, 1575.00, 1575.00, 'AED', 5.00, '100123456700003', 15, NULL, '2026-06-30 03:49:22', '2026-06-30 03:49:22', '2026-06-30 03:49:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_id` bigint(20) UNSIGNED NOT NULL,
  `line_type` varchar(30) NOT NULL,
  `salon_service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `service_package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `appointment_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `staff_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `vat_inclusive` tinyint(1) NOT NULL DEFAULT 0,
  `line_subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `line_vat` decimal(12,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `points_redeemed` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `line_type`, `salon_service_id`, `service_package_id`, `appointment_item_id`, `staff_id`, `customer_package_id`, `description`, `quantity`, `unit_price`, `vat_rate`, `vat_inclusive`, `line_subtotal`, `line_vat`, `line_total`, `points_redeemed`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'service', 1, NULL, NULL, 4, NULL, 'Women\'s Haircut & Blow-dry', 1, 180.00, 5.00, 0, 180.00, 9.00, 189.00, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(2, 1, 'service', 4, NULL, NULL, 4, NULL, 'Classic Manicure', 1, 95.00, 5.00, 0, 95.00, 4.75, 99.75, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(3, 1, 'service', 13, NULL, NULL, 4, NULL, 'Eyebrow Threading', 2, 45.00, 5.00, 0, 90.00, 4.50, 94.50, 0, 3, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(4, 2, 'service', 6, NULL, NULL, 4, NULL, 'Hydrating Facial', 1, 350.00, 5.00, 0, 350.00, 17.50, 367.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(5, 2, 'service', 1, NULL, NULL, 4, NULL, 'Women\'s Haircut & Blow-dry', 1, 180.00, 5.00, 0, 180.00, 9.00, 189.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(6, 3, 'service', 2, NULL, NULL, 4, NULL, 'Balayage / Highlights', 1, 650.00, 5.00, 0, 650.00, 32.50, 682.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(7, 3, 'service', 5, NULL, NULL, 4, NULL, 'Gel Manicure & Pedicure', 1, 280.00, 5.00, 0, 280.00, 14.00, 294.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(8, 3, 'service', 13, NULL, NULL, 4, NULL, 'Eyebrow Threading', 1, 45.00, 5.00, 0, 45.00, 2.25, 47.25, 0, 3, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(9, 4, 'service', 3, NULL, NULL, 4, NULL, 'Keratin Treatment', 1, 850.00, 5.00, 0, 850.00, 42.50, 892.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(10, 4, 'service', 8, NULL, NULL, 4, NULL, 'Swedish Massage 60 min', 1, 320.00, 5.00, 0, 320.00, 16.00, 336.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(11, 5, 'service', 1, NULL, NULL, 4, NULL, 'Women\'s Haircut & Blow-dry', 1, 180.00, 5.00, 0, 180.00, 9.00, 189.00, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(12, 5, 'service', 4, NULL, NULL, 4, NULL, 'Classic Manicure', 1, 95.00, 5.00, 0, 95.00, 4.75, 99.75, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(13, 5, 'service', 12, NULL, NULL, 4, NULL, 'Full Leg Wax', 1, 120.00, 5.00, 0, 120.00, 6.00, 126.00, 0, 3, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(14, 6, 'service', 2, NULL, NULL, 4, NULL, 'Balayage / Highlights', 1, 650.00, 5.00, 0, 650.00, 32.50, 682.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(15, 6, 'service', 7, NULL, NULL, 4, NULL, 'Gold Facial', 1, 420.00, 5.00, 0, 420.00, 21.00, 441.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(16, 6, 'service', 5, NULL, NULL, 4, NULL, 'Gel Manicure & Pedicure', 1, 280.00, 5.00, 0, 280.00, 14.00, 294.00, 0, 3, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(17, 7, 'service', 6, NULL, NULL, 4, NULL, 'Hydrating Facial', 1, 350.00, 5.00, 0, 350.00, 17.50, 367.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(18, 7, 'service', 1, NULL, NULL, 4, NULL, 'Women\'s Haircut & Blow-dry', 1, 180.00, 5.00, 0, 180.00, 9.00, 189.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(19, 7, 'service', 9, NULL, NULL, 4, NULL, 'Hot Stone Massage', 1, 380.00, 5.00, 0, 380.00, 19.00, 399.00, 0, 3, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(20, 8, 'service', 2, NULL, NULL, 4, NULL, 'Balayage / Highlights', 1, 650.00, 5.00, 0, 650.00, 32.50, 682.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(21, 8, 'service', 1, NULL, NULL, 4, NULL, 'Women\'s Haircut & Blow-dry', 1, 180.00, 5.00, 0, 180.00, 9.00, 189.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(22, 9, 'service', 2, NULL, NULL, 4, NULL, 'Balayage / Highlights', 1, 650.00, 5.00, 0, 650.00, 32.50, 682.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(23, 9, 'service', 6, NULL, NULL, 4, NULL, 'Hydrating Facial', 1, 350.00, 5.00, 0, 350.00, 17.50, 367.50, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(24, 10, 'service', 3, NULL, NULL, 4, NULL, 'Keratin Treatment', 1, 850.00, 5.00, 0, 850.00, 42.50, 892.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(25, 10, 'service', 8, NULL, NULL, 4, NULL, 'Swedish Massage 60 min', 1, 320.00, 5.00, 0, 320.00, 16.00, 336.00, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(26, 11, 'service', 5, NULL, NULL, 4, NULL, 'Gel Manicure & Pedicure', 1, 280.00, 5.00, 0, 280.00, 14.00, 294.00, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(27, 11, 'service', 4, NULL, NULL, 4, NULL, 'Classic Manicure', 1, 95.00, 5.00, 0, 95.00, 4.75, 99.75, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(28, 12, 'service', 2, NULL, NULL, 4, NULL, 'Balayage / Highlights', 1, 650.00, 5.00, 0, 650.00, 32.50, 682.50, 0, 1, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(29, 12, 'service', 10, NULL, NULL, 4, NULL, 'Evening Glam Makeup', 1, 450.00, 5.00, 0, 450.00, 22.50, 472.50, 0, 2, '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(30, 13, 'package_redemption', 1, NULL, NULL, NULL, 6, 'Women\'s Haircut & Blow-dry (Package Redemption)', 2, 0.00, 0.00, 1, 0.00, 0.00, 0.00, 15, 1, '2026-06-30 03:49:22', '2026-06-30 03:49:22'),
(31, 13, 'package', NULL, 9, NULL, NULL, NULL, 'Glow Essentials — 10 Sessions', 1, 1500.00, 5.00, 0, 1500.00, 75.00, 1575.00, 0, 2, '2026-06-30 03:49:22', '2026-06-30 03:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `sale_payments`
--

CREATE TABLE `sale_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `received_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'completed',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_payments`
--

INSERT INTO `sale_payments` (`id`, `sale_id`, `payment_method_id`, `amount`, `reference`, `received_by`, `status`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 383.25, 'DEMO-PAY-1', 3, 'completed', '2026-06-24 05:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(2, 2, 2, 556.50, 'DEMO-PAY-2', 3, 'completed', '2026-06-25 06:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(3, 3, 1, 1023.75, 'DEMO-PAY-3', 3, 'completed', '2026-06-26 07:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(4, 4, 2, 1228.50, 'DEMO-PAY-4', 3, 'completed', '2026-06-27 08:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(5, 5, 1, 414.75, 'DEMO-PAY-5', 3, 'completed', '2026-06-28 09:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(6, 6, 2, 1417.50, 'DEMO-PAY-6', 3, 'completed', '2026-06-29 04:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(7, 7, 1, 955.50, 'DEMO-PAY-7', 3, 'completed', '2026-06-30 05:45:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(8, 8, 2, 871.50, 'DEMO-PAY-8', 3, 'completed', '2026-06-20 09:00:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(9, 9, 2, 1050.00, 'DEMO-PAY-9', 3, 'completed', '2026-06-16 09:00:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(10, 10, 2, 1228.50, 'DEMO-PAY-10', 3, 'completed', '2026-06-12 09:00:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(11, 11, 2, 393.75, 'DEMO-PAY-11', 3, 'completed', '2026-06-08 09:00:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(12, 12, 2, 1155.00, 'DEMO-PAY-12', 3, 'completed', '2026-06-04 09:00:00', '2026-06-30 02:51:10', '2026-06-30 02:51:10'),
(13, 13, 1, 1575.00, NULL, 1, 'completed', '2026-06-30 03:49:22', '2026-06-30 03:49:22', '2026-06-30 03:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `service_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `duration_minutes` smallint(5) UNSIGNED NOT NULL DEFAULT 30,
  `price` decimal(12,2) NOT NULL,
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 5.00,
  `vat_inclusive` tinyint(1) NOT NULL DEFAULT 0,
  `commission_rate` decimal(8,2) DEFAULT NULL,
  `commission_type` varchar(20) NOT NULL DEFAULT 'percentage',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `company_id`, `service_category_id`, `code`, `name`, `description`, `image`, `duration_minutes`, `price`, `vat_rate`, `vat_inclusive`, `commission_rate`, `commission_type`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'SRV0001', 'Women\'s Haircut & Blow-dry', NULL, 'services/1/nkXwR9eExzMo6hOeFxzvpM4exWLHUpL3vW1TjQee.webp', 60, 180.00, 5.00, 0, 15.00, 'percentage', 1, 1, '2026-06-29 08:29:02', '2026-06-30 04:55:55', NULL),
(2, 1, 1, 'SRV0002', 'Balayage / Highlights', NULL, 'services/2/xpOg0ARn7WvnxPkewQAAn43PAHxtXdEf4JG9sOr1.webp', 180, 650.00, 5.00, 0, 20.00, 'percentage', 1, 2, '2026-06-29 08:29:02', '2026-06-30 04:57:47', NULL),
(3, 1, 1, 'SRV0003', 'Keratin Treatment', NULL, 'services/3/Ahe1xGkKcSHZmu9DfOo2bI5nfQ3B7gDMU1yDSVv7.webp', 150, 850.00, 5.00, 0, 18.00, 'percentage', 1, 3, '2026-06-29 08:29:02', '2026-06-30 04:58:02', NULL),
(4, 1, 2, 'SRV0004', 'Classic Manicure', NULL, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', 45, 95.00, 5.00, 0, 12.00, 'percentage', 1, 4, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(5, 1, 2, 'SRV0005', 'Gel Manicure & Pedicure', NULL, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', 90, 280.00, 5.00, 0, 15.00, 'percentage', 1, 5, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(6, 1, 3, 'SRV0006', 'Hydrating Facial', NULL, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 60, 350.00, 5.00, 0, 15.00, 'percentage', 1, 6, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(7, 1, 3, 'SRV0007', 'Gold Facial', NULL, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 75, 420.00, 5.00, 0, 18.00, 'percentage', 1, 7, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(8, 1, 4, 'SRV0008', 'Swedish Massage 60 min', NULL, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', 60, 320.00, 5.00, 0, 12.00, 'percentage', 1, 8, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(9, 1, 4, 'SRV0009', 'Hot Stone Massage', NULL, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', 75, 380.00, 5.00, 0, 12.00, 'percentage', 1, 9, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(10, 1, 5, 'SRV0010', 'Evening Glam Makeup', NULL, 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80', 90, 450.00, 5.00, 0, 20.00, 'percentage', 1, 10, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(11, 1, 5, 'SRV0011', 'Bridal Makeup Trial', NULL, 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80', 120, 600.00, 5.00, 0, 20.00, 'percentage', 1, 11, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(12, 1, 6, 'SRV0012', 'Full Leg Wax', NULL, 'services/12/bErEK8y62nuvM59DhApPRWfIVfwOP3nVnAPMjv2s.jpg', 45, 120.00, 5.00, 0, 10.00, 'percentage', 1, 12, '2026-06-29 08:29:02', '2026-06-30 04:59:41', NULL),
(13, 1, 6, 'SRV0013', 'Eyebrow Threading', NULL, 'services/13/7IeEsXn9mzxZFGSqItr501ZSwGr66JPpZLD4MXuB.jpg', 15, 45.00, 5.00, 0, 10.00, 'percentage', 1, 13, '2026-06-29 08:29:02', '2026-06-30 05:00:49', NULL),
(14, 1, 7, 'SRV0014', 'Full Day Spa Package', NULL, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80', 300, 1200.00, 5.00, 1, 15.00, 'percentage', 1, 14, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL),
(15, 1, 1, 'SRV0015', 'Men\'s Haircut', NULL, 'https://images.unsplash.com/photo-1521590832167-7bcbfda6381b?auto=format&fit=crop&w=800&q=80', 30, 80.00, 5.00, 0, 12.00, 'percentage', 0, 15, '2026-06-29 08:29:02', '2026-06-30 04:47:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_categories`
--

INSERT INTO `service_categories` (`id`, `company_id`, `parent_id`, `name`, `code`, `description`, `icon`, `color`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 'Hair Services', 'HAIR', NULL, 'scissors', '#7A2E3E', 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, NULL, 'Nail Services', 'NAILS', NULL, 'sparkles', '#B76E79', 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, NULL, 'Facial & Skin', 'SKIN', NULL, 'flower', '#C9A46C', 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, NULL, 'Spa & Massage', 'SPA', NULL, 'heart', '#5C2230', 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, NULL, 'Makeup & Bridal', 'MAKEUP', NULL, 'palette', '#9B3D52', 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, NULL, 'Waxing & Threading', 'WAX', NULL, 'star', '#6B5B57', 1, 6, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(7, 1, NULL, 'Packages & Combos', 'PACKAGES', NULL, 'gift', '#D4A574', 1, 7, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(8, 1, 1, 'Haircut & Styling', 'HAIR_CUT', NULL, NULL, NULL, 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(9, 1, 1, 'Hair Coloring', 'HAIR_COLOR', NULL, NULL, NULL, 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(10, 1, 1, 'Hair Treatments', 'HAIR_TREAT', NULL, NULL, NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_packages`
--

CREATE TABLE `service_packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `points_included` int(10) UNSIGNED NOT NULL,
  `validity_days` int(10) UNSIGNED DEFAULT NULL,
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 5.00,
  `vat_inclusive` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_packages`
--

INSERT INTO `service_packages` (`id`, `company_id`, `code`, `name`, `description`, `price`, `points_included`, `validity_days`, `vat_rate`, `vat_inclusive`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(9, 1, 'PKG0001', 'Glow Essentials — 10 Sessions', '10-session facial & skincare package with flexible point redemption.', 1500.00, 100, 180, 5.00, 0, 1, 1, '2026-06-29 08:46:28', '2026-06-29 08:46:28', NULL),
(10, 1, 'PKG0002', 'Hair Care Bundle', 'Wash, cut & blow-dry sessions redeemable with points.', 800.00, 60, 90, 5.00, 0, 1, 2, '2026-06-29 08:46:28', '2026-06-29 08:46:28', NULL),
(11, 1, 'PKG0003', 'Bridal Prep Package', 'Premium bridal services with extended validity.', 3500.00, 250, 365, 5.00, 0, 1, 3, '2026-06-29 08:46:28', '2026-06-29 08:46:28', NULL),
(12, 1, 'PKG0004', 'Quick Refresh — 5 Visits', 'Short validity package for express services.', 450.00, 30, 60, 5.00, 0, 1, 4, '2026-06-29 08:46:28', '2026-06-29 08:46:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_package_items`
--

CREATE TABLE `service_package_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `service_package_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `points_cost` int(10) UNSIGNED NOT NULL,
  `quantity_included` smallint(5) UNSIGNED DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_package_items`
--

INSERT INTO `service_package_items` (`id`, `service_package_id`, `service_id`, `points_cost`, `quantity_included`, `sort_order`, `created_at`, `updated_at`) VALUES
(21, 9, 4, 12, NULL, 1, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(22, 9, 5, 15, NULL, 2, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(23, 9, 3, 10, NULL, 3, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(24, 10, 1, 15, NULL, 1, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(25, 10, 2, 20, NULL, 2, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(26, 11, 9, 80, NULL, 1, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(27, 11, 10, 60, NULL, 2, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(28, 11, 8, 40, NULL, 3, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(29, 12, 7, 8, NULL, 1, '2026-06-29 08:46:28', '2026-06-29 08:46:28'),
(30, 12, 11, 6, NULL, 2, '2026-06-29 08:46:28', '2026-06-29 08:46:28');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('pdwyatxcK3x93QxK8pmqIZpFwJeniH2ITxh4sbrj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFlYbkxma3BxZHFObFhlNjFSWmxuOWNpaG1HSkFZYjZEdmh4d3ZVVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1782726489);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'general',
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'string' COMMENT 'string|boolean|integer|json',
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `company_id`, `branch_id`, `group`, `key`, `value`, `type`, `description`, `is_public`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 'general', 'app_name', 'Beauty Salon ERP', 'string', 'Application display name', 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, NULL, 'regional', 'timezone', 'Asia/Dubai', 'string', 'Default timezone', 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, NULL, 'regional', 'currency', 'AED', 'string', 'Default currency', 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, NULL, 'regional', 'currency_symbol', 'د.إ', 'string', 'Currency symbol', 1, '2026-06-29 06:20:49', '2026-06-29 06:20:49', NULL),
(5, 1, NULL, 'tax', 'vat_rate', '0', 'integer', 'Default VAT rate (optional; per-item rates take precedence)', 1, '2026-06-29 06:20:49', '2026-06-30 04:26:43', NULL),
(6, 1, NULL, 'tax', 'vat_enabled', '0', 'boolean', 'Legacy flag — VAT is applied per item when item VAT rate is set', 1, '2026-06-29 06:20:49', '2026-06-30 04:26:43', NULL),
(7, 1, NULL, 'appearance', 'primary_color', '#7A2E3E', 'string', 'Primary brand color', 1, '2026-06-29 06:20:49', '2026-06-29 07:49:38', NULL),
(8, 1, NULL, 'appearance', 'secondary_color', '#C9A46C', 'string', 'Secondary brand color', 1, '2026-06-29 06:20:49', '2026-06-29 06:20:49', NULL),
(9, 1, NULL, 'general', 'app_logo', 'settings/app_logo/1/kC0rqD7gBUCAcvPTPQCUD4cJiXc1bdKcKVVSDUcY.jpg', 'string', 'Application logo shown in the sidebar and login screen', 1, '2026-06-29 10:18:43', '2026-06-30 06:44:36', NULL),
(10, 1, NULL, 'general', 'app_favicon', 'settings/app_favicon/1/tVteIaSHGjLzfYWcmFIAkdTvfYTUrU2AOeGJ4ep3.png', 'string', 'Browser tab favicon (PNG, ICO, or SVG recommended)', 1, '2026-06-30 02:36:26', '2026-06-30 06:44:40', NULL),
(11, 1, NULL, 'website', 'salon_interior_image', 'settings/salon_interior_image/1/x3xNjDPDyT78AdHRxcnTOac0Fy8zP5bLzyM4MmBZ.webp', 'string', 'Salon interior image on the public website home page', 1, '2026-06-30 04:26:43', '2026-06-30 06:44:48', NULL),
(12, 1, NULL, 'website', 'business_hours', 'Sun – Thu: 10:00 – 21:00 · Fri – Sat: 10:00 – 22:00', 'string', 'Opening hours shown on the public website', 1, '2026-06-30 04:26:43', '2026-06-30 04:26:43', NULL),
(13, 1, NULL, 'website', 'map_query', 'Dubai Marina, UAE', 'string', 'Location query for the Google Maps embed on the contact page', 1, '2026-06-30 04:26:43', '2026-06-30 04:26:43', NULL),
(14, 1, NULL, 'website', 'public_phone', '+971 4 123 4567', 'string', 'Phone number on the public website contact page', 1, '2026-06-30 04:47:21', '2026-06-30 04:47:21', NULL),
(15, 1, NULL, 'website', 'public_email', 'info@luxebeauty.ae', 'string', 'Email address on the public website contact page', 1, '2026-06-30 04:47:21', '2026-06-30 05:03:57', NULL),
(16, 1, NULL, 'website', 'public_address', 'Marina Walk, Dubai Marina, UAE', 'string', 'Street address on the public website contact page', 1, '2026-06-30 04:47:21', '2026-06-30 04:47:21', NULL),
(17, 1, NULL, 'website', 'map_url', 'https://www.google.com/maps/place/Dubai+Marina', 'string', 'Google Maps link — open Google Maps, tap Share, and paste the link here', 1, '2026-06-30 04:47:21', '2026-06-30 04:47:21', NULL),
(18, 1, NULL, 'website', 'public_website_name', 'Luxe Beauty Lounge', 'string', 'Salon name shown on the public marketing website', 1, '2026-06-30 05:25:20', '2026-06-30 05:25:20', NULL),
(19, 1, NULL, 'website', 'banner_home', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80', 'string', 'Homepage hero carousel background', 1, '2026-06-30 05:25:20', '2026-06-30 05:25:20', NULL),
(20, 1, NULL, 'website', 'banner_about', 'settings/banner_about/1/1YZnYgiSgM8PGjd4PkAR5yz8yt1hNd76tQgzkwjv.webp', 'string', 'About page header banner', 1, '2026-06-30 05:25:20', '2026-06-30 06:45:05', NULL),
(21, 1, NULL, 'website', 'banner_services', 'settings/banner_services/1/mz3PwEOHt194YiJCTiC1CV438JytXYCESUrkPZVf.webp', 'string', 'Services page header banner', 1, '2026-06-30 05:25:20', '2026-06-30 06:45:12', NULL),
(22, 1, NULL, 'website', 'banner_shop', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80', 'string', 'Shop page header banner', 1, '2026-06-30 05:25:20', '2026-06-30 05:25:20', NULL),
(23, 1, NULL, 'website', 'banner_blog', 'settings/banner_blog/1/pOwC1kfwHtIzst9v4cUy4PJY7PrA90RnElsfRGrI.webp', 'string', 'Blog page header banner', 1, '2026-06-30 05:25:20', '2026-06-30 06:45:26', NULL),
(24, 1, NULL, 'website', 'banner_team', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80', 'string', 'Team page header banner', 1, '2026-06-30 05:25:20', '2026-06-30 05:25:20', NULL),
(25, 1, NULL, 'website', 'banner_contact', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1600&q=80', 'string', 'Contact page header banner', 1, '2026-06-30 05:25:20', '2026-06-30 05:25:20', NULL),
(26, 1, NULL, 'website', 'homepage_team_ids', '[8,5,11,9]', 'json', 'Up to 4 staff IDs shown in the homepage Meet the Artists section', 1, '2026-06-30 05:56:34', '2026-06-30 06:01:11', NULL),
(27, 1, NULL, 'website', 'public_whatsapp', '971501234567', 'string', 'WhatsApp number for the public website footer', 1, '2026-06-30 08:26:16', '2026-06-30 08:26:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff_attendance`
--

CREATE TABLE `staff_attendance` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'present',
  `notes` text DEFAULT NULL,
  `recorded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_attendance`
--

INSERT INTO `staff_attendance` (`id`, `company_id`, `user_id`, `branch_id`, `attendance_date`, `check_in`, `check_out`, `status`, `notes`, `recorded_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, '2026-06-29', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(2, 1, 1, 1, '2026-06-26', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(3, 1, 1, 1, '2026-06-25', '09:00:00', '18:00:00', 'late', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(4, 1, 1, 1, '2026-06-24', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(5, 1, 1, 1, '2026-06-23', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(6, 1, 1, 1, '2026-06-22', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(7, 1, 1, 1, '2026-06-19', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(8, 1, 1, 1, '2026-06-18', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(9, 1, 1, 1, '2026-06-17', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(10, 1, 1, 1, '2026-06-16', '09:00:00', '18:00:00', 'present', NULL, 1, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(11, 1, 2, 1, '2026-06-29', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(12, 1, 2, 1, '2026-06-26', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(13, 1, 2, 1, '2026-06-25', '09:00:00', '18:00:00', 'late', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(14, 1, 2, 1, '2026-06-24', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(15, 1, 2, 1, '2026-06-23', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(16, 1, 2, 1, '2026-06-22', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(17, 1, 2, 1, '2026-06-19', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(18, 1, 2, 1, '2026-06-18', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(19, 1, 2, 1, '2026-06-17', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(20, 1, 2, 1, '2026-06-16', '09:00:00', '18:00:00', 'present', NULL, 2, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(21, 1, 3, 1, '2026-06-29', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(22, 1, 3, 1, '2026-06-26', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(23, 1, 3, 1, '2026-06-25', '09:00:00', '18:00:00', 'late', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(24, 1, 3, 1, '2026-06-24', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(25, 1, 3, 1, '2026-06-23', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(26, 1, 3, 1, '2026-06-22', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(27, 1, 3, 1, '2026-06-19', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(28, 1, 3, 1, '2026-06-18', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(29, 1, 3, 1, '2026-06-17', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(30, 1, 3, 1, '2026-06-16', '09:00:00', '18:00:00', 'present', NULL, 3, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(31, 1, 4, 1, '2026-06-29', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(32, 1, 4, 1, '2026-06-26', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(33, 1, 4, 1, '2026-06-25', '09:00:00', '18:00:00', 'late', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(34, 1, 4, 1, '2026-06-24', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(35, 1, 4, 1, '2026-06-23', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(36, 1, 4, 1, '2026-06-22', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(37, 1, 4, 1, '2026-06-19', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(38, 1, 4, 1, '2026-06-18', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(39, 1, 4, 1, '2026-06-17', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(40, 1, 4, 1, '2026-06-16', '09:00:00', '18:00:00', 'present', NULL, 4, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff_commission_rules`
--

CREATE TABLE `staff_commission_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `service_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `rate_type` varchar(20) NOT NULL DEFAULT 'percentage',
  `rate_value` decimal(8,2) NOT NULL,
  `min_sale_amount` decimal(12,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_commission_rules`
--

INSERT INTO `staff_commission_rules` (`id`, `company_id`, `user_id`, `service_category_id`, `name`, `rate_type`, `rate_value`, `min_sale_amount`, `is_active`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 4, 1, 'Hair Services Commission', 'percentage', 15.00, NULL, 1, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(2, 1, 4, 3, 'Facial Commission', 'percentage', 10.00, NULL, 1, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff_designations`
--

CREATE TABLE `staff_designations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `level` tinyint(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT '1=junior, 5=senior',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_designations`
--

INSERT INTO `staff_designations` (`id`, `company_id`, `department_id`, `name`, `code`, `level`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 6, 'Salon Owner', 'OWNER', 5, NULL, 1, 5, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(2, 1, 6, 'Branch Manager', 'MGR', 4, NULL, 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(3, 1, 6, 'Receptionist', 'RECEP', 2, NULL, 1, 2, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(4, 1, 1, 'Senior Stylist', 'SR_STY', 4, NULL, 1, 4, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(5, 1, 1, 'Hair Stylist', 'STY', 3, NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(6, 1, 1, 'Junior Stylist', 'JR_STY', 1, NULL, 1, 1, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(7, 1, 2, 'Nail Technician', 'NAIL_TECH', 3, NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(8, 1, 3, 'Esthetician', 'ESTH', 3, NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(9, 1, 4, 'Spa Therapist', 'THER', 3, NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL),
(10, 1, 5, 'Makeup Artist', 'MU_ART', 3, NULL, 1, 3, '2026-06-29 06:20:48', '2026-06-29 06:20:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff_documents`
--

CREATE TABLE `staff_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `document_type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `document_number` varchar(100) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_documents`
--

INSERT INTO `staff_documents` (`id`, `company_id`, `user_id`, `document_type`, `title`, `file_path`, `document_number`, `issue_date`, `expiry_date`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'passport', 'Passport Copy', NULL, 'P0000001', '2021-06-29', '2029-06-29', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(2, 1, 2, 'passport', 'Passport Copy', NULL, 'P0000002', '2021-06-29', '2029-06-29', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(3, 1, 2, 'visa', 'Residence Visa', NULL, 'VISA-2019-45678', NULL, '2027-03-01', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(4, 1, 3, 'passport', 'Passport Copy', NULL, 'P0000003', '2021-06-29', '2029-06-29', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(5, 1, 3, 'visa', 'Residence Visa', NULL, 'VISA-2021-78901', NULL, '2027-08-29', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(6, 1, 4, 'passport', 'Passport Copy', NULL, 'P0000004', '2021-06-29', '2029-06-29', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(7, 1, 4, 'visa', 'Residence Visa', NULL, 'VISA-2020-34567', NULL, '2026-08-13', NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff_leave_requests`
--

CREATE TABLE `staff_leave_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `leave_type` varchar(30) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `days` smallint(5) UNSIGNED NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `reason` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_leave_requests`
--

INSERT INTO `staff_leave_requests` (`id`, `company_id`, `user_id`, `leave_type`, `start_date`, `end_date`, `days`, `status`, `reason`, `admin_notes`, `approved_by`, `approved_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 4, 'annual', '2026-07-29', '2026-08-02', 5, 'pending', 'Family visit home country', NULL, NULL, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff_salaries`
--

CREATE TABLE `staff_salaries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `base_salary` decimal(12,2) NOT NULL,
  `housing_allowance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `transport_allowance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `other_allowance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'AED',
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_salaries`
--

INSERT INTO `staff_salaries` (`id`, `company_id`, `user_id`, `base_salary`, `housing_allowance`, `transport_allowance`, `other_allowance`, `currency`, `effective_from`, `effective_to`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 25000.00, 6250.00, 500.00, 0.00, 'AED', '2018-01-15', NULL, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(2, 1, 2, 18000.00, 4500.00, 500.00, 0.00, 'AED', '2019-06-01', NULL, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(3, 1, 3, 8000.00, 2000.00, 500.00, 0.00, 'AED', '2021-03-10', NULL, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL),
(4, 1, 4, 12000.00, 3000.00, 500.00, 0.00, 'AED', '2020-09-01', NULL, NULL, '2026-06-29 08:18:29', '2026-06-29 08:18:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `stock_purchase_id` bigint(20) UNSIGNED DEFAULT NULL,
  `stock_purchase_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sale_id` bigint(20) UNSIGNED DEFAULT NULL,
  `appointment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(30) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `balance_after` decimal(12,3) NOT NULL,
  `unit_cost` decimal(12,2) DEFAULT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `company_id`, `branch_id`, `product_id`, `stock_purchase_id`, `stock_purchase_item_id`, `sale_id`, `appointment_id`, `service_id`, `created_by`, `type`, `quantity`, `balance_after`, `unit_cost`, `reference`, `description`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 12.000, 12.000, 45.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(2, 1, 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 18.000, 18.000, 18.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(3, 1, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 2.000, 2.000, 95.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(4, 1, 1, 4, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 6.000, 6.000, 55.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(5, 1, 1, 5, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 24.000, 24.000, 12.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(6, 1, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 4.000, 4.000, 25.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25'),
(7, 1, 1, 7, NULL, NULL, NULL, NULL, NULL, NULL, 'adjustment', 3.000, 3.000, 15.00, 'OPENING', 'Opening stock balance', NULL, '2026-06-29 09:15:25', '2026-06-29 09:15:25');

-- --------------------------------------------------------

--
-- Table structure for table `stock_purchases`
--

CREATE TABLE `stock_purchases` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `received_by` bigint(20) UNSIGNED DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `reference` varchar(100) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `vat_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `ordered_at` timestamp NULL DEFAULT NULL,
  `received_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_purchase_items`
--

CREATE TABLE `stock_purchase_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `stock_purchase_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity_ordered` decimal(12,3) NOT NULL,
  `quantity_received` decimal(12,3) NOT NULL DEFAULT 0.000,
  `unit_cost` decimal(12,2) NOT NULL,
  `vat_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `line_subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `line_vat` decimal(12,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `expiry_date` date DEFAULT NULL,
  `batch_number` varchar(50) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `tax_number` varchar(50) DEFAULT NULL,
  `payment_terms` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `company_id`, `code`, `name`, `contact_person`, `email`, `phone`, `address`, `tax_number`, `payment_terms`, `notes`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'SUP0001', 'Beauty Supply UAE', 'Ahmed Hassan', 'orders@beautysupply.ae', '+971 4 123 4567', NULL, NULL, 'Net 30', NULL, 1, '2026-06-29 09:15:24', '2026-06-29 09:15:24', NULL),
(2, 1, 'SUP0002', 'Professional Hair Distributors', 'Sarah Khan', 'sales@phd.ae', '+971 4 234 5678', NULL, NULL, 'Net 15', NULL, 1, '2026-06-29 09:15:24', '2026-06-29 09:15:24', NULL),
(3, 1, 'SUP0003', 'Spa Essentials Trading', 'Maria Lopez', 'info@spaessentials.ae', '+971 4 345 6789', NULL, NULL, 'COD', NULL, 1, '2026-06-29 09:15:24', '2026-06-29 09:15:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `quote` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `company_id`, `quote`, `name`, `role`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'The most luxurious salon experience in Dubai. My balayage turned out exactly as I imagined — flawless.', 'Amira K.', 'Regular Client', 1, 1, '2026-06-30 07:58:02', '2026-06-30 07:58:02'),
(2, 1, 'Impeccable service from booking to checkout. The team remembers every detail. Absolutely worth it.', 'Jessica M.', 'Bridal Client', 2, 1, '2026-06-30 07:58:02', '2026-06-30 07:58:02'),
(3, 1, 'Their keratin treatment transformed my hair. Professional, warm, and the space feels like a boutique spa.', 'Fatima A.', 'VIP Member', 3, 1, '2026-06-30 07:58:02', '2026-06-30 07:58:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `staff_designation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_code` varchar(30) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `employment_type` varchar(30) DEFAULT NULL,
  `emirates_id` varchar(30) DEFAULT NULL,
  `visa_number` varchar(50) DEFAULT NULL,
  `visa_expiry` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(30) DEFAULT NULL,
  `staff_notes` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `company_id`, `branch_id`, `department_id`, `staff_designation_id`, `employee_code`, `name`, `email`, `phone`, `date_of_birth`, `gender`, `nationality`, `joining_date`, `employment_type`, `emirates_id`, `visa_number`, `visa_expiry`, `address`, `emergency_contact_name`, `emergency_contact_phone`, `staff_notes`, `avatar`, `is_active`, `last_login_at`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 6, 1, 'EMP001', 'Salon Owner', 'owner@luxebeauty.ae', '+971 50 123 4567', NULL, 'female', 'UAE', '2018-01-15', 'full_time', '784-1985-1234567-1', NULL, NULL, 'Dubai Marina, UAE', 'Ahmed Al Mansoori', '+971501112233', NULL, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80', 1, '2026-06-30 09:54:46', '2026-06-29 06:20:49', '$2y$12$I7iCETF552cXHNEXwB1kKu5aTT8EsY8fnp6h.aAWD2cpSvy3Bu1ta', NULL, '2026-06-29 06:20:49', '2026-06-30 09:54:46', NULL),
(2, 1, 1, 6, 2, 'EMP002', 'System Admin', 'admin@luxebeauty.ae', '+971 50 234 5678', NULL, 'male', 'India', '2019-06-01', 'full_time', NULL, 'VISA-2019-45678', '2027-03-01', 'Business Bay, Dubai', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80', 1, '2026-06-30 08:50:04', '2026-06-29 06:20:49', '$2y$12$KDPbv0VAXwjjeG2xulr9Ce/k.cgM92FKDkXNb3w4oWubADDhp/ese', NULL, '2026-06-29 06:20:49', '2026-06-30 08:50:04', NULL),
(3, 1, 1, 6, 3, 'EMP003', 'Front Desk', 'reception@luxebeauty.ae', '+971 50 345 6789', NULL, 'female', 'Philippines', '2021-03-10', 'full_time', NULL, 'VISA-2021-78901', '2027-08-29', NULL, NULL, NULL, NULL, 'staff/3/M8Id7IKuUfcM7HvQCJ4vriiHtC1eq4nB4kFXt2mL.jpg', 1, '2026-06-30 09:42:29', '2026-06-29 06:20:50', '$2y$12$gI2r11YyUnLJANdlzhcrxO0qaGSEO6E.7LawStGCtBqTvD5VQ.w4i', NULL, '2026-06-29 06:20:50', '2026-06-30 09:42:29', NULL),
(4, 1, 1, 1, 5, 'EMP004', 'Beauty Specialist', 'staff@luxebeauty.ae', '+971 50 456 7890', NULL, 'female', 'Lebanon', '2020-09-01', 'full_time', NULL, 'VISA-2020-34567', '2026-08-13', NULL, NULL, NULL, 'Senior stylist — specialises in colour and bridal makeup.', 'staff/4/wxqk4q9GOW4WjYd751sTla8VfJzuHb7Vqn4bGgom.webp', 1, '2026-06-30 09:43:17', '2026-06-29 06:20:50', '$2y$12$HCUEhLncUVAwt0r2jacwDOMqCVo/4HejibMEPqCNZjq4X9VJKMS1G', NULL, '2026-06-29 06:20:50', '2026-06-30 09:43:17', NULL),
(5, 1, 1, 1, 4, 'EMP005', 'Layla Mansour', 'layla.mansour@luxebeauty.ae', '+971 50 567 8901', NULL, 'female', 'Lebanon', '2019-04-12', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Senior colourist specialising in balayage and bridal hair.', 'staff/5/APXu6qqayV9vuFzu9A0jfyXtL7dXhLkpXcsmb8H7.webp', 1, NULL, '2026-06-30 05:57:30', '$2y$12$xyYk6YxN2wNCuufCKqoK4O7Y7m5uGKu01kd6X4UnpZlf12JHmNdhm', NULL, '2026-06-30 05:44:53', '2026-06-30 06:59:10', NULL),
(6, 1, 1, 1, 5, 'EMP006', 'Sarah Al Mazrouei', 'sarah.almazrouei@luxebeauty.ae', '+971 50 678 9012', NULL, 'female', 'UAE', '2021-08-20', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Precision cuts and blow-dry specialist.', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:30', '$2y$12$LPIB47F3zkVXHGx10lqwF.fOYH03UhsdvThgt4kxQ.40UZTwjDpjm', NULL, '2026-06-30 05:44:53', '2026-06-30 05:57:30', NULL),
(7, 1, 1, 2, 7, 'EMP007', 'Priya Sharma', 'priya.sharma@luxebeauty.ae', '+971 50 789 0123', NULL, 'female', 'India', '2020-11-05', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Gel extensions and nail art expert.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:31', '$2y$12$t/2YytYyAL.giBQebq6d3.EOXBwhTF5xH2aXqZ5QQ0lFSr7rwe2YK', NULL, '2026-06-30 05:44:54', '2026-06-30 05:57:31', NULL),
(8, 1, 1, 3, 8, 'EMP008', 'Elena Volkov', 'elena.volkov@luxebeauty.ae', '+971 50 890 1234', NULL, 'female', 'Russia', '2022-02-14', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Hydrafacial and anti-ageing skincare treatments.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:31', '$2y$12$lnHzVEiNRbQHeoT5J9aONeXt9QOLPAIzWZH7vX3WUOfOL3NuJVIaO', NULL, '2026-06-30 05:44:54', '2026-06-30 05:57:31', NULL),
(9, 1, 1, 4, 9, 'EMP009', 'Maria Santos', 'maria.santos@luxebeauty.ae', '+971 50 901 2345', NULL, 'female', 'Philippines', '2021-05-18', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Swedish and hot stone massage therapist.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:32', '$2y$12$FxDIvlTnwA4P4EUCni6tmOEatb3xskCfJ8mebuImm2pDkfeH7jIK2', NULL, '2026-06-30 05:44:54', '2026-06-30 05:57:32', NULL),
(10, 1, 1, 5, 10, 'EMP010', 'Amira Khalid', 'amira.khalid@luxebeauty.ae', '+971 50 012 3456', NULL, 'female', 'Egypt', '2020-07-01', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Bridal and evening glam makeup artist.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:32', '$2y$12$wE.QgS6QldV3Fuw/jiPVeORJlxVlOERRh6WgkSP1JUo9T/NFFLzeO', NULL, '2026-06-30 05:44:55', '2026-06-30 05:57:32', NULL),
(11, 1, 1, 1, 6, 'EMP011', 'James Okonkwo', 'james.okonkwo@luxebeauty.ae', '+971 50 123 4560', NULL, 'male', 'Nigeria', '2023-09-10', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Men\'s grooming and contemporary styling.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:33', '$2y$12$79FkmcZaXB2AkZ0h15K4SeQ2afmiXyhP8r6GTcUp8EkoyvOqvZxGi', NULL, '2026-06-30 05:44:55', '2026-06-30 05:57:33', NULL),
(12, 1, 1, 3, 8, 'EMP012', 'Sofia Laurent', 'sofia.laurent@luxebeauty.ae', '+971 50 234 5670', NULL, 'female', 'France', '2022-11-22', 'full_time', NULL, NULL, NULL, NULL, NULL, NULL, 'Gold facial and luxury skincare rituals.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80', 1, NULL, '2026-06-30 05:57:33', '$2y$12$wjmEJAVf61/9n0p6m.0vp.gPqhY2O8wwMpFBdKBgMea.7YtGDMe3i', NULL, '2026-06-30 05:44:55', '2026-06-30 05:57:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `website_inquiries`
--

CREATE TABLE `website_inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `type` varchar(30) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'new',
  `name` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `website_inquiries`
--

INSERT INTO `website_inquiries` (`id`, `company_id`, `code`, `type`, `status`, `name`, `phone`, `email`, `subject`, `product_name`, `message`, `read_at`, `responded_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'INQ0001', 'product', 'responded', 'Satheesh Sukumaran', '+918089695413', 'sukumaransatheesh@gmail.com', 'Product Inquiry', 'Olaplex No.3 100ml', 'Please provide at least a phone number or email so we can reach you.', '2026-06-30 06:34:36', '2026-06-30 06:34:41', '2026-06-30 06:34:24', '2026-06-30 06:34:41'),
(2, 1, 'INQ0002', 'other', 'new', 'Katell Roy', '+1 (656) 163-3166', 'gyqyfemuke@mailinator.com', 'Quisquam cupiditate', NULL, 'Neque velit tempore', NULL, NULL, '2026-06-30 06:42:29', '2026-06-30 06:42:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`),
  ADD KEY `activity_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`),
  ADD KEY `activity_logs_action_index` (`action`),
  ADD KEY `activity_logs_created_at_index` (`created_at`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointments_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `appointments_branch_id_foreign` (`branch_id`),
  ADD KEY `appointments_customer_id_foreign` (`customer_id`),
  ADD KEY `appointments_staff_id_foreign` (`staff_id`),
  ADD KEY `appointments_booked_by_foreign` (`booked_by`),
  ADD KEY `appointments_company_id_scheduled_at_index` (`company_id`,`scheduled_at`),
  ADD KEY `appointments_company_id_status_index` (`company_id`,`status`),
  ADD KEY `appointments_company_id_staff_id_scheduled_at_index` (`company_id`,`staff_id`,`scheduled_at`),
  ADD KEY `appointments_company_id_customer_id_index` (`company_id`,`customer_id`);

--
-- Indexes for table `appointment_items`
--
ALTER TABLE `appointment_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_items_salon_service_id_foreign` (`salon_service_id`),
  ADD KEY `appointment_items_staff_id_foreign` (`staff_id`),
  ADD KEY `appointment_items_appointment_id_sort_order_index` (`appointment_id`,`sort_order`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  ADD KEY `blog_posts_company_id_is_published_published_at_index` (`company_id`,`is_published`,`published_at`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branches_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `branches_country_id_foreign` (`country_id`),
  ADD KEY `branches_emirate_id_foreign` (`emirate_id`),
  ADD KEY `branches_city_id_foreign` (`city_id`),
  ADD KEY `branches_company_id_is_active_index` (`company_id`,`is_active`),
  ADD KEY `branches_company_id_is_head_office_index` (`company_id`,`is_head_office`);

--
-- Indexes for table `branch_product_stock`
--
ALTER TABLE `branch_product_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branch_product_stock_branch_id_product_id_unique` (`branch_id`,`product_id`),
  ADD KEY `branch_product_stock_product_id_foreign` (`product_id`),
  ADD KEY `branch_product_stock_company_id_branch_id_index` (`company_id`,`branch_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brands_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `brands_company_id_is_active_index` (`company_id`,`is_active`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cities_emirate_id_name_unique` (`emirate_id`,`name`),
  ADD KEY `cities_country_id_emirate_id_is_active_index` (`country_id`,`emirate_id`,`is_active`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `companies_code_unique` (`code`),
  ADD KEY `companies_emirate_id_foreign` (`emirate_id`),
  ADD KEY `companies_city_id_foreign` (`city_id`),
  ADD KEY `companies_country_id_emirate_id_city_id_index` (`country_id`,`emirate_id`,`city_id`),
  ADD KEY `companies_is_active_index` (`is_active`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `countries_iso_code_unique` (`iso_code`),
  ADD KEY `countries_is_active_index` (`is_active`),
  ADD KEY `countries_sort_order_index` (`sort_order`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_company_id_code_unique` (`company_id`,`code`),
  ADD UNIQUE KEY `customers_company_id_phone_unique` (`company_id`,`phone`),
  ADD KEY `customers_branch_id_foreign` (`branch_id`),
  ADD KEY `customers_emirate_id_foreign` (`emirate_id`),
  ADD KEY `customers_city_id_foreign` (`city_id`),
  ADD KEY `customers_company_id_is_active_index` (`company_id`,`is_active`),
  ADD KEY `customers_company_id_name_index` (`company_id`,`name`),
  ADD KEY `customers_company_id_last_visit_at_index` (`company_id`,`last_visit_at`);

--
-- Indexes for table `customer_notes`
--
ALTER TABLE `customer_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_notes_user_id_foreign` (`user_id`),
  ADD KEY `customer_notes_customer_id_created_at_index` (`customer_id`,`created_at`),
  ADD KEY `customer_notes_company_id_customer_id_index` (`company_id`,`customer_id`);

--
-- Indexes for table `customer_packages`
--
ALTER TABLE `customer_packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_packages_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `customer_packages_service_package_id_foreign` (`service_package_id`),
  ADD KEY `customer_packages_branch_id_foreign` (`branch_id`),
  ADD KEY `customer_packages_sold_by_foreign` (`sold_by`),
  ADD KEY `customer_packages_company_id_customer_id_status_index` (`company_id`,`customer_id`,`status`),
  ADD KEY `customer_packages_customer_id_purchased_at_index` (`customer_id`,`purchased_at`),
  ADD KEY `customer_packages_sale_id_foreign` (`sale_id`);

--
-- Indexes for table `customer_point_transactions`
--
ALTER TABLE `customer_point_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_point_transactions_customer_id_foreign` (`customer_id`),
  ADD KEY `customer_point_transactions_appointment_id_foreign` (`appointment_id`),
  ADD KEY `customer_point_transactions_service_id_foreign` (`service_id`),
  ADD KEY `customer_point_transactions_created_by_foreign` (`created_by`),
  ADD KEY `cpt_company_customer_created_idx` (`company_id`,`customer_id`,`created_at`),
  ADD KEY `cpt_package_created_idx` (`customer_package_id`,`created_at`),
  ADD KEY `cpt_type_idx` (`type`),
  ADD KEY `customer_point_transactions_sale_id_foreign` (`sale_id`);

--
-- Indexes for table `customer_visits`
--
ALTER TABLE `customer_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_visits_branch_id_foreign` (`branch_id`),
  ADD KEY `customer_visits_staff_id_foreign` (`staff_id`),
  ADD KEY `customer_visits_company_id_customer_id_visited_at_index` (`company_id`,`customer_id`,`visited_at`),
  ADD KEY `customer_visits_customer_id_visited_at_index` (`customer_id`,`visited_at`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `departments_company_id_is_active_index` (`company_id`,`is_active`);

--
-- Indexes for table `emirates`
--
ALTER TABLE `emirates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `emirates_country_id_code_unique` (`country_id`,`code`),
  ADD KEY `emirates_country_id_is_active_index` (`country_id`,`is_active`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expenses_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `expenses_branch_id_foreign` (`branch_id`),
  ADD KEY `expenses_expense_category_id_foreign` (`expense_category_id`),
  ADD KEY `expenses_payment_method_id_foreign` (`payment_method_id`),
  ADD KEY `expenses_created_by_foreign` (`created_by`),
  ADD KEY `expenses_company_id_expense_date_index` (`company_id`,`expense_date`),
  ADD KEY `expenses_company_id_expense_category_id_expense_date_index` (`company_id`,`expense_category_id`,`expense_date`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expense_categories_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `expense_categories_parent_id_foreign` (`parent_id`),
  ADD KEY `expense_categories_company_id_parent_id_is_active_index` (`company_id`,`parent_id`,`is_active`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faqs_company_id_is_active_sort_order_index` (`company_id`,`is_active`,`sort_order`);

--
-- Indexes for table `gallery_items`
--
ALTER TABLE `gallery_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gallery_items_company_id_is_active_sort_order_index` (`company_id`,`is_active`,`sort_order`);

--
-- Indexes for table `homepage_slides`
--
ALTER TABLE `homepage_slides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `homepage_slides_company_id_is_active_sort_order_index` (`company_id`,`is_active`,`sort_order`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_methods_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `payment_methods_company_id_type_is_active_index` (`company_id`,`type`,`is_active`);

--
-- Indexes for table `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payslips_company_id_code_unique` (`company_id`,`code`),
  ADD UNIQUE KEY `payslip_user_period_unique` (`company_id`,`user_id`,`period_start`,`period_end`),
  ADD KEY `payslips_branch_id_foreign` (`branch_id`),
  ADD KEY `payslips_user_id_foreign` (`user_id`),
  ADD KEY `payslips_generated_by_foreign` (`generated_by`),
  ADD KEY `payslips_approved_by_foreign` (`approved_by`),
  ADD KEY `payslips_company_id_period_start_status_index` (`company_id`,`period_start`,`status`);

--
-- Indexes for table `payslip_items`
--
ALTER TABLE `payslip_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payslip_items_payslip_id_foreign` (`payslip_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `products_product_category_id_foreign` (`product_category_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`),
  ADD KEY `products_default_supplier_id_foreign` (`default_supplier_id`),
  ADD KEY `products_company_id_product_category_id_is_active_index` (`company_id`,`product_category_id`,`is_active`),
  ADD KEY `products_company_id_barcode_index` (`company_id`,`barcode`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_categories_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `product_categories_parent_id_foreign` (`parent_id`),
  ADD KEY `product_categories_company_id_parent_id_is_active_index` (`company_id`,`parent_id`,`is_active`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `sales_branch_id_foreign` (`branch_id`),
  ADD KEY `sales_customer_id_foreign` (`customer_id`),
  ADD KEY `sales_appointment_id_foreign` (`appointment_id`),
  ADD KEY `sales_sold_by_foreign` (`sold_by`),
  ADD KEY `sales_company_status_created_idx` (`company_id`,`status`,`created_at`),
  ADD KEY `sales_company_customer_idx` (`company_id`,`customer_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sale_id_foreign` (`sale_id`),
  ADD KEY `sale_items_salon_service_id_foreign` (`salon_service_id`),
  ADD KEY `sale_items_service_package_id_foreign` (`service_package_id`),
  ADD KEY `sale_items_appointment_item_id_foreign` (`appointment_item_id`),
  ADD KEY `sale_items_staff_id_foreign` (`staff_id`),
  ADD KEY `sale_items_customer_package_id_foreign` (`customer_package_id`);

--
-- Indexes for table `sale_payments`
--
ALTER TABLE `sale_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_payments_payment_method_id_foreign` (`payment_method_id`),
  ADD KEY `sale_payments_received_by_foreign` (`received_by`),
  ADD KEY `sale_payments_sale_idx` (`sale_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `services_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `services_service_category_id_foreign` (`service_category_id`),
  ADD KEY `services_company_id_service_category_id_is_active_index` (`company_id`,`service_category_id`,`is_active`),
  ADD KEY `services_company_id_name_index` (`company_id`,`name`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_categories_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `service_categories_parent_id_foreign` (`parent_id`),
  ADD KEY `service_categories_company_id_parent_id_is_active_index` (`company_id`,`parent_id`,`is_active`);

--
-- Indexes for table `service_packages`
--
ALTER TABLE `service_packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_packages_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `service_packages_company_id_is_active_index` (`company_id`,`is_active`);

--
-- Indexes for table `service_package_items`
--
ALTER TABLE `service_package_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_package_items_service_package_id_service_id_unique` (`service_package_id`,`service_id`),
  ADD KEY `service_package_items_service_id_foreign` (`service_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_company_branch_key_unique` (`company_id`,`branch_id`,`key`),
  ADD KEY `settings_group_key_index` (`group`,`key`),
  ADD KEY `settings_company_id_group_index` (`company_id`,`group`),
  ADD KEY `settings_branch_id_group_index` (`branch_id`,`group`);

--
-- Indexes for table `staff_attendance`
--
ALTER TABLE `staff_attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_attendance_user_id_attendance_date_unique` (`user_id`,`attendance_date`),
  ADD KEY `staff_attendance_branch_id_foreign` (`branch_id`),
  ADD KEY `staff_attendance_recorded_by_foreign` (`recorded_by`),
  ADD KEY `staff_attendance_company_id_attendance_date_index` (`company_id`,`attendance_date`),
  ADD KEY `staff_attendance_company_id_user_id_attendance_date_index` (`company_id`,`user_id`,`attendance_date`);

--
-- Indexes for table `staff_commission_rules`
--
ALTER TABLE `staff_commission_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_commission_rules_user_id_foreign` (`user_id`),
  ADD KEY `staff_commission_rules_service_category_id_foreign` (`service_category_id`),
  ADD KEY `staff_commission_rules_company_id_user_id_is_active_index` (`company_id`,`user_id`,`is_active`);

--
-- Indexes for table `staff_designations`
--
ALTER TABLE `staff_designations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_designations_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `staff_designations_department_id_foreign` (`department_id`),
  ADD KEY `staff_designations_company_id_department_id_is_active_index` (`company_id`,`department_id`,`is_active`);

--
-- Indexes for table `staff_documents`
--
ALTER TABLE `staff_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_documents_user_id_foreign` (`user_id`),
  ADD KEY `staff_documents_company_id_user_id_index` (`company_id`,`user_id`),
  ADD KEY `staff_documents_company_id_expiry_date_index` (`company_id`,`expiry_date`);

--
-- Indexes for table `staff_leave_requests`
--
ALTER TABLE `staff_leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_leave_requests_user_id_foreign` (`user_id`),
  ADD KEY `staff_leave_requests_approved_by_foreign` (`approved_by`),
  ADD KEY `staff_leave_requests_company_id_user_id_status_index` (`company_id`,`user_id`,`status`),
  ADD KEY `staff_leave_requests_company_id_start_date_end_date_index` (`company_id`,`start_date`,`end_date`);

--
-- Indexes for table `staff_salaries`
--
ALTER TABLE `staff_salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_salaries_user_id_foreign` (`user_id`),
  ADD KEY `staff_salaries_company_id_user_id_effective_from_index` (`company_id`,`user_id`,`effective_from`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_movements_branch_id_foreign` (`branch_id`),
  ADD KEY `stock_movements_product_id_foreign` (`product_id`),
  ADD KEY `stock_movements_stock_purchase_item_id_foreign` (`stock_purchase_item_id`),
  ADD KEY `stock_movements_sale_id_foreign` (`sale_id`),
  ADD KEY `stock_movements_appointment_id_foreign` (`appointment_id`),
  ADD KEY `stock_movements_service_id_foreign` (`service_id`),
  ADD KEY `stock_movements_created_by_foreign` (`created_by`),
  ADD KEY `stm_branch_product_created_idx` (`company_id`,`branch_id`,`product_id`,`created_at`),
  ADD KEY `stm_purchase_idx` (`stock_purchase_id`),
  ADD KEY `stm_type_idx` (`type`);

--
-- Indexes for table `stock_purchases`
--
ALTER TABLE `stock_purchases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_purchases_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `stock_purchases_branch_id_foreign` (`branch_id`),
  ADD KEY `stock_purchases_supplier_id_foreign` (`supplier_id`),
  ADD KEY `stock_purchases_created_by_foreign` (`created_by`),
  ADD KEY `stock_purchases_received_by_foreign` (`received_by`),
  ADD KEY `sp_company_branch_status_idx` (`company_id`,`branch_id`,`status`);

--
-- Indexes for table `stock_purchase_items`
--
ALTER TABLE `stock_purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_purchase_items_stock_purchase_id_foreign` (`stock_purchase_id`),
  ADD KEY `stock_purchase_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suppliers_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `suppliers_company_id_is_active_index` (`company_id`,`is_active`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `testimonials_company_id_is_active_sort_order_index` (`company_id`,`is_active`,`sort_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_company_id_employee_code_unique` (`company_id`,`employee_code`),
  ADD KEY `users_branch_id_foreign` (`branch_id`),
  ADD KEY `users_staff_designation_id_foreign` (`staff_designation_id`),
  ADD KEY `users_company_id_branch_id_is_active_index` (`company_id`,`branch_id`,`is_active`),
  ADD KEY `users_department_id_staff_designation_id_index` (`department_id`,`staff_designation_id`);

--
-- Indexes for table `website_inquiries`
--
ALTER TABLE `website_inquiries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `website_inquiries_company_id_code_unique` (`company_id`,`code`),
  ADD KEY `website_inquiries_company_id_status_created_at_index` (`company_id`,`status`,`created_at`),
  ADD KEY `website_inquiries_company_id_type_index` (`company_id`,`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `appointment_items`
--
ALTER TABLE `appointment_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `branch_product_stock`
--
ALTER TABLE `branch_product_stock`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customer_notes`
--
ALTER TABLE `customer_notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `customer_packages`
--
ALTER TABLE `customer_packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer_point_transactions`
--
ALTER TABLE `customer_point_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer_visits`
--
ALTER TABLE `customer_visits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `emirates`
--
ALTER TABLE `emirates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `gallery_items`
--
ALTER TABLE `gallery_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `homepage_slides`
--
ALTER TABLE `homepage_slides`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payslips`
--
ALTER TABLE `payslips`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payslip_items`
--
ALTER TABLE `payslip_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `sale_payments`
--
ALTER TABLE `sale_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `service_packages`
--
ALTER TABLE `service_packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `service_package_items`
--
ALTER TABLE `service_package_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `staff_attendance`
--
ALTER TABLE `staff_attendance`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `staff_commission_rules`
--
ALTER TABLE `staff_commission_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff_designations`
--
ALTER TABLE `staff_designations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `staff_documents`
--
ALTER TABLE `staff_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `staff_leave_requests`
--
ALTER TABLE `staff_leave_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staff_salaries`
--
ALTER TABLE `staff_salaries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stock_purchases`
--
ALTER TABLE `stock_purchases`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_purchase_items`
--
ALTER TABLE `stock_purchase_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `website_inquiries`
--
ALTER TABLE `website_inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_booked_by_foreign` FOREIGN KEY (`booked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `appointment_items`
--
ALTER TABLE `appointment_items`
  ADD CONSTRAINT `appointment_items_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointment_items_salon_service_id_foreign` FOREIGN KEY (`salon_service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointment_items_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `branches_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `branches_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `branches_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `branches_emirate_id_foreign` FOREIGN KEY (`emirate_id`) REFERENCES `emirates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `branch_product_stock`
--
ALTER TABLE `branch_product_stock`
  ADD CONSTRAINT `branch_product_stock_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `branch_product_stock_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `branch_product_stock_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cities_emirate_id_foreign` FOREIGN KEY (`emirate_id`) REFERENCES `emirates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `companies_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `companies_emirate_id_foreign` FOREIGN KEY (`emirate_id`) REFERENCES `emirates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customers_emirate_id_foreign` FOREIGN KEY (`emirate_id`) REFERENCES `emirates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_notes`
--
ALTER TABLE `customer_notes`
  ADD CONSTRAINT `customer_notes_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_notes_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_notes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_packages`
--
ALTER TABLE `customer_packages`
  ADD CONSTRAINT `customer_packages_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_packages_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_packages_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_packages_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_packages_service_package_id_foreign` FOREIGN KEY (`service_package_id`) REFERENCES `service_packages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_packages_sold_by_foreign` FOREIGN KEY (`sold_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_point_transactions`
--
ALTER TABLE `customer_point_transactions`
  ADD CONSTRAINT `customer_point_transactions_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_point_transactions_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_point_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_point_transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_point_transactions_customer_package_id_foreign` FOREIGN KEY (`customer_package_id`) REFERENCES `customer_packages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_point_transactions_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_point_transactions_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_visits`
--
ALTER TABLE `customer_visits`
  ADD CONSTRAINT `customer_visits_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_visits_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_visits_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_visits_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `emirates`
--
ALTER TABLE `emirates`
  ADD CONSTRAINT `emirates_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_expense_category_id_foreign` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories` (`id`),
  ADD CONSTRAINT `expenses_payment_method_id_foreign` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD CONSTRAINT `expense_categories_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expense_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `expense_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `faqs_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gallery_items`
--
ALTER TABLE `gallery_items`
  ADD CONSTRAINT `gallery_items_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `homepage_slides`
--
ALTER TABLE `homepage_slides`
  ADD CONSTRAINT `homepage_slides_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payslips`
--
ALTER TABLE `payslips`
  ADD CONSTRAINT `payslips_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payslips_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payslips_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payslips_generated_by_foreign` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payslips_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payslip_items`
--
ALTER TABLE `payslip_items`
  ADD CONSTRAINT `payslip_items_payslip_id_foreign` FOREIGN KEY (`payslip_id`) REFERENCES `payslips` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_default_supplier_id_foreign` FOREIGN KEY (`default_supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_product_category_id_foreign` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `product_categories_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_sold_by_foreign` FOREIGN KEY (`sold_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_appointment_item_id_foreign` FOREIGN KEY (`appointment_item_id`) REFERENCES `appointment_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sale_items_customer_package_id_foreign` FOREIGN KEY (`customer_package_id`) REFERENCES `customer_packages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_items_salon_service_id_foreign` FOREIGN KEY (`salon_service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sale_items_service_package_id_foreign` FOREIGN KEY (`service_package_id`) REFERENCES `service_packages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sale_items_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sale_payments`
--
ALTER TABLE `sale_payments`
  ADD CONSTRAINT `sale_payments_payment_method_id_foreign` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_payments_received_by_foreign` FOREIGN KEY (`received_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sale_payments_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `services_service_category_id_foreign` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD CONSTRAINT `service_categories_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `service_packages`
--
ALTER TABLE `service_packages`
  ADD CONSTRAINT `service_packages_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_package_items`
--
ALTER TABLE `service_package_items`
  ADD CONSTRAINT `service_package_items_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_package_items_service_package_id_foreign` FOREIGN KEY (`service_package_id`) REFERENCES `service_packages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `settings_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_attendance`
--
ALTER TABLE `staff_attendance`
  ADD CONSTRAINT `staff_attendance_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `staff_attendance_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_attendance_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `staff_attendance_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_commission_rules`
--
ALTER TABLE `staff_commission_rules`
  ADD CONSTRAINT `staff_commission_rules_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_commission_rules_service_category_id_foreign` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `staff_commission_rules_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_designations`
--
ALTER TABLE `staff_designations`
  ADD CONSTRAINT `staff_designations_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_designations_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `staff_documents`
--
ALTER TABLE `staff_documents`
  ADD CONSTRAINT `staff_documents_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_documents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_leave_requests`
--
ALTER TABLE `staff_leave_requests`
  ADD CONSTRAINT `staff_leave_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `staff_leave_requests_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_leave_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_salaries`
--
ALTER TABLE `staff_salaries`
  ADD CONSTRAINT `staff_salaries_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `staff_salaries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_stock_purchase_id_foreign` FOREIGN KEY (`stock_purchase_id`) REFERENCES `stock_purchases` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_stock_purchase_item_id_foreign` FOREIGN KEY (`stock_purchase_item_id`) REFERENCES `stock_purchase_items` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `stock_purchases`
--
ALTER TABLE `stock_purchases`
  ADD CONSTRAINT `stock_purchases_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_purchases_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_purchases_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_purchases_received_by_foreign` FOREIGN KEY (`received_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `stock_purchase_items`
--
ALTER TABLE `stock_purchase_items`
  ADD CONSTRAINT `stock_purchase_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `stock_purchase_items_stock_purchase_id_foreign` FOREIGN KEY (`stock_purchase_id`) REFERENCES `stock_purchases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_staff_designation_id_foreign` FOREIGN KEY (`staff_designation_id`) REFERENCES `staff_designations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `website_inquiries`
--
ALTER TABLE `website_inquiries`
  ADD CONSTRAINT `website_inquiries_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;