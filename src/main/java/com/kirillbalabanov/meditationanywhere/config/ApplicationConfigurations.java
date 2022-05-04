package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class ApplicationConfigurations {
    private int mailPort;
    private String userFolderPath;
    private String userFolderUrl;

    private String serverFolderPath;

    private String serverFolderUrl;

    private int amountOfDifferentSymbolsBetweenUrlAndFolderPath;

    public String getServerFolderPath() {
        return serverFolderPath;
    }

    public void setServerFolderPath(String serverFolderPath) {
        this.serverFolderPath = serverFolderPath;
    }

    public String getServerFolderUrl() {
        return serverFolderUrl;
    }

    public void setServerFolderUrl(String serverFolderUrl) {
        this.serverFolderUrl = serverFolderUrl;
    }

    public int getAmountOfDifferentSymbolsBetweenUrlAndFolderPath() {
        return amountOfDifferentSymbolsBetweenUrlAndFolderPath;
    }

    public void setAmountOfDifferentSymbolsBetweenUrlAndFolderPath(int amountOfDifferentSymbolsBetweenUrlAndFolderPath) {
        this.amountOfDifferentSymbolsBetweenUrlAndFolderPath = amountOfDifferentSymbolsBetweenUrlAndFolderPath;
    }

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
