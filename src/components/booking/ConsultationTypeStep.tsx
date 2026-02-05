 import { consultationTypes } from "@/data/clinic-data";
 import { Phone, Video } from "lucide-react";
 
 const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
   voice: Phone,
   video: Video,
 };
 
 interface ConsultationTypeStepProps {
   selectedType: string;
   onSelect: (typeId: string) => void;
 }
 
 const ConsultationTypeStep = ({ selectedType, onSelect }: ConsultationTypeStepProps) => {
   return (
     <div className="space-y-6">
       <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
         Choose Consultation Type
       </h2>
       <div className="grid gap-4">
         {consultationTypes.map((type) => {
           const Icon = typeIcons[type.id] || Phone;
           return (
             <button
               key={type.id}
               onClick={() => onSelect(type.id)}
               className={`flex items-start gap-4 p-6 rounded-xl border text-left transition-all ${
                 selectedType === type.id
                   ? "border-gold bg-gold/5 shadow-card"
                   : "border-border bg-card hover:border-primary/30"
               }`}
             >
               <div
                 className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                   selectedType === type.id ? "bg-gold" : "bg-sky"
                 }`}
               >
                 <Icon
                   className={`w-7 h-7 ${
                     selectedType === type.id ? "text-white" : "text-primary"
                   }`}
                 />
               </div>
               <div className="flex-1">
                 <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                 <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                 <div className="flex gap-4 text-sm">
                   <span className="font-semibold text-gold">₹{type.price}</span>
                   <span className="text-muted-foreground">{type.duration}</span>
                 </div>
               </div>
             </button>
           );
         })}
       </div>
     </div>
   );
 };
 
 export default ConsultationTypeStep;