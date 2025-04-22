package org.soradium.portablemessengerappfrontendapi.controller.exceptions;

import org.soradium.portablemessengerappfrontendapi.controller.exceptions.custom_details.ErrorDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;

@RestControllerAdvice
public class GenericExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> genericExceptionResponse(Exception e) {
        return new ResponseEntity<>(new ErrorDetails(
                new Date(), e.getMessage()
        ), HttpStatus.BAD_REQUEST);
    }
}
