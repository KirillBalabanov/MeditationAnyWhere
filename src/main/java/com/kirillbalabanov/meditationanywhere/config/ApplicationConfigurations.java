package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class ApplicationConfigurations {
    private int mailPort;
    private String userFolderPath;
    private String userFolderUrl;

    public int getMailPort() {
        return mailPort;
    }

    public void setMailPort(int mailPort) {
        this.mailPort = mailPort;
    }

    public String getUserFolderPath() {
        return userFolderPath;
    }

    public void setUserFolderPath(String userFolderPath) {
        this.userFolderPath = userFolderPath;
    }

    public String getUserFolderUrl() {
        return userFolderUrl;
    }

    public void setUserFolderUrl(String userFolderUrl) {
        this.userFolderUrl = userFolderUrl;
    }
}
