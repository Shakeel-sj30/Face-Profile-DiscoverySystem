package com.facediscovery.controllers;

import com.facediscovery.models.CandidateResult;
import com.facediscovery.repositories.CandidateResultRepository;
import com.facediscovery.services.SearchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class ResultsController {

    private final SearchService searchService;
    private final CandidateResultRepository candidateResultRepository;

    public ResultsController(SearchService searchService, CandidateResultRepository candidateResultRepository) {
        this.searchService = searchService;
        this.candidateResultRepository = candidateResultRepository;
    }

    private String getAuthUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication token required");
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/api/search/{searchId}/results")
    public ResponseEntity<?> getSearchResults(@PathVariable String searchId) {
        try {
            String userId = getAuthUserId();
            List<CandidateResult> results = searchService.getSearchResults(userId, searchId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "searchId", searchId,
                "resultsCount", results.size(),
                "results", results
            ));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "success", false, "message", e.getMessage(), "code", "FORBIDDEN"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false, "message", e.getMessage(), "code", "NOT_FOUND"
            ));
        }
    }

    @GetMapping("/api/results/{resultId}")
    public ResponseEntity<?> getSingleResult(@PathVariable String resultId) {
        CandidateResult result = candidateResultRepository.findById(resultId).orElse(null);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false, "message", "Result record not found", "code", "NOT_FOUND"
            ));
        }
        return ResponseEntity.ok(Map.of("success", true, "result", result));
    }
}
