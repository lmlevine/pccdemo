-- PCC FACULTY DEMONSTRATION
-- Mon Jul  3 20:59:55 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema PCC_Demo
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `PCC_Demo` ;

-- -----------------------------------------------------
-- Schema PCC_Demo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `PCC_Demo` DEFAULT CHARACTER SET utf8 ;
USE `PCC_Demo` ;

-- -----------------------------------------------------
-- Table `PCC_Demo`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PCC_Demo`.`students` ;

CREATE TABLE IF NOT EXISTS `PCC_Demo`.`students` (
  `idstudents` INT NOT NULL AUTO_INCREMENT,
  `STUDENT_ID` INT NULL,
  `LAST_NAME` VARCHAR(45) NULL,
  `FIRST_NAME` VARCHAR(45) NULL,
  `EMAIL_ADDRESS` VARCHAR(45) NULL,
  `PHONE_NUMBER` VARCHAR(45) NULL,
  PRIMARY KEY (`idstudents`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PCC_Demo`.`courses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PCC_Demo`.`courses` ;

CREATE TABLE IF NOT EXISTS `PCC_Demo`.`courses` (
  `idcourses` INT NOT NULL AUTO_INCREMENT,
  `COURSE_NUMBER` VARCHAR(45) NULL,
  PRIMARY KEY (`idcourses`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PCC_Demo`.`grades`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PCC_Demo`.`grades` ;

CREATE TABLE IF NOT EXISTS `PCC_Demo`.`grades` (
  `idgrades` INT NOT NULL AUTO_INCREMENT,
  `studentid` INT NULL,
  `courseid` INT NULL,
  `ASSIGNMENT_NUMBER` INT NULL,
  `SUBMISSION_DATE` DATETIME NULL,
  `GRADE` VARCHAR(2) NULL,
  PRIMARY KEY (`idgrades`),
  INDEX `courses_idx` (`courseid` ASC) VISIBLE,
  INDEX `students_idx` (`studentid` ASC) VISIBLE,
  CONSTRAINT `courses`
    FOREIGN KEY (`courseid`)
    REFERENCES `PCC_Demo`.`courses` (`idcourses`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `students`
    FOREIGN KEY (`studentid`)
    REFERENCES `PCC_Demo`.`students` (`idstudents`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PCC_Demo`.`import`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PCC_Demo`.`import` ;

CREATE TABLE IF NOT EXISTS `PCC_Demo`.`import` (
  `idimport` INT NOT NULL AUTO_INCREMENT,
  `STUDENT_ID` INT NULL,
  `LAST_NAME` VARCHAR(45) NULL,
  `FIRST_NAME` VARCHAR(45) NULL,
  `EMAIL_ADDRESS` VARCHAR(45) NULL,
  `PHONE_NUMBER` VARCHAR(45) NULL,
  `COURSE_NUMBER` VARCHAR(45) NULL,
  `ASSIGNMENT_NUMBER` INT NULL,
  `SUBMISSION_DATE` DATETIME NULL,
  `GRADE` VARCHAR(2) NULL,
  PRIMARY KEY (`idimport`))
ENGINE = InnoDB;

USE `PCC_Demo`;

DELIMITER $$

USE `PCC_Demo`$$
DROP TRIGGER IF EXISTS `PCC_Demo`.`import_AFTER_INSERT` $$
USE `PCC_Demo`$$
CREATE DEFINER = CURRENT_USER TRIGGER `PCC_Demo`.`import_AFTER_INSERT` AFTER INSERT ON `import` FOR EACH ROW
BEGIN
	INSERT INTO students(STUDENT_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PHONE_NUMBER) 
		SELECT new.STUDENT_ID, new.FIRST_NAME, new.LAST_NAME, new.EMAIL_ADDRESS, new.PHONE_NUMBER
        WHERE NOT EXISTS (SELECT * FROM students WHERE STUDENT_ID = new.STUDENT_ID); 
	INSERT INTO courses(COURSE_NUMBER)
		SELECT new.COURSE_NUMBER
		WHERE NOT EXISTS (SELECT * FROM courses WHERE COURSE_NUMBER = new.COURSE_NUMBER);
	INSERT INTO grades(studentid, courseid, ASSIGNMENT_NUMBER, SUBMISSION_DATE, GRADE) values (new.STUDENT_ID, (SELECT idcourses from courses WHERE COURSE_NUMBER=new.COURSE_NUMBER), new.ASSIGNMENT_NUMBER, new.SUBMISSION_DATE, new.GRADE); 

END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Insert Sample Data
-- -----------------------------------------------------

-- INSERT INTO PCC_Demo.import (STUDENT_ID,LAST_NAME,FIRST_NAME,EMAIL_ADDRESS,PHONE_NUMBER,COURSE_NUMBER,ASSIGNMENT_NUMBER,SUBMISSION_DATE,GRADE) 
-- VALUES (1,'Potter','Harry','harry.potter@pasadena.edu','123-456-7890','CSC101',1,'2023-01-15','A'),
-- (2,'Granger','Hermione','hermione.granger@pasadena.edu','987-654-3210','CSC102',1,'2023-01-15','A');
