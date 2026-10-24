package com.example.otpauth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * SpaWebMvcConfig — Single-Page Application (SPA) Routing Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Serves the embedded React frontend (_namustutam_UI) from classpath:/static/
 * and forwards any client-side route (e.g. /admin, /blog, /login, /project-works)
 * to /index.html while preserving direct API, OAuth2, and upload routes.
 * ─────────────────────────────────────────────────────────────────────────────
 */
@Configuration
public class SpaWebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);

                        // 1. If physical static asset exists (e.g. /assets/..., /favicon.ico, /logo.png), serve it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // 2. Do not intercept backend endpoints; let controllers handle them or return 404
                        if (resourcePath.startsWith("api/") ||
                            resourcePath.startsWith("oauth2/") ||
                            resourcePath.startsWith("upload/") ||
                            resourcePath.startsWith("uploads/")) {
                            return null;
                        }

                        // 3. Fallback: forward all SPA frontend paths to index.html if present
                        Resource indexHtml = new ClassPathResource("/static/index.html");
                        if (indexHtml.exists() && indexHtml.isReadable()) {
                            return indexHtml;
                        }

                        return null;
                    }
                });
    }
}
