package com.pharmacy.PharmacyInfoSystem.controller;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.pharmacy.PharmacyInfoSystem.entity.Sale;
import com.pharmacy.PharmacyInfoSystem.entity.SaleItem;
import com.pharmacy.PharmacyInfoSystem.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/bill")
@CrossOrigin
public class BillController {

    @Autowired
    private SaleRepository saleRepository;

    @GetMapping("/{saleId}/pdf")
    public ResponseEntity<byte[]> generateBillPdf(@PathVariable Long saleId) {
        Sale sale = saleRepository.findById(saleId).orElse(null);
        if (sale == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(("Sale ID " + saleId + " not found").getBytes());
        }

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font subTitleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

            // Header
            Paragraph header = new Paragraph("🧾 Pharmacy Invoice", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            document.add(new Paragraph("------------------------------------------------------------"));
            document.add(new Paragraph(" "));

            // Sale Info
            document.add(new Paragraph("Patient Name: " + sale.getPatientName(), normalFont));
            document.add(new Paragraph("Pharmacist: " + sale.getPharmacist().getName(), normalFont));
            document.add(new Paragraph("Date: " + sale.getSaleDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
            document.add(new Paragraph("Invoice ID: " + sale.getId(), normalFont));
            document.add(new Paragraph(" "));

            // Medicine Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 3f, 1.5f, 1.5f, 1.5f});

            addTableHeader(table, "S.No");
            addTableHeader(table, "Medicine Name");
            addTableHeader(table, "Quantity");
            addTableHeader(table, "Price (₹)");
            addTableHeader(table, "Subtotal (₹)");

            int count = 1;
            for (SaleItem item : sale.getSaleItems()) {
                table.addCell(String.valueOf(count++));
                table.addCell(item.getMedicine().getName());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(String.format("%.2f", item.getPrice()));
                table.addCell(String.format("%.2f", item.getPrice() * item.getQuantity()));
            }

            document.add(table);

            // Total Section
            document.add(new Paragraph(" "));
            Paragraph total = new Paragraph("Total Amount: ₹" + String.format("%.2f", sale.getTotalAmount()), subTitleFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.add(new Paragraph(" "));
            Paragraph thanks = new Paragraph("Thank you for visiting our pharmacy! Stay healthy ❤️", normalFont);
            thanks.setAlignment(Element.ALIGN_CENTER);
            document.add(thanks);

            document.close();

            // Prepare PDF response
            byte[] pdfBytes = out.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "Invoice_" + saleId + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(("Error generating PDF: " + e.getMessage()).getBytes());
        }
    }

    // Helper for header styling
    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(BaseColor.LIGHT_GRAY);
        header.setBorderWidth(1);
        header.setPhrase(new Phrase(headerTitle, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(header);
    }
}
