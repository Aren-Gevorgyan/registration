create database if not exists user;
create table if not exists userdata(
    id int unsigned unique auto_increment primary key,
    name varchar(60) char set utf8,
    lastName varchar(100) char set utf8,
    phone int unsigned,
    photo varchar(100) char set utf8 unique,
    email varchar(100) char set utf8 unique,
    login varchar(50) char set utf8 unique,
    password varchar(250) char set utf8 unique,
    token varchar(250) unique,
    refreshToken varchar(250) unique
)