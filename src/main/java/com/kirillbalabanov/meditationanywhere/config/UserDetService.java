package com.kirillbalabanov.meditationanywhere.config;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public UserDetService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if(optional.isEmpty()) throw new UsernameNotFoundException("User not found.");
        UserEntity ue = optional.get();
        return new UserDet(ue.getUsername(), ue.getPassword(), ue.getId(), new SimpleGrantedAuthority(ue.getRole()));
    }

}
