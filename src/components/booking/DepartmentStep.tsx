import * as React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";

/* -------------------- MOCK DATA (replace with API later) -------------------- */

const doctors = [
  {
    id: 1,
    name: "Dr. Ankita Chandna",
    designation:
      "Senior Director – Obstetrics & Gynaecology, Robotic & Laparoscopic Surgery",
    hospital: "Max Hospital – Shalimar Bagh",
    fee: 1400,
    availableDate: "10 Feb 2026",
    image: "/doctor-placeholder.png",
  },
  {
    id: 2,
    name: "Dr. Rakesh Gupta",
    designation: "Senior Consultant – Cardiology",
    hospital: "Max Hospital – Saket",
    fee: 1800,
    availableDate: "11 Feb 2026",
    image: "/doctor-placeholder.png",
  },
];

/* -------------------- COMPONENT -------------------- */

const Services = () => {
  const [doctorQuery, setDoctorQuery] = React.useState("");
  const [hospitalQuery, setHospitalQuery] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(0);

  const dates = ["10 Tue", "11 Wed", "12 Thu", "13 Fri", "14 Sat", "15 Sun"];

  return (
    <Layout>
      {/* ================= SEARCH STRIP ================= */}
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-card p-6 grid md:grid-cols-3 gap-4">
            <input
              value={doctorQuery}
              onChange={(e) => setDoctorQuery(e.target.value)}
              placeholder="Search Doctor"
              className="border rounded-lg px-4 py-3 focus:outline-none"
            />

            <input
              value={hospitalQuery}
              onChange={(e) => setHospitalQuery(e.target.value)}
              placeholder="Select Hospital"
              className="border rounded-lg px-4 py-3 focus:outline-none"
            />

            <Button className="h-12">Search</Button>
          </div>
        </div>
      </section>

      {/* ================= DATE SELECTOR ================= */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex gap-3 overflow-x-auto">
          {dates.map((date, index) => (
            <button
              key={date}
              onClick={() => setSelectedDate(index)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                selectedDate === index
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </section>

      {/* ================= DOCTOR RESULTS ================= */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 grid gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-card rounded-xl p-6 shadow-soft flex gap-6"
            >
              {/* Doctor Image */}
              <img
                src={doc.image}
                alt={doc.name}
                className="w-24 h-24 rounded-lg object-cover"
              />

              {/* Doctor Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">
                  {doc.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {doc.designation}
                </p>

                <div className="flex items-center gap-2 text-sm mt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {doc.hospital}
                </div>

                <div className="flex items-center gap-2 text-sm mt-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Available on {doc.availableDate}
                </div>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <CreditCard className="w-4 h-4" />
                    ₹{doc.fee}
                  </div>

                  <Link to="/book">
                    <Button size="sm">Book Appointment</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Book an appointment in just a few easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Search Doctor",
                desc: "Find doctors by name or specialty",
              },
              {
                step: 2,
                title: "Choose Hospital",
                desc: "Select a preferred hospital location",
              },
              {
                step: 3,
                title: "Pick Date & Time",
                desc: "Choose an available appointment slot",
              },
              {
                step: 4,
                title: "Confirm Appointment",
                desc: "Book instantly with secure payment",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 hero-gradient text-center">
        <h2 className="font-serif text-3xl font-bold text-white mb-4">
          Ready to Book Your Appointment?
        </h2>
        <p className="text-white/80 mb-6">
          Consult top specialists at your preferred hospital.
        </p>
        <Link to="/book">
          <Button variant="hero" size="xl">
            Book Appointment
          </Button>
        </Link>
      </section>
    </Layout>
  );
};

export default Services;
