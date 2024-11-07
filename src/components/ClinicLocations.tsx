import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const locations = [
  {
    name: "Halang Branch",
    iframe:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966.994881220826!2d121.1621007889931!3d14.195977259413104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd63dc8c831575%3A0xc66c997f1d3c082a!2sDog%20Central%20Veterinary%20Clinic%20%26%20Grooming!5e0!3m2!1sen!2sph!4v1730984989969!5m2!1sen!2sph",
    address:
      "2nd Flr Unit E CDC One Bldg. Chipeco Ave. Ext. Halang, Calamba City, Laguna (Beside Alfamart Grocery)",
  },
  {
    name: "San Juan Branch",
    iframe:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3867.6212291013126!2d121.1737001856416!3d14.216942850852998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd614f59972fd7%3A0xf76155a10e8696e!2sDog%20Central%20Veterinary%20Clinic%20and%20Grooming%20San%20Juan%20Calamba%20City!5e0!3m2!1sen!2sph!4v1730988648441!5m2!1sen!2sph",
    address:
      "#225 Brgy. San Juan Calamba City, Laguna (Near Pinagsangahan Arko)",
  },
  {
    name: "Palo Alto Branch",
    iframe:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3867.955937757304!2d121.11269677593651!3d14.197358386820348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd633ff3f0969f%3A0xd4aeebcfd1f21ad4!2sDog%20Central%20Veterinary%20Clinic%20and%20Grooming%20Palo%20Alto!5e0!3m2!1sen!2sph!4v1730988674124!5m2!1sen!2sph",
    address:
      "Ground Floor, Sitio Manggahan, Brgy. Palo Alto, Calamba City, Laguna (Near Southwynds)",
  },
];

export function ClinicLocations() {
  return (
    <Tabs defaultValue={locations[0].name} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {locations.map((location) => (
          <TabsTrigger key={location.name} value={location.name}>
            {location.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {locations.map((location) => (
        <TabsContent key={location.name} value={location.name}>
          <div className="w-full aspect-video">
            <iframe
              src={location.iframe}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="mt-4 text-lg">{location.address}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}
