
create table kittens (
    id serial primary key, 
    kitten_name text not null, 
    week_day text not null,
    duration int not null);