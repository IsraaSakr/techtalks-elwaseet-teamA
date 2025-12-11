package com.elwaseet.backend.config;

import com.elwaseet.backend.entity.ServiceCategory;
import com.elwaseet.backend.repository.ServiceCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the database with initial service categories on application startup.
 * Only runs if the service_categories table is empty.
 */
@Component
@Order(1)  // Ensures this runs early in app startup
public class ServiceCategoryInitializer implements CommandLineRunner {

    @Autowired
    private ServiceCategoryRepository repository;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            List<ServiceCategory> categories = createCategories();
            repository.saveAll(categories);
            System.out.println("✅ Service categories seeded successfully! Total: " + categories.size());
        } else {
            System.out.println("ℹ️  Service categories already exist. Skipping seeding.");
        }
    }

    private List<ServiceCategory> createCategories() {
        List<ServiceCategory> allCategories = new ArrayList<>();

        // HOME SERVICES
        allCategories.add(createCategory("Home Services", null));
        allCategories.add(createCategory("Plumbing", "Home Services"));
        allCategories.add(createCategory("Electrical", "Home Services"));
        allCategories.add(createCategory("Carpentry", "Home Services"));
        allCategories.add(createCategory("Painting", "Home Services"));
        allCategories.add(createCategory("HVAC", "Home Services"));

        // CLEANING
        allCategories.add(createCategory("Cleaning", null));
        allCategories.add(createCategory("House Cleaning", "Cleaning"));
        allCategories.add(createCategory("Office Cleaning", "Cleaning"));
        allCategories.add(createCategory("Deep Cleaning", "Cleaning"));
        allCategories.add(createCategory("Move-in/out Cleaning", "Cleaning"));

        // EDUCATION
        allCategories.add(createCategory("Education", null));
        allCategories.add(createCategory("Math Tutoring", "Education"));
        allCategories.add(createCategory("English Lessons", "Education"));
        allCategories.add(createCategory("Arabic Lessons", "Education"));
        allCategories.add(createCategory("French Lessons", "Education"));
        allCategories.add(createCategory("SAT Prep", "Education"));

        // TECH
        allCategories.add(createCategory("Tech", null));
        allCategories.add(createCategory("Computer Repair", "Tech"));
        allCategories.add(createCategory("Phone Repair", "Tech"));
        allCategories.add(createCategory("Network Setup", "Tech"));
        allCategories.add(createCategory("Software Installation", "Tech"));

        // BEAUTY
        allCategories.add(createCategory("Beauty", null));
        allCategories.add(createCategory("Hairdressing", "Beauty"));
        allCategories.add(createCategory("Makeup", "Beauty"));
        allCategories.add(createCategory("Nails", "Beauty"));
        allCategories.add(createCategory("Massage", "Beauty"));

        // DELIVERY
        allCategories.add(createCategory("Delivery", null));
        allCategories.add(createCategory("Food Delivery", "Delivery"));
        allCategories.add(createCategory("Package Delivery", "Delivery"));
        allCategories.add(createCategory("Grocery Shopping", "Delivery"));

        // PET CARE
        allCategories.add(createCategory("Pet Care", null));
        allCategories.add(createCategory("Dog Walking", "Pet Care"));
        allCategories.add(createCategory("Pet Sitting", "Pet Care"));
        allCategories.add(createCategory("Grooming", "Pet Care"));

        // EVENTS
        allCategories.add(createCategory("Events", null));
        allCategories.add(createCategory("Photography", "Events"));
        allCategories.add(createCategory("Videography", "Events"));
        allCategories.add(createCategory("DJ", "Events"));
        allCategories.add(createCategory("Catering", "Events"));
        allCategories.add(createCategory("Event Planning", "Events"));

        // TRANSPORTATION
        allCategories.add(createCategory("Transportation", null));
        allCategories.add(createCategory("Moving Services", "Transportation"));
        allCategories.add(createCategory("Driver Services", "Transportation"));

        // OTHER
        allCategories.add(createCategory("Other", null));
        allCategories.add(createCategory("Gardening", "Other"));
        allCategories.add(createCategory("Car Wash", "Other"));
        allCategories.add(createCategory("Laundry", "Other"));
        allCategories.add(createCategory("Tailoring", "Other"));

        return allCategories;
    }

    /**
     * Helper method to create a category with proper field names
     */
    private ServiceCategory createCategory(String categoryName, String parentCategory) {
        ServiceCategory category = new ServiceCategory(categoryName);
        category.setParentCategory(parentCategory);
        category.setIsActive(true);
        return category;
    }
}
