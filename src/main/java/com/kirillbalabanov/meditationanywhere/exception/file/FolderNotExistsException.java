package com.kirillbalabanov.meditationanywhere.exception.file;

public class FolderNotExistsException  extends FileException{
    public FolderNotExistsException(String message) {
        super(message);
    }

    public FolderNotExistsException(String message, Throwable cause) {
        super(message, cause);
    }

}
