package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.category.CategoryDTO;
import com.elwaseet.backend.dto.category.CategoryListResponse;
import com.elwaseet.backend.entity.ServiceCategory;
import com.elwaseet.backend.repository.ServiceCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Public endpoint for retrieving service categories
 * No authentication required
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // Allow frontend to access
public class CategoryController {

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    /**
     * Get all active categories with hierarchical structure
     * 
     * @return CategoryListResponse with parent categories containing their subcategories
     * 
     * Example response:
     * {
     *   "categories": [
     *     {
     *       "categoryId": 1,
     *       "categoryName": "Home Services",
     *       "parentCategory": null,
     *       "subcategories": [
     *         {
     *           "categoryId": 2,
     *           "categoryName": "Plumbing",
     *           "parentCategory": "Home Services",
     *           "subcategories": []
     *         }
     *       ]
     *     }
     *   ]
     * }
     */
    @GetMapping
    public ResponseEntity<CategoryListResponse> getAllCategories() {
        try {
            // Get all active categories from database
            List<ServiceCategory> allCategories = categoryRepository.findByIsActiveTrue();
            
            // Build hierarchical structure
            List<CategoryDTO> parentCategories = new ArrayList<>();
            
            // First pass: Find all parent categories (those with parentCategory = null)
            for (ServiceCategory category : allCategories) {
                if (category.isRootCategory()) {
                    CategoryDTO parentDto = new CategoryDTO(category);
                    
                    // Second pass: Find all children of this parent
                    List<CategoryDTO> children = allCategories.stream()
                        .filter(c -> category.getCategoryName().equals(c.getParentCategory()))
                        .map(CategoryDTO::new)
                        .collect(Collectors.toList());
                    
                    parentDto.setSubcategories(children);
                    parentCategories.add(parentDto);
                }
            }
            
            return ResponseEntity.ok(new CategoryListResponse(parentCategories));
            
        } catch (Exception e) {
            // Log error and return empty list
            System.err.println("Error fetching categories: " + e.getMessage());
            return ResponseEntity.ok(new CategoryListResponse(new ArrayList<>()));
        }
    }
}