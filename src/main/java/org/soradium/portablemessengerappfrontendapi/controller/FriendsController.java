package org.soradium.portablemessengerappfrontendapi.controller;

import org.soradium.portablemessengerappfrontendapi.dto.FriendRequestResponseDto;
import org.soradium.portablemessengerappfrontendapi.dto.FriendRequestSenderAndReceiverDto;
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
@RequestMapping("/friends")
public class FriendsController {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessagingTemplate stompTemplate;

    @Autowired
    public FriendsController(
            KafkaTemplate<String, Object>
                    kafkaMessageTemplate,
            SimpMessagingTemplate messagingTemplate) {
        kafkaTemplate = kafkaMessageTemplate;
        this.stompTemplate = messagingTemplate;
    }

    @PostMapping("/add-friend")
    public ResponseEntity<String> addFriend(
            @RequestBody FriendName friendUsername,
            Principal principal) {

        if (friendUsername == null) {
            return new ResponseEntity<>("Error passing friend username.",
                    HttpStatus.BAD_REQUEST);
        }

        String senderUserName = principal.getName();
        if (friendUsername.username().equals(senderUserName)) {
            return new ResponseEntity<>("You can't add yourself.",
                    HttpStatus.BAD_REQUEST);
        }
        this.kafkaTemplate.send(
                "friend-add",
                new FriendRequestSenderAndReceiverDto(
                        senderUserName, friendUsername.username())
        );
        return new ResponseEntity<>("Request sent!", HttpStatus.OK);
    }

    @KafkaListener(
            id = "friend_response",
            topics = "friend-response",
            containerFactory = "kafkaListenerFriendContainerFactory"
    )
    public void friendRequestResponseListener(FriendRequestResponseDto response) {
        this.stompTemplate.convertAndSendToUser(
                response.originalSenderUsername(),
                "/topics/friend",
                response.response()
        );
    }



    public record FriendName(String username) {}

}
