"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/config/api";

interface Appointment {
  id: string;
  ownerId: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  notes: string | null;
  pet: Pet;
  createdAt: string;
  owner: Owner;
  service:
    | "Check Up"
    | "Vaccination"
    | "Pet Groom"
    | "Confinement"
    | "Dental Cleaning"
    | "Laboratory"
    | "Pet Boarding"
    | "Surgery"
    | "Ultrasound"
    | "Laser Therapy";
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
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  bio: string;
  gender: string | null;
  owner: string;
  profile: string | null;
  ownerid: string;
  created_at: string;
}

const services = [
  "Check Up",
  "Vaccination",
  "Pet Groom",
  "Confinement",
  "Dental Cleaning",
  "Laboratory",
  "Pet Boarding",
  "Surgery",
  "Ultrasound",
  "Laser Therapy",
] as const;

type Service = (typeof services)[number];

export function AppointmentDialog({
  trigger,
  ownerId,
}: {
  trigger: React.ReactNode;
  ownerId: string;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedService, setSelectedService] = useState<Service | "">("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Owner>(`/api/profiles/${ownerId}`);
        setOwner(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch owner data");
      } finally {
        setIsLoading(false);
      }
    };

    if (ownerId) {
      fetchOwnerData();
    }
  }, [ownerId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!date || !selectedPet || !selectedService || !selectedTime) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    const appointmentData: Partial<Appointment> = {
      ownerId,
      date: date.toISOString().split("T")[0],
      time: selectedTime,
      status: "pending",
      notes: null,
      pet: owner!.pets.find((pet) => pet.id === selectedPet)!,
      service: selectedService as Service,
    };

    try {
      await api.post("/api/appointments", appointmentData);
      setIsConfirmationOpen(true);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-[400px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Fill out the form below to schedule your pet&apos;s visit to Dog
              Central Veterinary Clinic.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pet">Pet</Label>
                <Select
                  value={selectedPet}
                  onValueChange={setSelectedPet}
                  required
                >
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {owner?.pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={selectedService}
                  onValueChange={(value) =>
                    setSelectedService(value as Service)
                  }
                  required
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md p-3"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time Slot</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  required
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM - 11:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00">12:00 PM - 1:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM - 2:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM - 3:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM - 4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Appointment Confirmed</AlertDialogTitle>
            <AlertDialogDescription>
              Your appointment has been successfully scheduled. We look forward
              to seeing you and your pet!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsConfirmationOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
