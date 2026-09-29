package com.facediscovery.services;

import com.facediscovery.clients.AIServiceClient;
import com.facediscovery.models.CandidateResult;
import com.facediscovery.models.Search;
import com.facediscovery.repositories.CandidateResultRepository;
import com.facediscovery.repositories.SearchRepository;
import com.facediscovery.validators.ImageValidator;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SearchService {

    private final SearchRepository searchRepository;
    private final CandidateResultRepository candidateResultRepository;
    private final ImageValidator imageValidator;
    private final AIServiceClient aiServiceClient;
    private final AuditService auditService;

    public SearchService(SearchRepository searchRepository,
                         CandidateResultRepository candidateResultRepository,
                         ImageValidator imageValidator,
                         AIServiceClient aiServiceClient,
                         AuditService auditService) {
        this.searchRepository = searchRepository;
        this.candidateResultRepository = candidateResultRepository;
        this.imageValidator = imageValidator;
        this.aiServiceClient = aiServiceClient;
        this.auditService = auditService;
    }

    public Search createAndExecuteSearch(String userId, MultipartFile imageFile) {
        imageValidator.validate(imageFile);

        String base64Image;
        try {
            base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to read image byte content.");
        }

        Search search = new Search(userId, base64Image);
        search = searchRepository.save(search);

        long startTime = System.currentTimeMillis();

        // Call internal Python AI service
        Map<String, Object> aiResponse = aiServiceClient.discoverCandidates(base64Image, 5);
        boolean success = Boolean.TRUE.equals(aiResponse.get("success"));

        if (!success) {
            search.setStatus("FAILED");
            search.setCompletedAt(LocalDateTime.now());
            searchRepository.save(search);
            
            String errCode = (String) aiResponse.getOrDefault("code", "FACE_NOT_FOUND");
            String errMsg = (String) aiResponse.getOrDefault("message", "No detectable face found in image.");
            auditService.log(userId, "SEARCH_EXECUTE", "FAILED_" + errCode, false);
            
            throw new NoSuchElementException(errMsg);
        }

        // Process discovered candidate results
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> candidatesRaw = (List<Map<String, Object>>) aiResponse.get("candidates");

        if (candidatesRaw != null) {
            for (Map<String, Object> c : candidatesRaw) {
                CandidateResult result = new CandidateResult();
                result.setSearchId(search.getId());
                result.setPlatform((String) c.get("platform"));
                result.setUsername((String) c.get("username"));
                result.setName((String) c.get("name"));
                result.setProfileImageUrl((String) c.get("profileImageUrl"));
                result.setPublicProfileUrl((String) c.get("publicProfileUrl"));
                
                Number simScore = (Number) c.get("similarityScore");
                result.setSimilarityScore(simScore != null ? simScore.doubleValue() : 0.0);
                
                Number simPct = (Number) c.get("similarityPercentage");
                result.setSimilarityPercentage(simPct != null ? simPct.intValue() : 0);
                
                result.setSource((String) c.get("source"));
                result.setConfidenceLevel((String) c.get("confidenceLevel"));

                candidateResultRepository.save(result);
            }
        }

        search.setStatus("COMPLETED");
        search.setCompletedAt(LocalDateTime.now());
        search.setProcessingTimeMs(System.currentTimeMillis() - startTime);
        searchRepository.save(search);

        auditService.log(userId, "SEARCH_EXECUTE", "SUCCESS", false);

        return search;
    }

    public List<Search> getUserSearches(String userId) {
        return searchRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Search getSearchById(String userId, String searchId) {
        Search search = searchRepository.findById(searchId)
                .orElseThrow(() -> new NoSuchElementException("Search record not found."));

        if (!search.getUserId().equals(userId)) {
            auditService.log(userId, "SEARCH_ACCESS_UNAUTHORIZED", "FORBIDDEN", true);
            throw new SecurityException("Cross-user access denied. You do not own this search.");
        }

        return search;
    }

    public List<CandidateResult> getSearchResults(String userId, String searchId) {
        getSearchById(userId, searchId); // Enforces ownership check
        return candidateResultRepository.findBySearchIdOrderBySimilarityScoreDesc(searchId);
    }

    public void deleteSearch(String userId, String searchId) {
        getSearchById(userId, searchId); // Enforces ownership check
        candidateResultRepository.deleteBySearchId(searchId);
        searchRepository.deleteById(searchId);
        auditService.log(userId, "SEARCH_DELETE", "SUCCESS", false);
    }
}
