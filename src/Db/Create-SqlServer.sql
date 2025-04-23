-- Drop tables in reverse order of creation to avoid foreign key constraint violations
if exists
(
    select 1 
    from information_schema.tables 
    where table_type = 'BASE TABLE' and table_name = 'Users'
)
begin
    drop table Users;
end

if exists
(
    select 1 
    from information_schema.tables 
    where table_type = 'BASE TABLE' and table_name = 'Roles'
)
begin
    drop table Roles;
end

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
    Id int primary key identity,
    Col1 nvarchar(10),
    Col2 nvarchar(10),
    Col3 nvarchar(10)
);

create table Roles (
    Id int primary key identity,
    [Name] nvarchar(64) not null
);

create table Users (
    Id int primary key identity,
    RoleId int foreign key references Roles(Id) not null,
    Username nvarchar(64) not null,
    [Password] nvarchar(128) not null,
    Email nvarchar(512) not null,
    FirstName nvarchar(64) not null,
    LastName nvarchar(64)
);
