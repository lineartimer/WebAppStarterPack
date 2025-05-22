insert into [Data] (Col1, Col2, Col3) values ('Val-1-1', 'Val-1-2', 'Val-1-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-2-1', 'Val-2-2', 'Val-2-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-3-1', 'Val-3-2', 'Val-3-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-4-1', 'Val-4-2', 'Val-4-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-5-1', 'Val-5-2', 'Val-5-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-6-1', 'Val-6-2', 'Val-6-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-7-1', 'Val-7-2', 'Val-7-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-8-1', 'Val-8-2', 'Val-8-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-9-1', 'Val-9-2', 'Val-9-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-10-1', 'Val-10-2', 'Val-10-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-11-1', 'Val-11-2', 'Val-11-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-12-1', 'Val-12-2', 'Val-12-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-13-1', 'Val-13-2', 'Val-13-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-14-1', 'Val-14-2', 'Val-14-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-15-1', 'Val-15-2', 'Val-15-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-16-1', 'Val-16-2', 'Val-16-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-17-1', 'Val-17-2', 'Val-17-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-18-1', 'Val-18-2', 'Val-18-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-19-1', 'Val-19-2', 'Val-19-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-20-1', 'Val-20-2', 'Val-20-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-21-1', 'Val-21-2', 'Val-21-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-22-1', 'Val-22-2', 'Val-22-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-23-1', 'Val-23-2', 'Val-23-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-24-1', 'Val-24-2', 'Val-24-3');
insert into [Data] (Col1, Col2, Col3) values ('Val-25-1', 'Val-25-2', 'Val-25-3');

insert into Roles ([Name]) values ('User');
insert into Roles ([Name]) values ('Admin');

select * from [Data];

select * from [Roles];

select u.Id, Username, [Password], Email, FirstName, LastName, r.[Name] as [Role]
from Users u
join Roles r on r.Id = u.RoleId;
