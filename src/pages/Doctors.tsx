import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, GraduationCap } from "lucide-react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";

const doctors = [
  {
    id: 1,
    name: "Dr. James Whitmore",
    specialty: "Consultant Cardiologist",
    image: doctor1,
    experience: "25+ years",
    qualifications: "MBBS, MD, FRCP",
    bio: "Dr. Whitmore is a leading cardiologist with extensive experience in interventional cardiology and heart failure management. He has treated thousands of patients and is known for his thorough, patient-centred approach.",
    specialisms: ["Coronary Artery Disease", "Heart Failure", "Arrhythmias", "Preventive Cardiology"],
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialty: "Consultant Physician",
    image: doctor2,
    experience: "18+ years",
    qualifications: "MBBS, MRCP, PhD",
    bio: "Dr. Sharma specialises in internal medicine with a particular focus on endocrinology and metabolic disorders. Her research contributions have been published in leading medical journals.",
    specialisms: ["Diabetes Management", "Thyroid Disorders", "General Medicine", "Preventive Health"],
  },
  {
    id: 3,
    name: "Dr. Michael Okonkwo",
    specialty: "Consultant Orthopaedic Surgeon",
    image: doctor3,
    experience: "15+ years",
    qualifications: "MBChB, FRCS (Orth)",
    bio: "Dr. Okonkwo is an expert orthopaedic surgeon specialising in joint replacement and sports injuries. He has performed over 3,000 successful surgeries and is recognised for his minimally invasive techniques.",
    specialisms: ["Hip & Knee Replacement", "Sports Injuries", "Arthroscopy", "Trauma Surgery"],
  },
  {
    id: 4,
    name: "Dr. Elizabeth Hayes",
    specialty: "Consultant Dermatologist",
    image: doctor4,
    experience: "12+ years",
    qualifications: "MBBS, MRCP (Derm)",
    bio: "Dr. Hayes is a highly skilled dermatologist with expertise in both medical and cosmetic dermatology. She takes a holistic approach to skin health, combining the latest treatments with preventive care.",
    specialisms: ["Skin Cancer Screening", "Acne & Rosacea", "Eczema & Psoriasis", "Cosmetic Dermatology"],
  },
];

const Doctors = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
              Our Medical Team
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Our Distinguished Consultants
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Our team of highly qualified specialists brings together decades of experience 
              and expertise across multiple medical disciplines.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {doctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className={`grid lg:grid-cols-3 gap-8 items-start ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="lg:col-span-1">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elevated">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 bg-card rounded-2xl p-8 shadow-card">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-sky text-primary rounded-full text-sm font-medium">
                      {doctor.specialty}
                    </span>
                    <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
                      {doctor.experience}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {doctor.name}
                  </h2>

                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span>{doctor.qualifications}</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {doctor.bio}
                  </p>

                  <div className="mb-8">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-gold" />
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialisms.map((specialism, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm"
                        >
                          {specialism}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link to={`/book?doctor=${doctor.id}`}>
                    <Button variant="gold">
                      Book with {doctor.name.split(" ")[0]} {doctor.name.split(" ")[1]}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Not Sure Which Specialist You Need?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Our reception team can help guide you to the right consultant based on your symptoms 
            and medical needs. Get in touch today.
          </p>
          <Link to="/contact">
            <Button variant="default" size="xl">
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Doctors;
