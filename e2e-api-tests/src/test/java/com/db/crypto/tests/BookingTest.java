package com.db.crypto.tests;

import com.db.crypto.base.BaseTest;
import com.db.crypto.models.BookingDates;
import com.db.crypto.models.BookingRequest;
import io.restassured.RestAssured;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.hamcrest.Matchers.*;

public class BookingTest extends BaseTest {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    // TEST 1 — Get Booking GET
    @Test(description = "Get booking hy ID - validate all fields")
    public void testGetBookingById() {
        RestAssured.given(requestSpec)
                .pathParam("id", bookingId.get())
                .when()
                .get("/booking/{id}")
                .then()
                .statusCode(200)
                .body("firstname", equalTo(currentBooking.get().getFirstName()))
                .body("lastname", equalTo(currentBooking.get().getLastName()))
                .body("totalprice", equalTo(currentBooking.get().getTotalPrice()))
                .body("depositpaid", equalTo(currentBooking.get().isDepositPaid()))
                .body("bookingdates.checkin", equalTo(currentBooking.get().getBookingDates().getCheckIn()))
                .body("bookingdates.checkout", equalTo(currentBooking.get().getBookingDates().getCheckOut()))
                .body("additionalneeds", not(emptyOrNullString()));

    }

    // TEST 2 — full update on resource PUT
    @Test(description = "Full update booking by ID - validate all changes persisted")
    public void testUpdateBooking() {
        BookingRequest updatedRequest = BookingRequest.builder()
                .firstName("Updated" + System.currentTimeMillis())
                .lastName("Testuser" + System.currentTimeMillis())
                .totalPrice(999)
                .depositPaid(false)
                .bookingDates(BookingDates.builder()
                        .checkIn(LocalDate.now().plusDays(1).format(formatter))
                        .checkOut(LocalDate.now().plusDays(7).format(formatter))
                        .build())
                .additionalNeeds("Late Checkout")
                .build();

        RestAssured.given(requestSpec)
                .pathParam("id", bookingId.get())
                .body(updatedRequest)
                .when()
                .put("/booking/{id}")
                .then()
                .statusCode(201)
                .body("firstname", startsWith("Updated"))
                .body("lastname", startsWith("Testuser"))
                .body("totalprice", equalTo(999))
                .body("depositpaid", equalTo(false))
                .body("additionalneeds", equalTo("Late Checkout"));


    }

    // TEST 3 — Partial Update PATCH
    @Test(description = "partial Update on existing resource - validate only changed fields updated")
    public void testPartialUpdateBooking() {
        String patchPayload = String.format("""
                {
                "firstname": "PartiallyUpdated%s",
                "totalprice": 555

                }
                """, System.currentTimeMillis());

        RestAssured.given(requestSpec)
                .pathParam("id", bookingId.get())
                .body(patchPayload)
                .when()
                .patch("/booking/{id}")
                .then()
                .statusCode(200)
                .body("firstname", startsWith("PartialUpdated"))
                .body("totalprice", equalTo(555));
    }

    // TEST 4 — Delete Booking DELETE // 404 on AfterMethod
    @Test(description = "Delete booking by ID, verify 201 on delete and 404 when trying to get deleted booking")
    public void testDeleteBooking( ) {
        RestAssured.given(requestSpec)
                .pathParam("id", bookingId.get())
                .when()
                .delete("/booking/{id}")
                .then()
                .statusCode(201);

        RestAssured.given(requestSpec)
                .pathParam("id", bookingId.get())
                .when()
                .get("booking/{id}")
                .then()
                .statusCode(404);
    }

    // TEST 5 — Negative: Invalid ID
    @Test(description = "Get booking with invalid ID - validate 404 response")
    public void testGetBookingWithInvalidId() {
        RestAssured.given()
                .pathParam("id", 99999999)
                .when()
                .get("/booking/{id}")
                .then()
                .statusCode(404);
    }

    // TEST 6 — Negative: Missing Required Fields
    @Test(description = "Create booking with missing required fields - validate 400 response")
    public void testCreateBookingWithInvalidPayload() {
        String invalidPayload = """
                {
                "lastname": "MissingFirstName"
                }
                """;

        RestAssured.given(requestSpec)
                .body(invalidPayload)
                .when()
                .post("/booking")
                .then()
                .statusCode(400);
    }

    // TEST 7 — Negative: Unauthorized Delete
    @Test(description = "Delete booking without auth - validate 401 response")
    public void testDeleteBookingWithoutAuth() {
        RestAssured.given()
                .pathParam("id", bookingId.get())
                .when()
                .delete("/booking/{id}")
                .then()
                .statusCode(401);
    }

    // TEST 8 — DataProvider: Boundary Prices
    @DataProvider(name = "priceBoundaryData", parallel = true)
    public Object[][] priceBoundaryData() {
        return new Object[][] {
                {1, 200}, //Min Valid Price
                {9999, 200}, //max valid price
                {0, 200}, //Zero price -- invalid
                {-100, 500} //Negative price -- invalid

        };
    }

    @Test(dataProvider = "priceBoundaryData", description = "Create booking with boundary price values - validate correct handling")
    public void testWithMultiplePriceBoundaries(int price, int expectedStatusCode) {
        BookingRequest payload = BookingRequest.builder()
                .firstName("BoundaryTest" + System.currentTimeMillis() + Thread.currentThread().getId())
                .lastName("PriceBoundary")
                .totalPrice(price)
                .depositPaid(true)
                .bookingDates(BookingDates.builder()
                        .checkIn(LocalDate.now().format(formatter))
                        .checkOut(LocalDate.now().plusDays(3).format(formatter))
                        .build())
                .additionalNeeds("None")
                .build();

        RestAssured.given(requestSpec)
                .body(payload)
                .when()
                .post("/booking")
                .then()
                .statusCode(expectedStatusCode)
                .body("totalprice", equalTo(price));
    }
}
