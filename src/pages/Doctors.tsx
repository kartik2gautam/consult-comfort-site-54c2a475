 import { Link } from "react-router-dom";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { ArrowRight, Award, GraduationCap } from "lucide-react";
 import { doctors, departments } from "@/data/clinic-data";

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
                       Book Consultation
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
             Start by selecting a department and we'll show you the available specialists 
             for your consultation.
          </p>
           <Link to="/book">
             <Button variant="gold" size="xl">
               Book Appointment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Doctors;
