CREATE TABLE Users (
    username VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL,

    PRIMARY KEY (username)
);

CREATE TABLE AnimeRelation (
    username VARCHAR(15) NOT NULL,
    animeId INTEGER NOT NULL,
    status INTEGER NOT NULL,

    FOREIGN KEY (username) REFERENCES Users(username),
    PRIMARY KEY (username, animeId)
);

CREATE TABLE MangaRelation (
    username VARCHAR(15) NOT NULL,
    mangaId INTEGER NOT NULL,
    status INTEGER NOT NULL,

    FOREIGN KEY (username) REFERENCES Users(username),
    PRIMARY KEY (username, mangaId)
);

CREATE TABLE CharactersRelation (
    username VARCHAR(15) NOT NULL,
    characterId INTEGER NOT NULL,

    FOREIGN KEY (username) REFERENCES Users(username),
    PRIMARY KEY (username, characterId)
);

CREATE TABLE ForumMembers (
    username VARCHAR(15) NOT NULL,
    targetId INTEGER NOT NULL,
    optionEnum INTEGER NOT NULL,

    FOREIGN KEY (username) REFERENCES Users(username),
    PRIMARY KEY (username, targetId, optionEnum)
);

CREATE TABLE Posts (
    postId INTEGER PRIMARY KEY GENERATED ALWAYS AS
           IDENTITY(START WITH 0, INCREMENT BY 1),
    authorName VARCHAR(15) NOT NULL,
    targetId INTEGER NOT NULL,
    optionEnum INTEGER NOT NULL,
    content VARCHAR(240) NOT NULL,

    FOREIGN KEY (authorName) REFERENCES Users(username)
);