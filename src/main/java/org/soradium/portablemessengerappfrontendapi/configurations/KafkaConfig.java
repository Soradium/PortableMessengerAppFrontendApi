package org.soradium.portablemessengerappfrontendapi.configurations;


import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.soradium.portablemessengerappfrontendapi.dto.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.converter.BatchMessagingMessageConverter;
import org.springframework.kafka.support.converter.JsonMessageConverter;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableAsync
public class KafkaConfig {
    // Producer config

    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        // check, which serializers you import - do not import Jackson serializers here!!!
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        // See https://kafka.apache.org/documentation/#producerconfigs for more properties
        return props;
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        JsonSerializer<Object> serializer = new JsonSerializer<>();
        serializer.setAddTypeInfo(false);

        return new DefaultKafkaProducerFactory<>(
                producerConfigs(),
                new StringSerializer(),
                serializer
        );
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaMessageTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }


    // Consumer(listener) config

    @Bean
    public Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return props;
    }

    @Bean
    public JsonMessageConverter jsonConverter() {
        return new JsonMessageConverter();
    }

    @Bean
    public ConsumerFactory<String, FriendRequestResponseDto> consumerFriendFactory() {
        JsonDeserializer<FriendRequestResponseDto> deserializer =
                new JsonDeserializer<>(FriendRequestResponseDto.class);
        deserializer.addTrustedPackages("org.soradium.portablemessengerappfrontendapi.dto");
        deserializer.setUseTypeMapperForKey(false);
        deserializer.setRemoveTypeHeaders(true);

        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public KafkaListenerContainerFactory<?> kafkaListenerFriendContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, FriendRequestResponseDto>
                factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setBatchListener(true);
        factory.setConsumerFactory(consumerFriendFactory());
        factory.setBatchMessageConverter(
                new BatchMessagingMessageConverter(jsonConverter()));
        return factory;
    }

    @Bean
    public ConsumerFactory<String, FriendFetchResponseDto> consumerSidebarFetchFactory() {
        JsonDeserializer<FriendFetchResponseDto> deserializer =
                new JsonDeserializer<>(FriendFetchResponseDto.class);
        deserializer.addTrustedPackages("org.soradium.portablemessengerappfrontendapi.dto");
        deserializer.setUseTypeMapperForKey(false);
        deserializer.setRemoveTypeHeaders(true);

        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public KafkaListenerContainerFactory<?> kafkaListenerSidebarFetchContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, FriendFetchResponseDto>
                factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setBatchListener(true);
        factory.setConsumerFactory(consumerSidebarFetchFactory());
        factory.setBatchMessageConverter(
                new BatchMessagingMessageConverter(jsonConverter()));
        return factory;
    }

    @Bean
    public ConsumerFactory<String, SentMessageDto> consumerReceivedMessageFactory() {
        JsonDeserializer<SentMessageDto> deserializer =
                new JsonDeserializer<>(SentMessageDto.class);
        deserializer.addTrustedPackages("org.soradium.portablemessengerappfrontendapi.dto");
        deserializer.setUseTypeMapperForKey(false);
        deserializer.setRemoveTypeHeaders(true);

        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public KafkaListenerContainerFactory<?> kafkaListenerReceivedMessageContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, SentMessageDto>
                factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setBatchListener(true);
        factory.setConsumerFactory(consumerReceivedMessageFactory());
        factory.setBatchMessageConverter(
                new BatchMessagingMessageConverter(jsonConverter()));
        return factory;
    }

    @Bean
    public ConsumerFactory<String, SenderAndRetrievedMessageListDto> consumerMessageListFactory() {
        JsonDeserializer<SenderAndRetrievedMessageListDto> deserializer =
                new JsonDeserializer<>(SenderAndRetrievedMessageListDto.class);
        deserializer.addTrustedPackages("org.soradium.portablemessengerappfrontendapi.dto");
        deserializer.setUseTypeMapperForKey(false);
        deserializer.setRemoveTypeHeaders(true);

        return new DefaultKafkaConsumerFactory<>(
                consumerConfigs(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public KafkaListenerContainerFactory<?> kafkaListenerMessageListContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, SenderAndRetrievedMessageListDto>
                factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setBatchListener(true);
        factory.setConsumerFactory(consumerMessageListFactory());
        factory.setBatchMessageConverter(
                new BatchMessagingMessageConverter(jsonConverter()));
        return factory;
    }



}
