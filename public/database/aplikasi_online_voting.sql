-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2023 at 12:27 PM
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
(5, 'emily_white', 'CozyHome567-Blanket', 'VTR');

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
(5, 'Emily White', 'emilywhite@gmail.com', '283746591827364', '657483920174859');

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
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
