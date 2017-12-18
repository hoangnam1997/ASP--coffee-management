drop database GalaxyCoffee
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
--OK
CREATE TABLE [dbo].[User](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	[Password] NVARCHAR(50), -- pw
	[email] NVARCHAR(50), -- email
	WardID INT NOT NULL,  -- khu ph? s?ng
	DetailAddress NVARCHAR(50), -- d?a ch? chi ti?t
	[Identity] NVARCHAR(11), -- chung minh thu
	[BirthDay] SMALLDATETIME, -- ngay de
	[Sex] NVARCHAR(10), -- gioi tinh
	[Description] NVARCHAR(100), -- mô t?
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_User PRIMARY KEY (ID),
	CONSTRAINT FK_User_TownShip FOREIGN KEY (WardID) REFERENCES  Ward(ID)
);
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
CREATE TABLE [dbo].[Role](
	ID INT IDENTITY(1,1) NOT NULL,
	Name NVARCHAR(50) NOT NULL,
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,	
	CONSTRAINT PK_Regency PRIMARY KEY (ID),
);

GO
--OK
CREATE TABLE [dbo].[ShopUser](
	ID INT IDENTITY(1,1) NOT NULL,
	ShopID INT NOT NULL,
	UserID INT NOT NULL,
	RoleID INT,  -- vai tro
	[Description] NVARCHAR(100),
	IsDelete BIT DEFAULT 0,
	CONSTRAINT PK_ShopUser PRIMARY KEY (ID),
	CONSTRAINT FK_ShopUser_Shop FOREIGN KEY (ShopID) REFERENCES  Shop(ID),	
	CONSTRAINT FK_Shop_User FOREIGN KEY (UserID) REFERENCES  [User](ID),
	CONSTRAINT FK_Shop_Regency FOREIGN KEY (RoleID) REFERENCES  [Role](ID)	
);
GO
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
	CONSTRAINT FK_Order_User FOREIGN KEY (UserID) REFERENCES  [User](ID),
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

INSERT INTO CITY (Name) VALUES (N'Hồ Chí Minh'), (N'Hà Nội');

INSERT INTO DISTRICT (Name, CityId) VALUES (N'Quận 1', 1), (N'Quận 2', 1);
INSERT INTO DISTRICT (Name, CityId) VALUES (N'Cầu Giấy', 2), (N'Đống Đa', 2);

INSERT INTO WARD (Name, DistrictId) VALUES (N'Bến Nghé', 1), (N'Bến Thành', 1);
INSERT INTO WARD (Name, DistrictId) VALUES (N'Thảo Điền', 2), (N'Thủ Thiêm', 2);
INSERT INTO WARD (Name, DistrictId) VALUES (N'Trung Hoà', 3), (N'Yên Hoà', 3);
INSERT INTO WARD (Name, DistrictId) VALUES (N'Láng Hạ', 4), (N'Láng Thượng', 4);

INSERT INTO SHOP (Name, WardId, DetailAddress) VALUES ('Shop XXX', 1, N'30 Đường ABC');
INSERT INTO SHOP (Name, WardId, DetailAddress) VALUES ('Shop YYY', 2, N'20 Đường XYZ');

