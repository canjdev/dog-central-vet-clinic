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
    image: "/placeholder.svg?height=100&width=100",
    description: "Regular health examinations for your pet",
  },
  {
    name: "Vaccination",
    image: "/placeholder.svg?height=100&width=100",
    description: "Protect your pet from various diseases",
  },
  {
    name: "Pet Grooming",
    image: "/placeholder.svg?height=100&width=100",
    description: "Keep your pet clean and healthy",
  },
  {
    name: "Confinement",
    image: "/placeholder.svg?height=100&width=100",
    description: "Short-term medical care and observation",
  },
  {
    name: "Dental Cleaning",
    image: "/placeholder.svg?height=100&width=100",
    description: "Maintain your pet's oral health",
  },
  {
    name: "Laboratory",
    image: "/placeholder.svg?height=100&width=100",
    description: "Comprehensive diagnostic testing",
  },
  {
    name: "Pet Boarding",
    image: "/placeholder.svg?height=100&width=100",
    description: "Safe and comfortable lodging for your pet",
  },
  {
    name: "Surgery",
    image: "/placeholder.svg?height=100&width=100",
    description: "Various surgical procedures for your pet",
  },
  {
    name: "Ultrasound",
    image: "/placeholder.svg?height=100&width=100",
    description: "Non-invasive imaging for diagnosis",
  },
  {
    name: "Laser Therapy",
    image: "/placeholder.svg?height=100&width=100",
    description: "Advanced treatment for pain and inflammation",
  },
];

export const vets: Vet[] = [
  {
    name: "Dr. Sarah Johnson",
    image: "/placeholder.svg?height=200&width=200",
    role: "Lead Veterinarian",
    schedule: [
      { day: "Mon-Fri", hours: "9:00 AM - 5:00 PM" },
      { day: "Sat", hours: "10:00 AM - 2:00 PM" },
    ],
    quote:
      "Every pet deserves the highest quality of care. That's our promise to you and your furry family members.",
  },
  {
    name: "Dr. Michael Lee",
    image: "/placeholder.svg?height=200&width=200",
    role: "Veterinary Surgeon",
    schedule: [
      { day: "Mon-Thu", hours: "8:00 AM - 4:00 PM" },
      { day: "Fri", hours: "8:00 AM - 12:00 PM" },
    ],
    quote:
      "Surgical excellence and compassionate care are the cornerstones of our practice.",
  },
];

export const helpers: Helper[] = [
  {
    name: "Emily Brown",
    role: "Veterinary Technician",
    quote:
      "I'm passionate about ensuring every pet receives the best possible care and comfort.",
  },
  {
    name: "John Smith",
    role: "Veterinary Assistant",
    quote:
      "Working with animals is not just a job, it's a calling. I'm here to make a difference in their lives.",
  },
  {
    name: "Lisa Chen",
    role: "Groomer",
    quote:
      "A well-groomed pet is a happy pet. I love making our furry friends look and feel their best!",
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
