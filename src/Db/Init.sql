insert into [Data] (Col1, Col2, Col3) values ('Val11', 'Val12', 'Val13');
insert into [Data] (Col1, Col2, Col3) values ('Val21', 'Val22', 'Val23');
insert into [Data] (Col1, Col2, Col3) values ('Val31', 'Val32', 'Val33');
insert into [Data] (Col1, Col2, Col3) values ('Val41', 'Val42', 'Val43');
insert into [Data] (Col1, Col2, Col3) values ('Val51', 'Val52', 'Val53');
insert into [Data] (Col1, Col2, Col3) values ('Val61', 'Val62', 'Val63');
insert into [Data] (Col1, Col2, Col3) values ('Val71', 'Val72', 'Val73');
insert into [Data] (Col1, Col2, Col3) values ('Val81', 'Val82', 'Val83');
insert into [Data] (Col1, Col2, Col3) values ('Val91', 'Val92', 'Val93');
insert into [Data] (Col1, Col2, Col3) values ('Val101', 'Val102', 'Val103');
insert into [Data] (Col1, Col2, Col3) values ('Val111', 'Val112', 'Val113');
insert into [Data] (Col1, Col2, Col3) values ('Val121', 'Val122', 'Val123');
insert into [Data] (Col1, Col2, Col3) values ('Val131', 'Val132', 'Val133');
insert into [Data] (Col1, Col2, Col3) values ('Val141', 'Val142', 'Val143');
insert into [Data] (Col1, Col2, Col3) values ('Val151', 'Val152', 'Val153');
insert into [Data] (Col1, Col2, Col3) values ('Val161', 'Val162', 'Val163');
insert into [Data] (Col1, Col2, Col3) values ('Val171', 'Val172', 'Val173');
insert into [Data] (Col1, Col2, Col3) values ('Val181', 'Val182', 'Val183');
insert into [Data] (Col1, Col2, Col3) values ('Val191', 'Val192', 'Val193');
insert into [Data] (Col1, Col2, Col3) values ('Val201', 'Val202', 'Val203');
insert into [Data] (Col1, Col2, Col3) values ('Val211', 'Val212', 'Val213');
insert into [Data] (Col1, Col2, Col3) values ('Val221', 'Val222', 'Val223');
insert into [Data] (Col1, Col2, Col3) values ('Val231', 'Val232', 'Val233');
insert into [Data] (Col1, Col2, Col3) values ('Val241', 'Val242', 'Val243');
insert into [Data] (Col1, Col2, Col3) values ('Val251', 'Val252', 'Val253');
insert into [Data] (Col1, Col2, Col3) values ('Val261', 'Val262', 'Val263');
insert into [Data] (Col1, Col2, Col3) values ('Val271', 'Val272', 'Val273');
insert into [Data] (Col1, Col2, Col3) values ('Val281', 'Val282', 'Val283');
insert into [Data] (Col1, Col2, Col3) values ('Val291', 'Val292', 'Val293');
insert into [Data] (Col1, Col2, Col3) values ('Val301', 'Val302', 'Val303');
insert into [Data] (Col1, Col2, Col3) values ('Val311', 'Val312', 'Val313');
insert into [Data] (Col1, Col2, Col3) values ('Val321', 'Val322', 'Val323');
insert into [Data] (Col1, Col2, Col3) values ('Val331', 'Val332', 'Val333');
insert into [Data] (Col1, Col2, Col3) values ('Val341', 'Val342', 'Val343');
insert into [Data] (Col1, Col2, Col3) values ('Val351', 'Val352', 'Val353');
insert into [Data] (Col1, Col2, Col3) values ('Val361', 'Val362', 'Val363');
insert into [Data] (Col1, Col2, Col3) values ('Val371', 'Val372', 'Val373');
insert into [Data] (Col1, Col2, Col3) values ('Val381', 'Val382', 'Val383');
insert into [Data] (Col1, Col2, Col3) values ('Val391', 'Val392', 'Val393');
insert into [Data] (Col1, Col2, Col3) values ('Val401', 'Val402', 'Val403');
insert into [Data] (Col1, Col2, Col3) values ('Val411', 'Val412', 'Val413');
insert into [Data] (Col1, Col2, Col3) values ('Val421', 'Val422', 'Val423');
insert into [Data] (Col1, Col2, Col3) values ('Val431', 'Val432', 'Val433');
insert into [Data] (Col1, Col2, Col3) values ('Val441', 'Val442', 'Val443');
insert into [Data] (Col1, Col2, Col3) values ('Val451', 'Val452', 'Val453');
insert into [Data] (Col1, Col2, Col3) values ('Val461', 'Val462', 'Val463');
insert into [Data] (Col1, Col2, Col3) values ('Val471', 'Val472', 'Val473');
insert into [Data] (Col1, Col2, Col3) values ('Val481', 'Val482', 'Val483');
insert into [Data] (Col1, Col2, Col3) values ('Val491', 'Val492', 'Val493');

insert into Roles ([Name]) values ('User');
insert into Roles ([Name]) values ('Admin');

select * from [Data];

select * from [Roles];

select u.Id, Username, [Password], Email, FirstName, LastName, r.[Name] as [Role]
from Users u
join Roles r on r.Id = u.RoleId;
