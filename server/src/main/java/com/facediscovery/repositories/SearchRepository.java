package com.facediscovery.repositories;

import com.facediscovery.models.Search;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SearchRepository extends MongoRepository<Search, String> {
    List<Search> findByUserIdOrderByCreatedAtDesc(String userId);
}
