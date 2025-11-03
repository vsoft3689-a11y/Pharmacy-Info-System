CREATE DATABASE  IF NOT EXISTS `pharmacy_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pharmacy_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: pharmacy_db
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `medicine`
--

DROP TABLE IF EXISTS `medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine` (
  `expiry_date` date DEFAULT NULL,
  `price` double NOT NULL,
  `quantity` int NOT NULL,
  `reorder_level` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint DEFAULT NULL,
  `batch_no` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `pharmacist_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdk2ywmgysoha2dqgkc0do3okw` (`supplier_id`),
  KEY `FKnfn1rhnxlpag3ouqfrld9o1yh` (`pharmacist_id`),
  CONSTRAINT `FKdk2ywmgysoha2dqgkc0do3okw` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`),
  CONSTRAINT `FKnfn1rhnxlpag3ouqfrld9o1yh` FOREIGN KEY (`pharmacist_id`) REFERENCES `pharmacist` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine`
--

LOCK TABLES `medicine` WRITE;
/*!40000 ALTER TABLE `medicine` DISABLE KEYS */;
INSERT INTO `medicine` VALUES ('2025-11-29',25,119,50,1,1,'P500A23','Paracetamol 500mg',1),('2025-11-30',20,100,50,2,1,'P500A25','Dolo 650',1);
/*!40000 ALTER TABLE `medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `quantity` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `medicine_id` bigint DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `pharmacist_id` bigint DEFAULT NULL,
  `supplier_id` bigint DEFAULT NULL,
  `medicine_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnv494gmw6qjdqqxc3vlhw2y6t` (`pharmacist_id`),
  KEY `FKsx1o6ggef2tp2583ohnvomxj5` (`supplier_id`),
  CONSTRAINT `FKnv494gmw6qjdqqxc3vlhw2y6t` FOREIGN KEY (`pharmacist_id`) REFERENCES `pharmacist` (`id`),
  CONSTRAINT `FKsx1o6ggef2tp2583ohnvomxj5` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (100,1,1,'2025-10-29 13:28:07.149947',1,1,'Paracetamol 500mg','DELIVERED'),(100,2,1,'2025-10-29 13:28:33.430141',1,1,'Paracetamol 500mg','DELIVERED'),(100,3,1,'2025-10-30 11:34:23.341867',1,1,'Paracetamol 500mg','DELIVERED');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacist`
--

DROP TABLE IF EXISTS `pharmacist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pharmacist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtesnorayydqwul8isblqre81w` (`user_id`),
  CONSTRAINT `FK2sbkb63if9xd8ff6ktkktvynu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacist`
--

LOCK TABLES `pharmacist` WRITE;
/*!40000 ALTER TABLE `pharmacist` DISABLE KEYS */;
INSERT INTO `pharmacist` VALUES (1,1,'Hyderabad','9876543210','Raju','Bpharmacy','raju@gmail.com');
/*!40000 ALTER TABLE `pharmacist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale` (
  `total_amount` double NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pharmacist_id` bigint DEFAULT NULL,
  `sale_date` datetime(6) DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3s2lavh9x574mab1nh06e7u0e` (`pharmacist_id`),
  CONSTRAINT `FK3s2lavh9x574mab1nh06e7u0e` FOREIGN KEY (`pharmacist_id`) REFERENCES `pharmacist` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
INSERT INTO `sale` VALUES (25,1,1,'2025-10-29 15:04:16.774118','Shiva'),(25,2,1,'2025-10-30 17:59:50.648114','Krish');
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_item`
--

DROP TABLE IF EXISTS `sale_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_item` (
  `price` double NOT NULL,
  `quantity` int NOT NULL,
  `total` double NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `medicine_id` bigint DEFAULT NULL,
  `sale_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK59xww5o0cw0tvgw2k3v9c37f3` (`medicine_id`),
  KEY `FKar9qqr4n69xw1shum20oflleo` (`sale_id`),
  CONSTRAINT `FK59xww5o0cw0tvgw2k3v9c37f3` FOREIGN KEY (`medicine_id`) REFERENCES `medicine` (`id`),
  CONSTRAINT `FKar9qqr4n69xw1shum20oflleo` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_item`
--

LOCK TABLES `sale_item` WRITE;
/*!40000 ALTER TABLE `sale_item` DISABLE KEYS */;
INSERT INTO `sale_item` VALUES (25,1,25,1,1,1),(25,1,25,2,1,2);
/*!40000 ALTER TABLE `sale_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKafxol104prrysgdv6xe8nmt56` (`user_id`),
  CONSTRAINT `FKs1dd5csqciyb73tm0vep2slsy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,2,'Hyderabad','Agnololix','9874563210','rajesh@gmail.com','Rajesh'),(2,5,'Hyderabad','Reddys','9874563210','sai@gmail.com','Sai');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'pharm@gmail.com','pharmacy','$2a$10$vqP6WfNz.hZp8cEq50IB1.2xW1KVFrgWR8.bc7R1czlhx0ThoFpUm','PHARMACIST',NULL),(2,'supp@gmail.com','supplier','$2a$10$ryHjXGksUi1r/R1iC0xC1OB2M63xbJ6LzWXajePDt3EeXbmMu1Ejq','SUPPLIER',NULL),(3,'admin@gmail.com','admin','$2a$10$xgSrMkUAtf4mvsgwpbEty.EbRB/TWX2sdtAi5HNXdp3flJbaNeH6e','ADMIN',NULL),(4,'ravi@gmail.com','Ravi','$2a$10$CbWxi8aWgaHtWnGv4o400.iJdg.vtXHk9LKdMUYSPczlJogfG5QKi','PHARMACIST',NULL),(5,'sai@gmail.com','Sai','$2a$10$n06yGfPQNBe4V6KINF/mxehNL2/SpiPPdBXgLg85Qr4NboZPwwIna','SUPPLIER',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 18:39:43
