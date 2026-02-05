 import { departments } from "@/data/clinic-data";
 import { Heart, Baby, Bone, Users, Eye, Stethoscope } from "lucide-react";
 
 const departmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
   cardiology: Heart,
   pediatrics: Baby,
   orthopedics: Bone,
   gynecology: Users,
   dermatology: Eye,
   "general-medicine": Stethoscope,
 };
 
 interface DepartmentStepProps {
   selectedDepartment: string;
   onSelect: (departmentId: string) => void;
 }
 
 const DepartmentStep = ({ selectedDepartment, onSelect }: DepartmentStepProps) => {
   return (
     <div className="space-y-6">
       <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
         Select Department
       </h2>
       <div className="grid md:grid-cols-2 gap-4">
         {departments.map((dept) => {
           const Icon = departmentIcons[dept.id] || Stethoscope;
           return (
             <button
               key={dept.id}
               onClick={() => onSelect(dept.id)}
               className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${
                 selectedDepartment === dept.id
                   ? "border-gold bg-gold/5 shadow-card"
                   : "border-border bg-card hover:border-primary/30"
               }`}
             >
               <div
                 className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                   selectedDepartment === dept.id ? "bg-gold" : "bg-sky"
                 }`}
               >
                 <Icon
                   className={`w-7 h-7 ${
                     selectedDepartment === dept.id ? "text-white" : "text-primary"
                   }`}
                 />
               </div>
               <div>
                 <h3 className="font-semibold text-foreground">{dept.name}</h3>
                 <p className="text-sm text-muted-foreground">{dept.description}</p>
               </div>
             </button>
           );
         })}
       </div>
     </div>
   );
 };
 
 export default DepartmentStep;