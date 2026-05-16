package com.gregluna.civiclens.client;

import com.gregluna.civiclens.dto.NycServiceRequestRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NycOpenDataClient {

    private static final String DATASET_PATH = "/resource/erm2-nwe9.json";

    private final RestClient nycOpenDataRestClient;

    // Returns the most recently filed 311 requests, newest first.
    public List<NycServiceRequestRecord> fetchRecords(int limit) {
        return nycOpenDataRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(DATASET_PATH)
                        .queryParam("$limit", limit)
                        .queryParam("$order", "created_date DESC")
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
