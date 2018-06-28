-- MySQL Script generated by MySQL Workbench
-- mer. 27 juin 2018 15:56:47 CEST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Client` (
  `idClient` INT NOT NULL AUTO_INCREMENT,
  `Login` VARCHAR(45) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`idClient`))
ENGINE = InnoDB
COMMENT = '1. Maquetter une application\n\n2. Réaliser une interface utilisateur web statique et adaptable\n\n3. Développer une interface utilisateur web dynamique\n\n4. Réaliser une interface utilisateur avec une solution de\ngestion de contenu ou e-commerce\n\n5. Créer une base de données\n\n6. Développer les composants d’accès aux données\n\n7. Développer la partie back-end d’une application web ou\nweb mobile\n\n8. Elaborer et mettre en œuvre des composants dans une\napplication de gestion de contenu ou e-commerce\n\n9. Utiliser l’anglais dans son activité professionnelle en développement web et web mobile\n\n10. Actualiser et partager ses compétences en développement web et web mobile\n\n';


-- -----------------------------------------------------
-- Table `mydb`.`Competences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Competences` (
  `idCompétences` INT NOT NULL AUTO_INCREMENT,
  `competence` INT NOT NULL,
  PRIMARY KEY (`idCompétences`))
ENGINE = MEMORY
COMMENT = '1. Maquetter une application\n\n2. Réaliser une interface utilisateur web statique et\nadaptable\n\n3. Développer une interface utilisateur web dynamique\n\n4. Réaliser une interface utilisateur avec une solution de\ngestion de contenu ou e-commerce\n\n5. Créer une base de données\n\n6. Développer les composants d’accès aux données\n\n7. Développer la partie back-end d’une application web ou\nweb mobile\n\n8. Elaborer et mettre en œuvre des composants dans une\napplication de gestion de contenu ou e-commerce\n\n9. Utiliser l’anglais dans son activité professionnelle en développement web et web mobile\n\n10. Actualiser et partager ses compétences en développement web et web mobile';


-- -----------------------------------------------------
-- Table `mydb`.`Note`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Note` (
  `idNote` INT NOT NULL AUTO_INCREMENT,
  `Client_idClientvote` INT NOT NULL,
  `Client_idClientvoteur` INT NOT NULL,
  `Competences_idCompétences` INT NOT NULL,
  `note` DECIMAL(3,2) NULL,
  PRIMARY KEY (`idNote`, `Client_idClientvote`, `Client_idClientvoteur`, `Competences_idCompétences`),
  INDEX `fk_Note_Client_idx` (`Client_idClientvote` ASC),
  INDEX `fk_Note_Client1_idx` (`Client_idClientvoteur` ASC),
  INDEX `fk_Note_Competences1_idx` (`Competences_idCompétences` ASC),
  CONSTRAINT `fk_Note_Client`
    FOREIGN KEY (`Client_idClientvote`)
    REFERENCES `mydb`.`Client` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Note_Client1`
    FOREIGN KEY (`Client_idClientvoteur`)
    REFERENCES `mydb`.`Client` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Note_Competences1`
    FOREIGN KEY (`Competences_idCompétences`)
    REFERENCES `mydb`.`Competences` (`idCompétences`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
