package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {
    private final String userFolderPath;
    private final String userFolderUrl;
    private final String serverFolderPath;
    private final String serverFolderUrl;

    public MvcConfiguration(@Value("${app.user-folder-path}") String userFolderPath, @Value("${app.user-folder-url}") String userFolderUrl,
                            @Value("${app.server-folder-path}") String serverFolderPath, @Value("${app.server-folder-url}") String serverFolderUrl
                            ) {
        this.userFolderPath = userFolderPath;
        this.userFolderUrl = userFolderUrl;
        this.serverFolderPath = serverFolderPath;
        this.serverFolderUrl = serverFolderUrl;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(userFolderUrl + "/**").addResourceLocations("file:///" + userFolderPath + "/").
                resourceChain(true).addResolver(new UrlResolver());
        registry.addResourceHandler(serverFolderUrl + "/**").setCacheControl(CacheControl.maxAge(100, TimeUnit.SECONDS)).addResourceLocations("file:///" + serverFolderPath + "/").
                resourceChain(true).addResolver(new UrlResolver());

    }
}