package com.pharmacy.PharmacyInfoSystem.controller;

import com.pharmacy.PharmacyInfoSystem.entity.Medicine;
import com.pharmacy.PharmacyInfoSystem.entity.Order;
import com.pharmacy.PharmacyInfoSystem.entity.Pharmacist;
import com.pharmacy.PharmacyInfoSystem.repository.MedicineRepository;
import com.pharmacy.PharmacyInfoSystem.repository.OrderRepository;
import com.pharmacy.PharmacyInfoSystem.repository.PharmacistRepository;
import com.pharmacy.PharmacyInfoSystem.repository.SupplierRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/all")
    private List<Order> getAllPharmacists(){
        return orderRepository.findAll();
    }

    // 📦 Create new order (pharmacist request)
    @PostMapping("/request")
    public ResponseEntity<?> createOrder(@RequestBody Order orderRequest) {

        Long pharmacistId = orderRequest.getPharmacist().getId();
        Long supplierId = orderRequest.getSupplier().getId();

        if (!supplierRepository.existsById(supplierId) || !pharmacistRepository.existsById(pharmacistId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid Supplier or Pharmacist ID");
        }

        Order order = new Order();
        order.setPharmacist(pharmacistRepository.findById(pharmacistId).orElse(null));
        order.setSupplier(supplierRepository.findById(supplierId).orElse(null));
        order.setMedicineId(orderRequest.getMedicineId());
        order.setMedicineName(orderRequest.getMedicineName());
        order.setQuantity(orderRequest.getQuantity());
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        orderRepository.save(order);

//        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
//
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//            // 👇 Set custom sender name
//            helper.setFrom("konda.mahesh1250@gmail.com", "Pharmacy Information System");
//
//            helper.setTo(user.getEmail());
//            helper.setSubject("Password Reset Request - Pharmacy Information System");
//
//            String htmlContent = """
//            <html>
//            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
//                <div style="max-width: 600px; margin: 0 auto; background-color: white;
//                            border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
//                    <h2 style="color: #2E86C1;">Password Reset Request</h2>
//                    <p>Hello <strong>%s</strong>,</p>
//                    <p>You requested a password reset for your <strong>Pharmacy Information System</strong> account.</p>
//                    <p>Click the button below to reset your password:</p>
//                    <div style="text-align: center; margin: 30px 0;">
//                        <a href="%s"
//                           style="background-color: #2E86C1; color: white; padding: 12px 25px;
//                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
//                           Reset Password
//                        </a>
//                    </div>
//                    <p>If the button doesn’t work, copy and paste this link into your browser:</p>
//                    <p style="word-wrap: break-word;"><a href="%s">%s</a></p>
//                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
//                    <p style="font-size: 13px; color: #777;">If you didn’t request this, please ignore this email.</p>
//                    <p style="font-size: 13px; color: #999;">— Pharmacy Information System</p>
//                </div>
//            </body>
//            </html>
//        """.formatted(user.getName(), resetUrl, resetUrl, resetUrl);
//
//            helper.setText(htmlContent, true); // Enable HTML content
//            mailSender.send(message);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Error sending email.";
//        }

        return ResponseEntity.ok(Map.of(
                "message", "Order created successfully",
                "order", order
        ));
    }

    // 🧾 Fetch orders by supplier
    @GetMapping("/by-supplier/{supplierId}")
    public List<Order> getOrdersBySupplier(@PathVariable Long supplierId) {
        return orderRepository.findBySupplierId(supplierId);
    }

    // 🧾 Fetch orders by pharmacist
    @GetMapping("/by-pharmacist/{pharmacistId}")
    public List<Order> getOrdersByPharmacist(@PathVariable Long pharmacistId) {
        return orderRepository.findByPharmacistId(pharmacistId);
    }

    // 🚚 Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Object> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestBody Order updatedOrder) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(updatedOrder.getStatus());
                    orderRepository.save(order);

                    // If delivered, update medicine stock
                    if ("DELIVERED".equalsIgnoreCase(updatedOrder.getStatus())) {
                        Medicine medicine = medicineRepository
                                .findByNameAndSupplierId(order.getMedicineName(), order.getSupplier().getId())
                                .orElse(null);
                        if (medicine != null) {
                            medicine.setQuantity(medicine.getQuantity() + order.getQuantity());
                            medicineRepository.save(medicine);
                        }
                    }

                    return ResponseEntity.ok((Object) order);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found"));
    }
}
