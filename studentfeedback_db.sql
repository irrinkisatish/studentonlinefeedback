CREATE DATABASE  IF NOT EXISTS `studentfeedback` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `studentfeedback`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: studentfeedback
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alumni`
--

DROP TABLE IF EXISTS `alumni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumni` (
  `alumni_id` int NOT NULL AUTO_INCREMENT,
  `name_of_alumnus` varchar(255) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `suggestion_text` text,
  `relevance_of_curriculum_answer_id` int DEFAULT NULL,
  `infrastructure_facilities_answer_id` int DEFAULT NULL,
  `guest_lecturers_arrangement_answer_id` int DEFAULT NULL,
  `student_teacher_interaction_answer_id` int DEFAULT NULL,
  `cooperation_from_staff_answer_id` int DEFAULT NULL,
  `teaching_faculties_availability_answer_id` int DEFAULT NULL,
  `overall_facilities_satisfaction_answer_id` int DEFAULT NULL,
  `contribution_to_college_answer_id` int DEFAULT NULL,
  `rating` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`alumni_id`),
  KEY `relevance_of_curriculum_answer_id` (`relevance_of_curriculum_answer_id`),
  KEY `infrastructure_facilities_answer_id` (`infrastructure_facilities_answer_id`),
  KEY `guest_lecturers_arrangement_answer_id` (`guest_lecturers_arrangement_answer_id`),
  KEY `student_teacher_interaction_answer_id` (`student_teacher_interaction_answer_id`),
  KEY `cooperation_from_staff_answer_id` (`cooperation_from_staff_answer_id`),
  KEY `teaching_faculties_availability_answer_id` (`teaching_faculties_availability_answer_id`),
  KEY `overall_facilities_satisfaction_answer_id` (`overall_facilities_satisfaction_answer_id`),
  KEY `contribution_to_college_answer_id` (`contribution_to_college_answer_id`),
  CONSTRAINT `alumni_ibfk_1` FOREIGN KEY (`relevance_of_curriculum_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_2` FOREIGN KEY (`infrastructure_facilities_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_3` FOREIGN KEY (`guest_lecturers_arrangement_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_4` FOREIGN KEY (`student_teacher_interaction_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_5` FOREIGN KEY (`cooperation_from_staff_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_6` FOREIGN KEY (`teaching_faculties_availability_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_7` FOREIGN KEY (`overall_facilities_satisfaction_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`),
  CONSTRAINT `alumni_ibfk_8` FOREIGN KEY (`contribution_to_college_answer_id`) REFERENCES `alumnifeedbackanswers` (`answer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alumnifeedbackanswers`
--

DROP TABLE IF EXISTS `alumnifeedbackanswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnifeedbackanswers` (
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `answer_text` text NOT NULL,
  `question_id` int DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `alumnifeedbackanswers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `alumnifeedbackquestion` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alumnifeedbackquestion`
--

DROP TABLE IF EXISTS `alumnifeedbackquestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnifeedbackquestion` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `question_text` text NOT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alumnitalk`
--

DROP TABLE IF EXISTS `alumnitalk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnitalk` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumniname` varchar(255) DEFAULT NULL,
  `alumnitopic` varchar(255) DEFAULT NULL,
  `alumniabout` text,
  `alumniimage` varchar(255) DEFAULT NULL,
  `alumnivideo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `faculty_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `subject_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `student_id` (`student_id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventposts`
--

DROP TABLE IF EXISTS `eventposts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventposts` (
  `eventid` int NOT NULL AUTO_INCREMENT,
  `eventname` varchar(255) DEFAULT NULL,
  `eventtopic` varchar(255) DEFAULT NULL,
  `eventabout` text,
  `eventimage` varchar(255) DEFAULT NULL,
  `eventvideo` varchar(255) DEFAULT NULL,
  `eventdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`eventid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `faculty_email` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `dob` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `teaching_year` varchar(255) DEFAULT NULL,
  `teaching_branch` varchar(255) DEFAULT NULL,
  `teaching_group` varchar(255) DEFAULT NULL,
  `teaching_subject` varchar(255) DEFAULT NULL,
  `date_of_registration` timestamp NULL DEFAULT NULL,
  `faculty_imageurl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `faculty_id` int NOT NULL,
  `feedback_text` text NOT NULL,
  `posted_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subjectName` varchar(20) DEFAULT NULL,
  `syllabus_covered` varchar(10) DEFAULT NULL,
  `teacheruses_tools` varchar(10) DEFAULT NULL,
  `prepapreforclasses` varchar(10) DEFAULT NULL,
  `identifytoovercome` varchar(10) DEFAULT NULL,
  `teaching_approrach` varchar(10) DEFAULT NULL,
  `teachercommunicate` varchar(10) DEFAULT NULL,
  `teacherillustrate` varchar(10) DEFAULT NULL,
  `teacherencourage` varchar(10) DEFAULT NULL,
  `teacherperdiscess` varchar(10) DEFAULT NULL,
  `teacherfairneess` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_details`
--

DROP TABLE IF EXISTS `group_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `group_details_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hallticketnumbers`
--

DROP TABLE IF EXISTS `hallticketnumbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hallticketnumbers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hall_ticket_number` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hall_ticket_number` (`hall_ticket_number`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(20) DEFAULT NULL,
  `lname` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `dob` varchar(20) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `branch` varchar(50) NOT NULL,
  `group_name` varchar(50) NOT NULL,
  `year` varchar(255) DEFAULT NULL,
  `rollnumber` varchar(20) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `group_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group_details` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-24 17:57:53
