insert into [Data] (Col1, Col2, Col3) values ('Val11', 'Val12', 'Val13');
insert into [Data] (Col1, Col2, Col3) values ('Val21', 'Val22', 'Val23');
insert into [Data] (Col1, Col2, Col3) values ('Val31', 'Val32', 'Val33');

insert into Roles ([Name]) values ('User');
insert into Roles ([Name]) values ('Admin');

select * from [Data];

select * from [Roles];

select u.Id, Username, [Password], Email, FirstName, LastName, r.[Name] as [Role]
from Users u
join Roles r on r.Id = u.RoleId;
