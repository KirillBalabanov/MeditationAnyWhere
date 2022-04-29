package com.kirillbalabanov.meditationanywhere.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;


public class UserDet implements UserDetails {
    private final String username;
    private final String password;
    private final long userId;

    private final SimpleGrantedAuthority authority;

    public UserDet(String username, String password, long userId, SimpleGrantedAuthority authority) {
        this.username = username;
        this.password = password;
        this.userId = userId;
        this.authority = authority;
    }

    public long getUserId() {
        return userId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

