package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.dispute.DisputeDTO;
import com.elwaseet.backend.dto.dispute.DisputeEvidencePhotoDTO;
import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.DisputeEvidencePhoto;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.repository.DisputeRepository;
import com.elwaseet.backend.repository.DisputeEvidencePhotoRepository;
import com.elwaseet.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final DisputeEvidencePhotoRepository evidenceRepository;
    private final TransactionRepository transactionRepository;

    public DisputeService(DisputeRepository disputeRepository,
                          DisputeEvidencePhotoRepository evidenceRepository,
                          TransactionRepository transactionRepository) {
        this.disputeRepository = disputeRepository;
        this.evidenceRepository = evidenceRepository;
        this.transactionRepository = transactionRepository;
    }

    public DisputeDTO openDispute(Long transactionId,
                                  User customer,
                                  Dispute.DisputeReason reasonCategory,
                                  String description,
                                  List<MultipartFile> evidenceFiles) {

        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        // Rule 1: Only COMPLETED transactions
        if (!tx.getStatus().equals(Transaction.TransactionStatus.COMPLETED)) {
            throw new IllegalStateException("Only completed transactions can be disputed");
        }

        // Rule 2: Must open within 7 days of completion
        if (tx.getCompletedAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new IllegalStateException("Dispute deadline expired");
        }

        // Rule 3: Max 5 evidence photos
        if (evidenceFiles != null && evidenceFiles.size() > 5) {
            throw new IllegalStateException("Max 5 evidence photos allowed");
        }

        Job job = tx.getJob();

        // Create dispute
        Dispute dispute = new Dispute(tx, job, customer, reasonCategory, description);
        dispute.setStatus(Dispute.DisputeStatus.OPEN);
        dispute.setOpenedAt(LocalDateTime.now());

        dispute = disputeRepository.save(dispute);

        // Save evidence photos
        if (evidenceFiles != null) {
            for (MultipartFile file : evidenceFiles) {
                if (!file.isEmpty()) {
                    String url = storeFile(file); // implement storage logic
                    DisputeEvidencePhoto photo = new DisputeEvidencePhoto();
                    photo.setDispute(dispute);
                    photo.setPhotoUrl(url);
                    photo.setUploadedAt(LocalDateTime.now());
                    photo.setUploadedBy(customer); // ✅ FIX: set uploader
                    evidenceRepository.save(photo);
                }
            }
        }
if (disputeRepository.existsByTransaction(tx)) {
    throw new IllegalStateException("Transaction already has a dispute");
}
        // Update transaction + job status
        tx.setStatus(Transaction.TransactionStatus.DISPUTED);
        job.setStatus(Job.JobStatus.IN_REVIEW);
        transactionRepository.save(tx);

        return toDTO(dispute);
    }

    public DisputeDTO toDTO(Dispute dispute) {
        DisputeDTO dto = new DisputeDTO();
        dto.setDisputeId(dispute.getDisputeId());
        dto.setTransactionId(dispute.getTransaction().getTransactionId());
        dto.setCustomerId(dispute.getOpenedBy().getUserId());
        dto.setStatus(dispute.getStatus().name());
        dto.setOpenedAt(dispute.getOpenedAt());
        dto.setResolvedAt(dispute.getResolvedAt());

        List<DisputeEvidencePhotoDTO> photos = dispute.getEvidencePhotos().stream()
                .map(photo -> {
                    DisputeEvidencePhotoDTO pDto = new DisputeEvidencePhotoDTO();
                    pDto.setPhotoId(photo.getPhotoId());
                    pDto.setPhotoUrl(photo.getPhotoUrl());
                    pDto.setUploadedAt(photo.getUploadedAt());
                    return pDto;
                }).toList();

        dto.setEvidencePhotos(photos);
        return dto;
    }

    private String storeFile(MultipartFile file) {
        // TODO: implement storage (local FS, S3, etc.)
        return "/uploads/" + file.getOriginalFilename();
    }
}