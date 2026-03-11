package com.ilpmum.hotel.catalog_service.util;

import java.util.Random;

public class CredentialGenerator {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final String PASSWORD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final Random RANDOM = new Random();

    public static String generateUsername(String name, String role) {
        // Clean name: remove spaces, convert to lowercase
        String cleanName = name.replaceAll("\\s+", "").toLowerCase();

        // Add role prefix
        String prefix = role.equals("MANAGER") ? "mgr" : "rec";

        // Generate random suffix
        String suffix = generateRandomString(4);

        return prefix + "_" + cleanName + "_" + suffix;
    }

    public static String generatePassword() {
        StringBuilder password = new StringBuilder();

        // Ensure at least one uppercase, one lowercase, one digit, one special char
        password.append(CHARACTERS.charAt(RANDOM.nextInt(26))); // Uppercase
        password.append(CHARACTERS.charAt(RANDOM.nextInt(26) + 26)); // Lowercase
        password.append(CHARACTERS.charAt(RANDOM.nextInt(10) + 52)); // Digit
        password.append("!@#$%^&*".charAt(RANDOM.nextInt(8))); // Special char

        // Add 4 more random characters
        for (int i = 0; i < 4; i++) {
            password.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }

        // Shuffle the password
        return shuffleString(password.toString());
    }

    private static String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private static String shuffleString(String input) {
        char[] characters = input.toCharArray();
        for (int i = 0; i < characters.length; i++) {
            int randomIndex = RANDOM.nextInt(characters.length);
            char temp = characters[i];
            characters[i] = characters[randomIndex];
            characters[randomIndex] = temp;
        }
        return new String(characters);
    }
}

