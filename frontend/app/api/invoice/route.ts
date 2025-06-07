import { API_BASE_URL } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

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

    const cookieHeader = request.headers.get("cookie");

    const headers = new Headers();
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }
    headers.set("Content-Type", "application/json");

    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/invoices/${orderId}`,
      {
        method: "GET",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      console.error(
        `Invoice download failed: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Failed to download invoice: ${response.status} ${response.statusText}`,
          error: { message: "API request failed" },
        },
        { status: response.status }
      );
    }

    const pdfData = await response.arrayBuffer();

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
