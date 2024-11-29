import { services } from "@/utils/sharedUtils";
import {   
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
import { LucideProps } from 'lucide-react';

// Define a type for service names
type ServiceName = 
  | "Check Up"
  | "Vaccination"
  | "Pet Grooming"
  | "Confinement"
  | "Dental Cleaning"
  | "Laboratory"
  | "Pet Boarding"
  | "Surgery"
  | "Ultrasound"
  | "Laser Therapy";

  const serviceIcons: Record<ServiceName, React.ComponentType<LucideProps>> = {
    "Check Up": Stethoscope,
    "Vaccination": Syringe,
    "Pet Grooming": Scissors,
    "Confinement": Building2,
    "Dental Cleaning": Tooth,
    "Laboratory": FlaskConical,
    "Pet Boarding": Home,
    "Surgery": Scalpel,
    "Ultrasound": Radio,
    "Laser Therapy": Zap,
  };
  
  export function ServicesSection() {
    return (
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
              partner to professionally handle everything from minor repairs to a
              grassroots plant addition.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => {
                const IconComponent = serviceIcons[service.name as ServiceName];
                
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 flex items-center justify-center text-primary">
                        {IconComponent && <IconComponent className="w-8 h-8" />}
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
    );
  }