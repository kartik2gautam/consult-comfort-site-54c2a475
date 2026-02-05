 import { Calendar } from "@/components/ui/calendar";
 import { Calendar as CalendarIcon } from "lucide-react";
 import { timeSlots } from "@/data/clinic-data";
 
 interface DateTimeStepProps {
   selectedDate: Date | undefined;
   selectedTime: string;
   onDateSelect: (date: Date | undefined) => void;
   onTimeSelect: (time: string) => void;
 }
 
 const DateTimeStep = ({
   selectedDate,
   selectedTime,
   onDateSelect,
   onTimeSelect,
 }: DateTimeStepProps) => {
   return (
     <div className="space-y-6">
       <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
         Select Date & Time
       </h2>
       <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-card rounded-xl p-6 border border-border">
           <div className="flex items-center gap-2 mb-4">
             <CalendarIcon className="w-5 h-5 text-primary" />
             <h3 className="font-semibold text-foreground">Select Date</h3>
           </div>
           <Calendar
             mode="single"
             selected={selectedDate}
             onSelect={onDateSelect}
             disabled={(date) => date < new Date() || date.getDay() === 0}
             className="rounded-md"
           />
         </div>
         <div className="bg-card rounded-xl p-6 border border-border">
           <h3 className="font-semibold text-foreground mb-4">Available Times</h3>
           {selectedDate ? (
             <div className="grid grid-cols-3 gap-2">
               {timeSlots.map((time) => (
                 <button
                   key={time}
                   onClick={() => onTimeSelect(time)}
                   className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                     selectedTime === time
                       ? "bg-gold text-white"
                       : "bg-muted text-foreground hover:bg-primary/10"
                   }`}
                 >
                   {time}
                 </button>
               ))}
             </div>
           ) : (
             <p className="text-muted-foreground text-sm">Please select a date first</p>
           )}
         </div>
       </div>
     </div>
   );
 };
 
 export default DateTimeStep;