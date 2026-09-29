package com.facediscovery.repositories;

import com.facediscovery.models.CandidateResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CandidateResultRepository extends MongoRepository<CandidateResult, String> {
    List<CandidateResult> findBySearchIdOrderBySimilarityScoreDesc(String searchId);
    void deleteBySearchId(String searchId);
}
