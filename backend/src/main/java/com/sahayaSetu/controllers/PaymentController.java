package com.sahayaSetu.controllers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sahayaSetu.entities.Donation;
import com.sahayaSetu.entities.Donor;
import com.sahayaSetu.entities.FundraiserRequest;
import com.sahayaSetu.entities.Request;
import com.sahayaSetu.entities.enums.PaymentMode;
import com.sahayaSetu.repositories.DonationRepository;
import com.sahayaSetu.repositories.DonorRepository;
import com.sahayaSetu.repositories.RequestRepository;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private DonorRepository donorRepository;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody Map<String, Object> data)
            throws RazorpayException {
        
        int amount = Integer.parseInt(data.get("amount").toString());
        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        
        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", "donation_receipt_001");
        
        Order order = client.orders.create(options);
        return ResponseEntity.ok(order.toString());
    }

    @PostMapping("/success")
    public ResponseEntity<String> updateDonation(@RequestBody Map<String, Object> data) {
        try {
            Long requestId = Long.parseLong(data.get("requestId").toString());
            Long donorId = Long.parseLong(data.get("donorId").toString());
            BigDecimal amount = new BigDecimal(data.get("amount").toString());
            String paymentId = data.get("paymentId").toString();

            Request req = requestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            if (!(req instanceof FundraiserRequest)) {
                throw new RuntimeException("Not a fundraiser request");
            }

            FundraiserRequest fundraiser = (FundraiserRequest) req;
            Donor donor = donorRepository.findById(donorId)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));

            Donation donation = new Donation();
            donation.setAmount(amount);
            donation.setDonatedAt(LocalDateTime.now());
            donation.setDonor(donor);
            donation.setFundraiserRequest(fundraiser);
            donation.setPaymentMode(PaymentMode.ONLINE);
            donation.setPaymentReference(paymentId);
            donationRepository.save(donation);

            fundraiser.setCollectedAmount(fundraiser.getCollectedAmount().add(amount));
            requestRepository.save(fundraiser);

            return ResponseEntity.ok("Donation recorded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error recording donation: " + e.getMessage());
        }
    }
}
