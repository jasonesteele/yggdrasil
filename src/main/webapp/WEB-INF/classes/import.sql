-- Set up reference data
insert into PERMISSION (id, name) values (1, 'ACCOUNT_ADMIN');
insert into ROLE (id, name) values (1, 'ADMIN');
insert into ROLE_PERMISSION (roles_id, permissions_id) values (1,1);

-- Users
insert into USER (id, username, email, enabled, password) values (1, 'admin', 'foo@bar.com', 1, '$2a$10$jmBr5I3xOF5.GX/J9FOHyuwPntrqqdroY/pkYbJuRd7pLYANdxc/W');
insert into USER_ROLE (users_id, roles_id) values (1, 1);

insert into USER (id, username, email, enabled, password) values (2, 'user', 'bar@foo.com', 1, '$2a$10$.a.XmKgoxgwduV0SlwgxiO2xPPeXafGP.fg4hDKhgkEOC5t7SmbfW');
