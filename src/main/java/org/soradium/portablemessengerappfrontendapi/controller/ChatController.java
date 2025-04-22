package org.soradium.portablemessengerappfrontendapi.controller;

import org.soradium.portablemessengerappfrontendapi.dto.*;
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
public class ChatController {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessagingTemplate stompTemplate;

    // One function will work for sending from user X (to Kafka),
    // second will work to send refresh to user Y(from Kafka), same will go
    // both for individual message controller and retrieval message controller

    @Autowired
    public ChatController(
            KafkaTemplate<String, Object>
                    kafkaMessageTemplate,
            SimpMessagingTemplate messagingTemplate) {
        kafkaTemplate = kafkaMessageTemplate;
        this.stompTemplate = messagingTemplate;
    }

    @PostMapping("/send-message")
    public ResponseEntity<String> sendMessage(
            @RequestBody SentMessageDto sentMessageDto, Principal sender) {
        // pass further, return the response
        if (sentMessageDto.message().isBlank()) {
            return new ResponseEntity<>(
                    "Can't send empty message.",
                    HttpStatus.NO_CONTENT);
        }
        String receiverNameProcessed = sentMessageDto.targetUserName();
        String senderNameProcessed = sender.getName();
        kafkaTemplate.send(
                "chat-send",
                new MessageDto(sentMessageDto.message(),
                        senderNameProcessed,
                        receiverNameProcessed)
        );
        return new ResponseEntity<>("Successfully sent message", HttpStatus.OK);
    }

    @KafkaListener(
            id = "chat_response",
            topics = "chat-response",
            containerFactory = "kafkaListenerReceivedMessageContainerFactory"
    )
    public void receiveMessage(SentMessageDto message) {
        this.stompTemplate.convertAndSendToUser(
                message.targetUserName(),
                "/topics/messages-topic",
                message);
    }

    @PostMapping("/retrieve-messages-per-user")
    public ResponseEntity<String> requestAllMessages(
            @RequestBody GetChatRequestPerUserDto userRequest, Principal sender) {
        // pass further, return the response
        String requestedToUsername = userRequest.requestedToUser();
        if (requestedToUsername == null
                || requestedToUsername.isBlank()
                || sender.getName() == null
                || sender.getName().isBlank()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        kafkaTemplate.send(
                "message-send",
                new RequestMessageListDto(sender.getName(), requestedToUsername)
        );

        return new ResponseEntity<>("Request sent", HttpStatus.OK);
    }

    @KafkaListener(
            id = "message_response",
            topics = "message-response",
            containerFactory = "kafkaListenerMessageListContainerFactory"
    )
    public void receiveMessageList(SenderAndRetrievedMessageListDto response) {
        this.stompTemplate.convertAndSendToUser(
                response.requester(),
                "/topics/messages-topic",
                response.messages());
    }


}
