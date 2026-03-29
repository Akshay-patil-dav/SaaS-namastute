package com.example.otpauth.dto;

import java.util.List;

public class BuilderDto {

    public static class FolderDto {
        public String id;
        public String name;
        public String icon; // Lucide icon name
        public boolean open = true;
        public boolean ownedByMe = true;
    }

    public static class PageDto {
        public String id;
        public String name;
        public String icon; // Lucide icon name
        public String folderId;
    }

    public static class PageBlockDto {
        public String id;
        public String type;
        public String content;
        public Integer orderIndex;
    }

    public static class BuilderDataResponse {
        public List<FolderDto> folders;
        public List<PageDto> pages;
    }

    public static class CreateFolderRequest {
        public String name;
    }

    public static class CreatePageRequest {
        public String name;
        public String folderId;
    }

    public static class MovePageRequest {
        public String folderId;
    }

    public static class UpdateIconRequest {
        public String icon; // Lucide icon name
    }
}
