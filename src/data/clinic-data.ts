 // KANT Healthcare - Clinic Data
 
 import drBharat from "@/assets/drBharat.jpeg";
 import drChandrakant from "@/assets/drChandrakant.jpeg";
 
 export const departments = [
   { id: "cardiology", name: "Cardiology", description: "Heart and cardiovascular care" },
   { id: "surgery", name: "Surgery", description: "Surgical procedures and care" },
   { id: "general-medicine", name: "General Medicine", description: "Comprehensive health assessments" },
 ];
 
 export const doctors = [
   {
     id: "drBharat",
     name: "Dr. Bharat",
     specialty: "Non Interventional Cardiologist",
     department: "cardiology",
     image: drBharat,
     experience: "15+ years",
     qualifications: "MBBS, DM Cardiology, FACC",
     bio: "Dr. Bharat is an experienced non-interventional cardiologist specializing in cardiac diagnostics, heart failure management, and preventive cardiology.",
     specialisms: ["Cardiac Diagnostics", "Heart Failure Management", "Preventive Cardiology", "Arrhythmia Management"],
   },
   {
     id: "drChandrakant",
     name: "Dr. Chandrakant",
     specialty: "Surgeon",
     department: "surgery",
     image: drChandrakant,
     experience: "20+ years",
     qualifications: "MBBS, MS General Surgery, FICS",
     bio: "Dr. Chandrakant is a highly skilled surgeon with extensive expertise in general and specialized surgical procedures, ensuring optimal patient outcomes.",
     specialisms: ["General Surgery", "Minimally Invasive Surgery", "Trauma Surgery", "Emergency Surgical Care"],
   },
 ];
 
 export const consultationTypes = [
   {
     id: "voice",
     title: "Voice Call Consultation",
     description: "Connect with our doctors via secure voice call",
     price: 500,
     currency: "INR",
     duration: "20-30 min",
   },
   {
     id: "video",
     title: "Video Call Consultation",
     description: "Face-to-face consultation via secure video call",
     price: 800,
     currency: "INR",
     duration: "30 min",
   },
 ];
 
 export const timeSlots = [
   "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
   "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
 ];
 
 export interface BookingData {
   department: string;
   doctorId: string;
   date: Date | undefined;
   time: string;
   consultationType: string;
   patientInfo: {
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     dateOfBirth: string;
     gender: string;
     medicalHistory: string;
     currentMedications: string;
     previousPrescriptions: File[];
     symptoms: string;
   };
   paymentComplete: boolean;
   appointmentId: string;
 }
 
 export const generateAppointmentId = (): string => {
   const prefix = "KANT";
   const timestamp = Date.now().toString(36).toUpperCase();
   const random = Math.random().toString(36).substring(2, 6).toUpperCase();
   return `${prefix}-${timestamp}-${random}`;
 };