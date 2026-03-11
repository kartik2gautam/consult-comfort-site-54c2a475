// KANT Healthcare - Clinic Data

import drBharat from "@/assets/drBharat.jpeg";
import drChandrakant from "@/assets/drChandrakant.jpeg";
import drUlhas from "@/assets/drUlhas.jpeg";

/* -----------------------------
   Departments
------------------------------ */

export const departments = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart and cardiovascular care",
  },
  {
    id: "surgery",
    name: "Surgery",
    description: "Surgical procedures and care",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Bone, joint and musculoskeletal care",
  },
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Comprehensive health assessments",
  },
];

/* -----------------------------
   Doctor Type
------------------------------ */

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  image: string;
  experience: string;
  qualifications: string;
  bio: string;
  specialisms: string[];
}

/* -----------------------------
   Doctors
------------------------------ */

export const doctors: Doctor[] = [
  {
    id: "drBharat",
    name: "Dr. Bharat",
    specialty: "Non Interventional Cardiologist",
    department: "cardiology",
    image: drBharat,
    experience: "15+ years",
    qualifications: "MBBS, DM Cardiology, FACC",
    bio: "Dr. Bharat is an experienced non-interventional cardiologist specializing in cardiac diagnostics, heart failure management, and preventive cardiology.",
    specialisms: [
      "Cardiac Diagnostics",
      "Heart Failure Management",
      "Preventive Cardiology",
      "Arrhythmia Management",
    ],
  },

  {
    id: "drChandrakant",
    name: "Dr. Chandrakant",
    specialty: "Surgeon",
    department: "surgery",
    image: drChandrakant,
    experience: "20+ years",
    qualifications: "MBBS, MS General Surgery, FICS",
    bio: "Dr. Chandrakant is a highly skilled surgeon with extensive expertise in general and specialised surgical procedures, ensuring optimal patient outcomes.",
    specialisms: [
      "General Surgery",
      "Minimally Invasive Surgery",
      "Trauma Surgery",
      "Emergency Surgical Care",
    ],
  },

  {
    id: "drUlhas",
    name: "Dr. Ulhas",
    specialty: "Orthopedic Specialist",
    department: "orthopedics",
    image: drUlhas,
    experience: "12+ years",
    qualifications: "MBBS, MS Orthopedics",
    bio: "Dr. Ulhas is an experienced orthopedic specialist focusing on bone and joint disorders, sports injuries, and rehabilitation.",
    specialisms: [
      "Joint Replacement",
      "Sports Injury Treatment",
      "Fracture Management",
      "Arthritis Care",
    ],
  },
];

/* -----------------------------
   Consultation Types
------------------------------ */

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

/* -----------------------------
   Time Slots
------------------------------ */

export const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

/* -----------------------------
   Booking Interface
------------------------------ */

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

/* -----------------------------
   Appointment ID Generator
------------------------------ */

export const generateAppointmentId = (): string => {
  const prefix = "KANT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${prefix}-${timestamp}-${random}`;
};