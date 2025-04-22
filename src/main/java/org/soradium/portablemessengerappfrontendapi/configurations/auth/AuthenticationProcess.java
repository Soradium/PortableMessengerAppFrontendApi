package org.soradium.portablemessengerappfrontendapi.configurations.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.soradium.portablemessengerappfrontendapi.configurations.jwt.JwtUtils;
import org.soradium.portablemessengerappfrontendapi.configurations.jwt.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthenticationProcess {

    @Autowired
    private JwtUtils jwtUtils;

    public ResponseEntity<LoginResponse> doAuth(
            UserCredentials userCredentials,
            SecurityContextHolderStrategy securityContextHolderStrategy,
            // context is used for user credentials
            // per user (user is determined per request),
            SecurityContextRepository repository,
            AuthenticationManager authenticationManager,
            HttpServletRequest request,
            HttpServletResponse response) {

        Authentication authenticationResponse =
                authenticationManager
                        .authenticate(new UsernamePasswordAuthenticationToken(
                                userCredentials.username(),
                                userCredentials.password())
                        );
        // auth the request in response in manager
        SecurityContextHolder.getContext().setAuthentication(authenticationResponse);
        // Commentary is deprecated, JWT is now used. For later use in case Session will be used.
//         due to the fact that we have an external REST login
//         and sessions are managed by the react-spring in relationship
//         we have to manage and save session by ourselves

//        request.getSession(true);

        UserDetails ud = (UserDetails) securityContextHolderStrategy
                .getContext()
                .getAuthentication()
                .getPrincipal();

        repository.saveContext(securityContextHolderStrategy
                .getContext(), request, response);

        String jwtToken = jwtUtils.generateTokenFromUsername(ud);
        List<String> roles = ud.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        LoginResponse loginResponse = new LoginResponse(
                ud.getUsername(), roles, jwtToken);

        if (authenticationResponse.isAuthenticated()) {
            // clear context after request
            return new ResponseEntity<>(loginResponse,
                    HttpStatusCode.valueOf(200));
        } else {
            return new ResponseEntity<>(null,
                    HttpStatusCode.valueOf(403));
        }
    }
}
