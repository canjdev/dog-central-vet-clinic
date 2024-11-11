import { useState } from "react";
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
import { Input } from "@/components/ui/input";
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
import { services } from "@/utils/sharedUtils";

export function AppointmentDialog({ trigger }: { trigger: React.ReactNode }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsConfirmationOpen(true);
    setIsDialogOpen(false);
  };

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
                <Label htmlFor="pet-name">Pet&apos;s Name</Label>
                <Input id="pet-name" placeholder="Enter pet's name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pet-type">Pet Type</Label>
                <Select required>
                  <SelectTrigger id="pet-type">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" placeholder="Enter pet's breed" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select required>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="neutered">Neutered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select required>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service, index) => (
                      <SelectItem
                        key={index}
                        value={service.name.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {service.name}
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
                <Select required>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">9:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10">10:00 AM - 11:00 AM</SelectItem>
                    <SelectItem value="11">11:00 AM - 12:00 NN</SelectItem>
                    <SelectItem value="14">12:00 NN - 1:00 PM</SelectItem>
                    <SelectItem value="15">1:00 PM - 2:00 PM</SelectItem>
                    <SelectItem value="16">2:00 PM - 3:00 PM</SelectItem>
                    <SelectItem value="17">3:00 PM - 4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-2" type="submit">
                Schedule Appointment
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
