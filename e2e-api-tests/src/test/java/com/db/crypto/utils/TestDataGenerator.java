package com.db.crypto.utils;

import com.db.crypto.models.BookingDates;
import com.db.crypto.models.BookingRequest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class TestDataGenerator {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final Random random = new Random();

    public static BookingRequest generateBookingRequest() {
        return BookingRequest.builder()
                .firstName("testUser" + System.currentTimeMillis())
                .lastName("restfulbooker" + random.nextInt(10000))
                .totalPrice(random.nextInt(500) + 100)
                .depositPaid(random.nextBoolean())
                .bookingDates(BookingDates.builder()
                        .checkIn(LocalDate.now().format(formatter))
                        .checkOut(LocalDate.now().plusDays(5).format(formatter))
                        .build())
                .additionalNeeds("Breakfast")
                .build();
    }
}
