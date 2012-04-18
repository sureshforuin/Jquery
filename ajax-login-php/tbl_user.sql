-- phpMyAdmin SQL Dump
-- version 2.9.1.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Apr 19, 2008 at 05:45 PM
-- Server version: 5.0.27
-- PHP Version: 5.2.0
-- 
-- Database: `db_ajax`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `tbl_user`
-- 

CREATE TABLE `tbl_user` (
  `user_id` int(11) NOT NULL auto_increment,
  `user_name` varchar(30) NOT NULL,
  `password` varchar(70) NOT NULL,
  PRIMARY KEY  (`user_id`)
) TYPE=MyISAM  AUTO_INCREMENT=2 ;

-- 
-- Dumping data for table `tbl_user`
-- 

INSERT INTO `tbl_user` VALUES (1, 'admin', 'd6dfb33a2052663df81c35e5496b3b1b');
