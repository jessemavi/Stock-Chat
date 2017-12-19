-- stock_chat database

drop table if exists users cascade;
drop table if exists posts cascade;
drop table if exists stocks cascade;
drop table if exists comments cascade;
drop table if exists likes;

create table users (
  id serial primary key,
  username varchar(40) unique,
  email varchar(30) unique,
  password varchar(30)
);

create table stocks (
  id serial primary key,
  symbol varchar(4) unique
);

create table posts (
  id serial primary key,
  content text,
  stock_id integer references stocks(id),
  user_id integer references users(id)
);

create table comments (
  id serial primary key,
  content text,
  user_id integer references users(id),
  post_id integer references posts(id)
);

create table likes (
  id serial primary key,
  post_id integer references posts(id),
  comment_id integer references comments(id)
);
