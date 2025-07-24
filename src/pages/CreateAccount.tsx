import React, { useState } from "react";
import { motion } from "framer-motion";
import BackgroundVectors from "@/components/BackgroundVectors";
import NavigationSidebar from "@/components/NavigationSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function AnimatedInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(186,186,186,0.05)" }}
      className="w-full h-10 rounded-lg"
    >
      <input
        {...props}
        onFocus={e => {
          setIsFocused(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          props.onBlur && props.onBlur(e);
        }}
        className={
          "w-full h-full px-3 rounded-lg bg-white/10 border text-white placeholder:text-zinc-400 outline-none transition " +
          (isFocused ? "border-blue-400" : "border-zinc-400/20")
        }
        style={{ fontSize: 14, ...props.style }}
      />
    </motion.div>
  );
}

const projects = [
  {
    id: "rive-tester",
    title: "Rive Asset Tester",
    description: "Test your Rive animations and state machine interactions with various triggers and controls."
  },
  {
    id: "02", 
    title: "Morphing Shapes",
    description: "Geometric transformation animation featuring smooth morphing between different polygon shapes."
  },
  {
    id: "03",
    title: "Character Walk",
    description: "Skeletal animation system for character movement with procedural walk cycle generation."
  },
  {
    id: "04",
    title: "UI Transitions",
    description: "Micro-interactions and state transitions for modern user interface components."
  },
  {
    id: "font-color-samples",
    title: "Font & Color Samples",
    description: "View the style guide for typography and color usage."
  }
];

export default function CreateAccount() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active project based on current path
  const activeProject = React.useMemo(() => {
    if (location.pathname === "/create-account") return "create-account";
    if (location.pathname === "/") return projects[0].id;
    // You can add more path-to-id logic if needed
    return null;
  }, [location.pathname]);

  const handleProjectSelect = (projectId: string) => {
    if (projectId === "rive-tester") navigate("/");
    else if (projectId === "create-account") navigate("/create-account");
    else if (projectId === "font-color-samples") navigate("/font-color-samples");
    // Add more routes as needed
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStatus("Account created! (demo only)");
      setLoading(false);
      setForm(initialForm);
      setTimeout(() => setStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <BackgroundVectors />
      <div className="relative z-10 flex flex-1 overflow-auto">
        {sidebarOpen && (
          <NavigationSidebar 
            projects={projects}
            activeProject={activeProject}
            onProjectSelect={handleProjectSelect}
          />
        )}
        <div className={sidebarOpen ? "ml-80 flex-1 flex items-center justify-center" : "flex-1 flex items-center justify-center"}>
          {/* Toggle Sidebar Button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 left-4 z-20"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <form
            onSubmit={handleSubmit}
            className="w-[320px] p-6 rounded-2xl shadow-lg bg-card backdrop-blur-md border border-border flex flex-col gap-6 relative"
            style={{ boxShadow: "3px 4px 6px 2px rgba(0,0,0,0.25)", opacity: 0.9 }}
          >
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-white">First Name</label>
                <AnimatedInput
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  autoComplete="given-name"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-white">Last Name</label>
                <AnimatedInput
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white">Email</label>
              <AnimatedInput
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white">Password</label>
              <AnimatedInput
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="new-password"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-24 h-8 rounded-lg border border-white/60 bg-transparent text-white font-semibold text-sm hover:bg-white/10 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus:outline-none mx-auto mt-2 disabled:opacity-60"
              whileTap={{ filter: "blur(5px)", scale: 1 }}
            >
              {loading ? "…" : "Enter"}
            </motion.button>
            {status && (
              <div className="absolute left-0 right-0 -bottom-8 text-center text-xs text-green-400 font-medium animate-fade-in">
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 