import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Video, 
  FileText, 
  Stethoscope,
  Upload,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";

const consultationTypes = [
  {
    id: "in-person",
    icon: Stethoscope,
    title: "In-Person Consultation",
    description: "Meet face-to-face at our Harley Street clinic",
    price: 150,
    duration: "45-60 min",
  },
  {
    id: "video",
    icon: Video,
    title: "Video Consultation",
    description: "Connect remotely via secure video call",
    price: 75,
    duration: "30 min",
  },
  {
    id: "document",
    icon: FileText,
    title: "Document Review",
    description: "Upload X-rays, scans for expert analysis",
    price: 50,
    duration: "24-48 hrs",
  },
];

const doctors = [
  { id: "1", name: "Dr. James Whitmore", specialty: "Cardiologist", image: doctor1 },
  { id: "2", name: "Dr. Priya Sharma", specialty: "Physician", image: doctor2 },
  { id: "3", name: "Dr. Michael Okonkwo", specialty: "Orthopaedic Surgeon", image: doctor3 },
  { id: "4", name: "Dr. Elizabeth Hayes", specialty: "Dermatologist", image: doctor4 },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const Book = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState(searchParams.get("type") || "in-person");
  const [selectedDoctor, setSelectedDoctor] = useState(searchParams.get("doctor") || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentType = consultationTypes.find(t => t.id === consultationType);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsComplete(true);
    toast({
      title: "Booking Confirmed",
      description: "You will receive a confirmation email shortly.",
    });
  };

  const canProceed = () => {
    if (step === 1) return consultationType;
    if (step === 2) return selectedDoctor;
    if (step === 3) {
      if (consultationType === "document") return uploadedFiles.length > 0;
      return selectedDate && selectedTime;
    }
    return true;
  };

  if (isComplete) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-sky flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-gold" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground mb-2">
                Your {currentType?.title.toLowerCase()} has been scheduled.
              </p>
              {consultationType !== "document" && selectedDate && (
                <p className="text-lg font-semibold text-primary mb-6">
                  {selectedDate.toLocaleDateString("en-GB", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })} at {selectedTime}
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-8">
                A confirmation email has been sent to your email address with all the details.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/">
                  <Button variant="outline">Return Home</Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="gold">View Our Doctors</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Book Your Appointment
            </h1>
            <p className="text-white/80">
              Follow the steps below to schedule your consultation
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? "bg-gold text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        s < step ? "bg-gold" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm text-muted-foreground">
              {step === 1 && "Choose consultation type"}
              {step === 2 && "Select your doctor"}
              {step === 3 && (consultationType === "document" ? "Upload documents" : "Pick date & time")}
              {step === 4 && "Complete booking"}
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Step 1: Consultation Type */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Select Consultation Type
                </h2>
                <div className="grid gap-4">
                  {consultationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setConsultationType(type.id)}
                      className={`flex items-start gap-4 p-6 rounded-xl border text-left transition-all ${
                        consultationType === type.id
                          ? "border-gold bg-gold/5 shadow-card"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                        consultationType === type.id ? "bg-gold" : "bg-sky"
                      }`}>
                        <type.icon className={`w-7 h-7 ${
                          consultationType === type.id ? "text-white" : "text-primary"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="font-semibold text-gold">£{type.price}</span>
                          <span className="text-muted-foreground">{type.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Doctor */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Select Your Doctor
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                        selectedDoctor === doctor.id
                          ? "border-gold bg-gold/5 shadow-card"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                        <p className="text-sm text-primary">{doctor.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date/Time or Upload */}
            {step === 3 && (
              <div className="space-y-6">
                {consultationType === "document" ? (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      Upload Your Documents
                    </h2>
                    <div className="bg-card rounded-xl p-8 border border-border">
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">
                          Upload Medical Documents
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          X-rays, MRI scans, blood test results, or any relevant documents
                        </p>
                        <input
                          type="file"
                          id="files"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.dicom"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="files">
                          <Button variant="outline" asChild>
                            <span>Choose Files</span>
                          </Button>
                        </label>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Describe your symptoms or concerns..."
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      Select Date & Time
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarIcon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-foreground">Select Date</h3>
                        </div>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="rounded-md"
                        />
                      </div>
                      <div className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">Available Times</h3>
                        {selectedDate ? (
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                  selectedTime === time
                                    ? "bg-gold text-white"
                                    : "bg-muted text-foreground hover:bg-primary/10"
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Please select a date first
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Payment & Confirmation */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Complete Your Booking
                </h2>

                {/* Summary */}
                <div className="bg-sky rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consultation Type:</span>
                      <span className="font-medium text-foreground">{currentType?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium text-foreground">
                        {doctors.find(d => d.id === selectedDoctor)?.name}
                      </span>
                    </div>
                    {consultationType !== "document" && selectedDate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium text-foreground">
                            {selectedDate.toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium text-foreground">{selectedTime}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border mt-2">
                      <span className="font-semibold text-foreground">Total:</span>
                      <span className="font-bold text-gold text-lg">£{currentType?.price}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Your Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" required className="h-12" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" type="tel" required className="h-12" />
                    </div>
                  </div>
                </div>

                {/* Payment Info Note */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-6 h-6 text-gold" />
                    <h3 className="font-semibold text-foreground">Payment</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payment of £{currentType?.price} will be collected at the clinic or via secure 
                    payment link sent to your email after booking confirmation.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-border">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {step < 4 && (
                <Button
                  variant="gold"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="ml-auto"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Book;
