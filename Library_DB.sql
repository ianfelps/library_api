-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Library_DB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Library_DB` DEFAULT CHARACTER SET utf8 ;
USE `Library_DB` ;

-- -----------------------------------------------------
-- Table `Library_DB`.`User_TB`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Library_DB`.`User_TB` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Adicionado DEFAULT para facilitar
  PRIMARY KEY (`id_user`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Library_DB`.`Book_TB`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Library_DB`.`Book_TB` (
  `id_book` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `year` INT NOT NULL,
  `genre` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NULL DEFAULT 'Not read',
  PRIMARY KEY (`id_book`),
  UNIQUE INDEX `book_UNIQUE_per_user_idx` (`user_id` ASC, `title` ASC, `author` ASC) VISIBLE,
  INDEX `fk_Book_TB_User_TB_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Book_TB_User_TB`
    FOREIGN KEY (`user_id`)
    REFERENCES `Library_DB`.`User_TB` (`id_user`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
