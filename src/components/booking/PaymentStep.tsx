 import { Button } from "@/components/ui/button";
 import { CreditCard, Shield, CheckCircle } from "lucide-react";
 import { doctors, departments, consultationTypes } from "@/data/clinic-data";
 
 interface PaymentStepProps {
   bookingData: {
     department: string;
     doctorId: string;
     date: Date | undefined;
     time: string;
     consultationType: string;
   };
   onPaymentComplete: () => void;
   isProcessing: boolean;
 }
 
 const PaymentStep = ({ bookingData, onPaymentComplete, isProcessing }: PaymentStepProps) => {
   const doctor = doctors.find((d) => d.id === bookingData.doctorId);
   const department = departments.find((d) => d.id === bookingData.department);
   const consultation = consultationTypes.find((c) => c.id === bookingData.consultationType);
 
   return (
     <div className="space-y-6">
       <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
         Complete Payment
       </h2>
 
       {/* Booking Summary */}
       <div className="bg-sky rounded-xl p-6">
         <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
         <div className="space-y-2 text-sm">
           <div className="flex justify-between">
             <span className="text-muted-foreground">Department:</span>
             <span className="font-medium text-foreground">{department?.name}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-muted-foreground">Doctor:</span>
             <span className="font-medium text-foreground">{doctor?.name}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-muted-foreground">Date:</span>
             <span className="font-medium text-foreground">
               {bookingData.date?.toLocaleDateString("en-IN")}
             </span>
           </div>
           <div className="flex justify-between">
             <span className="text-muted-foreground">Time:</span>
             <span className="font-medium text-foreground">{bookingData.time}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-muted-foreground">Consultation:</span>
             <span className="font-medium text-foreground">{consultation?.title}</span>
           </div>
           <div className="flex justify-between pt-2 border-t border-border mt-2">
             <span className="font-semibold text-foreground">Total Amount:</span>
             <span className="font-bold text-gold text-lg">₹{consultation?.price}</span>
           </div>
         </div>
       </div>
 
       {/* Payment Info */}
       <div className="bg-card rounded-xl p-6 border border-border">
         <div className="flex items-center gap-3 mb-4">
           <CreditCard className="w-6 h-6 text-gold" />
           <h3 className="font-semibold text-foreground">Secure Payment</h3>
         </div>
         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
           <Shield className="w-4 h-4" />
           <span>Your payment is secured with 256-bit SSL encryption</span>
         </div>
 
         {/* Mock Payment Button */}
         <Button
           variant="gold"
           size="lg"
           className="w-full"
           onClick={onPaymentComplete}
           disabled={isProcessing}
         >
           {isProcessing ? (
             "Processing Payment..."
           ) : (
             <>
               <CheckCircle className="w-4 h-4 mr-2" />
               Pay ₹{consultation?.price} Now
             </>
           )}
         </Button>
 
         <p className="text-xs text-center text-muted-foreground mt-4">
           By proceeding, you agree to our terms and conditions
         </p>
       </div>
     </div>
   );
 };
 
 export default PaymentStep;