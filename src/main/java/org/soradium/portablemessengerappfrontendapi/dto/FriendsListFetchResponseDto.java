package org.soradium.portablemessengerappfrontendapi.dto;

import java.util.List;

public record FriendsListFetchResponseDto(String usernameRequester, List<String> friendUsernames) {
}
