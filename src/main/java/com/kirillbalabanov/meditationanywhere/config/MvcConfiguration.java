package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableAsync
@EnableScheduling
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
        registry.addResourceHandler(userFolderUrl + "/**").setCacheControl(CacheControl.maxAge(1, TimeUnit.DAYS)).addResourceLocations("file:///" + userFolderPath + "/").
                resourceChain(true).addResolver(new UrlResolver());
        registry.addResourceHandler(serverFolderUrl + "/**").setCacheControl(CacheControl.maxAge(120, TimeUnit.MINUTES)).addResourceLocations("file:///" + serverFolderPath + "/").
                resourceChain(true).addResolver(new UrlResolver());

    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/spa").setViewName("forward:/index.html");
    }

    @Bean
    public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> containerCustomizer() { // redirect to react spa when endpoint is not found.
        return container -> container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND,
                "/spa"));
    }
}