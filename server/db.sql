create table user (
  id serial primary key,
  email varchar(255) not null,
  password varchar(255) not null
);

create table image (
  id  serial primary key,
  title varchar(255) not null,
  name varchar(255) not null,
  user_id int not null,
  constraint fk_user_image foreign key(user_id)
  references user(id) on delete restrict
);

create table comment (
  id serial primary key,
  comment_text text not null,
  saved timestamp default current_timestamp,
  image_id int not null,
  constraint fk_image_comment foreign key(image_id)
  references image(id) on delete restrict,
  user_id int not null,
  constraint fk_user_image foreign key(user_id)
  references user(id) on delete restrict
);

insert into image (title,name) values ('Test image 1','avatar.png');
insert into image (title,name) values ('Test image 2','avatar.png');
insert into image (title,name) values ('Test image 3','avatar.png');
insert into image (title,name) values ('Test image 4','avatar.png');


insert into comment (comment_text,image_id) values ('Test comment 1',2);
insert into comment (comment_text,image_id) values ('Test comment 2',2);