package com.pmt.errors;

public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
}
