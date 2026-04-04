package com.example.otpauth.service;

import com.example.otpauth.dto.BuilderDto.*;
import com.example.otpauth.model.*;
import com.example.otpauth.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuilderService {

    private final PageFolderRepository folderRepo;
    private final CustomPageRepository pageRepo;
    private final PageBlockRepository blockRepo;
    private final UserRepository userRepo;
    private final FolderInvitationRepository inviteRepo;
    private final NotificationEmitterService emitterService;

    public BuilderService(PageFolderRepository folderRepo, CustomPageRepository pageRepo, 
                          PageBlockRepository blockRepo, UserRepository userRepo, 
                          FolderInvitationRepository inviteRepo,
                          NotificationEmitterService emitterService) {
        this.folderRepo = folderRepo;
        this.pageRepo = pageRepo;
        this.blockRepo = blockRepo;
        this.userRepo = userRepo;
        this.inviteRepo = inviteRepo;
        this.emitterService = emitterService;
    }

    @Transactional(readOnly = true)
    public BuilderDataResponse getBuilderData(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<PageFolder> folders = folderRepo.findByUserOrSharedWith(user);
        List<CustomPage> pages = pageRepo.findByUserOrFolderSharedWith(user);

        BuilderDataResponse response = new BuilderDataResponse();
        response.folders = folders.stream().map(f -> {
            FolderDto dto = new FolderDto();
            dto.id = "f" + f.getId();
            dto.name = f.getName();
            dto.icon = f.getIcon();
            dto.open = true;
            dto.ownedByMe = f.getUser().getEmail().equals(email); // true only for original owner
            return dto;
        }).collect(Collectors.toList());

        response.pages = pages.stream().map(p -> {
            PageDto dto = new PageDto();
            dto.id = "p" + p.getId();
            dto.name = p.getName();
            dto.icon = p.getIcon();
            dto.folderId = "f" + p.getFolder().getId();
            return dto;
        }).collect(Collectors.toList());

        return response;
    }

    @Transactional
    public FolderDto createFolder(String email, CreateFolderRequest request) {
        User user = userRepo.findByEmail(email).orElseThrow();
        PageFolder folder = new PageFolder(request.name, user);
        folder = folderRepo.save(folder);
        
        FolderDto dto = new FolderDto();
        dto.id = "f" + folder.getId();
        dto.name = folder.getName();
        dto.open = true;
        return dto;
    }

    @Transactional
    public PageDto createPage(String email, CreatePageRequest request) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Long folderDbId = Long.parseLong(request.folderId.replace("f", ""));
        PageFolder folder = folderRepo.findById(folderDbId).orElseThrow(() -> new RuntimeException("Folder not found"));
        
        CustomPage page = new CustomPage(request.name, folder, user);
        page = pageRepo.save(page);
        
        PageDto dto = new PageDto();
        dto.id = "p" + page.getId();
        dto.name = page.getName();
        dto.folderId = "f" + folder.getId();
        return dto;
    }

    @Transactional(readOnly = true)
    public List<PageBlockDto> getPageBlocks(String email, String pageId) {
        Long pId = Long.parseLong(pageId.replace("p", ""));
        CustomPage page = pageRepo.findById(pId).orElseThrow();
        if (!hasAccess(page.getUser(), email, page.getFolder())) throw new RuntimeException("Unauthorized");

        return blockRepo.findByPageOrderByOrderIndexAsc(page).stream().map(b -> {
            PageBlockDto dto = new PageBlockDto();
            dto.id = "block" + b.getId();
            dto.type = b.getBlockType();
            dto.content = b.getContent();
            dto.orderIndex = b.getOrderIndex();
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void savePageBlocks(String email, String pageId, List<PageBlockDto> blocks) {
        Long pId = Long.parseLong(pageId.replace("p", ""));
        CustomPage page = pageRepo.findById(pId).orElseThrow();
        if (!hasAccess(page.getUser(), email, page.getFolder())) throw new RuntimeException("Unauthorized");

        // Clear existing blocks for this page
        blockRepo.deleteByPage(page);

        // Save new layout
        for (int i = 0; i < blocks.size(); i++) {
            PageBlockDto b = blocks.get(i);
            PageBlock entity = new PageBlock(page, b.type, b.content, i);
            blockRepo.save(entity);
        }

        // Broadcast block changes to all users who have access to this folder
        java.util.Set<String> broadcastEmails = getBroadcastEmails(page.getFolder());
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("action", "blocks_updated");
        payload.put("pageId", pageId);
        payload.put("blocks", blocks);
        emitterService.broadcastWorkspaceChange(broadcastEmails, "page_blocks_updated", payload);
    }

    // --- DELETE OPERATIONS ---

    @Transactional
    public void deleteFolder(String email, String folderIdStr) {
        Long folderDbId = Long.parseLong(folderIdStr.replace("f", ""));
        PageFolder folder = folderRepo.findById(folderDbId).orElseThrow(() -> new RuntimeException("Folder not found"));

        // Only the owner can delete a folder
        if (!folder.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: only the owner can delete a folder");
        }

        // Collect all broadcast emails BEFORE deleting (folder will be gone after)
        java.util.Set<String> broadcastEmails = getBroadcastEmails(folder);

        // Cascade: delete all blocks of all pages in this folder, then pages, then folder
        java.util.List<CustomPage> pages = pageRepo.findByFolder(folder);
        for (CustomPage page : pages) {
            blockRepo.deleteByPage(page);
        }
        pageRepo.deleteAll(pages);
        folderRepo.delete(folder);

        // Broadcast workspace change to all affected users
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("action", "folder_deleted");
        payload.put("folderId", "f" + folderDbId);
        emitterService.broadcastWorkspaceChange(broadcastEmails, "workspace_change", payload);
    }

    @Transactional
    public void deletePage(String email, String pageIdStr) {
        Long pageDbId = Long.parseLong(pageIdStr.replace("p", ""));
        CustomPage page = pageRepo.findById(pageDbId).orElseThrow(() -> new RuntimeException("Page not found"));

        // Must be page owner or folder owner/member
        if (!hasAccess(page.getUser(), email, page.getFolder())) {
            throw new RuntimeException("Unauthorized");
        }

        // Collect broadcast emails before deletion
        java.util.Set<String> broadcastEmails = getBroadcastEmails(page.getFolder());

        blockRepo.deleteByPage(page);
        pageRepo.delete(page);

        // Broadcast workspace change
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("action", "page_deleted");
        payload.put("pageId", "p" + pageDbId);
        payload.put("folderId", "f" + page.getFolder().getId());
        emitterService.broadcastWorkspaceChange(broadcastEmails, "workspace_change", payload);
    }

    /** Returns all email addresses that should receive workspace change events for a folder. */
    private java.util.Set<String> getBroadcastEmails(PageFolder folder) {
        java.util.Set<String> emails = new java.util.HashSet<>();
        emails.add(folder.getUser().getEmail());
        folder.getSharedWith().forEach(u -> emails.add(u.getEmail()));
        return emails;
    }

    @Transactional
    public void movePage(String email, String pageIdStr, String targetFolderIdStr) {
        Long pageDbId = Long.parseLong(pageIdStr.replace("p", ""));
        Long targetFolderDbId = Long.parseLong(targetFolderIdStr.replace("f", ""));

        CustomPage page = pageRepo.findById(pageDbId).orElseThrow(() -> new RuntimeException("Page not found"));
        PageFolder targetFolder = folderRepo.findById(targetFolderDbId).orElseThrow(() -> new RuntimeException("Target folder not found"));

        // Must have access to both source and destination
        if (!hasAccess(page.getUser(), email, page.getFolder())) {
            throw new RuntimeException("Unauthorized: no access to source folder");
        }
        if (!hasAccess(targetFolder.getUser(), email, targetFolder)) {
            throw new RuntimeException("Unauthorized: no access to target folder");
        }

        // Collect broadcast emails from BOTH folders before we change the association
        java.util.Set<String> broadcastEmails = getBroadcastEmails(page.getFolder());
        broadcastEmails.addAll(getBroadcastEmails(targetFolder));

        page.setFolder(targetFolder);
        pageRepo.save(page);

        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("action", "page_moved");
        payload.put("pageId", "p" + pageDbId);
        payload.put("targetFolderId", "f" + targetFolderDbId);
        emitterService.broadcastWorkspaceChange(broadcastEmails, "workspace_change", payload);
    }

    // --- COLLABORATION ---

    private boolean hasAccess(User pageOwner, String requestEmail, PageFolder folder) {
        if (pageOwner.getEmail().equals(requestEmail)) return true;
        if (folder.getUser().getEmail().equals(requestEmail)) return true;
        return folder.getSharedWith().stream().anyMatch(u -> u.getEmail().equals(requestEmail));
    }

    @Transactional
    public String generateInviteToken(String email, String folderIdStr, String targetEmail) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Long folderDbId = Long.parseLong(folderIdStr.replace("f", ""));
        PageFolder folder = folderRepo.findById(folderDbId).orElseThrow();
        
        if (!folder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Only the owner can invite users");
        }
        
        String token = java.util.UUID.randomUUID().toString();
        FolderInvitation inv = new FolderInvitation(folder, targetEmail, token);
        inviteRepo.save(inv);
        
        // Log the token to the console so the developer can click it
        System.out.println("====== INVITATION LINK GENERATED ======");
        System.out.println("http://localhost:3000/invite/accept/" + token);
        System.out.println("=======================================");

        // Push a real-time SSE notification to the invitee
        java.util.Map<String, Object> ssePayload = new java.util.HashMap<>();
        ssePayload.put("id", inv.getId());
        ssePayload.put("folderName", folder.getName());
        ssePayload.put("sharedByEmail", email);
        ssePayload.put("token", token);
        ssePayload.put("createdAt", inv.getCreatedAt().toString());
        emitterService.pushInvitation(targetEmail, ssePayload);
        
        return token;
    }

    @Transactional
    public void acceptInvite(String email, String token) {
        User user = userRepo.findByEmail(email).orElseThrow();
        FolderInvitation inv = inviteRepo.findByToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));
        
        if ("ACCEPTED".equals(inv.getStatus())) {
            throw new RuntimeException("Invitation already accepted");
        }
        
        PageFolder folder = inv.getFolder();
        folder.getSharedWith().add(user);
        folderRepo.save(folder);
        
        inv.setStatus("ACCEPTED");
        inviteRepo.save(inv);
    }

    // Accept invite by notification ID (instead of token URL)
    @Transactional
    public void acceptInviteById(String email, Long invitationId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        FolderInvitation inv = inviteRepo.findByIdAndEmail(invitationId, email)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!"PENDING".equals(inv.getStatus())) {
            throw new RuntimeException("Invitation is no longer pending");
        }

        PageFolder folder = inv.getFolder();
        folder.getSharedWith().add(user);
        folderRepo.save(folder);

        inv.setStatus("ACCEPTED");
        inviteRepo.save(inv);
    }

    @Transactional
    public void rejectInvite(String email, Long invitationId) {
        FolderInvitation inv = inviteRepo.findByIdAndEmail(invitationId, email)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));
        if (!"PENDING".equals(inv.getStatus())) {
            throw new RuntimeException("Invitation is no longer pending");
        }
        inv.setStatus("REJECTED");
        inviteRepo.save(inv);
    }

    @Transactional(readOnly = true)
    public java.util.List<java.util.Map<String, Object>> getNotifications(String email) {
        java.util.List<FolderInvitation> pending = inviteRepo.findByEmailAndStatus(email, "PENDING");
        return pending.stream().map(inv -> {
            java.util.Map<String, Object> n = new java.util.HashMap<>();
            n.put("id", inv.getId());
            n.put("folderName", inv.getFolder().getName());
            n.put("sharedByEmail", inv.getFolder().getUser().getEmail());
            n.put("token", inv.getToken());
            n.put("createdAt", inv.getCreatedAt().toString());
            return n;
        }).collect(java.util.stream.Collectors.toList());
    }

    // --- ICON UPDATE METHODS ---

    @Transactional
    public void updateFolderIcon(String email, String folderIdStr, String iconName) {
        Long folderDbId = Long.parseLong(folderIdStr.replace("f", ""));
        PageFolder folder = folderRepo.findById(folderDbId)
            .orElseThrow(() -> new RuntimeException("Folder not found"));

        // Must have access to update icon
        if (!hasAccess(folder.getUser(), email, folder)) {
            throw new RuntimeException("Unauthorized");
        }

        folder.setIcon(iconName);
        folderRepo.save(folder);

        // Broadcast workspace change
        java.util.Set<String> broadcastEmails = getBroadcastEmails(folder);
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("action", "folder_updated");
        payload.put("folderId", "f" + folderDbId);
        payload.put("icon", iconName);
        emitterService.broadcastWorkspaceChange(broadcastEmails, "workspace_change", payload);
    }

    @Transactional
    public void updatePageIcon(String email, String pageIdStr, String iconName) {
        Long pageDbId = Long.parseLong(pageIdStr.replace("p", ""));
        CustomPage page = pageRepo.findById(pageDbId)
            .orElseThrow(() -> new RuntimeException("Page not found"));

        // Must have access to update icon
        if (!hasAccess(page.getUser(), email, page.getFolder())) {
            throw new RuntimeException("Unauthorized");
        }

        page.setIcon(iconName);
        pageRepo.save(page);

        // Broadcast workspace change
        java.util.Set<String> broadcastEmails = getBroadcastEmails(page.getFolder());
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("action", "page_updated");
        payload.put("pageId", "p" + pageDbId);
        payload.put("icon", iconName);
        emitterService.broadcastWorkspaceChange(broadcastEmails, "workspace_change", payload);
    }
}
