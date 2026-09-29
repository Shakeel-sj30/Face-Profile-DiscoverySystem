package com.facediscovery.controllers;

import com.facediscovery.models.Search;
import com.facediscovery.services.SearchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    private String getAuthUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication token required");
        }
        return (String) auth.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<?> initiateSearch(@RequestParam("image") MultipartFile image) {
        try {
            String userId = getAuthUserId();
            Search search = searchService.createAndExecuteSearch(userId, image);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Face search completed successfully",
                "search", search
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage(),
                "code", "INVALID_REQUEST"
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", e.getMessage(),
                "code", "FACE_NOT_FOUND"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Processing error: " + e.getMessage(),
                "code", "SEARCH_PROCESSING_ERROR"
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> listSearches() {
        String userId = getAuthUserId();
        List<Search> searches = searchService.getUserSearches(userId);
        return ResponseEntity.ok(Map.of("success", true, "searches", searches));
    }

    @GetMapping("/{searchId}")
    public ResponseEntity<?> getSearch(@PathVariable String searchId) {
        try {
            String userId = getAuthUserId();
            Search search = searchService.getSearchById(userId, searchId);
            return ResponseEntity.ok(Map.of("success", true, "search", search));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "success", false, "message", e.getMessage(), "code", "FORBIDDEN"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false, "message", "Search not found", "code", "NOT_FOUND"
            ));
        }
    }

    @DeleteMapping("/{searchId}")
    public ResponseEntity<?> deleteSearch(@PathVariable String searchId) {
        try {
            String userId = getAuthUserId();
            searchService.deleteSearch(userId, searchId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Search deleted successfully"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "success", false, "message", e.getMessage(), "code", "FORBIDDEN"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false, "message", "Search not found", "code", "NOT_FOUND"
            ));
        }
    }
}
