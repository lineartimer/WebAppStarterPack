-- Drop tables in reverse order of creation to avoid foreign key constraint violations
drop table if exists [Users];
drop table if exists [Data];

create table [Data] (
    Id integer primary key autoincrement,
    Col1 nvarchar(10),
    Col2 nvarchar(10),
    Col3 nvarchar(10)
);

create table [Users] (
    Id integer primary key autoincrement not null,
    UserName nvarchar(64) not null,
    [Password] nvarchar(128) not null,
    Email nvarchar(512) not null,
    FirstName nvarchar(64) not null,
    LastName nvarchar(64)
);
