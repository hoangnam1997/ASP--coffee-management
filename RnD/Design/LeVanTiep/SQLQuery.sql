DROP DATABASE GalaxyCoffee
GO
CREATE DATABASE GalaxyCoffee
GO
USE GalaxyCoffee
GO
--OK
CREATE TABLE [dbo].[City]
(
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	[Description] NVARCHAR(100), -- mo ta ne
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_City PRIMARY KEY (ID)
);
GO
--OK
CREATE TABLE [dbo].[District](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	CityID INT NOT NULL,
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,	
	CONSTRAINT PK_District PRIMARY KEY (ID),
	CONSTRAINT FK_District_City FOREIGN KEY (CityID) REFERENCES  City(ID)
);
GO
--OK
CREATE TABLE [dbo].[Ward](
	ID INT IDENTITY(1,1) NOT NULL,
	DistrictID INT NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,	
	CONSTRAINT PK_TownShip PRIMARY KEY (ID),
	CONSTRAINT FK_TownShip_District FOREIGN KEY (DistrictID) REFERENCES  District(ID)
);
GO

GO
--OK
CREATE TABLE [dbo].[Shop](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	WardID INT NOT NULL, -- dia chi
	[DetailAddress] NVARCHAR(50),  -- di chi chi tiet
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_Shop PRIMARY KEY (ID),
	CONSTRAINT FK_Shop_TownShip FOREIGN KEY (WardID) REFERENCES  Ward(ID)
);
GO
--OK
--Create User
CREATE TABLE [dbo].[AspNetUsers] (
    [Id]                   int	identity NOT NULL,
    [Email]                NVARCHAR (256) NULL,
    [EmailConfirmed]       BIT            NOT NULL,
    [PasswordHash]         NVARCHAR (MAX) NULL,
    [SecurityStamp]        NVARCHAR (MAX) NULL,
    [PhoneNumber]          NVARCHAR (MAX) NULL,
    [PhoneNumberConfirmed] BIT            NOT NULL,
    [TwoFactorEnabled]     BIT            NOT NULL,
    [LockoutEndDateUtc]    DATETIME       NULL,
    [LockoutEnabled]       BIT            NOT NULL,
    [AccessFailedCount]    INT            NOT NULL,
    [UserName]             NVARCHAR (256) NOT NULL,
	[Name]				   nvarchar(50),
	[WardID]				int		,
	[DetailAddress]			nvarchar(50),
	[Identity]				nvarchar(11) ,
	[BirthDay]				smalldatetime ,
	[Sex]					nvarchar(10),
	[Description]			nvarchar(100) ,
	[CreateAt]				smalldatetime,
	[IsDelete]				bit default 0,
	CONSTRAINT FK_User_TownShip FOREIGN KEY (WardID) REFERENCES  Ward(ID)
);
GO
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex]
    ON [dbo].[AspNetUsers]([UserName] ASC);
GO
ALTER TABLE [dbo].[AspNetUsers]
    ADD CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC);
GO

--create userlogin
CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] NVARCHAR (128) NOT NULL,
    [ProviderKey]   NVARCHAR (128) NOT NULL,
    [UserId]        int NOT NULL
);
GO
CREATE NONCLUSTERED INDEX [IX_UserId]
    ON [dbo].[AspNetUserLogins]([UserId] ASC);
GO
ALTER TABLE [dbo].[AspNetUserLogins]
    ADD CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider] ASC, [ProviderKey] ASC, [UserId] ASC);
GO
ALTER TABLE [dbo].[AspNetUserLogins]
    ADD CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

--create userclaim
	CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [UserId]     int NOT NULL,
    [ClaimType]  NVARCHAR (MAX) NULL,
    [ClaimValue] NVARCHAR (MAX) NULL
);

GO
CREATE NONCLUSTERED INDEX [IX_UserId]
    ON [dbo].[AspNetUserClaims]([UserId] ASC);
GO
ALTER TABLE [dbo].[AspNetUserClaims]
    ADD CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC);
GO
ALTER TABLE [dbo].[AspNetUserClaims]
    ADD CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

--create role
CREATE TABLE [dbo].[AspNetRoles] (
    [Id]   int	IDENTITY		 NOT NULL,
    [Name] NVARCHAR (256) NOT NULL,
	[Description]			nvarchar(100) ,
	[IsDelete]				bit default 0,
);
GO
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex]
    ON [dbo].[AspNetRoles]([Name] ASC);
GO
ALTER TABLE [dbo].[AspNetRoles]
    ADD CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC);

--create user role
CREATE TABLE [dbo].[AspNetUserRoles] (
	[Id]	int	Primary key	IDENTITY NOT NULL,
    [UserId] int NOT NULL,
    [RoleId] int NOT NULL,
	[ShopID] INT NOT NULL,
	[Description]			nvarchar(100) ,
	[IsDelete]				bit default 0,
	CONSTRAINT FK_ShopUser_Shop FOREIGN KEY (ShopID) REFERENCES  Shop(ID),	
);
GO
CREATE NONCLUSTERED INDEX [IX_UserId]
    ON [dbo].[AspNetUserRoles]([UserId] ASC);
GO
CREATE NONCLUSTERED INDEX [IX_RoleId]
    ON [dbo].[AspNetUserRoles]([RoleId] ASC);
GO

ALTER TABLE [dbo].[AspNetUserRoles]
    ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE;
GO
ALTER TABLE [dbo].[AspNetUserRoles]
    ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

--OK
CREATE TABLE [dbo].[GroupTable](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	[Description] NVARCHAR(100),
	[Surcharge] MONEY NOT NULL,
	IsDelete BIT DEFAULT 0,	
	CONSTRAINT PK_GroupTable PRIMARY KEY (ID),
);
GO
--OK
CREATE TABLE [dbo].[Table](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	GroupTableID INT NOT NULL,
	ShopID INT NOT NULL,
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_Table PRIMARY KEY (ID),
	CONSTRAINT FK_Table_GroupTable FOREIGN KEY (GroupTableID) REFERENCES  [GroupTable](ID),
	CONSTRAINT FK_Table_Shop FOREIGN KEY (ShopID) REFERENCES  [Shop](ID),
);
GO
--OK
CREATE TABLE [dbo].[ProductCategory](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,	
	CONSTRAINT PK_ProductCategory PRIMARY KEY (ID),
);
GO

--OK
CREATE TABLE [dbo].[Product](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	ProductCategoryID INT NOT NULL,
	ShopID INT NOT NULL,
	[Image] NVARCHAR(200),  -- image
	[UnitPrice] MONEY, -- GIA 1 sp
	[Description] NVARCHAR(100), -- mo ta
	[StartDay] SMALLDATETIME,  -- ket thuc
	[EndDate] SMALLDATETIME, -- ngay bat dau
	[Discount] INT, -- giam gia tren san pham
	IsDelete BIT DEFAULT 0, -- xoa or khong
	CONSTRAINT PK_Product PRIMARY KEY (ID),
	CONSTRAINT FK_Product_Shop FOREIGN KEY (ShopID) REFERENCES  [Shop](ID),
	CONSTRAINT FK_Product_ProductCategory FOREIGN KEY (ProductCategoryID) REFERENCES  [ProductCategory](ID),
);

GO
--may be option
CREATE TABLE [dbo].[Promotion](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	ShopID INT NOT NULL,
	StartDate SMALLDATETIME,
	EndDate SMALLdATETIME,
	BasePurchase INT DEFAULT 0, -- tien order >= thi khuyen mai. mat dinh  == 0 
	[Discount] INT,  -- giam gia tren hoa don
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_Promotion PRIMARY KEY (ID),
	CONSTRAINT FK_Promotion_Shop FOREIGN KEY (ShopID) REFERENCES [Shop](ID)
);
GO


--OK


CREATE TABLE [dbo].[Order](
	ID INT IDENTITY(1,1) NOT NULL,
	TableID INT NOT NULL,
	-- THANG PHI VA THANG CHIEU KEU DE
	-- thang vuong nghi xoa, nam nghix xoa,
	PromotionID INT, -- khuyen mai tren hoa don
	UserID INT NOT NULL,
	CreateAt SMALLDATETIME, -- ngay khoi tao hoa don 
	IsDelete BIT DEFAULT 0,	
	CONSTRAINT PK_Order PRIMARY KEY (ID),
	CONSTRAINT FK_Order_Table FOREIGN KEY (TableID) REFERENCES  [Table](ID),
	CONSTRAINT FK_Order_Promotion FOREIGN KEY (PromotionID) REFERENCES  [Promotion](ID),
	CONSTRAINT FK_Order_User FOREIGN KEY (UserID) REFERENCES  [AspNetUsers](ID),
);

GO
--OK
CREATE TABLE [dbo].[OrderProduct](
	ID INT IDENTITY(1,1) NOT NULL,
	ProductID INT NOT NULL,
	OrderID INT NOT NULL,
	-- Thang Phi Sua: PromotionID INT,
	Quantity SMALLINT, -- so luong product
	[Status] NVARCHAR(20), -- trang thai hoa don	
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_OrderProduct PRIMARY KEY (ID),
	CONSTRAINT FK_OrderProduct_Product FOREIGN KEY (ProductID) REFERENCES  [Product](ID),
	CONSTRAINT FK_OrderProduct_Order FOREIGN KEY (OrderID) REFERENCES  [Order](ID),
	-- Thang Phi Sua: CONSTRAINT FK_OrderProduct_Promotion FOREIGN KEY (PromotionID) REFERENCES  [Promotion](ID),
);



----------------------------------------



-- insert 63 tỉnh thành
set identity_insert City on;

insert into City(ID,Name,Description,IsDelete) values(1,N'An Giang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(2,N'Bà Rịa - Vũng Tàu','', 'false');
insert into City(ID,Name,Description,IsDelete) values(3,N'Bắc Giang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(4,N'Bắc Kạn','', 'false');
insert into City(ID,Name,Description,IsDelete) values(5,N'Bạc Liêu','', 'false');
insert into City(ID,Name,Description,IsDelete) values(6,N'Bắc Ninh','', 'false');
insert into City(ID,Name,Description,IsDelete) values(7,N'Bến Tre','', 'false');
insert into City(ID,Name,Description,IsDelete) values(8,N'Bình Định','', 'false');
insert into City(ID,Name,Description,IsDelete) values(9,N'Bình Dương','', 'false');
insert into City(ID,Name,Description,IsDelete) values(10,N'Bình Phước','', 'false');
insert into City(ID,Name,Description,IsDelete) values(11,N'Bình Thuận','', 'false');
insert into City(ID,Name,Description,IsDelete) values(12,N'Cà Mau','', 'false');
insert into City(ID,Name,Description,IsDelete) values(13,N'Cao Bằng','', 'false');
insert into City(ID,Name,Description,IsDelete) values(14,N'Đắk Lắk','', 'false');
insert into City(ID,Name,Description,IsDelete) values(15,N'Đắk Nông','', 'false');
insert into City(ID,Name,Description,IsDelete) values(16,N'Điện Biên','', 'false');
insert into City(ID,Name,Description,IsDelete) values(17,N'Đồng Nai','', 'false');
insert into City(ID,Name,Description,IsDelete) values(18,N'Đồng Tháp','', 'false');
insert into City(ID,Name,Description,IsDelete) values(19,N'Gia Lai','', 'false');
insert into City(ID,Name,Description,IsDelete) values(20,N'Hà Giang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(21,N'Hà Nam','', 'false');
insert into City(ID,Name,Description,IsDelete) values(22,N'Hà Tĩnh','', 'false');
insert into City(ID,Name,Description,IsDelete) values(23,N'Hải Dương','', 'false');
insert into City(ID,Name,Description,IsDelete) values(24,N'Hậu Giang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(25,N'Hòa Bình','', 'false');
insert into City(ID,Name,Description,IsDelete) values(26,N'Hưng Yên','', 'false');
insert into City(ID,Name,Description,IsDelete) values(27,N'Khánh Hòa','', 'false');
insert into City(ID,Name,Description,IsDelete) values(28,N'Kiên Giang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(29,N'Kon Tum','', 'false');
insert into City(ID,Name,Description,IsDelete) values(30,N'Lai Châu','', 'false');
insert into City(ID,Name,Description,IsDelete) values(31,N'Lâm Đồng','', 'false');
insert into City(ID,Name,Description,IsDelete) values(32,N'Lạng Sơn','', 'false');
insert into City(ID,Name,Description,IsDelete) values(33,N'Lào Cai','', 'false');
insert into City(ID,Name,Description,IsDelete) values(34,N'Long An','', 'false');
insert into City(ID,Name,Description,IsDelete) values(35,N'Nam Định','', 'false');
insert into City(ID,Name,Description,IsDelete) values(36,N'Nghệ An','', 'false');
insert into City(ID,Name,Description,IsDelete) values(37,N'Ninh Bình','', 'false');
insert into City(ID,Name,Description,IsDelete) values(38,N'Ninh Thuận','', 'false');
insert into City(ID,Name,Description,IsDelete) values(39,N'Phú Thọ','', 'false');
insert into City(ID,Name,Description,IsDelete) values(40,N'Quảng Bình','', 'false');
insert into City(ID,Name,Description,IsDelete) values(41,N'Quảng Nam','', 'false');
insert into City(ID,Name,Description,IsDelete) values(42,N'Quảng Ngãi','', 'false');
insert into City(ID,Name,Description,IsDelete) values(43,N'Quảng Ninh','', 'false');
insert into City(ID,Name,Description,IsDelete) values(44,N'Quảng Trị','', 'false');
insert into City(ID,Name,Description,IsDelete) values(45,N'Sóc Trăng','', 'false');
insert into City(ID,Name,Description,IsDelete) values(46,N'Sơn La','', 'false');
insert into City(ID,Name,Description,IsDelete) values(47,N'Tây Ninh','', 'false');
insert into City(ID,Name,Description,IsDelete) values(48,N'Thái Bình','', 'false');
insert into City(ID,Name,Description,IsDelete) values(49,N'Thái Nguyên','', 'false');
insert into City(ID,Name,Description,IsDelete) values(50,N'Thanh Hóa','', 'false');
insert into City(ID,Name,Description,IsDelete) values(51,N'Thừa Thiên Huế','', 'false');
insert into City(ID,Name,Description,IsDelete) values(52,N'Tiền Giang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(53,N'Trà Vinh','', 'false');
insert into City(ID,Name,Description,IsDelete) values(54,N'Tuyên Quang','', 'false');
insert into City(ID,Name,Description,IsDelete) values(55,N'Vĩnh Long','', 'false');
insert into City(ID,Name,Description,IsDelete) values(56,N'Vĩnh Phúc','', 'false');
insert into City(ID,Name,Description,IsDelete) values(57,N'Yên Bái','', 'false');
insert into City(ID,Name,Description,IsDelete) values(58,N'Phú Yên','', 'false');
insert into City(ID,Name,Description,IsDelete) values(59,N'Cần Thơ','', 'false');
insert into City(ID,Name,Description,IsDelete) values(60,N'Đà Nẵng','', 'false');
insert into City(ID,Name,Description,IsDelete) values(61,N'Hải Phòng','', 'false');
insert into City(ID,Name,Description,IsDelete) values(62,N'Hà Nội','', 'false');
insert into City(ID,Name,Description,IsDelete) values(63,N'Hồ Chí Minh','', 'false');


---
set identity_insert City off;
set identity_insert District on;
-- insert các quận huyện tp Hồ Chí Minh
insert into District(ID,Name,CityID,Description,IsDelete) values(1,N'Quận 1',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(2,N'Quận 2',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(3,N'Quận 3',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(4,N'Quận 4',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(5,N'Quận 5',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(6,N'Quận 6',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(7,N'Quận 7',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(8,N'Quận 8',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(9,N'Quận 9',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(10,N'Quận 10',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(11,N'Quận 11',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(12,N'Quận 12',63,'', 'false');

insert into District(ID,Name,CityID,Description,IsDelete) values(13,N'Bình Tân',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(14,N'Bình Thạnh',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(15,N'Tân Bình',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(16,N'Tân Phú',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(17,N'Thủ Đức',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(18,N'Gò Vấp',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(19,N'Phú Nhuận',63,'', 'false');

insert into District(ID,Name,CityID,Description,IsDelete) values(20,N'Hóc Môn',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(21,N'Bình Chánh',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(22,N'Nhà Bè',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(23,N'Củ Chi',63,'', 'false');
insert into District(ID,Name,CityID,Description,IsDelete) values(24,N'Cần Giờ',63,'', 'false');

-- insert các quận huyện ở Hà Nội
insert into District(ID,Name,CityID,Description,IsDelete) values(25,N'Ba Đình',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(26,N'Hoàn Kiếm',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(27,N'Tây Hồ',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(28,N'Long Biên',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(29,N'Cầu Giấy',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(30,N'Đống Đa',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(31,N'Hai Bà Trưng',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(32,N'Hoàng Mai',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(33,N'Thanh Xuân',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(34,N'Sóc Sơn',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(35,N'Đông Anh',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(36,N'Gia Lâm',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(37,N'Nam Từ Liêm',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(38,N'Thanh Trì',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(39,N'Bắc Từ Liêm',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(40,N'Mê Linh',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(41,N'Hà Đông',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(42,N'Thị xã Sơn Tây',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(43,N'Ba Vì',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(44,N'Phúc Thọ',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(45,N'Đan Phượng',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(46,N'Hoài Đức',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(47,N'Quốc Oai',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(48,N'Thạch Thất',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(49,N'Chương Mỹ',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(50,N'Thanh Oai',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(51,N'Thường Tín',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(52,N'Phú Xuyên',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(53,N'Ứng Hòa',63,'','false');
insert into District(ID,Name,CityID,Description,IsDelete) values(54,N'Mỹ Đức',63,'','false');
---
set identity_insert District off;
set identity_insert Ward off;

-- INSERT Ward
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 2',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 3',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 4',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 5',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 6',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 7',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 8',N'','false');
INSERT INTO Ward(DistrictID,Name,[Description],IsDelete) values (1,N'Phường 9',N'','false');

------------InSert Shop


INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'Ban Mê',2,N'577 Hiệp Bình',N'','false')
INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'Feel Cafe',3,N'577 QL13',N'','false')
INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'Hà Lan',4,N'577 Đường Số 3',N'','false')
INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'TeaCoffee',5,N'577 Bình Long',N'','false')
INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'Gold',6,N'577 Hà Nạ',N'','false')
INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'LinhKe',7,N'577 Hai Long',N'','false')
INSERT INTO dbo.Shop ( Name , WardID ,DetailAddress ,Description ,IsDelete) VALUES(N'Night',8,N'577 Đường Số 2',N'','false')

-- Trigger Check End Date
CREATE TRIGGER SET_EndDate --Tên Trigger
ON dbo.Promotion
FOR INSERT
AS
BEGIN  
			DECLARE @NGBD SMALLDATETIME
			DECLARE @id INT
			DECLARE @idNew INT
			SELECT  @NGBD=StartDate FROM INSERTED 
			SELECT @idNew = ID FROM INSERTED
			SELECT @id=ID FROM dbo.Promotion WHERE EndDate IS NULL AND ID!=@idNew
          IF (@id IS NOT NULL)
			BEGIN
			UPDATE dbo.Promotion
			SET EndDate=@NGBD
		    WHERE ID=@id
			END
			
END

-----INSERT PROMOTION


INSERT INTO dbo.Promotion(Name,ShopID,StartDate,BasePurchase,Discount,[Description],IsDelete)
VALUES  ( N'Khuyến Mãi Khai Trương',1,'2016-09-01',100000 ,20 ,N'','false')

INSERT INTO dbo.Promotion(Name,ShopID,StartDate,EndDate,BasePurchase,Discount,[Description],IsDelete)
VALUES  ( N'Khuyến Mãi 8/3',1,'2017-03-08','2017-03-09',100000 ,20 ,N'','false')

INSERT INTO dbo.Promotion(Name,ShopID,StartDate,EndDate,BasePurchase,Discount,[Description],IsDelete)
VALUES  ( N'Khuyến Mãi 30/4',1,'2017-04-30','2017-05-02',100000 ,20 ,N'','false')

INSERT INTO dbo.Promotion(Name,ShopID,StartDate,EndDate,BasePurchase,Discount,[Description],IsDelete)
VALUES  ( N'Khuyến Mãi Quốc tế thiếu nhi',1,'2017-06-01','2017-06-05',100000 ,20 ,N'','false')

INSERT INTO dbo.Promotion(Name,ShopID,StartDate,EndDate,BasePurchase,Discount,[Description],IsDelete)
VALUES  ( N'Khuyến Mãi 3/8',1,'2017-08-03','2017-08-05',100000 ,20 ,N'','false')

INSERT INTO dbo.Promotion(Name,ShopID,StartDate,BasePurchase,Discount,[Description],IsDelete)
VALUES  ( N'Khuyến Mãi Khai Giảng Năm Học',1,'2017-09-01',100000 ,20 ,N'','false')
