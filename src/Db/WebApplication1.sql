if exists
(
    select 1 
    from information_schema.tables 
    where table_type = 'BASE TABLE' and table_name = 'Data'
)
begin
    drop table [Data];
end

create table [Data] (
    -- For Sql Server
    Id int primary key identity,
    -- For Sqlite
    -- Id integer primary key autoincrement,
    Col1 nvarchar(10),
    Col2 nvarchar(10),
    Col3 nvarchar(10)
);

insert into [Data] (Col1, Col2, Col3) values ('Val11', 'Val12', 'Val13');
insert into [Data] (Col1, Col2, Col3) values ('Val21', 'Val22', 'Val23');
insert into [Data] (Col1, Col2, Col3) values ('Val31', 'Val32', 'Val33');

select * from [Data];