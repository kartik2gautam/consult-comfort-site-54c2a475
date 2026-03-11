 // KANT Healthcare - Clinic Data
 
 import drBharat from "@/assets/drBharat.jpeg";
 import drChandrakant from "@/assets/drChandrakant.jpeg";
 import drUlhas from "@/assets/drUlhas.jpeg";
 export const departments = [
   { id: "cardiology", name: "Cardiology", description: "Heart and cardiovascular care" },
   { id: "surgery", name: "Surgery", description: "Surgical procedures and care" },
   { id: "general-medicine", name: "General Medicine", description: "Comprehensive health assessments" },
 ];
 
 export const doctors = [
   {
     id: "drChandrakant",
     name: "Dr. Chandrakant",
     specialty: "General Surgeon",
     department: "surgery",
     image: drChandrakant,
     experience: "20+ years",
     qualifications: "MBBS, MS General Surgery",
     bio: "Dr. Chandrakant is a highly experienced General Surgeon with over 20+ years of experience dedicated to providing safe, ethical and patient-centred surgical care. He has worked extensively in Critical Care and Intensive Care Units managing complex and life-threatening conditions. His calm approach, clear communication and commitment to evidence-based treatment make him a trusted surgeon among patients and families. Dr. Chandrakant believes in treating patients with compassion, transparency and precision, ensuring the best possible outcome with a personalized approach.",
     specialisms: [
       "General and Abdominal Surgeries",
       "Gastrointestinal Surgical Procedures",
       "Emergency and Trauma Surgery",
       "Critical Care Supported Surgical Management",
       "Pre and Post Operative Patient Care",
     ],
   },

   {
     id: "drBharat",
     name: "Dr. Bharat Prajapati",
     specialty: "Non Interventional Cardiologist",
     department: "cardiology",
     image: drBharat,
     experience: "15+ years",
     qualifications: "MBBS, DM Cardiology, FACC",
     bio: "Dr. Bharat Prajapati is an experienced Non-Invasive Cardiologist with over 15+ years of clinical experience in diagnosing and managing cardiovascular diseases. Known for his compassionate patient-focused approach and clear communication, Dr. Bharat focuses on careful evaluation, preventive cardiology and personalized treatment plans to help patients achieve better heart health and improved quality of life.",
     specialisms: [
       "2D Echocardiography (Adult & Pediatric)",
       "Stress ECHO",
       "ECG Interpretation",
       "Holter Monitoring",
       "Ambulatory Blood Pressure Monitoring",
       "Cardiac Imaging Interpretation",
     ],
   },

   {
     id: "drUlhas",
     name: "Dr. Ulhas Narayanrao Mugal",
     specialty: "General Practitioner",
     department: "general-medicine",
     image: drUlhas,
     experience: "16+ years",
     qualifications: "MBBS, ECFMG Certified (USA)",
     bio: "Dr. Ulhas Narayanrao Mugal is a dedicated General Practitioner with over 16 years of clinical experience across primary care, psychiatry and intensive care medicine. He has worked in India, Singapore and the United Kingdom, gaining broad international experience. Dr. Ulhas has extensive experience in critical care including medical, surgical and cardiology intensive care units. His background in psychiatry provides him with a holistic approach to patient care. He has also delivered comprehensive community and primary healthcare across all age groups and is known for his patient-centered, compassionate and evidence-based care.",
     specialisms: [
       "Primary and Family Healthcare",
       "Critical Care Medicine",
       "Psychiatric and Mental Health Care",
       "Preventive and Community Healthcare",
       "International Clinical Practice",
     ],
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