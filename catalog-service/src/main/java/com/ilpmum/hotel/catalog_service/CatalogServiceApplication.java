package com.ilpmum.hotel.catalog_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import com.ilpmum.hotel.catalog_service.model.*;
// import com.ilpmum.hotel.catalog_service.repo.*;

@SpringBootApplication
public class CatalogServiceApplication {

	public static void main(java.lang.String[] args) {
		SpringApplication.run(CatalogServiceApplication.class, args);
	}

//  @Bean
//  CommandLineRunner seedData(HotelRepository hotels, RoomTypeRepository roomTypes, RoomRepository rooms, StaffRepository staff) {
//      return args -> {
//          // Intentionally left empty: Admin will add hotels, room types, rooms, and staff.
//      };
//  }

}
