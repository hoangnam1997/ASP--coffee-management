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


