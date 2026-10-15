package com.example.schoolproject.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI metadata + a JWT "bearer" security scheme so the Swagger UI shows an
 * <b>Authorize</b> button where the frontend can paste a token and call protected endpoints.
 */
@Configuration
public class OpenApiConfig {

    public static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI schoolProjectOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Schoolproject Auth API")
                        .version("v1")
                        .description("Registration, login, logout and profile for students and teachers. "
                                + "For protected endpoints click Authorize and paste the JWT returned by "
                                + "/api/auth/register or /api/auth/login."))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Paste the JWT from /api/auth/register or /api/auth/login")));
    }
}
