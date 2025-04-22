package org.soradium.portablemessengerappfrontendapi.dto;

import java.util.List;

public record SenderAndRetrievedMessageListDto(String requester, List<SentMessageDto> messages, String response) {}

