import { API_BASE_URL } from "@/config/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.pathname.split("/").pop();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
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
        },
        { status: response.status }
      );
    }

    const pdfData = await response.arrayBuffer();

    return new NextResponse(pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${orderId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error downloading invoice", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function downloadInvoice(orderId: string) {
  try {
    window.open(`${API_BASE_URL}/api/v1/orders/invoices/${orderId}`, "_blank");

    return {
      success: true,
      message: "Invoice downloaded successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to download invoice",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
