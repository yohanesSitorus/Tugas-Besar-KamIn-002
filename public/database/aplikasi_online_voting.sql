-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2023 at 01:04 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aplikasi_online_voting`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

CREATE TABLE `candidate` (
  `candidateID` int(11) NOT NULL,
  `electionID` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`candidateID`, `electionID`, `name`) VALUES
(1, 1, 'Bandung'),
(2, 1, 'Bali'),
(3, 1, 'Jogja'),
(4, 1, 'Sumba'),
(5, 1, 'Singapore'),
(6, 2, 'Up Normal'),
(7, 2, 'Marugame Udon'),
(8, 2, 'Pizza Hut'),
(9, 2, 'Burger King'),
(10, 2, 'Solaria');

-- --------------------------------------------------------

--
-- Table structure for table `election`
--

CREATE TABLE `election` (
  `electionID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `election`
--

INSERT INTO `election` (`electionID`, `title`, `description`, `startDate`, `endDate`) VALUES
(1, 'Rencana Liburan Akhir Tahun', 'Ini merupakan voting destinasi liburan akhir tahun circle X', '2023-12-27', '2023-12-29'),
(2, 'Pilihan Tempat Makan Bersama Weekend Ini', 'Ini merupakan voting tempat makan bersama untuk anak kantor X', '2023-12-28', '2023-12-29'),
(3, 'Pemilihan Ketua Kelas 12 MIPA 3', 'ini merupakan voting untuk memilih ketua kelas 12 MIPA 3 SMA X', '2023-12-29', '2023-12-30'),
(4, 'Pemilihan Ketua & Wakil Ketua BEM Periode 2024-2025', 'Ini merupakan voting pemilihan ketua & wakil ketua BEM Universitas X', '2024-01-01', '2024-01-05'),
(5, 'Pilihan Nama Tim Basket Jurusan Informatika', 'ini merupakan voting pemilihan nama tim basket jurusan Informatika Universitas X', '2024-01-08', '2024-01-12'),
(6, 'Tema Pesta Prom SMA X', 'ini merupakan voting pemilihan tema pesta prom siswa/i kelas 12 SMA X ', '2024-02-05', '2024-02-10');

-- --------------------------------------------------------

--
-- Table structure for table `participant`
--

CREATE TABLE `participant` (
  `voterID` int(11) NOT NULL,
  `electionID` int(11) NOT NULL,
  `requestStatus` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participant`
--

INSERT INTO `participant` (`voterID`, `electionID`, `requestStatus`) VALUES
(2, 1, 0),
(3, 1, 0),
(4, 1, 1),
(5, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `platform`
--

CREATE TABLE `platform` (
  `publicKey` text NOT NULL,
  `privateKey` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `platform`
--

INSERT INTO `platform` (`publicKey`, `privateKey`) VALUES
('657382910472837', '485920174859203');

-- --------------------------------------------------------

--
-- Table structure for table `result`
--

CREATE TABLE `result` (
  `electionID` int(11) NOT NULL,
  `candidateID` int(11) NOT NULL,
  `frequency` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submittedelection`
--

CREATE TABLE `submittedelection` (
  `voterID` int(11) NOT NULL,
  `electionID` int(11) NOT NULL,
  `selectedCandidate` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `username`, `password`, `role`) VALUES
(1, 'alice_johnson', 'RedApple123!Orange', 'ADM'),
(2, 'benjamin_clark', 'SunnyDay456$Cloud', 'VTR'),
(3, 'chloe_anderson', 'Chocolate789^Vanilla', 'VTR'),
(4, 'daniel_mitchell', 'HappyDog123*Biscuit', 'VTR'),
(5, 'emily_white', 'CozyHome567-Blanket', 'VTR'),
(7, 'finnegan_murphy', '59c1c1ba39b77ed77dd265017e3220204815f62b2498186d26b74d4a3cc4c7b7', 'VTR'),
(9, 'grace_taylor', '915965110be559e9f37b68b298dad558ae1599adb6e17e8580c1b84c8d9021a3', 'VTR');

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

CREATE TABLE `vote` (
  `voteID` int(11) NOT NULL,
  `voterID` int(11) NOT NULL,
  `electionID` int(11) NOT NULL,
  `candidateID` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vote`
--

INSERT INTO `vote` (`voteID`, `voterID`, `electionID`, `candidateID`, `timestamp`) VALUES
(1, 4, 1, 2, '2023-12-27 06:43:00'),
(2, 5, 1, 4, '2023-12-27 06:43:00');

-- --------------------------------------------------------

--
-- Table structure for table `voter`
--

CREATE TABLE `voter` (
  `voterID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `publicKey` text NOT NULL,
  `privateKey` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voter`
--

INSERT INTO `voter` (`voterID`, `name`, `email`, `publicKey`, `privateKey`) VALUES
(2, 'Benjamin Clark', 'benjaminclark@gmail.com', '927364819273645', '182736492847563'),
(3, 'Chloe Anderson', 'chloeanderson@gmail.com', '546392837465829', '109283746592837'),
(4, 'Daniel Mitchell', 'danielmitchell@gmail.com', '384756193284765', '739284756192837'),
(5, 'Emily White', 'emilywhite@gmail.com', '283746591827364', '657483920174859'),
(7, 'Finnegan Murphy', 'fineganmurphy@gmail.com', '-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp0zDdcqFjYpqcWjeti6A\r\nPYP7g9UD7rhsPi2Awl52l8nR/xfteXh9GvO3Dp8J1FPSiYzbTkHrGAGi/FKDq1my\r\nlKE5nByrregdTP+iIXSliKtibP6xhqBYbHlpUtzbU+CHnh09YumRUjy7Eo+TkuLR\r\nexSL5U+I7DiBDwEb7CtnyNiblBHBuPSUVdtr5ilB8o2C7kPX6rp8LGzIXL/nisy2\r\n29QHUmNyrxAfmqvrxd/+JO1kzl63Fx4YgujfOgD4QNqhW9VB+JwKnV0iNe0q1vlG\r\noF2lWlP/JEmE69A56QfpV+ijfVdFNQ5EtGI5+xAkAIY/HlIeCrK0aGXbgiXBkTS6\r\n+QIDAQAB\r\n-----END PUBLIC KEY-----\r\n', '-----BEGIN RSA PRIVATE KEY-----\r\nMIIEowIBAAKCAQEAp0zDdcqFjYpqcWjeti6APYP7g9UD7rhsPi2Awl52l8nR/xft\r\neXh9GvO3Dp8J1FPSiYzbTkHrGAGi/FKDq1mylKE5nByrregdTP+iIXSliKtibP6x\r\nhqBYbHlpUtzbU+CHnh09YumRUjy7Eo+TkuLRexSL5U+I7DiBDwEb7CtnyNiblBHB\r\nuPSUVdtr5ilB8o2C7kPX6rp8LGzIXL/nisy229QHUmNyrxAfmqvrxd/+JO1kzl63\r\nFx4YgujfOgD4QNqhW9VB+JwKnV0iNe0q1vlGoF2lWlP/JEmE69A56QfpV+ijfVdF\r\nNQ5EtGI5+xAkAIY/HlIeCrK0aGXbgiXBkTS6+QIDAQABAoIBABUuS4/J7msrU0sc\r\n8RdlH0DKiSkZarhKOpALsEHLdl3ExDS06ZCnr8UeBnbQLU0nuJ/ICMrpXxOIv4MN\r\nClUDE/Ar0lCgs56epLkHI1Zzf3Kkah9tBnpKKi+/llVSl2UQ5/KddpRjiE2+WRvi\r\nOBeQZl+cDBMh5O6tP6+v3wJhQ3BCwdHEUxmPEWhr5bMbDX4CEBGzV3iaS9lr/J1i\r\nb9LECtCity/HMrQVJ25hlarZ1Tnb/FHzHujB9n68JQ4vRnER8n1jWA1Bpd2rZRgi\r\nHTvTMjjSfHJC1DNTLbQWbJRXsy713qfV2Ewac/w9Ydj5Acw+BIHK9YlEGtgrac/s\r\nXBYdNXUCgYEA1KAa0MsFLZXTG820J1RBSoxsqCGyuKcRQH19RZUaGrKffiLQb5eM\r\nu8ViLrg6b6GGHS0wpr8USwlyL1JiDRZDuWXriDjMJG+GHKB6byM0ZbrQZzGjB1T8\r\nsUsoHq+5DYIZSJlxkzyXT5ncuJBKEdjMfh/OFQXqulk9S6YDfsBKiGUCgYEAyW2h\r\nnp+TyFsV5HZx9DIvXqfZolygLJ3x+MT2tgIixpg3K/BR+yFz1t6k1wa8SSQJQXIJ\r\nl26yTT+fzlbiUnYVfSSPoJHTjS//1T43+AvH9mDAXdxxjLRYcyvHgJ+p9/YE/Y1A\r\nq6+MxqHTig+Ba8jvAdi6lvQlj1/bFNgMUuRAPQUCgYBt2pqALaRrPPFpeAoQF9Pz\r\n9EFfTKnOBWNAcpV6keJ+0LLetJYEUcSAbyafBMgMTOPBx0tPm4GckzDPijzmjg5H\r\nh4T9SHsQiB4+RBt9uC6mMLLj3h1g+GPmJfKAiEGP3Ru7CqxHahKzKceEA+iA+AYP\r\nU9dhvUDdLqYgo5FCt47KkQKBgQDHsqc/KhpL0vIbdMp5PZ/1ChgcfhRW56hT6IJn\r\n5CoyFgrsxu+gOIQuDMIEZKsbIF0Ew1h7B8ZCC8gVu9HZyzR2w16Z5LmGCoZrFapL\r\ngvKWc0mERN9Wjh364PaDsMfEC+bascXh8MNy0lF1WPYItEcw33vt2NO8F16OhbuC\r\nGsUNOQKBgCiuwcKFZ0nBi+T8HQphl0KbMWk+UKYv0FPm8bK4rxTY5smouBC+qTmd\r\n46bv8rmTQYy1SZ7sdcvjLbfmCUYKI9ppbQ5s8ROdtGyxkExJ//c1gi61VZ5VgEoQ\r\nQ5H8dgvTlnpMP9aQFCutxUJp7TgN9mHbzMYYjeCrij5eubkjbVxk\r\n-----END RSA PRIVATE KEY-----\r\n'),
(9, 'Grace Taylor', 'gracetaylor@gmail.com', '-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuUyby9SFk+yzILBTV1Xu\r\noUqzojsel9hx8QjvtWTuNgWTHbMklv647QQZF5uSmUJ9jUFeRBJ/3/gpCgOXXk3w\r\nkTkM+wYrrFZxP87TDplt5nL9x9g7mcVMWSTSQAXgCxrYmawzD2iv7Yt/G6cy+S+K\r\nnkQU+423KsTj9rqVK2tU9OWe4j1MhE++pI5AlEvN39Eor1kfH0txgNHKx67/BDEW\r\nGm2r7+5q+mO/wHnJKc9kfUjv49OvktVUbKAshglY8bGVLhsVJzhM3/e5/tdT0JkM\r\nmO0ObBM6mUbO5SyawZx+nshRJtb5bi0qpMMYXv1Hse/9vQJaHhsbOIJbJ+W8Y5Az\r\naQIDAQAB\r\n-----END PUBLIC KEY-----\r\n', '-----BEGIN RSA PRIVATE KEY-----\r\nMIIEowIBAAKCAQEAuUyby9SFk+yzILBTV1XuoUqzojsel9hx8QjvtWTuNgWTHbMk\r\nlv647QQZF5uSmUJ9jUFeRBJ/3/gpCgOXXk3wkTkM+wYrrFZxP87TDplt5nL9x9g7\r\nmcVMWSTSQAXgCxrYmawzD2iv7Yt/G6cy+S+KnkQU+423KsTj9rqVK2tU9OWe4j1M\r\nhE++pI5AlEvN39Eor1kfH0txgNHKx67/BDEWGm2r7+5q+mO/wHnJKc9kfUjv49Ov\r\nktVUbKAshglY8bGVLhsVJzhM3/e5/tdT0JkMmO0ObBM6mUbO5SyawZx+nshRJtb5\r\nbi0qpMMYXv1Hse/9vQJaHhsbOIJbJ+W8Y5AzaQIDAQABAoIBAADhYKyeXv+ZzGyT\r\ndePodjypMZML35x2VG1CHvxwRTL3whAOL7ZxcaC7qCBc9nx4rMbI6JkfcuDWKaDA\r\n7V1O9r2D5UBEklzMYNeeJJHRUAy8H2FNkVPs1GzogEC6XmsDFsQdJbV1KH/TDbis\r\nidEWBR01ItninZwMCS69CnQlO4c51XwZ0RBs1Crn/roqxnq+ZDREntqbsOnX9ADU\r\nv91w+RNcXNWHrN4vWO0uZFpZshXqFuzbnZWXHm/2cEAgkflXvU9TDyBWsEQJEOYg\r\nUR8fE7u589v8RzInvqS/Bl+LHPanETafneFADQ9CrUnebWNbASM4QL3HzX08QTp+\r\nK8miGlECgYEA72S2iitvJWM0IwVCp4wn+AeZih74lCZLQ+ZXTBXelAcwR3MhMQ2u\r\nxItI3m9AImlws3rars0HdfDBLFWVBEKjIIvInPZl8uK5a53ECK0NzpD+7lcYczM+\r\nmIffYuBUunbYIHLngTsah4LpNHrZR6FDq2GrvqgUp5Ci3BbfAizc9ZkCgYEAxidC\r\nlvwqAMHIlhPP/ewsx0mnBcHnwrUs70Q0fkI2im72HY/OcNDihP+xwysn0kassMn0\r\nOGhSa2rPg0UNlJNWriH3qUvL/yl4UomYR5e3WOmqbqYu8I+z5p9Y1fyg3LSAlueq\r\nZ8NQ3d25ySIjlVzp/UjTtdhxUP2w3lYRSaLNLlECgYBT0S1gXyjBLGS6xkK6KwZr\r\nfy2xAHsEVAwSL/nst9OAfKvYuGSsqh/AzQusZcNMySIelSsv/LVaA/t+rFBKd5Jp\r\n+Mc6vcKgMeW92jUi3IRzCK1ZgcEbxJtsCFacZfMEfkvZwKFxy+HUBG/mYgTlYX8x\r\n6DabwHnK2YdMC+308wRCMQKBgHpYIzU13Hk7LK387Z7KA5vITeewIXiGhIf2hLKw\r\nDxzKBguajsv5LOMRPKBUNPIP0PAWwUNSphDMkfNq30es8Qfy0QcmVX3mDPRpICyT\r\n8BBltWU8Fh9RmrH6EM+Oe4PJrtt9jiki3vsdu2gEPBQsmgxYut68FLr86Ade/K2K\r\nZ0UBAoGBAJCK3xAgusXjGveggbXKCOn+oHBOhljD/TsgaqTXzp5uU41fePXTWxcP\r\nhSVMgoNaGnaK8tFVoM9wLKOfu7nCZFerlKY0g2vkcTwQKYULMyowc2eSTahTAZXF\r\nXw80bGLe2EdDijgq7ZoHeJa2tDH9SWVs0pCaHoWZv56BiGLRQsG2\r\n-----END RSA PRIVATE KEY-----\r\n');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`candidateID`),
  ADD KEY `fk_candidate_election` (`electionID`);

--
-- Indexes for table `election`
--
ALTER TABLE `election`
  ADD PRIMARY KEY (`electionID`);

--
-- Indexes for table `participant`
--
ALTER TABLE `participant`
  ADD KEY `fk_participant_voter` (`voterID`),
  ADD KEY `fk_participant_election` (`electionID`);

--
-- Indexes for table `result`
--
ALTER TABLE `result`
  ADD KEY `fk_result_election` (`electionID`),
  ADD KEY `fk_result_candidate` (`candidateID`);

--
-- Indexes for table `submittedelection`
--
ALTER TABLE `submittedelection`
  ADD KEY `fk_submittedElection_voter` (`voterID`),
  ADD KEY `fk_submittedElection_election` (`electionID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`voteID`),
  ADD KEY `fk_vote_voter` (`voterID`),
  ADD KEY `fk_vote_election` (`electionID`),
  ADD KEY `fk_vote_candidate` (`candidateID`);

--
-- Indexes for table `voter`
--
ALTER TABLE `voter`
  ADD PRIMARY KEY (`voterID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidate`
--
ALTER TABLE `candidate`
  MODIFY `candidateID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `election`
--
ALTER TABLE `election`
  MODIFY `electionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vote`
--
ALTER TABLE `vote`
  MODIFY `voteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `fk_candidate_election` FOREIGN KEY (`electionID`) REFERENCES `election` (`electionID`);

--
-- Constraints for table `participant`
--
ALTER TABLE `participant`
  ADD CONSTRAINT `fk_participant_election` FOREIGN KEY (`electionID`) REFERENCES `election` (`electionID`),
  ADD CONSTRAINT `fk_participant_voter` FOREIGN KEY (`voterID`) REFERENCES `voter` (`voterID`);

--
-- Constraints for table `result`
--
ALTER TABLE `result`
  ADD CONSTRAINT `fk_result_candidate` FOREIGN KEY (`candidateID`) REFERENCES `candidate` (`candidateID`),
  ADD CONSTRAINT `fk_result_election` FOREIGN KEY (`electionID`) REFERENCES `election` (`electionID`);

--
-- Constraints for table `submittedelection`
--
ALTER TABLE `submittedelection`
  ADD CONSTRAINT `fk_submittedElection_election` FOREIGN KEY (`electionID`) REFERENCES `election` (`electionID`),
  ADD CONSTRAINT `fk_submittedElection_voter` FOREIGN KEY (`voterID`) REFERENCES `voter` (`voterID`);

--
-- Constraints for table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `fk_vote_candidate` FOREIGN KEY (`candidateID`) REFERENCES `candidate` (`candidateID`),
  ADD CONSTRAINT `fk_vote_election` FOREIGN KEY (`electionID`) REFERENCES `election` (`electionID`),
  ADD CONSTRAINT `fk_vote_voter` FOREIGN KEY (`voterID`) REFERENCES `voter` (`voterID`);

--
-- Constraints for table `voter`
--
ALTER TABLE `voter`
  ADD CONSTRAINT `fk_voter_user` FOREIGN KEY (`voterID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
