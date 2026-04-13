package com.db.crypto.tests.contracts;

import com.db.crypto.base.BaseTest;
import com.db.crypto.models.BookingDates;
import com.db.crypto.models.BookingRequest;
import com.db.crypto.utils.SchemaValidator;
import com.db.crypto.utils.TestDataGenerator;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Contract Test Suite — Schema Validation Only
 *
 * Purpose: Validate that API response structures
 * match the agreed golden copy schemas.
 *
 * These tests are intentionally separate from functional
 * tests — they run first in the pipeline as a fail-fast
 * gate. If a schema breaks, no point running functional suite.
 *
 * Does NOT test business logic — only response structure.
 */
public class BookingContractTest extends BaseTest {

    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Shared across contract tests in this class
    // Not ThreadLocal — contract tests run sequentially
    private int contractBookingId;
    private String contractAuthToken;

    // ─────────────────────────────────────────
    // SETUP — create one booking for contract tests
    // ─────────────────────────────────────────

    @BeforeClass
    public void createContractTestData() {
        BookingRequest request = TestDataGenerator.generateBookingRequest();

        contractBookingId = RestAssured.given(requestSpec)
                .body(request)
                .when()
                .post("/booking")
                .then()
                .statusCode(200)
                .extract()
                .path("bookingid");

        System.out.println("Contract test booking ID: " + contractBookingId);
    }

    // ─────────────────────────────────────────
    // CONTRACT 1 — Auth Token Schema
    // ─────────────────────────────────────────

    @Test(priority = 1,
            description = "Contract: Auth response matches schema")
    public void validateAuthResponseSchema() {

        Response response = RestAssured.given()
                .contentType("application/json")
                .body("{\"username\": \"admin\", \"password\": \"password123\"}")
                .when()
                .post("/auth")
                .then()
                .statusCode(200)
                .extract().response();

        SchemaValidator.validateAuthSchema(response);
    }

    // ─────────────────────────────────────────
    // CONTRACT 2 — Create Booking Schema
    // ─────────────────────────────────────────

    @Test(priority = 2,
            description = "Contract: Create booking response matches schema")
    public void validateCreateBookingSchema() {

        BookingRequest request = TestDataGenerator.generateBookingRequest();

        Response response = RestAssured.given(requestSpec)
                .body(request)
                .when()
                .post("/booking")
                .then()
                .statusCode(200)
                .extract().response();

        SchemaValidator.validateCreateBookingSchema(response);

        // Cleanup this booking
        int id = response.path("bookingid");
        RestAssured.given(requestSpec)
                .pathParam("id", id)
                .delete("/booking/{id}");
    }

    // ─────────────────────────────────────────
    // CONTRACT 3 — Get Booking Schema
    // ─────────────────────────────────────────

    @Test(priority = 3,
            description = "Contract: Get booking response matches schema")
    public void validateGetBookingSchema() {

        Response response = RestAssured.given(requestSpec)
                .pathParam("id", contractBookingId)
                .when()
                .get("/booking/{id}")
                .then()
                .statusCode(200)
                .extract().response();

        SchemaValidator.validateGetBookingSchema(response);
    }

    // ─────────────────────────────────────────
    // CONTRACT 4 — Update Booking Schema (PUT)
    // ─────────────────────────────────────────

    @Test(priority = 4,
            description = "Contract: Update booking response matches schema")
    public void validateUpdateBookingSchema() {

        BookingRequest updatedRequest = BookingRequest.builder()
                .firstName("ContractUpdate" + System.currentTimeMillis())
                .lastName("Tester")
                .totalPrice(500)
                .depositPaid(true)
                .bookingDates(BookingDates.builder()
                        .checkIn(LocalDate.now().format(formatter))
                        .checkOut(LocalDate.now().plusDays(3).format(formatter))
                        .build())
                .additionalNeeds("None")
                .build();

        Response response = RestAssured.given(requestSpec)
                .pathParam("id", contractBookingId)
                .body(updatedRequest)
                .when()
                .put("/booking/{id}")
                .then()
                .statusCode(200)
                .extract().response();

        // PUT returns same structure as GET
        SchemaValidator.validateGetBookingSchema(response);
    }

    // ─────────────────────────────────────────
    // CONTRACT 5 — Partial Update Schema (PATCH)
    // ─────────────────────────────────────────

    @Test(priority = 5,
            description = "Contract: Partial update response matches schema")
    public void validatePartialUpdateBookingSchema() {

        String patchPayload = """
                {
                    "firstname": "PatchedContract",
                    "totalprice": 300
                }
                """;

        Response response = RestAssured.given(requestSpec)
                .pathParam("id", contractBookingId)
                .body(patchPayload)
                .when()
                .patch("/booking/{id}")
                .then()
                .statusCode(200)
                .extract().response();

        // PATCH also returns same structure as GET
        SchemaValidator.validateGetBookingSchema(response);
    }

    // ─────────────────────────────────────────
    // CONTRACT 6 — Response Headers Contract
    // ─────────────────────────────────────────

    @Test(priority = 6,
            description = "Contract: Response headers contain correct content type")
    public void validateResponseHeaders() {

        RestAssured.given(requestSpec)
                .pathParam("id", contractBookingId)
                .when()
                .get("/booking/{id}")
                .then()
                .statusCode(200)
                .header("Content-Type",
                        org.hamcrest.Matchers.containsString("application/json"));
    }

    // ─────────────────────────────────────────
    // CONTRACT 7 — Response Time Contract
    // ─────────────────────────────────────────

    @Test(priority = 7,
            description = "Contract: API responds within 2000ms")
    public void validateResponseTime() {

        RestAssured.given(requestSpec)
                .pathParam("id", contractBookingId)
                .when()
                .get("/booking/{id}")
                .then()
                .statusCode(200)
                .time(org.hamcrest.Matchers.lessThan(2000L));
    }

    // ─────────────────────────────────────────
    // TEARDOWN — cleanup contract test data
    // ─────────────────────────────────────────

    @AfterClass
    public void cleanupContractTestData() {
        if (contractBookingId != 0) {
            RestAssured.given(requestSpec)
                    .pathParam("id", contractBookingId)
                    .when()
                    .delete("/booking/{id}")
                    .then()
                    .statusCode(org.hamcrest.Matchers.anyOf(
                            org.hamcrest.Matchers.is(201),
                            org.hamcrest.Matchers.is(404)
                    ));
        }
    }
}