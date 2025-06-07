import PDFDocument from "pdfkit";
import { Response } from "express";
import { InvoiceOrder, PopulatedOrderItem } from "../../types/invoice";
import { CustomError } from "../../types/error";

export const generateInvoicePDF = async (
  order: InvoiceOrder,
  res: Response
) => {
  if (!order || !order.items || !order.user || order.items.length === 0) {
    throw new CustomError("Order not found", 404);
  }

  // Create a new PDF document with better margins
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
    info: {
      Title: `Invoice-${order._id}`,
      Author: "Your Company Name",
    },
  });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Define colors and styles
  const primaryColor = "#4f4f4f";
  const secondaryColor = "#777777";
  const accentColor = "#2980b9";
  const tableLineColor = "#e0e0e0";

  // Helper function to draw a horizontal line
  const drawHorizontalLine = (y: number) => {
    doc
      .strokeColor(tableLineColor)
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  };

  const logoPath = "./assets/logo.png";
  doc.image(logoPath, 50, 35, { width: 80 });

  // Add invoice title with a better style - moved to the right side to avoid overlap with logo
  doc
    .fillColor(accentColor)
    .fontSize(28)
    .font("Helvetica-Bold")
    .text("INVOICE", 350, 60, { align: "right" });

  // Add invoice metadata in a better format
  const metadataTop = 120;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(primaryColor)
    .text("INVOICE NUMBER", 50, metadataTop)
    .font("Helvetica")
    .fontSize(10)
    .text(`INV-${order._id}`, 50, metadataTop + 15)
    .font("Helvetica-Bold")
    .text("DATE", 50, metadataTop + 40)
    .font("Helvetica")
    .text(
      `${new Date(order.orderDate).toLocaleDateString()}`,
      50,
      metadataTop + 55
    )
    .font("Helvetica-Bold")
    .text("STATUS", 50, metadataTop + 80)
    .font("Helvetica")
    .text(`${order.status}`, 50, metadataTop + 95);

  // Add customer information in a better layout
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("BILL TO", 300, metadataTop)
    .font("Helvetica")
    .fontSize(10)
    .text(`${order.user.name || "N/A"}`, 300, metadataTop + 15)
    .text(`${order.user.email || "N/A"}`, 300, metadataTop + 30);

  // You can add additional customer information here if needed
  // For example, if you extend your PopulatedUser type with address

  // Draw a horizontal line before the table
  const tableTop = 250;
  drawHorizontalLine(tableTop - 10);

  // Add table headers with better formatting
  doc.font("Helvetica-Bold").fontSize(10).fillColor(primaryColor);

  // Define column positions
  const itemX = 50;
  const quantityX = 280;
  const unitPriceX = 350;
  const amountX = 450;

  // Table headers with background
  doc.fillColor(accentColor).rect(itemX, tableTop, 500, 20).fill();

  doc
    .fillColor("#ffffff")
    .text("Item", itemX + 10, tableTop + 5)
    .text("Quantity", quantityX, tableTop + 5)
    .text("Unit Price", unitPriceX, tableTop + 5)
    .text("Amount", amountX, tableTop + 5);

  // Add table content with better spacing and formatting
  let tablePosition = tableTop + 30;
  doc.font("Helvetica").fontSize(10).fillColor(primaryColor);

  // Function to create a table row with proper alignment
  const createTableRow = (item: PopulatedOrderItem, position: number) => {
    const productName = item.product.name;
    const quantity = Number(item.productVariant.quantity).toFixed(2);
    const unitPrice =
      item.productVariant.quantity > 0
        ? (item.totalPrice / item.productVariant.quantity).toFixed(2)
        : "0.00";
    const amount = item.totalPrice.toFixed(2);

    // Add alternating row background for better readability
    if (((position - tableTop - 30) / 35) % 2 === 0) {
      doc
        .fillColor("#f9f9f9")
        .rect(itemX, position - 5, 500, 25)
        .fill();
    }

    doc
      .fillColor(primaryColor)
      .text(productName, itemX + 10, position, { width: 200 })
      .text(quantity, quantityX, position, { width: 60, align: "center" })
      .text(`$${unitPrice}`, unitPriceX, position, {
        width: 80,
        align: "right",
      })
      .text(`$${amount}`, amountX, position, { width: 80, align: "right" });

    // Draw a subtle line after each row
    drawHorizontalLine(position + 20);

    return position + 35;
  };

  // Create table rows for each item
  order.items.forEach((item) => {
    tablePosition = createTableRow(item, tablePosition);
  });

  // Add totals section with better formatting
  const totalsY = tablePosition + 20;

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Subtotal:", 350, totalsY, { width: 100, align: "right" })
    .text(`$${order.totalPrice.toFixed(2)}`, 450, totalsY, {
      width: 100,
      align: "right",
    });

  // You can add tax and discount information here
  // To do this, extend the InvoiceOrder interface with tax and discount properties

  // Draw a line before the total
  drawHorizontalLine(totalsY + 65);

  // Add the total amount with emphasis
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(accentColor)
    .text("Total:", 350, totalsY + 75, { width: 100, align: "right" })
    .text(`$${order.totalPrice.toFixed(2)}`, 450, totalsY + 75, {
      width: 100,
      align: "right",
    });

  // Add payment information
  const paymentInfoY = totalsY + 120;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(primaryColor)
    .text("Payment Information", 50, paymentInfoY);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Please include the invoice number with your payment.",
      50,
      paymentInfoY + 20
    )
    .text("Payment is due within 30 days.", 50, paymentInfoY + 35);

  // Add footer with company information
  const footerY = 700;
  drawHorizontalLine(footerY - 10);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(secondaryColor)
    .text("Thank you for your business!", 50, footerY, { align: "center" })
    .text(
      "ShopOnline Inc. | 123 Business Street, City, State ZIP | Phone: 0439 456 7890 | Email: contact@example.com",
      50,
      footerY + 20,
      {
        align: "center",
        width: 500,
      }
    );

  // Finalize the PDF
  doc.end();
};
