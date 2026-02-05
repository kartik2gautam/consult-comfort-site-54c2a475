 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Button } from "@/components/ui/button";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Upload, FileText } from "lucide-react";
 import { useState } from "react";
 
 interface PatientInfo {
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
 }
 
 interface PatientInfoStepProps {
   patientInfo: PatientInfo;
   onUpdate: (info: PatientInfo) => void;
 }
 
 const PatientInfoStep = ({ patientInfo, onUpdate }: PatientInfoStepProps) => {
   const [uploadedFiles, setUploadedFiles] = useState<File[]>(patientInfo.previousPrescriptions);
 
   const handleChange = (field: keyof PatientInfo, value: string) => {
     onUpdate({ ...patientInfo, [field]: value });
   };
 
   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) {
       const files = Array.from(e.target.files);
       setUploadedFiles(files);
       onUpdate({ ...patientInfo, previousPrescriptions: files });
     }
   };
 
   return (
     <div className="space-y-6">
       <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
         Patient Information
       </h2>
 
       {/* Personal Details */}
       <div className="bg-card rounded-xl p-6 border border-border space-y-4">
         <h3 className="font-semibold text-foreground mb-2">Personal Details</h3>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="firstName">First Name *</Label>
             <Input
               id="firstName"
               value={patientInfo.firstName}
               onChange={(e) => handleChange("firstName", e.target.value)}
               required
               className="h-12"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="lastName">Last Name *</Label>
             <Input
               id="lastName"
               value={patientInfo.lastName}
               onChange={(e) => handleChange("lastName", e.target.value)}
               required
               className="h-12"
             />
           </div>
         </div>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="email">Email *</Label>
             <Input
               id="email"
               type="email"
               value={patientInfo.email}
               onChange={(e) => handleChange("email", e.target.value)}
               required
               className="h-12"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="phone">Phone *</Label>
             <Input
               id="phone"
               type="tel"
               value={patientInfo.phone}
               onChange={(e) => handleChange("phone", e.target.value)}
               required
               className="h-12"
             />
           </div>
         </div>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="dob">Date of Birth *</Label>
             <Input
               id="dob"
               type="date"
               value={patientInfo.dateOfBirth}
               onChange={(e) => handleChange("dateOfBirth", e.target.value)}
               required
               className="h-12"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="gender">Gender *</Label>
             <Select
               value={patientInfo.gender}
               onValueChange={(value) => handleChange("gender", value)}
             >
               <SelectTrigger className="h-12">
                 <SelectValue placeholder="Select gender" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="male">Male</SelectItem>
                 <SelectItem value="female">Female</SelectItem>
                 <SelectItem value="other">Other</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
       </div>
 
       {/* Medical History */}
       <div className="bg-card rounded-xl p-6 border border-border space-y-4">
         <h3 className="font-semibold text-foreground mb-2">Medical History</h3>
         <div className="space-y-2">
           <Label htmlFor="medicalHistory">Previous Medical Conditions</Label>
           <Textarea
             id="medicalHistory"
             placeholder="List any previous surgeries, chronic conditions, allergies, etc."
             value={patientInfo.medicalHistory}
             onChange={(e) => handleChange("medicalHistory", e.target.value)}
             rows={3}
           />
         </div>
         <div className="space-y-2">
           <Label htmlFor="medications">Current Medications</Label>
           <Textarea
             id="medications"
             placeholder="List any medications you are currently taking"
             value={patientInfo.currentMedications}
             onChange={(e) => handleChange("currentMedications", e.target.value)}
             rows={3}
           />
         </div>
       </div>
 
       {/* Upload Prescriptions */}
       <div className="bg-card rounded-xl p-6 border border-border space-y-4">
         <h3 className="font-semibold text-foreground mb-2">Previous Prescriptions (Optional)</h3>
         <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
           <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
           <p className="text-sm text-muted-foreground mb-3">
             Upload X-rays, MRI scans, blood tests, or previous prescriptions
           </p>
           <input
             type="file"
             id="prescriptions"
             multiple
             accept=".pdf,.jpg,.jpeg,.png"
             className="hidden"
             onChange={handleFileUpload}
           />
           <label htmlFor="prescriptions">
             <Button variant="outline" asChild>
               <span>Choose Files</span>
             </Button>
           </label>
         </div>
         {uploadedFiles.length > 0 && (
           <div className="space-y-2">
             {uploadedFiles.map((file, index) => (
               <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                 <FileText className="w-4 h-4 text-primary" />
                 <span className="text-sm">{file.name}</span>
               </div>
             ))}
           </div>
         )}
       </div>
 
       {/* Symptoms */}
       <div className="bg-card rounded-xl p-6 border border-border space-y-4">
         <h3 className="font-semibold text-foreground mb-2">Symptoms Description *</h3>
         <div className="space-y-2">
           <Label htmlFor="symptoms">Describe your current symptoms or concerns</Label>
           <Textarea
             id="symptoms"
             placeholder="Please describe what you're experiencing in detail..."
             value={patientInfo.symptoms}
             onChange={(e) => handleChange("symptoms", e.target.value)}
             rows={4}
             required
           />
         </div>
       </div>
     </div>
   );
 };
 
 export default PatientInfoStep;