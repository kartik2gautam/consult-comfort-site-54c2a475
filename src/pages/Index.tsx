 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import Layout from "@/components/layout/Layout";
 import { 
   Phone, 
   Video, 
   Heart,
   Baby,
   Bone,
   Users,
   Award, 
   Clock, 
   Shield,
   ArrowRight,
   Star
 } from "lucide-react";
 import heroImage from "@/assets/hero-clinic.jpg";
 import { doctors, departments } from "@/data/clinic-data";
 
 const services = [
   {
     icon: Phone,
     title: "Voice Consultation",
     description: "Connect with our doctors via secure voice call for expert medical advice.",
     href: "/book",
     price: "₹500",
   },
   {
     icon: Video,
     title: "Video Consultation",
     description: "Face-to-face consultation via secure HD video call.",
     href: "/book",
     price: "₹800",
   },
   {
     icon: Heart,
     title: "Cardiology",
     description: "Expert heart and cardiovascular care from specialist doctors.",
     href: "/book",
   },
   {
     icon: Bone,
     title: "Orthopedics",
     description: "Bone, joint and muscle care with experienced surgeons.",
     href: "/book",
   },
 ];

const stats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "50,000+", label: "Patients Treated" },
  { value: "15+", label: "Specialist Consultants" },
  { value: "98%", label: "Patient Satisfaction" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
           alt="KANT Healthcare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6 animate-fade-in">
             Welcome to KANT Healthcare
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
             Expert Medical 
             <span className="block text-gold">Second Opinions</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
             Get expert medical consultations from specialist doctors via voice or video call. 
             Easy online booking, secure payments, and quality healthcare from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/book">
                <Button variant="hero" size="xl">
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="hero-outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { value: "15+", label: "Specialist Doctors" },
             { value: "10,000+", label: "Consultations" },
             { value: "6", label: "Departments" },
             { value: "98%", label: "Patient Satisfaction" },
           ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-3xl md:text-4xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
              Our Services
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
             Book Your Consultation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
             Choose voice or video consultation and connect with our specialist doctors 
             for expert medical advice and second opinions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.href}
                className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="w-14 h-14 rounded-lg bg-sky flex items-center justify-center mb-5 group-hover:bg-gold transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                {service.price && (
                  <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
                    From {service.price}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
               Trusted Healthcare at Your Fingertips
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
               At KANT Healthcare, we bring specialist doctors to you through secure online consultations. 
               Get expert second opinions, medical advice, and treatment plans without leaving your home.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                   <h4 className="font-semibold text-foreground mb-1">Expert Specialists</h4>
                   <p className="text-sm text-muted-foreground">Highly qualified doctors across departments</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                   <h4 className="font-semibold text-foreground mb-1">Easy Booking</h4>
                   <p className="text-sm text-muted-foreground">Simple online appointment system</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Flexible Hours</h4>
                   <p className="text-sm text-muted-foreground">Book at your convenience</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                   <h4 className="font-semibold text-foreground mb-1">Secure Platform</h4>
                   <p className="text-sm text-muted-foreground">Safe payments & private consultations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-elevated">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="font-serif text-xl text-foreground italic mb-6">
                 "The video consultation was seamless. The doctor took time 
                  to listen and explain everything thoroughly. I felt truly valued as a patient."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                   <span className="text-primary-foreground font-semibold">RS</span>
                  </div>
                  <div>
                   <div className="font-semibold text-foreground">Rajesh Sharma</div>
                   <div className="text-sm text-muted-foreground">Patient from Mumbai</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gold/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Distinguished Consultants
            </h2>
            <p className="text-muted-foreground leading-relaxed">
             Our team of experienced specialists across multiple departments 
             is ready to provide expert medical consultations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {doctors.slice(0, 4).map((doctor, index) => (
              <div
                key={index}
                className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-2">
                    {doctor.specialty}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {doctor.experience} experience
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/doctors">
              <Button variant="outline" size="lg">
                View All Doctors
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Exceptional Care?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
           Book your consultation today and get expert medical advice from 
           KANT Healthcare's specialist doctors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book">
              <Button variant="hero" size="xl">
                Book Appointment
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="hero-outline" size="xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
