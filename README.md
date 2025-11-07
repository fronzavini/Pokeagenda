# Pokeagenda

CREATE DATABASE if NOT EXISTS POKEAGENDA;
USE POKEAGENDA;

CREATE TABLE if NOT EXISTS Treinador (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(100) not null,
    email varchar(150) not null,
    cpf varchar(11) not null unique,
    foto varchar(200) not null,
    cidade varchar(100) not null
);


CREATE TABLE if NOT EXISTS Tipo (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(100) not null
);

CREATE TABLE if NOT EXISTS Pokemon (
	id int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(100) not null,
    shiny boolean not null,
    apelido varchar(100),
    numero_pokedex int not null,
    tipo int not null,
    imagem_url varchar(200) not null,
    altura float not null,
    peso float not null, 
    habilidade varchar(100) not null,
    FOREIGN KEY (tipo) REFERENCES Tipo(id)
);

CREATE TABLE if NOT EXISTS Treinador_Pokemon (
	id int AUTO_INCREMENT PRIMARY KEY,
    treinador_id INT not null,
    pokemon_id INT not null,
    loca ENUM('time', 'box'),
    FOREIGN KEY (treinador_id) REFERENCES Treinador(id),
    FOREIGN KEY (Pokemon_id) REFERENCES Pokemon(id)
);
