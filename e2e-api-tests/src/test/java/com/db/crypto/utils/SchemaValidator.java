package com.db.crypto.utils;

import io.restassured.response.Response;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

public class SchemaValidator {

    // ─────────────────────────────────────────
    // Schema paths — single source of truth
    // If schema file moves, change it here only
    // ─────────────────────────────────────────
    private static final String AUTH_SCHEMA =
            "schemas/auth-schema.json";

    private static final String CREATE_BOOKING_SCHEMA =
            "schemas/create-booking-schema.json";

    private static final String GET_BOOKING_SCHEMA =
            "schemas/get-booking-schema.json";


    public static void validateAuthSchema(Response response) {
        response.then()
                .assertThat()
                .body(matchesJsonSchemaInClasspath(AUTH_SCHEMA));
    }

    public static void validateCreateBookingSchema(Response response) {
        response.then()
                .assertThat()
                .body(matchesJsonSchemaInClasspath(CREATE_BOOKING_SCHEMA));
    }

    public static void validateGetBookingSchema(Response response) {
        response.then()
                .assertThat()
                .body(matchesJsonSchemaInClasspath(GET_BOOKING_SCHEMA));
    }

    // ─────────────────────────────────────────
    // Generic method — for any custom schema
    // ─────────────────────────────────────────
    public static void validateSchema(Response response, String schemaPath) {
        response.then()
                .assertThat()
                .body(matchesJsonSchemaInClasspath(schemaPath));
    }
}