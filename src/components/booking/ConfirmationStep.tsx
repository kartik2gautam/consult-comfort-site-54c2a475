 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { CheckCircle, Calendar, Clock, User, Phone, Video } from "lucide-react";
 import { doctors, departments, consultationTypes } from "@/data/clinic-data";
 
 interface ConfirmationStepProps {
   appointmentId: string;
   bookingData: {
     department: string;
     doctorId: string;
     date: Date | undefined;
     time: string;
     consultationType: string;
     patientInfo: {
       firstName: string;
       lastName: string;
       email: string;
     };
   };
 }
 
 const ConfirmationStep = ({ appointmentId, bookingData }: ConfirmationStepProps) => {
   const doctor = doctors.find((d) => d.id === bookingData.doctorId);
   const department = departments.find((d) => d.id === bookingData.department);
   const consultation = consultationTypes.find((c) => c.id === bookingData.consultationType);
   const ConsultIcon = bookingData.consultationType === "video" ? Video : Phone;
 
   return (
     <div className="max-w-lg mx-auto text-center py-8">
       <div className="w-20 h-20 rounded-full bg-sky flex items-center justify-center mx-auto mb-6">
         <CheckCircle className="w-10 h-10 text-gold" />
       </div>
 
       <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
         Appointment Confirmed!
       </h1>
       <p className="text-muted-foreground mb-6">
         Your {consultation?.title.toLowerCase()} has been scheduled.
       </p>
 
       {/* Appointment ID */}
       <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
         <p className="text-sm text-muted-foreground mb-1">Appointment ID</p>
         <p className="text-xl font-bold text-gold font-mono">{appointmentId}</p>
       </div>
 
       {/* Appointment Details */}
       <div className="bg-card rounded-xl p-6 border border-border text-left mb-6">
         <h3 className="font-semibold text-foreground mb-4 text-center">Appointment Details</h3>
         <div className="space-y-3">
           <div className="flex items-center gap-3">
             <User className="w-5 h-5 text-primary" />
             <div>
               <p className="text-sm text-muted-foreground">Doctor</p>
               <p className="font-medium text-foreground">{doctor?.name}</p>
               <p className="text-xs text-primary">{department?.name}</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <Calendar className="w-5 h-5 text-primary" />
             <div>
               <p className="text-sm text-muted-foreground">Date</p>
               <p className="font-medium text-foreground">
                 {bookingData.date?.toLocaleDateString("en-IN", {
                   weekday: "long",
                   day: "numeric",
                   month: "long",
                   year: "numeric",
                 })}
               </p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <Clock className="w-5 h-5 text-primary" />
             <div>
               <p className="text-sm text-muted-foreground">Time</p>
               <p className="font-medium text-foreground">{bookingData.time}</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <ConsultIcon className="w-5 h-5 text-primary" />
             <div>
               <p className="text-sm text-muted-foreground">Consultation Type</p>
               <p className="font-medium text-foreground">{consultation?.title}</p>
             </div>
           </div>
         </div>
       </div>
 
       <p className="text-sm text-muted-foreground mb-8">
         A confirmation email has been sent to{" "}
         <span className="font-medium text-foreground">{bookingData.patientInfo.email}</span>
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
   );
 };
 
 export default ConfirmationStep;