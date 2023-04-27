create table gallery_user (
  id serial primary key,
  email varchar(255) not null,
  password varchar(255) not null
);

create table image (
  id  serial primary key,
  title varchar(255) not null,
  name varchar(255) not null,
  gallery_user_id int not null,
  constraint fk_gallery_user_image foreign key(gallery_user_id)
  references gallery_user(id) on delete restrict
);

create table comment (
  id serial primary key,
  comment_text text not null,
  saved timestamp default current_timestamp,
  image_id int not null,
  constraint fk_image_comment foreign key(image_id)
  references image(id) on delete restrict,
  gallery_user_id int not null,
  constraint fk_gallery_user_comment foreign key(gallery_user_id)
  references gallery_user(id) on delete restrict
);

insert into gallery_user (email,password) values ('foo@foo.com','abc123');
insert into gallery_user (email,password) values ('foo2@foo.com','admin123');

insert into image (title,name,gallery_user_id) values ('Test image 1','avatar.png',1);
insert into image (title,name,gallery_user_id) values ('Test image 2','avatar.png',2);
insert into image (title,name,gallery_user_id) values ('Test image 3','avatar.png',1);
insert into image (title,name,gallery_user_id) values ('Test image 4','avatar.png',1);


insert into comment (comment_text,image_id,gallery_user_id) values ('Test comment 1',1,1);
insert into comment (comment_text,image_id,gallery_user_id) values ('Test comment 2',1,1);
insert into comment (comment_text,image_id,gallery_user_id) values ('Test comment 3',1,2);
