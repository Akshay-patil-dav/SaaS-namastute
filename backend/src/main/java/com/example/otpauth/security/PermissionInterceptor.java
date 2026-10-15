package com.example.otpauth.security;

import com.example.otpauth.model.ProjectMember;
import com.example.otpauth.repository.ProjectMemberRepository;
import com.example.otpauth.util.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;

@Component
public class PermissionInterceptor implements HandlerInterceptor {

    private final ProjectMemberRepository projectMemberRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PermissionInterceptor(ProjectMemberRepository projectMemberRepository) {
        this.projectMemberRepository = projectMemberRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Long currentTenantId = SecurityUtils.getCurrentUserId();
        Long actualUserId = SecurityUtils.getActualUserId();

        // Pass if not authenticated (handled by Spring Security) or acting on own project
        if (currentTenantId == null || actualUserId == null || currentTenantId.equals(actualUserId)) {
            return true;
        }

        // Fetch permissions for the active project
        Optional<ProjectMember> memberOpt = projectMemberRepository.findByProjectIdAndMemberUserId(currentTenantId, actualUserId);
        if (memberOpt.isEmpty()) {
            return sendForbidden(response, "You are not a member of this project.");
        }

        ProjectMember member = memberOpt.get();
        if ("INACTIVE".equalsIgnoreCase(member.getStatus())) {
            return sendForbidden(response, "Your staff account has been deactivated by the owner.");
        }

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Self-actions: Accepting/rejecting invitations, checking own invites, or switching projects
        boolean isSelfProjectAction = path.startsWith("/api/project/invite/accept")
                || path.startsWith("/api/project/invite/reject")
                || path.equals("/api/project/invitations/me")
                || path.equals("/api/project/my-workspaces")
                || path.startsWith("/api/project/switch")
                || path.startsWith("/api/invitations");

        if (isSelfProjectAction) {
            return true;
        }

        // Project management (adding/editing staff, sending invites) is strictly owner-only unless given 'users' perm
        if (path.startsWith("/api/project")) {
            JsonNode perms = null;
            try {
                if (member.getPermissions() != null && !member.getPermissions().isBlank()) {
                    perms = objectMapper.readTree(member.getPermissions());
                }
            } catch (Exception ignored) {}
            if (perms == null || perms.get("users") == null) {
                return sendForbidden(response, "Only the workspace owner can manage team members.");
            }
        }

        // Notes and Workspace Announcements are open to all active members
        if (path.startsWith("/api/notes")) {
            return true;
        }

        // Dashboard overview and summary statistics are readable by all active workspace members
        if ("GET".equalsIgnoreCase(method) && (path.startsWith("/api/dashboard") || path.endsWith("/summary"))) {
            return true;
        }

        // Determine module based on path
        String module = determineModule(path);
        if (module == null) {
            return true; // Ignore paths that don't match our modules (e.g., auth, etc)
        }

        // Parse permissions JSON
        try {
            if (member.getPermissions() == null || member.getPermissions().isBlank()) {
                return sendForbidden(response, "No permissions assigned.");
            }

            JsonNode perms = objectMapper.readTree(member.getPermissions());

            // Special convenience: Cashiers/Sales staff need to view products & categories & CRM customers during checkout
            if ("GET".equalsIgnoreCase(method)) {
                if (("products".equals(module) || "crm".equals(module)) && 
                    (perms.has("pos") || perms.has("sales"))) {
                    return true;
                }
                if ("reports".equals(module) && (perms.has("reports") || perms.has("pos") || perms.has("sales"))) {
                    return true;
                }
            }

            JsonNode modulePerms = perms.get(module);
            if (modulePerms == null || !modulePerms.isArray()) {
                return sendForbidden(response, "No access to " + module + " module.");
            }

            // Check specific action
            String requiredAction = determineRequiredAction(method);
            boolean hasAccess = false;
            for (JsonNode action : modulePerms) {
                if (action.asText().equalsIgnoreCase(requiredAction) || action.asText().equalsIgnoreCase("MANAGE")) {
                    hasAccess = true;
                    break;
                }
            }

            if (!hasAccess) {
                return sendForbidden(response, "Missing " + requiredAction + " permission for " + module + " module.");
            }

        } catch (Exception e) {
            return sendForbidden(response, "Failed to evaluate permissions: " + e.getMessage());
        }

        return true;
    }

    private boolean sendForbidden(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"" + message + "\", \"message\": \"" + message + "\", \"status\": 403}");
        response.getWriter().flush();
        return false;
    }

    private String determineModule(String path) {
        if (path.startsWith("/api/products") || 
            path.startsWith("/api/categories") || 
            path.startsWith("/api/sub-categories") || 
            path.startsWith("/api/brands") || 
            path.startsWith("/api/units") || 
            path.startsWith("/api/warranties")) {
            return "products";
        }
        if (path.startsWith("/api/pos") || path.startsWith("/api/pos-sales")) return "pos";
        if (path.startsWith("/api/crm")) return "crm";
        if (path.startsWith("/api/manufacturing") || path.startsWith("/api/bom") || path.startsWith("/api/work-centers") || path.startsWith("/api/work-orders")) return "manufacturing";
        if (path.startsWith("/api/purchases") || path.startsWith("/api/purchase-returns")) return "purchases";
        if (path.startsWith("/api/sales") || path.startsWith("/api/sales-returns")) return "sales";
        if (path.startsWith("/api/stocks") || path.startsWith("/api/stock-transfers") || path.startsWith("/api/inventory")) return "inventory";
        if (path.startsWith("/api/khata")) return "khata";
        if (path.startsWith("/api/reports") || path.startsWith("/api/dashboard")) return "reports";
        if (path.startsWith("/api/stores") || path.startsWith("/api/warehouses") || path.startsWith("/api/settings") || path.startsWith("/api/bank-accounts")) return "settings";
        return null;
    }

    private String determineRequiredAction(String method) {
        switch (method.toUpperCase()) {
            case "GET": return "VIEW";
            case "POST": return "CREATE";
            case "PUT":
            case "PATCH": return "EDIT";
            case "DELETE": return "DELETE";
            default: return "VIEW";
        }
    }
}
