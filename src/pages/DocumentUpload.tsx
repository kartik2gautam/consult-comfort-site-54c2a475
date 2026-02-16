import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, CheckCircle2, ArrowLeft, ArrowRight, FileText } from "lucide-react";

declare global {
  interface Window {
    Stripe: any;
  }
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1); // 1: select type, 2: upload, 3: review, 4: payment, 5: confirmation
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadId, setUploadId] = useState("");

  const DOCUMENT_TYPES = [
    { id: "prescription", label: "Prescription", icon: FileText },
    { id: "medical-report", label: "Medical Report", icon: FileText },
    { id: "lab-test", label: "Lab Test Results", icon: FileText },
    { id: "imaging", label: "Imaging (CT/X-Ray/MRI)", icon: FileText },
    { id: "discharge-summary", label: "Discharge Summary", icon: FileText },
    { id: "other", label: "Other Medical Document", icon: FileText },
  ];

  const FEES = {
    prescription: 100,
    "medical-report": 200,
    "lab-test": 150,
    imaging: 300,
    "discharge-summary": 200,
    other: 150,
  };

  const currentFee = (FEES[documentType as keyof typeof FEES] || 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const validFiles = newFiles.filter((file) => {
      if (!["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast({ title: "Error", description: `Invalid file type: ${file.name}` });
        return false;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast({ title: "Error", description: `File too large: ${file.name}` });
        return false;
      }
      return true;
    });
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmitDocuments = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", documentType);
      formData.append("description", description);
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await fetch(`${BACKEND_URL}/api/document-upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUploadId(data.id);
      setStep(4);
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      setPaymentProcessing(true);

      // Create payment intent
      const intentRes = await fetch(`${BACKEND_URL}/api/payment/stripe/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentFee,
          type: "document-upload",
          refId: uploadId
        })
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) throw new Error(intentData.message);

      const { clientSecret } = intentData;

      // Load Stripe
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
      script.onload = async () => {
        const stripe = window.Stripe(STRIPE_PUB_KEY);
        const elements = stripe.elements();
        const cardElement = elements.create("card");

        const modal = document.createElement("div");
        modal.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999";
        modal.innerHTML = `
          <div style="background:white;padding:40px;border-radius:8px;max-width:400px;width:100%;">
            <h2 style="margin:0 0 20px 0;font-size:24px;">Enter Card Details</h2>
            <div id="card-element" style="border:1px solid #ccc;padding:10px;border-radius:4px;margin-bottom:20px;"></div>
            <div id="card-errors" style="color:red;margin-bottom:10px;"></div>
            <button id="pay-btn" style="width:100%;padding:10px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">Pay ₹${currentFee}</button>
          </div>
        `;
        document.body.appendChild(modal);

        cardElement.mount("#card-element");

        const payBtn = modal.querySelector("#pay-btn") as HTMLButtonElement;
        const cardErrors = modal.querySelector("#card-errors") as HTMLDivElement;

        payBtn.onclick = async () => {
          payBtn.disabled = true;
          payBtn.textContent = "Processing...";

          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement }
          });

          if (error) {
            cardErrors.textContent = error.message;
            payBtn.disabled = false;
            payBtn.textContent = `Pay ₹${currentFee}`;
          } else if (paymentIntent.status === "succeeded") {
            const verifyRes = await fetch(`${BACKEND_URL}/api/payment/stripe/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.id,
                type: "document-upload",
                refId: uploadId
              })
            });

            if (verifyRes.ok) {
              modal.remove();
              setStep(5);
              toast({
                title: "Success",
                description: "Documents uploaded and payment completed successfully!"
              });
            } else {
              cardErrors.textContent = "Verification failed";
              payBtn.disabled = false;
              payBtn.textContent = `Pay ₹${currentFee}`;
            }
          }
        };
      };
      document.head.appendChild(script);
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Upload Medical Documents
          </h1>
          <p className="text-white/80">Upload your medical documents for secure storage and consultation</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[
                  { num: 1, label: "Document Type" },
                  { num: 2, label: "Upload Files" },
                  { num: 3, label: "Review" },
                  { num: 4, label: "Payment" },
                  { num: 5, label: "Confirmation" },
                ].map((s, idx) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step > s.num
                          ? "bg-gold text-white"
                          : step === s.num
                          ? "bg-primary text-white ring-4 ring-primary/30"
                          : "bg-border text-muted-foreground"
                      }`}
                    >
                      {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                    </div>
                    {idx < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded ${
                          step > s.num ? "bg-gold" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Type</span>
                <span>Upload</span>
                <span>Review</span>
                <span>Payment</span>
                <span>Confirmation</span>
              </div>
            </div>

            {/* Step 1: Select Document Type */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Document Type</CardTitle>
                  <CardDescription>Choose the type of medical document you want to upload</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {DOCUMENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const fee = FEES[type.id as keyof typeof FEES];
                      return (
                        <div
                          key={type.id}
                          onClick={() => setDocumentType(type.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            documentType === type.id
                              ? "border-gold bg-gold/5"
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-primary mb-2" />
                          <h3 className="font-semibold text-sm">{type.label}</h3>
                          <p className="text-xs text-gold font-semibold mt-2">₹{fee}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Upload Files */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Medical Documents</CardTitle>
                  <CardDescription>Upload your {DOCUMENT_TYPES.find(d => d.id === documentType)?.label || "medical documents"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Description / Remarks</label>
                      <textarea
                        placeholder="Add any relevant information about these documents..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3">Upload Files *</label>
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                        <Upload className="w-10 h-10 mx-auto mb-3 text-primary/60" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          PDF, JPG, PNG (Max 15MB each)
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="file-input"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("file-input")?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>

                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-semibold text-muted-foreground">
                            {files.length} file(s) selected
                          </p>
                          {files.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-3 bg-muted rounded-lg"
                            >
                              <span className="text-sm truncate">{file.name}</span>
                              <button 
                                onClick={() => removeFile(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Upload</CardTitle>
                  <CardDescription>Please verify all details before proceeding to payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold">Upload Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Document Type:</span>
                          <span>{DOCUMENT_TYPES.find(d => d.id === documentType)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Files:</span>
                          <span>{files.length} file(s)</span>
                        </div>
                        {description && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Description:</span>
                            <span>{description.substring(0, 30)}...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold">Files</h3>
                      <ul className="space-y-1 text-sm">
                        {files.map((file, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-primary">•</span>
                            <span className="truncate">{file.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">Total Fee:</span> ₹{currentFee}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Your documents will be securely stored and accessible for consultations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Complete Payment</CardTitle>
                  <CardDescription>Secure payment via Stripe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Document Type:</span>
                        <span className="font-semibold">{DOCUMENT_TYPES.find(d => d.id === documentType)?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Files Uploaded:</span>
                        <span className="font-semibold">{files.length}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-gold">₹{currentFee}</span>
                      </div>
                    </div>

                    <Button
                      variant="gold"
                      onClick={handleStripePayment}
                      disabled={paymentProcessing}
                      className="w-full py-6 text-lg"
                    >
                      {paymentProcessing ? "Processing..." : `Pay ₹${currentFee} with Stripe`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Your payment is secure and encrypted. We accept Visa, Mastercard, and American Express.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Documents Uploaded Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="inline-block p-4 bg-gold/10 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-gold" />
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 space-y-3 text-left">
                    <h3 className="font-semibold">Upload Confirmation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Document Type:</span>
                        <span>{DOCUMENT_TYPES.find(d => d.id === documentType)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Files:</span>
                        <span>{files.length} file(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upload ID:</span>
                        <span className="font-mono">{uploadId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid:</span>
                        <span className="font-semibold">₹{currentFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      Your documents have been securely uploaded and stored. You can access and share them with doctors during consultations.
                    </p>
                  </div>

                  <Button
                    variant="gold"
                    onClick={() => navigate("/")}
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                {step < 4 && (
                  <Button
                    variant="gold"
                    onClick={() => {
                      if (step === 1 && !documentType) {
                        toast({ title: "Error", description: "Please select a document type" });
                        return;
                      }
                      if (step === 2 && files.length === 0) {
                        toast({ title: "Error", description: "Please upload at least one document" });
                        return;
                      }
                      if (step === 3) {
                        handleSubmitDocuments();
                      } else {
                        setStep(step + 1);
                      }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {step === 3 ? "Proceed to Payment" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DocumentUpload;
