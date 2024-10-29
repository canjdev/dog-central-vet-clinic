import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Send,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoginPage from "./LoginPage";
import { PetMedicalHistory } from "./PetMedicalHistory";
import { AdminDashboard } from "./AdminDashboard";
import { patients } from "@/utils/sharedUtils";

type UserRole = "customer" | "staff" | "admin";

interface User {
  username: string;
  role: UserRole;
}

const services = [
  {
    name: "Vaccination",
    description:
      "Keep your pet protected with our comprehensive vaccination services.",
  },
  {
    name: "Grooming",
    description:
      "Professional grooming to keep your furry friend looking and feeling their best.",
  },
  {
    name: "24 hr care",
    description:
      "Round-the-clock care for your pet's health emergencies and peace of mind.",
  },
];

const vets = [
  {
    name: "Dr. Sarah Johnson",
    image: "/placeholder.svg?height=200&width=200",
    role: "Lead Veterinarian",
    schedule: [
      { day: "Mon-Fri", hours: "9:00 AM - 5:00 PM" },
      { day: "Sat", hours: "10:00 AM - 2:00 PM" },
    ],
  },
];

const helpers = [
  { name: "John Smith", role: "Veterinary Technician" },
  { name: "Emily Brown", role: "Groomer" },
  { name: "Michael Lee", role: "Veterinary Assistant" },
];

export default function VetClinicLanding() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");

  const nextPatient = useCallback(() => {
    setCurrentPatientIndex((prevIndex) => (prevIndex + 1) % patients.length);
  }, []);

  const prevPatient = useCallback(() => {
    setCurrentPatientIndex(
      (prevIndex) => (prevIndex - 1 + patients.length) % patients.length
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(nextPatient, 5000);
    return () => clearInterval(intervalId);
  }, [nextPatient]);

  const handleLogin = (username: string, role: UserRole) => {
    setLoggedInUser({ username, role });
    // setActiveTab("medical-history");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveTab("home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2020-H2WL8rPLJfpqcOkz3zhME4AbN8Gmaj.png"
                alt="Dog Central Clinic Logo"
                className="h-8 w-auto"
              />
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                className={`transition-colors hover:text-primary ${
                  activeTab === "home" ? "text-primary" : "text-primary/60"
                }`}
                href="#"
                onClick={() => setActiveTab("home")}
              >
                Home
              </a>
              <a
                className="transition-colors hover:text-primary text-primary/60"
                href="#services"
              >
                Services
              </a>
              <a
                className="transition-colors hover:text-primary text-primary/60"
                href="#vets"
              >
                Our Team
              </a>
              <a
                className="transition-colors hover:text-primary text-primary/60"
                href="#patients"
              >
                Happy Patients
              </a>
              <a
                className="transition-colors hover:text-primary text-primary/60"
                href="#contact"
              >
                Contact
              </a>
              {loggedInUser && (
                <a
                  className={`transition-colors hover:text-primary ${
                    activeTab === "medical-history"
                      ? "text-primary"
                      : "text-primary/60"
                  }`}
                  href="#"
                  onClick={() => setActiveTab("medical-history")}
                >
                  Medical History
                </a>
              )}
              {loggedInUser &&
                (loggedInUser.role === "admin" ||
                  loggedInUser.role === "staff") && (
                  <a
                    className={`transition-colors hover:text-primary ${
                      activeTab === "admin-dashboard"
                        ? "text-primary"
                        : "text-primary/60"
                    }`}
                    href="#"
                    onClick={() => setActiveTab("admin-dashboard")}
                  >
                    Dashboard
                  </a>
                )}
            </nav>
          </div>
          <Button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-background border-b md:hidden">
              <nav className="flex flex-col space-y-2 p-4">
                <a
                  className="transition-colors hover:text-primary text-primary/60"
                  href="#"
                  onClick={() => setActiveTab("home")}
                >
                  Home
                </a>
                <a
                  className="transition-colors hover:text-primary text-primary/60"
                  href="#services"
                >
                  Services
                </a>
                <a
                  className="transition-colors hover:text-primary text-primary/60"
                  href="#vets"
                >
                  Our Team
                </a>
                <a
                  className="transition-colors hover:text-primary text-primary/60"
                  href="#patients"
                >
                  Happy Patients
                </a>
                <a
                  className="transition-colors hover:text-primary text-primary/60"
                  href="#contact"
                >
                  Contact
                </a>
                {loggedInUser && (
                  <a
                    className="transition-colors hover:text-primary text-primary/60"
                    href="#"
                    onClick={() => setActiveTab("medical-history")}
                  >
                    Medical History
                  </a>
                )}
                {loggedInUser &&
                  (loggedInUser.role === "admin" ||
                    loggedInUser.role === "staff") && (
                    <a
                      className="transition-colors hover:text-primary text-primary/60"
                      href="#"
                      onClick={() => setActiveTab("admin-dashboard")}
                    >
                      Dashboard
                    </a>
                  )}
              </nav>
            </div>
          )}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {loggedInUser ? (
              <>
                <span className="mr-2">Welcome, {loggedInUser.username}!</span>
                <Button
                  onClick={handleLogout}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setActiveTab("login")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            )}
            <Button
              onClick={() => setIsChatOpen(true)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat with Us
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {activeTab === "home" && (
          <>
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-secondary-foreground">
                      Welcome to Dog Central Clinic
                    </h1>
                    <p className="mx-auto max-w-[700px] text-secondary-foreground/80 md:text-xl">
                      Providing compassionate care for your furry friends. Your
                      pets deserve the best, and we're here to deliver it.
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Book Appointment
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="services"
              className="w-full py-12 md:py-24 lg:py-32 bg-background"
            >
              <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-primary">
                  Our Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <Card key={index} className="bg-secondary">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-secondary-foreground">
                          {service.name}
                        </h3>
                        <p className="text-secondary-foreground/80">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section
              id="vets"
              className="w-full py-12 md:py-24 lg:py-32 bg-background"
            >
              <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-primary">
                  Our Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card className="flex flex-col bg-secondary">
                    <CardContent className="p-6 flex-grow">
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="w-32 h-32 mb-4">
                          <AvatarImage src={vets[0].image} alt={vets[0].name} />
                          <AvatarFallback>
                            {vets[0].name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold text-center text-secondary-foreground">
                          {vets[0].name}
                        </h3>
                        <p className="text-secondary-foreground/80">
                          {vets[0].role}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-secondary-foreground">
                          Schedule:
                        </h4>
                        <ul className="space-y-1">
                          {vets[0].schedule.map((slot, slotIndex) => (
                            <li
                              key={slotIndex}
                              className="text-sm text-secondary-foreground/80"
                            >
                              <span className="font-medium">{slot.day}:</span>{" "}
                              {slot.hours}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="flex flex-col bg-secondary">
                    <CardContent className="p-6 flex-grow">
                      <h3 className="text-xl font-bold mb-4 text-secondary-foreground">
                        Our Helpers
                      </h3>
                      <ul className="space-y-2">
                        {helpers.map((helper, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>
                                {helper.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-secondary-foreground">
                                {helper.name}
                              </p>
                              <p className="text-sm text-secondary-foreground/80">
                                {helper.role}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section
              id="patients"
              className="w-full py-12 md:py-24 lg:py-32 bg-secondary"
            >
              <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-secondary-foreground">
                  Happy Patients
                </h2>
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <div className="relative aspect-w-16 aspect-h-9">
                      <img
                        src={patients[currentPatientIndex].image}
                        alt={patients[currentPatientIndex].name}
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                        <div className="text-white text-center">
                          <h3 className="text-2xl font-bold">
                            {patients[currentPatientIndex].name}
                          </h3>
                          <p className="text-lg">
                            {patients[currentPatientIndex].breed}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={prevPatient}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={nextPatient}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "login" && !loggedInUser && (
          <section className="w-full bg-background">
            <LoginPage onLogin={handleLogin} />
          </section>
        )}

        {activeTab === "medical-history" && loggedInUser && (
          <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <PetMedicalHistory />
          </section>
        )}

        {activeTab === "admin-dashboard" &&
          loggedInUser &&
          (loggedInUser.role === "admin" || loggedInUser.role === "staff") && (
            <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
              <AdminDashboard />
            </section>
          )}
      </main>

      <footer id="contact" className="w-full py-6 bg-secondary">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold text-secondary-foreground">
              Dog Central Clinic
            </h3>
            <p className="text-sm text-secondary-foreground/80">
              123 Pet Street, Animalville, AV 12345
            </p>
            <p className="text-sm text-secondary-foreground/80">
              Phone: (555) 123-4567
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-secondary-foreground/80 hover:text-secondary-foreground"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-secondary-foreground/80 hover:text-secondary-foreground"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-secondary-foreground/80 hover:text-secondary-foreground"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-background border rounded-lg shadow-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-primary">Chat with Us</h3>
            <Button
              variant="ghost"
              onClick={() => setIsChatOpen(false)}
              className="text-primary hover:text-primary/80"
            >
              Close
            </Button>
          </div>
          <div className="h-64 overflow-y-auto p-4">
            {/* Chat messages would go here */}
          </div>
          <div className="p-4 border-t">
            <form className="flex space-x-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
