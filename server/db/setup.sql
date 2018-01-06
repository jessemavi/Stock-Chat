-- stock_chat database

drop table if exists users cascade;
drop table if exists posts cascade;
drop table if exists stocks cascade;
drop table if exists comments cascade;
drop table if exists likes;

create table users (
  id serial primary key,
  username varchar unique not null check (length(username) >= 4),
  email varchar unique not null check (length(email) >= 7),
  password varchar not null,
  created_at timestamp default now() not null
);

create table stocks (
  id serial primary key,
  symbol varchar unique not null,
  name varchar unique not null
);

create table posts (
  id serial primary key,
  content text not null check (length(content) > 0),
  stock_id integer references stocks(id) not null,
  user_id integer references users(id) not null,
  created_at timestamp default now() not null
);

create table comments (
  id serial primary key,
  content text not null check (length(content) > 0),
  post_id integer references posts(id) on delete cascade not null,
  user_id integer references users(id) not null,
  created_at timestamp default now() not null
);

create table likes (
  id serial primary key,
  post_id integer references posts(id) on delete cascade,
  comment_id integer references comments(id) on delete cascade,
  user_id integer references users(id) not null,
  created_at timestamp default now() not null
);

insert into stocks (symbol, name) values
    ('MMM', '3M'),
    ('AXP', 'American Express'),
    ('AAPL', 'Apple'),
    ('BA', 'Boeing'),
    ('CAT', 'Caterpillar'),
    ('CVX', 'Chevron'),
    ('CSCO', 'Cisco'),
    ('KO', 'Coca-Cola'),
    ('DIS', 'Disney'),
    ('XOM', 'Exxon Mobil'),
    ('GE', 'General Electric'),
    ('GS', 'Goldman Sachs'),
    ('HD', 'Home Depot'),
    ('IBM', 'IBM'),
    ('INTC', 'Intel'),
    ('JNJ', 'Johnson & Johnson'),
    ('JPM', 'JPMorgan Chase'),
    ('MCD', 'McDonald''s'),
    ('MRK', 'Merck'),
    ('MSFT', 'Microsoft'),
    ('NKE', 'Nike'),
    ('PFE', 'Pfizer'),
    ('PG', 'Procter & Gamble'),
    ('TRV', 'Travelers Companies Inc'),
    ('UTX', 'United Technologies'),
    ('UNH', 'UnitedHealth'),
    ('VZ', 'Verizon'),
    ('V', 'Visa'),
    ('WMT', 'Wal-Mart');
