 // KANT Healthcare - Clinic Data
 
 import doctor1 from "@/assets/doctor-1.jpg";
 import doctor2 from "@/assets/doctor-2.jpg";
 import doctor3 from "@/assets/doctor-3.jpg";
 import doctor4 from "@/assets/doctor-4.jpg";
 
 export const departments = [
   { id: "cardiology", name: "Cardiology", description: "Heart and cardiovascular care" },
   { id: "pediatrics", name: "Pediatrics", description: "Child and adolescent health" },
   { id: "orthopedics", name: "Orthopedics", description: "Bone, joint and muscle care" },
   { id: "gynecology", name: "Gynecology", description: "Women's health and reproductive care" },
   { id: "dermatology", name: "Dermatology", description: "Skin health and conditions" },
   { id: "general-medicine", name: "General Medicine", description: "Comprehensive health assessments" },
 ];
 
 export const doctors = [
   {
     id: "1",
     name: "Dr. James Whitmore",
     specialty: "Consultant Cardiologist",
     department: "cardiology",
     image: doctor1,
     experience: "25+ years",
     qualifications: "MBBS, MD, FRCP",
     bio: "Dr. Whitmore is a leading cardiologist with extensive experience in interventional cardiology and heart failure management.",
     specialisms: ["Coronary Artery Disease", "Heart Failure", "Arrhythmias", "Preventive Cardiology"],
   },
   {
     id: "2",
     name: "Dr. Priya Sharma",
     specialty: "Consultant Physician",
     department: "general-medicine",
     image: doctor2,
     experience: "18+ years",
     qualifications: "MBBS, MRCP, PhD",
     bio: "Dr. Sharma specialises in internal medicine with a particular focus on endocrinology and metabolic disorders.",
     specialisms: ["Diabetes Management", "Thyroid Disorders", "General Medicine", "Preventive Health"],
   },
   {
     id: "3",
     name: "Dr. Michael Okonkwo",
     specialty: "Consultant Orthopaedic Surgeon",
     department: "orthopedics",
     image: doctor3,
     experience: "15+ years",
     qualifications: "MBChB, FRCS (Orth)",
     bio: "Dr. Okonkwo is an expert orthopaedic surgeon specialising in joint replacement and sports injuries.",
     specialisms: ["Hip & Knee Replacement", "Sports Injuries", "Arthroscopy", "Trauma Surgery"],
   },
   {
     id: "4",
     name: "Dr. Elizabeth Hayes",
     specialty: "Consultant Dermatologist",
     department: "dermatology",
     image: doctor4,
     experience: "12+ years",
     qualifications: "MBBS, MRCP (Derm)",
     bio: "Dr. Hayes is a highly skilled dermatologist with expertise in both medical and cosmetic dermatology.",
     specialisms: ["Skin Cancer Screening", "Acne & Rosacea", "Eczema & Psoriasis", "Cosmetic Dermatology"],
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