// frontend/app/api/invoices/[orderId]/route.ts
import { API_BASE_URL } from "@/config/env";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
          error: { message: "Missing order ID" },
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/invoices/${orderId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to download invoice: ${response.status} ${response.statusText}`,
          error: { message: "API request failed" },
        },
        { status: response.status }
      );
    }

    // Get the PDF data as array buffer
    const pdfData = await response.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${orderId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
