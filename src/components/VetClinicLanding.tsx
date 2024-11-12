import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { patients, services, vets, helpers } from "@/utils/sharedUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import { AppointmentDialog } from "@/components/AppointmentDialog";
import { ClinicLocations } from "@/components/ClinicLocations";

type UserRole = "customer" | "staff" | "veterinarian" | "admin";

interface User {
  username: string;
  role: UserRole;
}

export default function VetClinicLanding() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("home");
    } else if (location.pathname === "/medical-history") {
      setActiveTab("medical-history");
    } else if (location.pathname === "/admin-dashboard") {
      setActiveTab("admin-dashboard");
    }
  }, [location]);

  // const handleLogin = (user: User) => {
  //   setLoggedInUser(user);
  //   if (user.role === "customer") {
  //     setActiveTab("home");
  //     navigate("/");
  //   } else {
  //     setActiveTab("admin-dashboard");
  //     navigate("/admin-dashboard");
  //   }
  // };
  //
  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveTab("home");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderNavigation = () => {
    if (!loggedInUser) {
      return (
        <>
          <a
            className={`transition-colors hover:text-primary ${
              activeTab === "home" ? "text-primary" : "text-primary/60"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("home");
            }}
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
            Our Vets
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
        </>
      );
    }

    if (loggedInUser.role === "customer") {
      return (
        <>
          <a
            className={`transition-colors hover:text-primary ${
              activeTab === "home" ? "text-primary" : "text-primary/60"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("home");
            }}
          >
            Home
          </a>
          <a
            className={`transition-colors hover:text-primary ${
              activeTab === "medical-history"
                ? "text-primary"
                : "text-primary/60"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("medical-history");
            }}
          >
            Medical History
          </a>
        </>
      );
    }

    // For staff, veterinarian, and admin roles
    return (
      <a
        className={`transition-colors hover:text-primary ${
          activeTab === "admin-dashboard" ? "text-primary" : "text-primary/60"
        }`}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab("admin-dashboard");
        }}
      >
        Dashboard
      </a>
    );
  };

  const renderHomeContent = () => (
    <>
      <section
        className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://i.ibb.co/DQ0T6Rw/coverpage.jpg')`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#F35709",
            opacity: 0.2,
          }}
        ></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Welcome to Dog Central Veterinary Clinic & Grooming
              </h1>
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                We aim high to be the most trusted and respected pet care
                provider. Your best choice in veterinary services and grooming
                in the city!
              </p>
            </div>
            <div className="space-x-4">
              <AppointmentDialog
                trigger={
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Book Appointment
                  </Button>
                }
              />
              <Button
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="relative group cursor-pointer">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-secondary transition-transform transform group-hover:scale-105">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <AppointmentDialog
                      trigger={
                        <Button
                          variant="secondary"
                          className="bg-primary/90 text-primary-foreground"
                        >
                          Book Now
                        </Button>
                      }
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="vets"
        className="w-full py-12 md:py-24 lg:py-32 bg-[url('https://i.ibb.co/ZLR7VvW/background.png')] bg-cover"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Our Team
          </h2>

          {/* Lead Doctor Carousel */}
          <div className="max-w-3xl mx-auto mb-16">
            <Carousel className="w-full">
              <CarouselContent>
                {vets.map((vet, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-secondary">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <Avatar className="w-32 h-32 mb-6">
                            <AvatarImage src={vet.image} alt={vet.name} />
                            <AvatarFallback>
                              {vet.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-2xl font-bold text-center text-secondary-foreground mb-2">
                            {vet.name}
                          </h3>
                          <p className="text-secondary-foreground/80 mb-4">
                            {vet.role}
                          </p>
                          <div className="mb-6">
                            <Quote className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <p className="text-lg italic text-center text-secondary-foreground">
                              {vet.quote}
                            </p>
                          </div>
                          <div className="w-full">
                            <h4 className="font-semibold mb-2 text-secondary-foreground">
                              Schedule:
                            </h4>
                            <ul className="space-y-1">
                              {vet.schedule.map((slot, slotIndex) => (
                                <li
                                  key={slotIndex}
                                  className="text-sm text-secondary-foreground/80"
                                >
                                  <span className="font-medium">
                                    {slot.day}:
                                  </span>{" "}
                                  {slot.hours}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Helpers Carousel */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">
              Our Dedicated Team
            </h3>
            <Carousel className="w-full">
              <CarouselContent>
                {helpers.map((helper, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-secondary">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={helper.image} alt={helper.name} />
                            <AvatarFallback>
                              {helper.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="text-xl font-bold text-center text-secondary-foreground mb-2">
                            {helper.name}
                          </h4>
                          <p className="text-secondary-foreground/80 mb-4">
                            {helper.role}
                          </p>
                          <div>
                            <Quote className="w-6 h-6 mx-auto mb-3 text-primary" />
                            <p className="text-sm italic text-center text-secondary-foreground">
                              {helper.quote}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
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
      <section
        id="locations"
        className="w-full py-12 md:py-24 lg:py-32 bg-[url('https://i.ibb.co/vvndnbZ/bglocation.png')]"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Our Locations
          </h2>
          <ClinicLocations />
        </div>
      </section>
    </>
  );

  const renderContent = () => {
    if (loggedInUser && loggedInUser.role === "customer") {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          </TabsList>
          <TabsContent value="home">{renderHomeContent()}</TabsContent>
          <TabsContent value="medical-history">
            <PetMedicalHistory />
          </TabsContent>
        </Tabs>
      );
    }

    switch (activeTab) {
      case "home":
        return renderHomeContent();
      case "login":
        return <LoginPage />;
      case "admin-dashboard":
        return loggedInUser ? <AdminDashboard /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled ? "bg-[#F35709]/80 backdrop-blur-md" : "bg-[#F35709]"
        }`}
      >
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <img
                src="https://i.ibb.co/30D8mSn/LOGOAGAIN.png"
                alt="Dog Central Clinic Logo"
                className="h-20 w-auto"
              />
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium text-white">
              {renderNavigation()}
            </nav>
          </div>
          <Button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#F35709] border-b md:hidden">
              <nav className="flex flex-col space-y-2 p-4">
                {renderNavigation()}
              </nav>
            </div>
          )}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {loggedInUser ? (
              <>
                <span className="mr-2 text-white">
                  Welcome, {loggedInUser.username}!
                </span>
                <Button
                  onClick={handleLogout}
                  className="bg-white text-[#F35709] hover:bg-white/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-[#F35709] hover:bg-white/90"
              >
                Login
              </Button>
            )}
            <Button
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-[#F35709] hover:bg-white/90"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat with Us
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{renderContent()}</main>

      <footer id="contact" className="w-full py-6 bg-secondary">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold text-secondary-foreground">
              Dog Central Clinic
            </h3>
            <p className="text-sm text-secondary-foreground/80">
              dogcentralvet@gmail.com
            </p>
            <p className="text-sm text-secondary-foreground/80">
              Phone: 0932 849 5981
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
