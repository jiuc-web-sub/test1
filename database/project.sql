use project;

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    AvatarURL NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Tasks (
    TaskID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    DueDate DATETIME,
    Priority INT DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'pending',
    ColorCode NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE TaskResources (
    ResourceID INT PRIMARY KEY IDENTITY(1,1),
    TaskID INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(255) NOT NULL,
    FileSize INT NOT NULL,
    UploadedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID)
);

CREATE TABLE UserSettings (
    SettingID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL UNIQUE,
    FontFamily NVARCHAR(50) DEFAULT 'Arial',
    FontSize INT DEFAULT 14,
    BackgroundImage NVARCHAR(255),
    Theme NVARCHAR(20) DEFAULT 'light',
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);