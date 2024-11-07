// Define interfaces first
export interface Service {
  name: string;
  description: string;
  image: string;
}

export interface Schedule {
  day: string;
  hours: string;
}

export interface Vet {
  name: string;
  image: string;
  role: string;
  schedule: Schedule[];
  quote: string;
}

export interface Helper {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Patient {
  name: string;
  breed: string;
  image: string;
}

// Export the data
export const services: Service[] = [
  {
    name: "Check Up",
    image: "https://i.ibb.co/fSKJVNs/checkup.png",
    description: "Regular health examinations for your pet",
  },
  {
    name: "Vaccination",
    image: "https://i.ibb.co/pjD8qtx/vaccination.png",
    description: "Protect your pet from various diseases",
  },
  {
    name: "Pet Grooming",
    image: "https://i.ibb.co/qRwp3nN/petgrooming.png",
    description: "Keep your pet clean and healthy",
  },
  {
    name: "Confinement",
    image: "https://i.ibb.co/VxkLYX0/confinement.png",
    description: "Short-term medical care and observation",
  },
  {
    name: "Dental Cleaning",
    image: "https://i.ibb.co/VxwWJ1m/dental.png",
    description: "Maintain your pet's oral health",
  },
  {
    name: "Laboratory",
    image: "https://i.ibb.co/wWn4B4D/laboratory.png",
    description: "Comprehensive diagnostic testing",
  },
  {
    name: "Pet Boarding",
    image: "https://i.ibb.co/mJvR7rm/petboarding.png",
    description: "Safe and comfortable lodging for your pet",
  },
  {
    name: "Surgery",
    image: "https://i.ibb.co/b7g83Hk/surgery.png",
    description: "Various surgical procedures for your pet",
  },
  {
    name: "Ultrasound",
    image: "https://i.ibb.co/X3Fn3rg/ultrasound.png",
    description: "Non-invasive imaging for diagnosis",
  },
  {
    name: "Laser Therapy",
    image: "https://i.ibb.co/5hnVXLc/laser.png",
    description: "Advanced treatment for pain and inflammation",
  },
];

export const vets: Vet[] = [
  {
    name: "Dr. Jocelyn G. Ignacio",
    image: "https://i.ibb.co/6ypbjh6/vet1.png",
    role: "Lead Veterinarian",
    schedule: [
      { day: "Mon-Fri", hours: "9:00 AM - 5:00 PM" },
      { day: "Sat", hours: "09:00 AM - 4:30 PM" },
    ],
    quote:
      "Preventive Medicine has always been the backbone of my practice. I firmly believe that we can lengthen the lives of our pets and prevent serious illness if we rigorously follow the schedule set by a trusted veterinarian. We at Dog Central Veterinary Clinic and Grooming assure you the highest standard be given to your pets in ensuring their health and wellness",
  },
];

export const helpers: Helper[] = [
  {
    name: "Christian Angelo Juan",
    role: "Veterinary Technician",
    quote:
      "I'm passionate about ensuring every pet receives the best possible care and comfort.",
    image: "https://i.ibb.co/hMpngGR/helper1.png",
  },
  {
    name: "Jefferson Garcia",
    role: "Veterinary Assistant",
    quote:
      "Working with animals is not just a job, it's a calling. I'm here to make a difference in their lives.",
    image: "https://i.ibb.co/sbg3fkF/helper2.jpg",
  },
  {
    name: "John Rovic Agor",
    role: "Groomer",
    quote:
      "A well-groomed pet is a happy pet. I love making our furry friends look and feel their best!",
    image: "https://i.ibb.co/qgkb8HS/helper3.png",
  },
  {
    name: "Marco Joemari Salazar",
    role: "Surgeon",
    quote: "All doctors treat, but a good doctor lets nature heal.",
    image: "https://i.ibb.co/fXNk8cX/helper4.jpg",
  },
];

export const patients: Patient[] = [
  {
    name: "Shoyo",
    breed: "Persian X Puspin",
    image:
      "https://i.pinimg.com/originals/1c/ce/44/1cce44a5cf2d805faebdbce46156b629.jpg",
  },
  {
    name: "Yuna",
    breed: "Turkish Angora",
    image: "https://pbs.twimg.com/media/FJYYCYUX0AAF8YW?format=jpg&name=large",
  },
  {
    name: "Twig",
    breed: "Labrador",
    image:
      "https://i.pinimg.com/736x/7e/d0/47/7ed047f028d6954c5f50dacf7a96398d.jpg",
  },
  {
    name: "Twilly",
    breed: "Border Collie",
    image:
      "https://i.pinimg.com/originals/98/0c/87/980c871d6842155f42a48cb12170c14a.jpg",
  },
];
