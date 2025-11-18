package com.pmt.model;

public class LoginResponse {
    private boolean success;
    private User user;

    public LoginResponse(boolean success, User user) {
        this.success = success;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public User getUser() {
        return user;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setUser(User user) {
        this.user = user;
    }
}