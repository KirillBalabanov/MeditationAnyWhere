package com.kirillbalabanov.meditationanywhere.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UUIDCryptorTest {

    @Autowired
    private UUIDCryptor uuidCryptor;

    @Test
    void encrypt_decrypt_equalsTest() {

        String str = "!\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";

        String encrypted = uuidCryptor.encrypt(str);
        String decrypted = uuidCryptor.decrypt(encrypted);

        assertEquals(str, decrypted);
    }
}