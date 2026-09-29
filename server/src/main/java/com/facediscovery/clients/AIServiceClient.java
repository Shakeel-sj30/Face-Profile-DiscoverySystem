package com.facediscovery.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class AIServiceClient {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> discoverCandidates(String base64Image, int topK) {
        String url = aiServiceUrl + "/internal/ai/discover";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("imageBase64", base64Image);
        body.put("topK", topK);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> errMap = new HashMap<>();
            errMap.put("success", false);
            errMap.put("message", "AI service unavailable: " + e.getMessage());
            errMap.put("code", "AI_SERVICE_UNAVAILABLE");
            return errMap;
        }
    }
}
