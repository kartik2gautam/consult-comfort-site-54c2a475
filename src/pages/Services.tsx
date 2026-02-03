import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Video, 
  FileText, 
  Stethoscope, 
  Heart, 
  Brain,
  Bone,
  Eye,
  ArrowRight,
  Check,
  Clock,
  CreditCard
} from "lucide-react";

const mainServices = [
  {
    icon: Calendar,
    title: "In-Person Consultation",
    description: "Meet face-to-face with our consultants for comprehensive medical assessments, physical examinations, and personalised treatment plans.",
    price: "From £150",
    duration: "45-60 minutes",
    features: [
      "Full medical history review",
      "Physical examination",
      "Personalised treatment plan",
      "Prescription if required",
      "Follow-up recommendations",
    ],
    href: "/book",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with our doctors remotely from the comfort of your home. Ideal for follow-ups, minor concerns, and medication reviews.",
    price: "£75",
    duration: "30 minutes",
    features: [
      "Secure video platform",
      "Same expert consultants",
      "E-prescription service",
      "Convenient & flexible",
      "Recording available",
    ],
    href: "/book?type=video",
    popular: true,
  },
  {
    icon: FileText,
    title: "Document Review",
    description: "Upload your X-rays, MRI scans, blood tests, or other medical documents for expert analysis and written report.",
    price: "£50",
    duration: "24-48 hour response",
    features: [
      "Upload any medical document",
      "Expert specialist review",
      "Detailed written report",
      "Recommendations provided",
      "Follow-up option included",
    ],
    href: "/book?type=document",
  },
];

const specialties = [
  { icon: Heart, name: "Cardiology", description: "Heart and cardiovascular care" },
  { icon: Stethoscope, name: "General Medicine", description: "Comprehensive health assessments" },
  { icon: Bone, name: "Orthopaedics", description: "Bone, joint and muscle care" },
  { icon: Brain, name: "Neurology", description: "Brain and nervous system" },
  { icon: Eye, name: "Dermatology", description: "Skin health and conditions" },
];

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
          <div className="grid lg:grid-cols-3 gap-8">
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
              Medical Specialties
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Expert Care Across Disciplines
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our consultants cover a wide range of medical specialties to address all your healthcare needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-sky flex items-center justify-center mx-auto mb-4">
                  <specialty.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{specialty.name}</h3>
                <p className="text-muted-foreground text-sm">{specialty.description}</p>
              </div>
            ))}
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
              { step: 1, title: "Choose Service", desc: "Select the type of consultation that suits your needs" },
              { step: 2, title: "Pick a Specialist", desc: "Browse our doctors and choose the right expert" },
              { step: 3, title: "Book & Pay", desc: "Select a convenient time and complete payment" },
              { step: 4, title: "Get Care", desc: "Attend your appointment and receive expert care" },
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
            Book your consultation today and experience the Kaant Clinic difference.
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
