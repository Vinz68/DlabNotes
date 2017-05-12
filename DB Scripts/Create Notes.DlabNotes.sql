CREATE TABLE [dbo].[DLabNotes] (
    [id]          NVARCHAR (255)     CONSTRAINT [DF_Notes_id] DEFAULT (CONVERT([nvarchar](255),newid(),(0))) NOT NULL,
    [__createdAt] DATETIMEOFFSET (3) CONSTRAINT [DF_Notes___createdAt] DEFAULT (CONVERT([datetimeoffset](3),sysutcdatetime(),(0))) NOT NULL,
    [__updatedAt] DATETIMEOFFSET (3) NULL,
    [__version]   ROWVERSION         NOT NULL,
    [__deleted]   BIT                DEFAULT ((0)) NOT NULL,
    [notetext]    NVARCHAR (MAX)     NULL,
    [done] BIT NOT NULL DEFAULT ((0)), 
    PRIMARY KEY NONCLUSTERED ([id] ASC)
);


GO
CREATE CLUSTERED INDEX [__createdAt]
    ON [dbo].[DLabNotes]([__createdAt] ASC);


GO
CREATE TRIGGER [dbo].[TR_Notes_InsertUpdateDelete] ON [dbo].[DLabNotes]
		   AFTER INSERT, UPDATE, DELETE
		AS
		BEGIN
			SET NOCOUNT ON;
			IF TRIGGER_NESTLEVEL() > 3 RETURN;

			UPDATE [dbo].[DLabNotes] SET [dbo].[DLabNotes].[__updatedAt] = CONVERT (DATETIMEOFFSET(3), SYSUTCDATETIME())
			FROM INSERTED
			WHERE INSERTED.id = [dbo].[DLabNotes].[id]
		END
