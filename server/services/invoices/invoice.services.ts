import PDFDocument from "pdfkit";
import { Response } from "express";
import { InvoiceOrder } from "../../types/invoice";

export const generateInvoicePDF = async (
  order: InvoiceOrder,
  res: Response
) => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Add invoice title
  doc.fontSize(25).text("INVOICE", { align: "center" });
  doc.moveDown();

  // Add invoice metadata
  doc.fontSize(12);
  doc.text(`Invoice Number: INV-${order._id}`, 50, 160);
  doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 50, 180);
  doc.text(`Order Status: ${order.status}`, 50, 200);
  doc.moveDown();

  // Add customer information
  doc.text("Customer Information:", 50, 230);
  if (order.user) {
    if (typeof order.user === "object") {
      doc.text(`Name: ${order.user.name || "N/A"}`);
      doc.text(`Email: ${order.user.email || "N/A"}`);
    } else {
      doc.text(`Customer ID: ${order.user}`);
    }
  }
  doc.moveDown();

  // Add table headers
  const tableTop = 300;
  doc.font("Helvetica-Bold");
  doc.text("Item", 50, tableTop);
  doc.text("Quantity", 250, tableTop);
  doc.text("Unit Price", 350, tableTop);
  doc.text("Amount", 450, tableTop);

  // Add table content
  let tablePosition = tableTop + 20;
  doc.font("Helvetica");

  order.items.forEach((item) => {
    const productName = item.product.name;

    doc.text(productName, 50, tablePosition);
    doc.text(
      Number(item.productVariant.quantity).toFixed(2),
      250,
      tablePosition
    );
    doc.text(
      `$${(item.totalPrice / item.productVariant.quantity).toFixed(2)}`,
      350,
      tablePosition
    );
    doc.text(`$${item.totalPrice.toFixed(2)}`, 450, tablePosition);
    doc
      .moveTo(50, tablePosition + 20)
      .lineTo(550, tablePosition + 20)
      .strokeColor("#000")
      .stroke();
    tablePosition += 35;
  });

  // Add total

  doc.font("Helvetica-Bold").fontSize(16);
  doc.text("Total:", 350, tablePosition + 40);
  doc.text(`$${order.totalPrice.toFixed(2)}`, 450, tablePosition + 40);

  // Add footer
  doc.fontSize(10).text("Thank you for your purchase!", 50, 700, {
    align: "center",
    width: 500,
  });

  // Finalize the PDF
  doc.end();
};
