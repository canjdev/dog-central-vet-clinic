"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Menu,
  Stethoscope,
  Syringe,
  Scissors,
  Building2,
  SmileIcon as Tooth,
  FlaskConical,
  Home,
  ScissorsIcon as Scalpel,
  Radio,
  Zap,
} from "lucide-react";
import { services, vets, helpers } from "@/utils/sharedUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import { ClinicLocations } from "@/components/ClinicLocations";
import { useAuth } from "@/context/AuthContext";
import api from "@/config/api";

const serviceIcons = {
  "Check Up": Stethoscope,
  Vaccination: Syringe,
  "Pet Grooming": Scissors,
  Confinement: Building2,
  "Dental Cleaning": Tooth,
  Laboratory: FlaskConical,
  "Pet Boarding": Home,
  Surgery: Scalpel,
  Ultrasound: Radio,
  "Laser Therapy": Zap,
};

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  bio: string;
  gender: string | null;
  owner: Owner;
  profile: string | null;
  ownerid: string;
  created_at: string;
}

interface Owner {
  id: string;
  profilePicture: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  createdAt: Date;
  contact: string;
  pets: Pet[];
  email: string;
}

interface GalleryItem {
  id: number;
  imageUrl: string;
  pet: Pet;
}

export default function VetClinicLanding() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<GalleryItem[]>("/api/galleries");

        setGalleryItems(response.data);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setError("Failed to load gallery items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const renderNavigation = () => (
    <>
      <a
        className="transition-colors hover:text-white hover:underline hover:scale-105 transform"
        href="#"
      >
        Home
      </a>
      <a
        className="transition-colors hover:text-white hover:underline hover:scale-105 transform"
        href="#services"
      >
        Services
      </a>
      <a
        className="transition-colors hover:text-white hover:underline hover:scale-105 transform"
        href="#vets"
      >
        Our Vets
      </a>
      <a
        className="transition-colors hover:text-white hover:underline hover:scale-105 transform"
        href="#patients"
      >
        Happy Patients
      </a>
      <a
        className="transition-colors hover:text-white hover:underline hover:scale-105 transform"
        href="#contact"
      >
        Contact
      </a>
    </>
  );

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    const response = await api.post("/api/auth/logout");
    if (response.status === 204) {
      navigate("/");
    }
  };

  const handleBookAppointment = () => {
    if (isAuthenticated) {
      // TODO: Implement booking logic for authenticated users
      console.log("Implement booking logic here");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-[#F35709]/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container flex h-20 items-center justify-between">
          <Button
            className="md:hidden inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <nav className="hidden md:flex items-center space-x-8 text-lg font-medium text-white">
            {renderNavigation()}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-white">Welcome, {user?.username}</span>
                <Button
                  onClick={handleLogout}
                  className="bg-white text-[#F35709] hover:bg-white/90 hover:scale-105 transform transition-transform"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-white text-[#F35709] hover:bg-white/90 hover:scale-105 transform transition-transform"
              >
                Login
              </Button>
            )}
            <a href="/">
              <img
                src="https://i.ibb.co/30D8mSn/LOGOAGAIN.png"
                alt="Dog Central Clinic Logo"
                className="h-16 w-auto"
              />
            </a>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F35709] border-b">
            <nav className="flex flex-col space-y-2 p-4">
              {renderNavigation()}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section
          className="w-full h-[600px] bg-cover bg-center relative -mt-20"
          style={{
            backgroundImage: `linear-gradient(rgba(243, 87, 9, 0.3), rgba(243, 87, 9, 0.3)), url('https://i.ibb.co/rvt3Cvq/coverpage.jpg')`,
          }}
        >
          <div className="container px-4 md:px-6 relative z-10 h-full flex items-center justify-center pt-20">
            <div className="flex flex-col items-center space-y-4 text-center w-full">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white drop-shadow-lg">
                  Welcome to Dog Central Veterinary Clinic & Grooming
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl font-medium drop-shadow-md">
                  We aim high to be the most trusted and respected pet care
                  provider. Your best choice in veterinary services and grooming
                  in the city!
                </p>
              </div>
              <div>
                <Button
                  className="bg-white text-primary hover:bg-white/90 font-medium text-lg px-8 py-3"
                  onClick={handleBookAppointment}
                >
                  {isAuthenticated ? "Book Appointment" : "Login to Book"}
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
            <div className="max-w-6xl mx-auto">
              <p className="text-primary font-medium mb-2">SERVICES</p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Our Expertise
              </h2>
              <p className="text-muted-foreground max-w-[600px] mb-12">
                Our experience, expertise, and track record make us the perfect
                partner to professionally handle everything from routine
                check-ups to complex veterinary procedures.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => {
                  const IconComponent =
                    serviceIcons[service.name as keyof typeof serviceIcons];

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 flex items-center justify-center text-primary">
                          {IconComponent && (
                            <IconComponent className="w-8 h-8" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                              <AvatarImage
                                src={helper.image}
                                alt={helper.name}
                              />
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
            {isLoading ? (
              <p className="text-center text-secondary-foreground">
                Loading gallery...
              </p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : galleryItems.length > 0 ? (
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {galleryItems.map((item) => (
                    <CarouselItem key={item.id}>
                      <div className="p-1">
                        <Card className="overflow-hidden">
                          <div className="relative aspect-w-16 aspect-h-9">
                            <img
                              src={item.imageUrl}
                              alt={item.pet.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-black/60 to-transparent">
                              <div className="text-white text-center">
                                <h3 className="text-xl font-bold">
                                  {item.pet.name}
                                </h3>
                                <p className="text-sm">{item.pet.breed}</p>
                                <p className="text-xs mt-1">
                                  Owner: {item.pet.owner.firstName}{" "}
                                  {item.pet.owner.lastName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <p className="text-center text-secondary-foreground">
                No gallery items available.
              </p>
            )}
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
      </main>

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
