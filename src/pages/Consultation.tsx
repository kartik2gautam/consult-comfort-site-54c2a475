import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Video, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import ConsentForm from "@/components/ConsentForm";
import { Badge } from "@/components/ui/badge";
import { doctors as clinicDoctors } from "@/data/clinic-data";

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

  const [step, setStep] = useState(1); // 1: doctor, 2: date/time, 3: patient info, 4: consent, 5: payment, 6: confirmation
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  
  // default type since selection step removed
  const [consultationType, setConsultationType] = useState<"voice" | "video" | "">("video");
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
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [consentData, setConsentData] = useState<any>(null);

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
    if (step === 1 && !selectedDoctor) {
      toast({ title: "Error", description: "Please select a doctor" });
      return;
    }
    if (step === 2 && (!selectedDate || !selectedSlot)) {
      toast({ title: "Error", description: "Please select date and time" });
      return;
    }
    if (step === 3) {
      if (!formData.patientName || !formData.phone || !formData.symptoms) {
        toast({ title: "Error", description: "Please fill required fields" });
        return;
      }
      // Book consultation
      await bookConsultation();
      return;
    }
    // If we're on consent step, open the consent modal
    if (step === 4) {
      setShowConsentForm(true);
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
      // after booking go to consent step and open modal
      setStep(4);
      setShowConsentForm(true);
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
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Book a Consultation</h1>
          <p className="text-white/80">Get expert medical advice from our specialists</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 items-start">
            {/* Stepper - vertical on md+, horizontal condensed on mobile */}
            <div className="md:col-span-1">
              <div className="hidden md:block sticky top-28 space-y-4">
                {[
                  { num: 1, label: "Doctor" },
                  { num: 2, label: "Date & Time" },
                  { num: 3, label: "Your Info" },
                  { num: 4, label: "Consent" },
                  { num: 5, label: "Payment" },
                  { num: 6, label: "Done" },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step > s.num ? 'bg-gold text-white' : step === s.num ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="md:hidden mb-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Doctor</span>
                  <span>Date</span>
                  <span>Info</span>
                  <span>Consent</span>
                  <span>Pay</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="max-w-full">
                {/* Step content cards */}
                {/* Step 1: Select Doctor */}
                {step === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select a Doctor</CardTitle>
                      <CardDescription>Choose from our specialist doctors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[60vh] overflow-y-auto">
                        {doctors.length === 0 ? (
                          <div className="col-span-full text-center text-muted-foreground py-6">Loading doctors...</div>
                        ) : (
                          doctors.map((doc) => (
                            <div
                              key={doc.doctorId}
                              onClick={() => setSelectedDoctor(doc.doctorId)}
                              className={`p-4 border rounded-xl cursor-pointer transition-shadow hover:shadow-md ${selectedDoctor === doc.doctorId ? 'border-gold bg-gold/5' : 'border-border'}`}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  {/* Doctor photo (mapped from clinic data by name) */}
                                  {(() => {
                                    const match = clinicDoctors.find((c) => c.name === doc.name);
                                    if (!match?.image) return null;
                                    return (
                                      <img
                                        src={match.image}
                                        alt={doc.name}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gold/60 shadow-sm"
                                      />
                                    );
                                  })()}
                                  <div>
                                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                                    <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                                    {doc.experience && <p className="text-xs text-muted-foreground mt-1">{doc.experience}</p>}
                                  </div>
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

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Date & Time</CardTitle>
                      <CardDescription>Choose your preferred appointment slot</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Preferred Date</label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {selectedDate && (
                          <div>
                            <label className="block text-sm font-semibold mb-2">Available Slots</label>
                            {loading ? (
                              <div className="text-center text-muted-foreground py-6">Loading available slots...</div>
                            ) : slots.length === 0 ? (
                              <div className="text-center text-muted-foreground py-4">No slots available for this date</div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {slots.map((slot) => (
                                  <button
                                    key={slot.time}
                                    onClick={() => !slot.isBooked && setSelectedSlot(slot.time)}
                                    disabled={slot.isBooked}
                                    className={`p-3 rounded-lg text-sm font-medium transition ${slot.isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : selectedSlot === slot.time ? 'bg-gold text-white' : 'border border-border hover:border-gold'}`}>
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

                {/* Step 3: Patient Information */}
                {step === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Information</CardTitle>
                      <CardDescription>Please provide your details for the consultation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Full Name *</label>
                          <input type="text" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Phone *</label>
                          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Email</label>
                          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold mb-2">Symptoms *</label>
                          <textarea value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" rows={5} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Consent */}
                {step === 4 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Consent & Legal Acknowledgement</CardTitle>
                      <CardDescription>Please review and accept the consent form before payment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-900"><strong>Important:</strong> You must accept the patient consent declaration to proceed with payment. This ensures you understand the limitations and scope of the consultation.</p>
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
                        <div className="bg-muted rounded-lg p-4 space-y-3">
                          <div className="flex justify-between text-sm"><span>Consultation Type:</span><span className="font-semibold">{CONSULTATION_TYPES.find(c => c.type === consultationType)?.label}</span></div>
                          <div className="flex justify-between text-sm"><span>Doctor:</span><span className="font-semibold">{selectedDoctorInfo?.name}</span></div>
                          <div className="flex justify-between text-sm"><span>Date & Time:</span><span className="font-semibold">{selectedDate} at {selectedSlot}</span></div>
                          <div className="border-t pt-3 flex justify-between"><span className="font-semibold">Total Amount:</span><span className="text-2xl font-bold text-gold">₹{currentPrice}</span></div>
                        </div>
                        <Button variant="gold" onClick={handleStripePayment} disabled={paymentProcessing} className="w-full py-4 text-lg">{paymentProcessing ? 'Processing...' : `Pay ₹${currentPrice}`}</Button>
                        <p className="text-xs text-muted-foreground text-center">Your payment is secure and encrypted. We accept major cards.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 6: Confirmation */}
                {step === 6 && (
                  <Card>
                    <CardHeader><CardTitle className="text-center">Consultation Booked Successfully!</CardTitle></CardHeader>
                    <CardContent className="text-center space-y-6">
                      <div className="inline-block p-4 bg-gold/10 rounded-full"><CheckCircle2 className="w-12 h-12 text-gold" /></div>
                      <div className="bg-muted rounded-lg p-4 space-y-3 text-left">
                        <h3 className="font-semibold">Consultation Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span>{CONSULTATION_TYPES.find(c=>c.type===consultationType)?.label}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Doctor:</span><span>{selectedDoctorInfo?.name}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Date & Time:</span><span>{selectedDate} at {selectedSlot}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Confirmation ID:</span><span className="font-mono">{consultationId}</span></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">A confirmation email has been sent to <span className="font-semibold">{formData.email}</span></p>
                      <Button variant="gold" onClick={() => navigate('/')} className="w-full">Back to Home</Button>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                {step < 6 && (
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    {step < 5 ? (
                      <Button variant="gold" onClick={handleContinue} disabled={loading}>Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                    ) : null}
                  </div>
                )}
                {/* Consent modal (gates payment) */}
                <ConsentForm
                  open={showConsentForm}
                  onClose={() => setShowConsentForm(false)}
                  onAccept={(data: any) => {
                    setConsentData(data);
                    setShowConsentForm(false);
                    setStep(5);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Consultation;