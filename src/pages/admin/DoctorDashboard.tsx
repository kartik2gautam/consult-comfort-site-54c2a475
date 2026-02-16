import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Calendar, Users, CheckCircle, Clock, DollarSign } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface Consultation {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  booked: number;
  paid: number;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0,
    booked: 0,
    paid: 0
  });
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const info = localStorage.getItem("doctorInfo");
    if (info) setDoctorInfo(JSON.parse(info));

    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch(`${BACKEND_URL}/api/doctor/consultations/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // Fetch consultations
      const consRes = await fetch(`${BACKEND_URL}/api/doctor/consultations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (consRes.ok) {
        setConsultations(await consRes.json());
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorInfo");
    toast({ title: "Success", description: "Logged out successfully" });
    navigate("/admin/login");
  };

  const updateConsultationStatus = async (consultationId: string, newStatus: string) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/doctor/consultations/${consultationId}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (res.ok) {
        toast({ title: "Success", description: "Status updated successfully" });
        fetchData();
      } else {
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    }
  };

  const filteredConsultations =
    statusFilter === "all"
      ? consultations
      : consultations.filter((c) => c.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "booked":
        return "bg-blue-50 text-blue-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Welcome back, {doctorInfo?.name || "Doctor"}!
              </h1>
              <p className="text-muted-foreground">
                {doctorInfo?.specialty} | {doctorInfo?.email}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Consultations</p>
                        <p className="text-3xl font-bold text-primary">{stats.total}</p>
                      </div>
                      <Users className="w-10 h-10 text-primary/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                      </div>
                      <CheckCircle className="w-10 h-10 text-green-600/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                      </div>
                      <Clock className="w-10 h-10 text-yellow-600/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Booked</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.booked}</p>
                      </div>
                      <Calendar className="w-10 h-10 text-blue-600/30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Paid Consultations</p>
                        <p className="text-3xl font-bold text-emerald-600">{stats.paid}</p>
                      </div>
                      <DollarSign className="w-10 h-10 text-emerald-600/30" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Consultations Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Consultations</CardTitle>
                    <div className="flex gap-2">
                      {["all", "pending", "booked", "completed"].map((status) => (
                        <Button
                          key={status}
                          variant={statusFilter === status ? "gold" : "outline"}
                          size="sm"
                          onClick={() => setStatusFilter(status)}
                          className="capitalize"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {filteredConsultations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No consultations found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Patient</th>
                            <th className="text-left py-3 px-4 font-medium">Contact</th>
                            <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                            <th className="text-left py-3 px-4 font-medium">Symptoms</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Payment</th>
                            <th className="text-left py-3 px-4 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredConsultations.map((consultation) => (
                            <tr key={consultation.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{consultation.patientName}</td>
                              <td className="py-3 px-4 text-xs">
                                <p>{consultation.phone}</p>
                                <p className="text-muted-foreground">{consultation.email}</p>
                              </td>
                              <td className="py-3 px-4 text-xs">
                                <p>{consultation.date}</p>
                                <p className="text-muted-foreground">{consultation.timeSlot}</p>
                              </td>
                              <td className="py-3 px-4 text-xs max-w-xs truncate">
                                {consultation.symptoms || "-"}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(consultation.status)}`}>
                                  {consultation.status}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-xs font-medium ${getPaymentStatusColor(consultation.paymentStatus)}`}>
                                {consultation.paymentStatus}
                              </td>
                              <td className="py-3 px-4">
                                {consultation.status !== "completed" && (
                                  <select
                                    value={consultation.status}
                                    onChange={(e) =>
                                      updateConsultationStatus(consultation.id, e.target.value)
                                    }
                                    className="text-xs px-2 py-1 border rounded"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="booked">Booked</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DoctorDashboard;
