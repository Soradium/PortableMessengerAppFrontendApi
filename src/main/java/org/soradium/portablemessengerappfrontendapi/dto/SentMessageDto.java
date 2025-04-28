package org.soradium.portablemessengerappfrontendapi.dto;

public record SentMessageDto(String targetUserName, String message) {
    //targetUserName - person that is sent TO.
}
