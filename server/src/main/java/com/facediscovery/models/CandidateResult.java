package com.facediscovery.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "CandidateResults")
public class CandidateResult {

    @Id
    private String id;

    @Indexed
    private String searchId;

    private String platform; // e.g. "Instagram", "LinkedIn", "Twitter"

    private String publicProfileUrl;

    private String username;

    private String name;

    private String profileImageUrl;

    private Double similarityScore;

    private Integer similarityPercentage;

    private String source;

    private String confidenceLevel;

    public CandidateResult() {
        this.id = UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSearchId() { return searchId; }
    public void setSearchId(String searchId) { this.searchId = searchId; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getPublicProfileUrl() { return publicProfileUrl; }
    public void setPublicProfileUrl(String publicProfileUrl) { this.publicProfileUrl = publicProfileUrl; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }

    public Integer getSimilarityPercentage() { return similarityPercentage; }
    public void setSimilarityPercentage(Integer similarityPercentage) { this.similarityPercentage = similarityPercentage; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }
}
