package org.soradium.portablemessengerappfrontendapi.controller;

import org.soradium.portablemessengerappfrontendapi.dto.FriendFetchResponseDto;
import org.soradium.portablemessengerappfrontendapi.dto.UserChatTargetRequestDto;
import org.soradium.portablemessengerappfrontendapi.dto.UserRequesterAndUserRequestedToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/chat")
public class SidebarUiController {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessagingTemplate stompTemplate;

    @Autowired
    public SidebarUiController(
            KafkaTemplate<String, Object>
                    kafkaMessageTemplate,
            SimpMessagingTemplate messagingTemplate) {
        kafkaTemplate = kafkaMessageTemplate;
        this.stompTemplate = messagingTemplate;
    }

    @PostMapping("/find-target-friend")
    public ResponseEntity<?> getTargetToOpenChatWith(
            @RequestBody UserChatTargetRequestDto target,
            Principal principal) {
        // pass data further, return processed response
        if (target.target() == null || target.target().isBlank()) {
            return new ResponseEntity<>(
                    "Incorrect input",
                    HttpStatus.BAD_REQUEST);
        }
        String userRequester = principal.getName();
        kafkaTemplate.send(
                "friend-fetch-send",
                new UserRequesterAndUserRequestedToDto(
                        userRequester,
                        target.target()
                )
        );
        return new ResponseEntity<>(
                "Friend fetch request successfully sent",
                HttpStatus.OK);
    }

    @KafkaListener(
            id = "friend_fetch_response",
            topics = "friend-fetch-response",
            containerFactory = "kafkaListenerSidebarFetchContainerFactory"
    )
    public void sendFriendFetchResponse(FriendFetchResponseDto response) {
        stompTemplate.convertAndSendToUser(
                response.originalSenderUsername(),
                "/topics/fetch-friend",
                response
        );
    }
}


///  GROUP EX. FUNCTIONALITY - RESTORE LATER ///
//    @Autowired
//    private GroupServiceImpl groupService;
//            Group group
//                    = groupService
//                    .getGroupByName(target.target());
//            if (group == null) { // think about turning this
//                // into exception in controller advice - it can be used from
//                // various places
//                return new ResponseEntity<>(
//                        "No such entity was found", HttpStatus.NOT_FOUND);
//            }
//            return new ResponseEntity<>(
//                    "Group found! " + target.target(),
//                    HttpStatus.OK
//            );