 import { useState } from "react";
 import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
 import { ArrowRight, ArrowLeft } from "lucide-react";
 import { generateAppointmentId, doctors, BookingData } from "@/data/clinic-data";
 import DepartmentStep from "@/components/booking/DepartmentStep";
 import DoctorStep from "@/components/booking/DoctorStep";
 import DateTimeStep from "@/components/booking/DateTimeStep";
 import ConsultationTypeStep from "@/components/booking/ConsultationTypeStep";
 import PaymentStep from "@/components/booking/PaymentStep";
 import PatientInfoStep from "@/components/booking/PatientInfoStep";
 import ConfirmationStep from "@/components/booking/ConfirmationStep";

const Book = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
   
   // Get initial doctor's department if doctor is preselected
   const preselectedDoctorId = searchParams.get("doctor") || "";
   const preselectedDoctor = doctors.find(d => d.id === preselectedDoctorId);
   
   const [bookingData, setBookingData] = useState<BookingData>({
     department: preselectedDoctor?.department || "",
     doctorId: preselectedDoctorId,
     date: undefined,
     time: "",
     consultationType: "",
     patientInfo: {
       firstName: "",
       lastName: "",
       email: "",
       phone: "",
       dateOfBirth: "",
       gender: "",
       medicalHistory: "",
       currentMedications: "",
       previousPrescriptions: [],
       symptoms: "",
     },
     paymentComplete: false,
     appointmentId: "",
   });
 
   const stepLabels = [
     "Department",
     "Doctor",
     "Date & Time",
     "Consultation",
     "Payment",
     "Patient Info",
     "Confirmation",
   ];
 
   const handlePaymentComplete = async () => {
     setIsSubmitting(true);
     await new Promise((resolve) => setTimeout(resolve, 2000));
     setBookingData((prev) => ({ ...prev, paymentComplete: true }));
     setIsSubmitting(false);
     setStep(6);
   };
 
   const handleFinalSubmit = async () => {
     setIsSubmitting(true);
     await new Promise((resolve) => setTimeout(resolve, 1500));
     const appointmentId = generateAppointmentId();
     setBookingData((prev) => ({ ...prev, appointmentId }));
     setIsSubmitting(false);
     setStep(7);
     toast({
       title: "Appointment Confirmed",
       description: `Your appointment ID is ${appointmentId}`,
     });
   };
 
   const canProceed = (): boolean => {
     switch (step) {
       case 1:
         return !!bookingData.department;
       case 2:
         return !!bookingData.doctorId;
       case 3:
         return !!bookingData.date && !!bookingData.time;
       case 4:
         return !!bookingData.consultationType;
       case 5:
         return bookingData.paymentComplete;
       case 6:
         const p = bookingData.patientInfo;
         return !!(p.firstName && p.lastName && p.email && p.phone && p.dateOfBirth && p.gender && p.symptoms);
       default:
         return true;
    }
  };
 
   // Confirmation step - show full-page confirmation
   if (step === 7) {
     return (
       <Layout>
         <section className="py-12 bg-primary">
           <div className="container mx-auto px-4 text-center">
             <h1 className="font-serif text-3xl font-bold text-white">Appointment Booked</h1>
           </div>
         </section>
         <section className="py-12 bg-background">
           <div className="container mx-auto px-4">
             <ConfirmationStep
               appointmentId={bookingData.appointmentId}
               bookingData={bookingData}
             />
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
               Book Your Consultation
            </h1>
            <p className="text-white/80">
               Follow the steps below to schedule your appointment
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
           <div className="flex justify-center overflow-x-auto pb-2">
             <div className="flex items-center gap-2 md:gap-4">
               {[1, 2, 3, 4, 5, 6].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                     className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold ${
                      s <= step
                        ? "bg-gold text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                   {s < 6 && (
                    <div
                       className={`w-6 md:w-12 h-1 mx-1 md:mx-2 ${
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
               Step {step}: {stepLabels[step - 1]}
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
             {/* Step 1: Department Selection */}
            {step === 1 && (
               <DepartmentStep
                 selectedDepartment={bookingData.department}
                 onSelect={(dept) => setBookingData((prev) => ({ ...prev, department: dept, doctorId: "" }))}
               />
            )}

             {/* Step 2: Doctor Selection */}
            {step === 2 && (
               <DoctorStep
                 selectedDepartment={bookingData.department}
                 selectedDoctor={bookingData.doctorId}
                 onSelect={(docId) => setBookingData((prev) => ({ ...prev, doctorId: docId }))}
               />
            )}

             {/* Step 3: Date & Time */}
            {step === 3 && (
               <DateTimeStep
                 selectedDate={bookingData.date}
                 selectedTime={bookingData.time}
                 onDateSelect={(date) => setBookingData((prev) => ({ ...prev, date }))}
                 onTimeSelect={(time) => setBookingData((prev) => ({ ...prev, time }))}
               />
            )}

             {/* Step 4: Consultation Type */}
            {step === 4 && (
               <ConsultationTypeStep
                 selectedType={bookingData.consultationType}
                 onSelect={(type) => setBookingData((prev) => ({ ...prev, consultationType: type }))}
               />
             )}

             {/* Step 5: Payment */}
             {step === 5 && (
               <PaymentStep
                 bookingData={bookingData}
                 onPaymentComplete={handlePaymentComplete}
                 isProcessing={isSubmitting}
               />
             )}
 
             {/* Step 6: Patient Information */}
             {step === 6 && (
               <PatientInfoStep
                 patientInfo={bookingData.patientInfo}
                 onUpdate={(info) => setBookingData((prev) => ({ ...prev, patientInfo: info }))}
               />
            )}

            {/* Navigation Buttons */}
             {step < 5 && (
               <div className="flex justify-between mt-8 pt-8 border-t border-border">
                 {step > 1 && (
                   <Button variant="outline" onClick={() => setStep(step - 1)}>
                     <ArrowLeft className="w-4 h-4" />
                     Back
                   </Button>
                 )}
                 <Button
                   variant="gold"
                   onClick={() => setStep(step + 1)}
                   disabled={!canProceed()}
                   className="ml-auto"
                 >
                   Continue
                   <ArrowRight className="w-4 h-4" />
                 </Button>
               </div>
             )}
 
             {/* Step 6 Submit */}
             {step === 6 && (
               <div className="flex justify-between mt-8 pt-8 border-t border-border">
                 <Button variant="outline" onClick={() => setStep(5)}>
                   <ArrowLeft className="w-4 h-4" />
                   Back
                 </Button>
                 <Button
                   variant="gold"
                   onClick={handleFinalSubmit}
                   disabled={!canProceed() || isSubmitting}
                 >
                   {isSubmitting ? "Confirming..." : "Confirm Appointment"}
                   {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                 </Button>
               </div>
             )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Book;
