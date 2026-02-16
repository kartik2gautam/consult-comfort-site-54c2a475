import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, AlertCircle } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({ title: "Error", description: "Please fill all fields" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/doctor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store token in localStorage
      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem("doctorInfo", JSON.stringify(data.doctor));

      toast({ title: "Success", description: "Login successful!" });
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="container mx-auto px-4 h-20 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-xl font-bold">K</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-primary">KANT Healthcare</h1>
              <p className="text-xs text-muted-foreground tracking-wider uppercase">Doctor Portal</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-center">Doctor Portal</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Sign in to your doctor account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Demo Credentials Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-900">
                    <p className="font-medium">Demo Credentials:</p>
                    <p className="text-xs mt-1">Email: james.whitmore@kanthealth.com</p>
                    <p className="text-xs">Password: doctor123</p>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="james.whitmore@kanthealth.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Not a doctor?{" "}
                <Link
                  to="/"
                  className="text-primary font-medium hover:underline"
                >
                  Back to Home
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorLogin;
