package com.kirillbalabanov.meditationanywhere.service;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.ArrayDeque;
import java.util.Random;

@Component
public class UUIDCryptor {
    public UUIDCryptor() {
    }

    public String encrypt(String input) {
        byte[] bytes = input.getBytes(StandardCharsets.UTF_8);

        byte[] splitBytes = new byte[bytes.length * 2];

        int splitBytesPutIndex = 0;
        for (byte asciiChar : bytes) {

            byte leftSplit = 64;
            byte rightSplit = 64;

            for (int i = 7; i >= 4; i--) { // splitting left - high order bits - xxxx_0000 from ascii char
                if ((asciiChar & (int) Math.pow(2, i)) > 0) { //
                    leftSplit = (byte) (leftSplit | (1 << (i - 4))); // 0011_xxxx - setting into lower order.
                }
            }

            for (int i = 3; i >= 0; i--) { // splitting right - lower order bits - 0000_xxxx from ascii char
                if ((asciiChar & (int) Math.pow(2, i)) > 0) { //
                    rightSplit = (byte) (rightSplit | (1 << i)); // 0011_xxxx - setting into lower order.
                }
            }

            splitBytes[splitBytesPutIndex++] = leftSplit;
            splitBytes[splitBytesPutIndex++] = rightSplit;
            // put splits together
        } // split

        shuffleBytes(splitBytes);

        return new String(splitBytes, StandardCharsets.UTF_8);
    }

    public String decrypt(String encryptedString) {
        byte[] encryptedBytes = encryptedString.getBytes(StandardCharsets.UTF_8);
        byte[] decryptedBytes = new byte[encryptedBytes.length / 2];


        // de shuffle of encryptedBytes
        deShuffleBytes(encryptedBytes);

        int encryptedBytesPutIndex = 0;
        for (int i = 0; i < encryptedBytes.length; i++) {


            byte left = encryptedBytes[i++];
            byte right = encryptedBytes[i];

            byte leftSplit = 0;
            byte rightSplit = 0;

            // getting lower order bits from left, right - 0000_XXXX, setting to leftSplit, rightSplit.
            for (int s = 3; s >= 0; s--) {
                int setBit = (int) Math.pow(2, s);
                if ((left & setBit) > 0) {
                    leftSplit = (byte) (leftSplit | (1 << s)); // 0000_xxxx - setting into lower order of left Split.
                }
                if ((right & setBit) > 0) {
                    rightSplit = (byte) (rightSplit | (1 << s)); // 0000_xxxx - setting into lower order of right Split.
                }
            }

            byte finalByte = (byte) ((leftSplit << 4) | rightSplit);

            decryptedBytes[encryptedBytesPutIndex++] = finalByte;
        }
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    public void shuffleBytes(byte[] bytes) {
        int shuffledBoundaryIndex = bytes.length - 1;

        Random numberGenerator = new Random(bytes.length);

        for (int i = 0; i < bytes.length - 1; i++) {
            int randInd = Math.abs(numberGenerator.nextInt() % (shuffledBoundaryIndex + 1));
            byte temp = bytes[shuffledBoundaryIndex];
            // swapping rand byte with shuffledBoundaryIndex byte
            bytes[shuffledBoundaryIndex] = bytes[randInd];
            bytes[randInd] = temp;
            shuffledBoundaryIndex--;
        }
    }

    public void deShuffleBytes(byte[] bytes) {
        int shuffledBoundaryIndex = 1;

        ArrayDeque<Integer> randIntStack = getRandIntStack(bytes.length, bytes.length);

        for (int i = 0; i < bytes.length - 1; i++) {
            int randInd = randIntStack.pollLast();
            byte temp = bytes[shuffledBoundaryIndex];
            // swapping rand byte with shuffledBoundaryIndex byte
            bytes[shuffledBoundaryIndex] = bytes[randInd];
            bytes[randInd] = temp;
            shuffledBoundaryIndex++;
        }
    }

    public void shuffleChars(char[] chars) {
        int shuffledBoundaryIndex = chars.length - 1;

        Random numberGenerator = new Random(chars.length);

        for (int i = 0; i < chars.length - 1; i++) {
            int randInd = Math.abs(numberGenerator.nextInt() % (shuffledBoundaryIndex + 1));
            char temp = chars[shuffledBoundaryIndex];
            // swapping rand byte with shuffledBoundaryIndex byte
            chars[shuffledBoundaryIndex] = chars[randInd];
            chars[randInd] = temp;
            shuffledBoundaryIndex--;
        }
    }

    public void deShuffleChars(char[] chars) {
        int shuffledBoundaryIndex = 1;

        ArrayDeque<Integer> randIntStack = getRandIntStack(chars.length, chars.length);

        for (int i = 0; i < chars.length - 1; i++) {
            int randInd = randIntStack.pollLast();
            char temp = chars[shuffledBoundaryIndex];
            // swapping rand byte with shuffledBoundaryIndex byte
            chars[shuffledBoundaryIndex] = chars[randInd];
            chars[randInd] = temp;
            shuffledBoundaryIndex++;
        }
    }

    private ArrayDeque<Integer> getRandIntStack(int seed, int len) {
        Random numberGenerator = new Random(seed);
        ArrayDeque<Integer> randIntStack = new ArrayDeque<>(); // pop rand int in reverse order.
        int shuffleBoundary = len - 1;
        for (int i = 0; i < len - 1; i++) {
            randIntStack.addLast(Math.abs(numberGenerator.nextInt() % (shuffleBoundary-- + 1)));
        }
        return randIntStack;
    }

    private static final char[] HEX_MAP = new char[] {
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e', 'f'
    };

    public String hexEncryption(String input) {
        byte[] bytes = input.getBytes(StandardCharsets.UTF_8);

        char[] hexed = new char[bytes.length * 2];
        int hexedPutIndex = 0;
        for (byte b : bytes) {
            int ch = b & 0xFF;
            hexed[hexedPutIndex++] = HEX_MAP[(ch >>> 4) & 0x00F]; // xxxx_0000
            hexed[hexedPutIndex++] = HEX_MAP[ch & 0x000F]; // 0000_xxxx
        }

        shuffleChars(hexed);

        return new String(hexed);
    }

    public String hexDecryption(String encrypted) {
        char[] chars = encrypted.toCharArray();
        deShuffleChars(chars);

        byte[] decryptedBytes = new byte[chars.length / 2];

        int decryptPutIndex = 0;
        for (int i = 0; i < chars.length;) {

            decryptedBytes[decryptPutIndex++] = (byte) ((Character.digit(chars[i++], 16) << 4) | (Character.digit(chars[i++], 16)));

        }
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }
}
