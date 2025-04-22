package org.soradium.portablemessengerappfrontendapi.configurations;

import org.soradium.portablemessengerappfrontendapi.configurations.customizers.SessionCustomizers;
import org.soradium.portablemessengerappfrontendapi.configurations.jwt.AuthEntryPointJwt;
import org.soradium.portablemessengerappfrontendapi.configurations.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000"
        ));
        configuration.setAllowedMethods(List.of(
                "*"
        ));
        configuration.setAllowedHeaders(List.of(
                "*"
        ));
//        configuration.setExposedHeaders(List.of(
//                "XSRF-TOKEN"
//        ));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source
                = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(
                "/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(
                        (authorize)
                                -> authorize
                                .requestMatchers("/sec/login", "/sec/signup").permitAll()
                                .requestMatchers("/friends/**", "/groups/**").hasAnyRole("USER", "ADMIN")
                                .anyRequest()
                                .authenticated())
                .securityContext((
                        securityContext)
                        -> securityContext
                        .requireExplicitSave(true)
                        .securityContextRepository(delegatingSecurityContextRepository()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(SessionCustomizers.statelessSessionConfigurer())
                .addFilterBefore(authenticationJwtTokenFilter(),
                        UsernamePasswordAuthenticationFilter.class);
        // has to be set, because default is null and won't persist the session b/w requests
        return http.build();
    }

    @Bean
    public DelegatingSecurityContextRepository delegatingSecurityContextRepository() {
        return new DelegatingSecurityContextRepository(
                new RequestAttributeSecurityContextRepository(),
                new HttpSessionSecurityContextRepository()
        );
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

