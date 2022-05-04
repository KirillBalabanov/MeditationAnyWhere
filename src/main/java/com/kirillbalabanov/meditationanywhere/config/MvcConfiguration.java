package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {
    private final String userFolderPath;
    private final String userFolderUrl;

    public MvcConfiguration(@Value("${app.user-folder-path}") String userFolderPath, @Value("${app.user-folder-url}") String userFolderUrl) {
        this.userFolderPath = userFolderPath;
        this.userFolderUrl = userFolderUrl;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(userFolderUrl + "/**").addResourceLocations("file:///" + userFolderPath + "/");
    }
}