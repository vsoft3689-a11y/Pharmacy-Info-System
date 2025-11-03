package com.pharmacy.PharmacyInfoSystem.controller;

import com.pharmacy.PharmacyInfoSystem.entity.Sale;
import com.pharmacy.PharmacyInfoSystem.entity.User;
import com.pharmacy.PharmacyInfoSystem.repository.*;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

//    @Autowired
//    private UserService userService;
//    @Autowired
//    private JwtUtil jwtUtil;
//    @Autowired
//    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Validate incoming data
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be empty");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }

        // Encrypt password safely
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // Default role (optional)
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_PHARMACIST");
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
//            String token = jwtUtil.generateToken(existingUser.getUsername(), existingUser.getRole());
            String token = "token";
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", existingUser.getEmail(),
                    "role", existingUser.getRole(),
                    "userId", existingUser.getId()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping("/admin/summary")
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalMedicines = medicineRepository.count();
        long totalPharmacists = pharmacistRepository.count();
        long totalSuppliers = supplierRepository.count();
        long pendingOrders = orderRepository.countByStatus("PENDING");
        long deliveredOrders = orderRepository.countByStatus("DELIVERED");

        // Calculate today’s total sales
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        double totalSales = saleRepository.findTotalSalesAmount();
        double todaySales = saleRepository.findAll().stream()
                .filter(s -> s.getSaleDate() != null &&
                        !s.getSaleDate().isBefore(startOfDay) &&
                        !s.getSaleDate().isAfter(endOfDay))
                .mapToDouble(Sale::getTotalAmount)
                .sum();

        summary.put("totalMedicines", totalMedicines);
        summary.put("totalPharmacists", totalPharmacists);
        summary.put("totalSuppliers", totalSuppliers);
        summary.put("pendingOrders", pendingOrders);
        summary.put("deliveredOrders", deliveredOrders);
        summary.put("todaySales", todaySales);
        summary.put("totalSales",totalSales);

        return summary;
    }

    // Request reset link
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        Optional<User> optional = userRepository.findByEmail(email);
        if (optional.isEmpty()) {
            return "No user found with this email";
        }

        User user = optional.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        String resetUrl = "http://localhost:5173/reset-password?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // 👇 Set custom sender name
            helper.setFrom("konda.mahesh1250@gmail.com", "Pharmacy Information System");

            helper.setTo(user.getEmail());
            helper.setSubject("Password Reset Request - Pharmacy Information System");

            String htmlContent = """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; 
                            border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
                    <h2 style="color: #2E86C1;">Password Reset Request</h2>
                    <p>Hello <strong>%s</strong>,</p>
                    <p>You requested a password reset for your <strong>Pharmacy Information System</strong> account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" 
                           style="background-color: #2E86C1; color: white; padding: 12px 25px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                           Reset Password
                        </a>
                    </div>
                    <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                    <p style="word-wrap: break-word;"><a href="%s">%s</a></p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 13px; color: #777;">If you didn’t request this, please ignore this email.</p>
                    <p style="font-size: 13px; color: #999;">— Pharmacy Information System</p>
                </div>
            </body>
            </html>
        """.formatted(user.getName(), resetUrl, resetUrl, resetUrl);

            helper.setText(htmlContent, true); // Enable HTML content
            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
            return "Error sending email.";
        }

        return "Password reset link sent to your email.";
    }

    // Reset password
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<User> optional = userRepository.findByResetToken(token);
        if (optional.isEmpty()) {
            return "Invalid or expired token.";
        }

        User user = optional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);

        return "Password successfully updated.";
    }
}
