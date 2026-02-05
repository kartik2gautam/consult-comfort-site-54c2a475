 import { doctors } from "@/data/clinic-data";
 
 interface DoctorStepProps {
   selectedDepartment: string;
   selectedDoctor: string;
   onSelect: (doctorId: string) => void;
 }
 
 const DoctorStep = ({ selectedDepartment, selectedDoctor, onSelect }: DoctorStepProps) => {
   const filteredDoctors = doctors.filter((d) => d.department === selectedDepartment);
 
   return (
     <div className="space-y-6">
       <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
         Select Your Doctor
       </h2>
       {filteredDoctors.length === 0 ? (
         <div className="bg-muted rounded-xl p-8 text-center">
           <p className="text-muted-foreground">
             No doctors available in this department currently. Please select another department.
           </p>
         </div>
       ) : (
         <div className="grid md:grid-cols-2 gap-4">
           {filteredDoctors.map((doctor) => (
             <button
               key={doctor.id}
               onClick={() => onSelect(doctor.id)}
               className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                 selectedDoctor === doctor.id
                   ? "border-gold bg-gold/5 shadow-card"
                   : "border-border bg-card hover:border-primary/30"
               }`}
             >
               <img
                 src={doctor.image}
                 alt={doctor.name}
                 className="w-20 h-20 rounded-lg object-cover"
               />
               <div className="flex-1">
                 <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                 <p className="text-sm text-primary mb-1">{doctor.specialty}</p>
                 <p className="text-xs text-muted-foreground mb-1">{doctor.qualifications}</p>
                 <p className="text-xs text-gold">{doctor.experience}</p>
               </div>
             </button>
           ))}
         </div>
       )}
     </div>
   );
 };
 
 export default DoctorStep;