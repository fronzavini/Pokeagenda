-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pokeagenda
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `pokemon`
--

DROP TABLE IF EXISTS `pokemon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokemon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shiny` tinyint(1) NOT NULL,
  `apelido` varchar(100) DEFAULT NULL,
  `numero_pokedex` int NOT NULL,
  `sombroso` tinyint(1) NOT NULL,
  `id_treinador` int NOT NULL,
  `loca` enum('time','box') DEFAULT NULL,
  `habilidade` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_treinador` (`id_treinador`),
  CONSTRAINT `pokemon_ibfk_1` FOREIGN KEY (`id_treinador`) REFERENCES `treinador` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokemon`
--

LOCK TABLES `pokemon` WRITE;
/*!40000 ALTER TABLE `pokemon` DISABLE KEYS */;
INSERT INTO `pokemon` VALUES (1,1,'Gold',302,1,1,'time','prankster'),(2,0,'as',4,1,1,'box','blaze'),(3,0,'golduck',55,0,1,'box','damp'),(4,0,'machadow',610,0,2,'time','rivalry'),(5,0,'excadrill',530,0,2,'box','sand-rush'),(13,0,'sandslash',28,0,1,'box','sand-veil'),(14,0,'hypno',97,0,1,'box','insomnia'),(15,0,'farfetchd',83,0,1,'time','keen-eye'),(16,0,'growlithe',58,0,1,'box','intimidate'),(17,0,'aerodactyl',142,0,1,'box','rock-head'),(18,0,'urshifu-single-strike',892,0,1,'box','unseen-fist'),(19,0,'graveler',75,0,1,'box','rock-head'),(20,0,'abra',63,0,1,'box','synchronize'),(21,0,'golduck',55,0,1,'box','damp'),(22,0,'exeggcute',102,0,1,'box','chlorophyll'),(23,0,'alakazam',65,0,1,'box','synchronize'),(24,0,'beedrill',15,0,1,'box','swarm'),(25,0,'tauros',128,0,1,'box','intimidate'),(26,0,'blastoise',9,0,1,'box','torrent'),(27,0,'blastoise',9,0,1,'box','torrent'),(28,0,'exeggcute',102,0,1,'box','chlorophyll'),(29,0,'tentacruel',73,0,1,'box','clear-body'),(30,0,'squirtle',7,0,1,'box','torrent'),(31,0,'hypno',97,0,1,'box','insomnia'),(32,0,'yanma',193,0,1,'box','speed-boost'),(33,1,'garde',282,1,1,'time','trace');
/*!40000 ALTER TABLE `pokemon` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05 21:17:53
