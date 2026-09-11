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
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "You are not a member of this project.");
            return false;
        }

        ProjectMember member = memberOpt.get();
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Determine module based on path
        String module = determineModule(path);
        if (module == null) {
            return true; // Ignore paths that don't match our modules (e.g., auth, etc)
        }

        // Parse permissions JSON
        // Structure: {"products": ["VIEW", "CREATE", "EDIT", "DELETE"]}
        try {
            if (member.getPermissions() == null || member.getPermissions().isBlank()) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "No permissions assigned.");
                return false;
            }

            JsonNode perms = objectMapper.readTree(member.getPermissions());
            JsonNode modulePerms = perms.get(module);

            if (modulePerms == null || !modulePerms.isArray()) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "No access to " + module + " module.");
                return false;
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
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Missing " + requiredAction + " permission for " + module + " module.");
                return false;
            }

        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to evaluate permissions.");
            return false;
        }

        return true;
    }

    private String determineModule(String path) {
        if (path.startsWith("/api/products")) return "products";
        if (path.startsWith("/api/pos")) return "pos";
        if (path.startsWith("/api/crm")) return "crm";
        if (path.startsWith("/api/bom") || path.startsWith("/api/work-centers") || path.startsWith("/api/work-orders")) return "manufacturing";
        if (path.startsWith("/api/purchases")) return "purchases";
        if (path.startsWith("/api/sales")) return "sales";
        if (path.startsWith("/api/inventory")) return "inventory";
        if (path.startsWith("/api/stores") || path.startsWith("/api/warehouses")) return "settings";
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
