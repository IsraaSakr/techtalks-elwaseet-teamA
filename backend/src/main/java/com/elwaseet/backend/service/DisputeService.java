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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final DisputeEvidencePhotoRepository evidenceRepository;
    private final TransactionRepository transactionRepository;
    private final FileStorageService fileStorageService;

    public DisputeService(DisputeRepository disputeRepository,
                          DisputeEvidencePhotoRepository evidenceRepository,
                          TransactionRepository transactionRepository,
                          FileStorageService fileStorageService) {
        this.disputeRepository = disputeRepository;
        this.evidenceRepository = evidenceRepository;
        this.transactionRepository = transactionRepository;
        this.fileStorageService = fileStorageService;
    }

    public DisputeDTO openDispute(Long transactionId,
                                  User customer,
                                  Dispute.DisputeReason reasonCategory,
                                  String description,
                                  List<MultipartFile> evidenceFiles) {

        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        // Rule 1: Only one dispute per transaction
        if (disputeRepository.existsByTransaction(tx)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Transaction already has a dispute");
        }

        // Rule 2: Only COMPLETED/CONFIRMED/PAID transactions
        if (!tx.getStatus().equals(Transaction.TransactionStatus.COMPLETED) &&
            !tx.getStatus().equals(Transaction.TransactionStatus.CONFIRMED) &&
            !tx.getStatus().equals(Transaction.TransactionStatus.PAID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only completed, confirmed or paid transactions can be disputed");
        }

        // Rule 3: Must open within 7 days of completion
        if (tx.getCompletedAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dispute deadline expired");
        }

        // Rule 4: Max 5 evidence photos
        if (evidenceFiles != null && evidenceFiles.size() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max 5 evidence photos allowed");
        }

        Job job = tx.getJob();

        // Create dispute
        Dispute dispute = new Dispute(tx, job, customer, reasonCategory, description);
        dispute.setStatus(Dispute.DisputeStatus.OPEN);
        dispute.setOpenedAt(LocalDateTime.now());

        dispute = disputeRepository.save(dispute);

        // Save evidence photos
        if (evidenceFiles != null && !evidenceFiles.isEmpty()) {
            List<String> photoUrls = fileStorageService.saveMultipleFiles(evidenceFiles, "disputes", 5);
            
            for (String url : photoUrls) {
                DisputeEvidencePhoto photo = new DisputeEvidencePhoto(dispute, customer, url);
                evidenceRepository.save(photo);
                dispute.getEvidencePhotos().add(photo);
            }
        }

        // Update transaction
        tx.setStatus(Transaction.TransactionStatus.DISPUTED);
        transactionRepository.save(tx);

        return toDTO(dispute);
    }

    public DisputeDTO toDTO(Dispute dispute) {
        DisputeDTO dto = new DisputeDTO();
        dto.setDisputeId(dispute.getDisputeId());
        dto.setTransactionId(dispute.getTransaction().getTransactionId());
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
}