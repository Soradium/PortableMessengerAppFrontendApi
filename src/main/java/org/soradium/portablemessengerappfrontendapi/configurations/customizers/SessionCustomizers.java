package org.soradium.portablemessengerappfrontendapi.configurations.customizers;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

public class SessionCustomizers {

    public static Customizer<SessionManagementConfigurer<HttpSecurity>>
    statelessSessionConfigurer() {
        return (session) -> {
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        };
    }
}
