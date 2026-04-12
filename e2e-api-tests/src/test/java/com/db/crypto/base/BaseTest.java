package com.db.crypto.base;


import com.db.crypto.config.ConfigManager;
import com.db.crypto.models.BookingRequest;
import com.db.crypto.utils.TestDataGenerator;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import java.util.Map;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.is;


@Slf4j
public class BaseTest {

        protected static RequestSpecification requestSpec;
        protected static String authToken;

        protected static final ThreadLocal<Integer> bookingId = new ThreadLocal<>();
        protected static final ThreadLocal<BookingRequest> currentBooking = new ThreadLocal<>();

        @BeforeSuite
        public void setUp() {
                RestAssured.baseURI = ConfigManager.getProperty("base.url");

                RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
                //Get the auth token and set up the request specification with the token for all tests
                authToken = RestAssured.given()
                        .contentType(ContentType.JSON)
                        .body(Map.of(
                                "username", ConfigManager.getProperty("username"),
                                "password",ConfigManager.getProperty("password")
                        ))
                        .when()
                        .post("/auth")
                        .then()
                        .statusCode(200)
                        .extract()
                        .path("token");

                // Set up a reusable RequestSpecification with the auth token for all tests
                requestSpec = new RequestSpecBuilder()
                        .setBaseUri(ConfigManager.getProperty("base.url"))
                        .setContentType(ContentType.JSON)
                        .setAccept(ContentType.JSON)
                        .addHeader("Authorization", "Bearer "+authToken)
                        .build();
        }

        @BeforeMethod
        public void createBooking() {
                BookingRequest request = TestDataGenerator.generateBookingRequest();
                int id = RestAssured.given()
                        .spec(requestSpec)
                        .body(request)
                        .when()
                        .post("/booking")
                        .then()
                        .statusCode(200)
                        .extract()
                        .path("bookingid");

                bookingId.set(id);
                log.info("Created booking with ID: {}", id);
        }

        @AfterMethod
        public void deleteBooking() {
                Integer id = bookingId.get();
                if(id != null) {
                        try {
                                RestAssured.given().spec(requestSpec)
                                        .pathParam("id", id)
                                        .when()
                                        .delete("/booking/{id}")
                                        .then()
                                        .statusCode(anyOf(is(201), is(404)));
                                log.info("Deleted booking with ID: {}", id);
                        } catch (Exception e) {
                                log.warn("Warning: Failed to delete booking with ID: {}. It may have already been deleted. Exception: {}", id, e.getMessage());
                        } finally {
                                bookingId.remove();
                                currentBooking.remove();
                        }
                }
        }

}
