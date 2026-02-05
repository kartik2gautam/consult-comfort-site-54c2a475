 import { Link } from "react-router-dom";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { 
   Phone, 
   Video, 
   Heart, 
   Baby,
   Bone,
   Users,
   Eye,
   Stethoscope,
   ArrowRight,
   Check,
   Clock,
   CreditCard
 } from "lucide-react";
 import { departments, consultationTypes } from "@/data/clinic-data";
 
 const mainServices = [
   {
     icon: Phone,
     title: "Voice Call Consultation",
     description: "Connect with our doctors via secure voice call from anywhere. Ideal for quick consultations, follow-ups, and second opinions.",
     price: "₹500",
     duration: "20-30 minutes",
     features: [
       "Secure voice platform",
       "Expert specialist advice",
       "E-prescription service",
       "Convenient & flexible",
       "Call recording available",
     ],
     href: "/book",
     popular: false,
   },
   {
     icon: Video,
     title: "Video Call Consultation",
     description: "Face-to-face consultation with our doctors via secure video call. Best for detailed assessments and visual examinations.",
     price: "₹800",
     duration: "30 minutes",
     features: [
       "HD video quality",
       "Same expert consultants",
       "Screen sharing for reports",
       "E-prescription service",
       "Recording available",
     ],
     href: "/book",
     popular: true,
   },
 ];
 
 const departmentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
   cardiology: Heart,
   pediatrics: Baby,
   orthopedics: Bone,
   gynecology: Users,
   dermatology: Eye,
   "general-medicine": Stethoscope,
 };

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
              Our Services
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Healthcare Solutions
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              From in-person consultations to remote video appointments, we offer flexible 
              healthcare options tailored to your needs and schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mainServices.map((service, index) => (
              <div
                key={index}
                className={`relative bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 border ${
                  service.popular ? "border-gold" : "border-border"
                }`}
              >
                {service.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="w-16 h-16 rounded-xl bg-sky flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold" />
                    <span className="font-semibold text-foreground">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{service.duration}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-gold shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to={service.href} className="block">
                  <Button variant={service.popular ? "gold" : "outline"} className="w-full">
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
               Departments
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
               Our Medical Departments
            </h2>
            <p className="text-muted-foreground leading-relaxed">
               Choose from our specialized departments for expert consultation.
            </p>
          </div>

           <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
             {departments.map((dept) => {
               const Icon = departmentIcons[dept.id] || Stethoscope;
               return (
               <Link
                 to="/book"
                 key={dept.id}
                className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-sky flex items-center justify-center mx-auto mb-4">
                   <Icon className="w-7 h-7 text-primary" />
                </div>
                 <h3 className="font-semibold text-foreground mb-1">{dept.name}</h3>
                 <p className="text-muted-foreground text-xs">{dept.description}</p>
               </Link>
             );
             })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple Steps to Better Health
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
               { step: 1, title: "Select Department", desc: "Choose from Cardiology, Pediatrics, Orthopedics & more" },
               { step: 2, title: "Pick a Doctor", desc: "Browse specialists and select based on your needs" },
               { step: 3, title: "Choose Date & Time", desc: "Pick a slot that fits your schedule" },
               { step: 4, title: "Pay & Consult", desc: "Complete payment and connect with your doctor" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-serif text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
           Book your consultation today and experience the KANT Healthcare difference.
          </p>
          <Link to="/book">
            <Button variant="hero" size="xl">
              Book Appointment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
