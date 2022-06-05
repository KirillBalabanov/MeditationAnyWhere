package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class ApplicationConfigurations {
    private String serverDns;
    private String userFolderPath;
    private String userFolderUrl;

    private String serverFolderPath;

    private String serverFolderUrl;

    private String serverDefaultAudioPackRelativePath;
    private int amountOfDifferentSymbolsBetweenUrlAndFolderPath;

    private String serverToggleAudioRelativePath;

    public String getServerToggleAudioRelativePath() {
        return serverToggleAudioRelativePath;
    }

    public void setServerToggleAudioRelativePath(String serverToggleAudioRelativePath) {
        this.serverToggleAudioRelativePath = serverToggleAudioRelativePath;
    }

    public String getServerDefaultAudioPackRelativePath() {
        return serverDefaultAudioPackRelativePath;
    }

    public void setServerDefaultAudioPackRelativePath(String serverDefaultAudioPackRelativePath) {
        this.serverDefaultAudioPackRelativePath = serverDefaultAudioPackRelativePath;
    }

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

    public String getServerDns() {
        return serverDns;
    }

    public void setServerDns(String serverDns) {
        this.serverDns = serverDns;
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
