-- Set up reference data
insert into PERMISSION (id, name) values (1, 'ACCOUNT_ADMIN');
insert into ROLE (id, name) values (1, 'ADMIN');
insert into ROLE_PERMISSION (roles_id, permissions_id) values (1,1);

-- Users
insert into USER (id, username, email, emailverified, enabled, password) values (1, 'admin', 'foo@bar.com', 1, 1, '$2a$10$2WF8shppVB83EUMlQ..p7ubA79.242zeWfDg0szdLyJY/b9E.A8Xa');
insert into USER_ROLE (users_id, roles_id) values (1, 1);
insert into USER (id, username, email, emailverified, enabled, password) values (2, 'user', 'bar@foo.com', 1, 1, '$2a$10$69hsCBgOvlYVP4W8Nhggjep6m8hwT7E1lX14NkCHx7OoFaP9bN5qW');
