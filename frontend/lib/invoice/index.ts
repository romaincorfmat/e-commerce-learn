import { toast } from "sonner";

export const downloadInvoice = async (orderId: string) => {
  try {
    const response = await fetch("/api/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to download invoice");
      return {
        success: false,
        message: error.message || "Failed to download invoice",
      };
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;

    document.body.appendChild(a);

    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return {
      success: true,
      message: "Invoice downloaded successfully",
    };
  } catch (error) {
    toast.error("Failed to download invoice");
    return {
      success: false,
      message: "Failed to download invoice",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};
