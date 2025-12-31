package com.elwaseet.backend.dto.category;

import java.util.List;

public class CategoryListResponse {
    private List<CategoryDTO> categories;
    
    public CategoryListResponse() {}
    
    public CategoryListResponse(List<CategoryDTO> categories) {
        this.categories = categories;
    }
    
    // Getters and Setters
    public List<CategoryDTO> getCategories() { return categories; }
    public void setCategories(List<CategoryDTO> categories) { 
        this.categories = categories; 
    }
}