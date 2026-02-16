import { useEffect, useState } from "react";
import { doctors as localDoctors } from "@/data/clinic-data";

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  department?: string;
  image?: string;
  experience?: string;
  qualifications?: string;
}

interface DoctorStepProps {
  selectedDepartment: string;
  selectedDoctor: string;
  onSelect: (doctorId: string) => void;
  doctors?: Doctor[];
}

const DoctorStep = ({ selectedDepartment, selectedDoctor, onSelect, doctors }: DoctorStepProps) => {
  const [fetchedDoctors, setFetchedDoctors] = useState<Doctor[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/doctors`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (mounted) setFetchedDoctors(data);
      } catch (err) {
        // fallback to local data
        if (mounted) setFetchedDoctors(localDoctors as any);
      }
    }
    if (!doctors) load();
    return () => { mounted = false; };
  }, [doctors]);

  const source = doctors || fetchedDoctors || (localDoctors as any);
  const filteredDoctors = selectedDepartment ? source.filter((d) => d.department === selectedDepartment) : source;
 
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