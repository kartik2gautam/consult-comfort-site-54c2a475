export type RazorpayOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export async function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if ((window as any).Razorpay) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

export interface RazorpayPaymentOptions {
  amount: number;
  type: "consultation" | "second-opinion" | "document-upload";
  refId: string;
  name: string;
  description: string;
  email?: string;
  phone?: string;
  onSuccess: () => void;
  onError: (err: Error) => void;
  backendUrl: string;
}

export async function startRazorpayPayment(options: RazorpayPaymentOptions) {
  const { amount, type, refId, name, description, email, phone, onSuccess, onError, backendUrl } = options;

  try {
    const orderRes = await fetch(`${backendUrl}/api/payment/razorpay/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, type, refId }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.message || "Failed to create Razorpay order");

    await loadRazorpayScript();

    const razorpayOptions: any = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name,
      description,
      order_id: orderData.orderId,
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch(`${backendUrl}/api/payment/razorpay/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              type,
              refId,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed");

          onSuccess();
        } catch (err: any) {
          onError(err);
        }
      },
      prefill: {
        email: email || "",
        contact: phone || "",
      },
      theme: {
        color: "#EAB308",
      },
    };

    const razorpay = new (window as any).Razorpay(razorpayOptions);
    razorpay.open();
  } catch (err: any) {
    onError(err);
  }
}
