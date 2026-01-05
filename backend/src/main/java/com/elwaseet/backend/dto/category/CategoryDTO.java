package com.elwaseet.backend.dto.category;

import com.elwaseet.backend.entity.ServiceCategory;
import java.util.ArrayList;
import java.util.List;

public class CategoryDTO {
    private Integer categoryId;
    private String categoryName;
    private String parentCategory;
    private List<CategoryDTO> subcategories;
    
    public CategoryDTO() {
        this.subcategories = new ArrayList<>();
    }
    
    public CategoryDTO(ServiceCategory category) {
        this.categoryId = category.getCategoryId();
        this.categoryName = category.getCategoryName();
        this.parentCategory = category.getParentCategory();
        this.subcategories = new ArrayList<>();
    }
    
    // Getters and Setters
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    
    public String getParentCategory() { return parentCategory; }
    public void setParentCategory(String parentCategory) { this.parentCategory = parentCategory; }
    
    public List<CategoryDTO> getSubcategories() { return subcategories; }
    public void setSubcategories(List<CategoryDTO> subcategories) { 
        this.subcategories = subcategories; 
    }
}