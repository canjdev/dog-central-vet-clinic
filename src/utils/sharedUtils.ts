export const services = [
  {
    name: "Vaccinations",
    description: "Keep your pet healthy with up-to-date vaccinations",
  },
  {
    name: "Surgery",
    description: "Expert surgical care for your furry friends",
  },
  { name: "Dental Care", description: "Maintain your pet's oral health" },
  {
    name: "Nutrition Counseling",
    description: "Personalized diet plans for optimal pet health",
  },
];

export const vets = [
  {
    name: "Dr. Sarah Johnson",
    image: "/placeholder.svg?height=200&width=200",
    schedule: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "10:00 AM - 6:00 PM" },
      { day: "Friday", hours: "9:00 AM - 4:00 PM" },
    ],
  },
  {
    name: "Dr. Michael Lee",
    image: "/placeholder.svg?height=200&width=200",
    schedule: [
      { day: "Tuesday", hours: "8:00 AM - 4:00 PM" },
      { day: "Thursday", hours: "11:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
    ],
  },
  {
    name: "Dr. Emily Chen",
    image: "/placeholder.svg?height=200&width=200",
    schedule: [
      { day: "Monday", hours: "11:00 AM - 7:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "10:00 AM - 6:00 PM" },
    ],
  },
];

import gallery1 from "../assets/gallery_1.png";
import gallery2 from "../assets/gallery_2.png";
import gallery3 from "../assets/gallery_3.png";
import gallery4 from "../assets/gallery_4.png";
export const patients = [
  {
    name: "Shoyo",
    breed: "Patay Gutom",
    image: gallery1,
  },
  { name: "Yuna", breed: "Dugyot", image: gallery2 },
  { name: "Twig", breed: "Mabaho", image: gallery3 },
  { name: "Twilly", breed: "Iyakin", image: gallery4 },
];
