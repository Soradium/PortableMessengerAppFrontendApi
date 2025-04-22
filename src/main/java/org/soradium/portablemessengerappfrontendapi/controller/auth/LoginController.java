package org.soradium.portablemessengerappfrontendapi.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.soradium.portablemessengerappfrontendapi.configurations.auth.AuthenticationProcess;
import org.soradium.portablemessengerappfrontendapi.configurations.auth.UserCredentials;
import org.soradium.portablemessengerappfrontendapi.configurations.jwt.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/sec")
// Login now happens only through API side
public class LoginController {
    @Autowired
    private final AuthenticationManager authenticationManager;
    private final SecurityContextHolderStrategy
            securityContextHolderStrategy
            = SecurityContextHolder.getContextHolderStrategy();
    private final SecurityContextRepository repository;
    private final AuthenticationProcess process;


    public LoginController(
            @Autowired AuthenticationManager authenticationManager,
            @Autowired DelegatingSecurityContextRepository
                    delegatingSecurityContextRepository,
            @Autowired AuthenticationProcess process) {
        this.authenticationManager = authenticationManager;
        this.repository = delegatingSecurityContextRepository;
        this.process = process;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody UserCredentials userCredentials,
            HttpSession session,
            HttpServletRequest request,
            HttpServletResponse response) {

        return process.doAuth(
                userCredentials,
                this.securityContextHolderStrategy,
                this.repository,
                this.authenticationManager,
                request,
                response);
    }

}