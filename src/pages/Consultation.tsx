import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Video, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

declare global {
  interface Window {
    Stripe: any;
  }
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

interface ConsultationType {
  type: "voice" | "video";
  label: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CONSULTATION_TYPES: ConsultationType[] = [
  {
    type: "voice",
    label: "Voice Call Consultation",
    price: 500,
    duration: "20-30 minutes",
    icon: Phone,
  },
  {
    type: "video",
    label: "Video Call Consultation",
    price: 800,
    duration: "30 minutes",
    icon: Video,
  },
];

const Consultation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1); // 1: consultation type, 2: doctor, 3: date/time, 4: patient info, 5: payment, 6: confirmation
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  
  const [consultationType, setConsultationType] = useState<"voice" | "video" | "">("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    symptoms: "",
  });

  const [consultationId, setConsultationId] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const currentPrice = CONSULTATION_TYPES.find(c => c.type === consultationType)?.price || 0;
  const selectedDoctorInfo = doctors.find(d => d.doctorId === selectedDoctor);

  // Load doctors
  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/consultation/doctors`);
        const data = await res.json();
        setDoctors(data);
      } catch (err: any) {
        toast({ title: "Error", description: "Failed to load doctors" });
      }
    }
    loadDoctors();
  }, []);

  // Load slots when doctor and date selected
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    async function loadSlots() {
      try {
        setLoading(true);
        const res = await fetch(
          `${BACKEND_URL}/api/consultation/slots?doctorId=${selectedDoctor}&date=${selectedDate}`
        );
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err: any) {
        toast({ title: "Error", description: "Failed to load slots" });
      } finally {
        setLoading(false);
      }
    }
    loadSlots();
  }, [selectedDoctor, selectedDate]);

  const handleContinue = async () => {
    if (step === 1 && !consultationType) {
      toast({ title: "Error", description: "Please select consultation type" });
      return;
    }
    if (step === 2 && !selectedDoctor) {
      toast({ title: "Error", description: "Please select a doctor" });
      return;
    }
    if (step === 3 && (!selectedDate || !selectedSlot)) {
      toast({ title: "Error", description: "Please select date and time" });
      return;
    }
    if (step === 4) {
      if (!formData.patientName || !formData.phone || !formData.symptoms) {
        toast({ title: "Error", description: "Please fill required fields" });
        return;
      }
      // Book consultation
      await bookConsultation();
      return;
    }
    setStep(step + 1);
  };

  const bookConsultation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/consultation/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          patientName: formData.patientName,
          phone: formData.phone,
          email: formData.email,
          symptoms: formData.symptoms,
          date: selectedDate,
          timeSlot: selectedSlot,
          consultationType: consultationType,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      setConsultationId(data.id);
      setStep(5);
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
          amount: currentPrice,
          type: "consultation",
          refId: consultationId
        })
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) throw new Error(intentData.message);

      const { clientSecret } = intentData;

      // Load Stripe.js
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
      script.onload = async () => {
        const stripe = window.Stripe(STRIPE_PUB_KEY);
        const elements = stripe.elements();
        const cardElement = elements.create("card");

        // Create modal for card input
        const modal = document.createElement("div");
        modal.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999";
        modal.innerHTML = `
          <div style="background:white;padding:40px;border-radius:8px;max-width:400px;width:100%;">
            <h2 style="margin:0 0 20px 0;font-size:24px;">Enter Card Details</h2>
            <div id="card-element" style="border:1px solid #ccc;padding:10px;border-radius:4px;margin-bottom:20px;"></div>
            <div id="card-errors" style="color:red;margin-bottom:10px;"></div>
            <button id="pay-btn" style="width:100%;padding:10px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">Pay ₹${currentPrice}</button>
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
            payBtn.textContent = `Pay ₹${currentPrice}`;
          } else if (paymentIntent.status === "succeeded") {
            // Verify with backend
            const verifyRes = await fetch(`${BACKEND_URL}/api/payment/stripe/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.id,
                type: "consultation",
                refId: consultationId
              })
            });

            if (verifyRes.ok) {
              modal.remove();
              setStep(6);
              toast({
                title: "Success",
                description: "Consultation booked successfully!"
              });
            } else {
              cardErrors.textContent = "Verification failed";
              payBtn.disabled = false;
              payBtn.textContent = `Pay ₹${currentPrice}`;
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
            Book a Consultation
          </h1>
          <p className="text-white/80">Get expert medical advice from our specialists</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[
                  { num: 1, label: "Type" },
                  { num: 2, label: "Doctor" },
                  { num: 3, label: "Date & Time" },
                  { num: 4, label: "Patient Info" },
                  { num: 5, label: "Payment" },
                  { num: 6, label: "Confirmation" },
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
                    {idx < 5 && (
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
                <span>Doctor</span>
                <span>Date & Time</span>
                <span>Patient Info</span>
                <span>Payment</span>
                <span>Confirmation</span>
              </div>
            </div>

            {/* Step 1: Consultation Type */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Consultation Type</CardTitle>
                  <CardDescription>Choose how you want to consult with our doctors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {CONSULTATION_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.type}
                          onClick={() => setConsultationType(type.type)}
                          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            consultationType === type.type
                              ? "border-gold bg-gold/5"
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <Icon className="w-8 h-8 text-primary mb-3" />
                          <h3 className="font-semibold text-lg mb-2">{type.label}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{type.duration}</p>
                          <div className="text-2xl font-bold text-gold">₹{type.price}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Doctor */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Doctor</CardTitle>
                  <CardDescription>Choose from our specialist doctors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {doctors.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Loading doctors...</p>
                    ) : (
                      doctors.map((doc) => (
                        <div
                          key={doc.doctorId}
                          onClick={() => setSelectedDoctor(doc.doctorId)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedDoctor === doc.doctorId
                              ? "border-gold bg-gold/5"
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{doc.name}</h3>
                              <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                              {doc.experience && (
                                <p className="text-xs text-muted-foreground mt-1">{doc.experience}</p>
                              )}
                            </div>
                            {selectedDoctor === doc.doctorId && (
                              <Badge variant="default" className="bg-gold">Selected</Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Select Date & Time */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>Choose your preferred appointment slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3">Preferred Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedSlot("");
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-semibold mb-3">Time Slot</label>
                        {loading ? (
                          <p className="text-center text-muted-foreground py-8">Loading available slots...</p>
                        ) : slots.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">No slots available for this date</p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {slots.map((slot) => (
                              <button
                                key={slot.time}
                                onClick={() => !slot.isBooked && setSelectedSlot(slot.time)}
                                disabled={slot.isBooked}
                                className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                                  slot.isBooked
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-border"
                                    : selectedSlot === slot.time
                                    ? "bg-gold text-white border-gold"
                                    : "border-border hover:border-gold"
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Patient Information */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Please provide your details for the consultation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone *</label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Symptoms *</label>
                      <textarea
                        placeholder="Describe your symptoms in detail..."
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Payment */}
            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Complete Payment</CardTitle>
                  <CardDescription>Secure payment via Stripe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Consultation Type:</span>
                        <span className="font-semibold">
                          {CONSULTATION_TYPES.find(c => c.type === consultationType)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Doctor:</span>
                        <span className="font-semibold">{selectedDoctorInfo?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Date & Time:</span>
                        <span className="font-semibold">{selectedDate} at {selectedSlot}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-gold">₹{currentPrice}</span>
                      </div>
                    </div>

                    <Button
                      variant="gold"
                      onClick={handleStripePayment}
                      disabled={paymentProcessing}
                      className="w-full py-6 text-lg"
                    >
                      {paymentProcessing ? "Processing..." : `Pay ₹${currentPrice} with Stripe`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Your payment is secure and encrypted. We accept Visa, Mastercard, and American Express.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Consultation Booked Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="inline-block p-4 bg-gold/10 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-gold" />
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 space-y-3 text-left">
                    <h3 className="font-semibold">Consultation Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{CONSULTATION_TYPES.find(c => c.type === consultationType)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doctor:</span>
                        <span>{selectedDoctorInfo?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date & Time:</span>
                        <span>{selectedDate} at {selectedSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confirmation ID:</span>
                        <span className="font-mono">{consultationId}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>
                  </p>

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
            {step < 6 && (
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
                {step < 5 && (
                  <Button
                    variant="gold"
                    onClick={handleContinue}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    Continue
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

export default Consultation;
