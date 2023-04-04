create table image (
  id  serial primary key,
  title varchar(255) not null,
  name varchar(255) not null
);

insert into image (title,name) values ('Test image 1','avatar.png');
insert into image (title,name) values ('Test image 2','avatar.png');
insert into image (title,name) values ('Test image 3','avatar.png');
insert into image (title,name) values ('Test image 4','avatar.png');