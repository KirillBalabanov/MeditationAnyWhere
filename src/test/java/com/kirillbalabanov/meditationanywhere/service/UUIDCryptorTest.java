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
    void encrypt_decrypt_equalsTest_ascii() {

        String str = "!\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";

        String encrypted = uuidCryptor.encrypt(str);
        String decrypted = uuidCryptor.decrypt(encrypted);

        assertEquals(str, decrypted);
    }

    @Test
    void encrypt_decrypt_equalsTest_unicode() {

        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 0; i < 3000; i++) {
            stringBuilder.append((char) i);
        }
        String str = stringBuilder.toString();
        String encrypted = uuidCryptor.encrypt(str);
        String decrypted = uuidCryptor.decrypt(encrypted);

        assertEquals(str, decrypted);
    }

    @Test
    void encrypt_decrypt_hex_equalsTest_ascii() {

        String str = "!\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";

        String encrypted = uuidCryptor.hexEncryption(str);
        String decrypted = uuidCryptor.hexDecryption(encrypted);

        assertEquals(str, decrypted);
    }

    @Test
    void encrypt_decrypt_hex_equalsTest_unicode() {

        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 0; i < 3000; i++) {
            stringBuilder.append((char) i);
        }
        String str = stringBuilder.toString();
        String encrypted = uuidCryptor.hexEncryption(str);
        String decrypted = uuidCryptor.hexDecryption(encrypted);

        assertEquals(str, decrypted);
    }
}