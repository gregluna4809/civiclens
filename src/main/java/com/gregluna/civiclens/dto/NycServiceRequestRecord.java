package com.gregluna.civiclens.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// Maps the fields we consume from the NYC Open Data 311 Service Requests API.
// Unknown fields in the response are ignored to avoid deserialization failures as the API evolves.
@JsonIgnoreProperties(ignoreUnknown = true)
public record NycServiceRequestRecord(
        @JsonProperty("unique_key")     String uniqueKey,
        @JsonProperty("agency")         String agencyCode,
        @JsonProperty("agency_name")    String agencyName,
        @JsonProperty("complaint_type") String complaintType,
        @JsonProperty("descriptor")     String descriptor,
        @JsonProperty("status")         String status,
        @JsonProperty("borough")        String borough,
        @JsonProperty("incident_zip")   String incidentZip,
        @JsonProperty("latitude")       String latitude,
        @JsonProperty("longitude")      String longitude,
        @JsonProperty("created_date")   String createdDate,
        @JsonProperty("closed_date")    String closedDate
) {}
