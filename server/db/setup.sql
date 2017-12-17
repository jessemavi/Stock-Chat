-- stock_chat database

drop table users cascade if exists;
drop table posts cascade if exists;
drop table stocks cascade if exists;
drop table comments cascade if exists;
drop table likes;

create table users (
  id serial primary key,
  username varchar(40),
  email varchar(30),
  password varchar(30)
);

create table posts (
  id serial primary key,
  content text,
  stock_id integer references stocks(id),
  user_id integer references users(id)
);

create table stocks (
  id serial primary key,
  symbol varchar(4)
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
