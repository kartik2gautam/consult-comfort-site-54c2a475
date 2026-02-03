import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Award, Heart, Shield, Users, Target, Lightbulb, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Patient-Centred Care",
    description: "Every decision we make is guided by what's best for our patients. We listen, understand, and provide personalised treatment plans.",
  },
  {
    icon: Award,
    title: "Clinical Excellence",
    description: "Our consultants are leaders in their fields, bringing the latest medical advances and evidence-based treatments to our practice.",
  },
  {
    icon: Shield,
    title: "Discretion & Privacy",
    description: "We understand the importance of confidentiality. Your medical information is protected with the highest standards of privacy.",
  },
  {
    icon: Users,
    title: "Collaborative Approach",
    description: "Our multidisciplinary team works together to provide comprehensive care, ensuring no aspect of your health is overlooked.",
  },
];

const timeline = [
  { year: "1998", event: "Founded by Dr. Richard Kaant with a vision for exceptional private healthcare" },
  { year: "2005", event: "Expanded to new premises on Harley Street with state-of-the-art facilities" },
  { year: "2012", event: "Launched specialist departments in cardiology and orthopaedics" },
  { year: "2018", event: "Introduced telemedicine services for remote consultations" },
  { year: "2023", event: "Celebrated 25 years of excellence with over 50,000 patients treated" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
              About Kaant Clinic
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              A Legacy of Excellence in Healthcare
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              For over 25 years, Kaant Clinic has been at the forefront of private healthcare 
              in London, combining traditional British medical values with modern innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Founded on Principles of Care & Excellence
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Kaant Clinic was established in 1998 by Dr. Richard Kaant, a visionary physician 
                who believed that every patient deserves access to the highest quality medical care 
                in an environment of comfort and respect.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                From our humble beginnings as a single-consultant practice, we have grown into 
                one of London's most respected private clinics, with a team of over 15 specialist 
                consultants covering a wide range of medical disciplines.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we continue to uphold the founding principles that have made Kaant Clinic 
                a trusted name in healthcare: clinical excellence, patient-centred care, and 
                unwavering commitment to discretion and privacy.
              </p>
            </div>

            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gold border-4 border-sky" />
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-gold font-semibold">{item.year}</span>
                    <p className="text-foreground mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-sky rounded-full text-primary text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Principles That Guide Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our core values shape every interaction and medical decision at Kaant Clinic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-sky flex items-center justify-center mb-5">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary rounded-2xl p-10 text-white">
              <div className="w-14 h-14 rounded-lg bg-gold/20 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                To provide exceptional, patient-centred healthcare that combines clinical 
                excellence with compassion, delivered in an environment of comfort, 
                confidentiality, and respect. We are committed to improving the health 
                and wellbeing of every individual who entrusts us with their care.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-10">
              <div className="w-14 h-14 rounded-lg bg-sky flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading private healthcare provider in London, recognised 
                for our unwavering commitment to clinical excellence, innovation in 
                patient care, and the highest standards of medical ethics. We aspire 
                to set the benchmark for what exceptional healthcare should be.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Experience the Kaant Clinic Difference
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join the thousands of patients who have trusted us with their healthcare needs.
          </p>
          <Link to="/book">
            <Button variant="hero" size="xl">
              Book Your Appointment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
