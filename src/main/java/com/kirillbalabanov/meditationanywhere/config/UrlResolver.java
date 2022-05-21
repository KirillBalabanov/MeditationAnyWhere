package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.core.io.Resource;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolver;

import java.io.IOException;

public class UrlResolver extends PathResourceResolver implements ResourceResolver {
    @Override
    protected Resource getResource(String resourcePath, Resource location) throws IOException {
        String resolved = resourcePath.replaceAll("%20|%2520", " ");
        return super.getResource(resolved, location);
    }
}