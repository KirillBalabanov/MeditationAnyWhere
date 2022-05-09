package com.kirillbalabanov.meditationanywhere.model;

public class ErrorModel {
    private String errorMsg;

    public ErrorModel() {
    }

    public static ErrorModel fromMessage(String msg) {
        ErrorModel errorModel = new ErrorModel();
        errorModel.setErrorMsg(msg);
        return errorModel;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
