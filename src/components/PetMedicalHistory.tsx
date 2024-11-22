import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentDialog } from "./AppointmentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/config/api";
import { useNavigate } from "react-router-dom";

// // Mock data for medical and booking history
// const mockMedicalRecords = [
//   {
//     date: "2023-05-15",
//     treatment: "Annual Checkup",
//     veterinarian: "Dr. Sarah Johnson",
//     notes: "All vitals normal. Recommended dental cleaning.",
//   },
//   {
//     date: "2023-07-22",
//     treatment: "Vaccination",
//     veterinarian: "Dr. Michael Lee",
//     notes: "Administered annual vaccines. No adverse reactions.",
//   },
//   {
//     date: "2023-09-10",
//     treatment: "Dental Cleaning",
//     veterinarian: "Dr. Sarah Johnson",
//     notes: "Performed dental cleaning. No complications.",
//   },
// ];

// const mockBookingHistory = [
//   {
//     date: "2023-10-05",
//     service: "Grooming",
//     status: "Completed",
//   },
//   {
//     date: "2023-11-15",
//     service: "Vaccination",
//     status: "Upcoming",
//   },
// ];

interface Appointment {
  id: string;
  ownerId: string;
  date: string;
  time: string;
  services: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  notes: string | null;
  petName: string;
  petType: string;
  owner: Owner;
  pet: Pet;
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
  owner: Owner;
  profile: string | null;
  ownerid: string;
  created_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  owner: Owner;
}

// type Services =
//   | "Check Up"
//   | "Vaccination"
//   | "Pet Grooming"
//   | "Confinement"
//   | "Dental Cleaning"
//   | "Laboratory"
//   | "Pet Boarding"
//   | "Surgery"
//   | "Ultrasound"
//   | "Laser Therapy";

// type AppointmentStatus = "confirmed" | "cancelled" | "completed" | "pending";

// const petTypeOptions = ["cat", "dog", "other"];

// const servicesOptions: Services[] = [
//   "Check Up",
//   "Vaccination",
//   "Pet Grooming",
//   "Confinement",
//   "Dental Cleaning",
//   "Laboratory",
//   "Pet Boarding",
//   "Surgery",
//   "Ultrasound",
//   "Laser Therapy",
// ];

// const statusOptions: AppointmentStatus[] = [
//   "confirmed",
//   "cancelled",
//   "completed",
//   "pending",
// ];

// Mock appointment data
// const mockAppointment: Appointment = {
//   id: "1",
//   ownerId: "1",
//   date: "2023-12-01",
//   time: "14:00",
//   status: "confirmed",
//   notes: "Regular checkup",
//   pets: [
//     {
//       id: "1",
//       name: "Buddy",
//       type: "Dog",
//       breed: "Labrador",
//       bio: "Friendly and energetic Labrador",
//       gender: "Male",
//       owner: "John Doe",
//       profile: null,
//       ownerid: "1",
//       created_at: "2023-01-15T10:00:00Z",
//     },
//     {
//       id: "2",
//       name: "Whiskers",
//       type: "Cat",
//       breed: "Siamese",
//       bio: "Calm and affectionate Siamese cat",
//       gender: "Female",
//       owner: "John Doe",
//       profile: null,
//       ownerid: "1",
//       created_at: "2023-02-20T14:30:00Z",
//     },
//   ],
//   createdAt: "2023-11-15T10:00:00Z",
//   owner: [],
// };

export function PetMedicalHistory() {
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoggedInUserData();
  }, []);

  const fetchLoggedInUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Owner>("/api/profiles/me");
      const loggedInUser = response.data;
      setOwner(loggedInUser);
      await Promise.all([
        fetchNotifications(loggedInUser.id),
        fetchAppointments(loggedInUser.id),
        fetchPets(loggedInUser.id),
      ]);
    } catch (error) {
      console.error("Error fetching logged-in user data:", error);
      setError("Failed to fetch user data. Please try logging in again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async (ownerId: string) => {
    try {
      const response = await api.get<Notification[]>(
        `/api/notifications/${ownerId}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchAppointments = async (ownerId: string) => {
    try {
      const response = await api.get<Appointment[]>(
        `/api/appointments/${ownerId}`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchPets = async (ownerId: string) => {
    try {
      const response = await api.get<Pet[]>(`/api/pets/${ownerId}`);
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleProfileUpdate = async (updatedOwner: Owner) => {
    try {
      await api.put(`/api/profiles/${updatedOwner.id}`, updatedOwner);
      setOwner(updatedOwner);
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const upcomingAppointment = appointments.find(
    (appointment) =>
      appointment.status === "confirmed" || appointment.status === "pending"
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="flex justify-center items-center h-screen">
        No user profile found. Please log in.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={owner.profilePicture || ""} alt="User avatar" />
              <AvatarFallback>
                {owner.firstName?.[0]}
                {owner.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <Dialog
              open={isProfileDialogOpen}
              onOpenChange={setIsProfileDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProfileUpdate(owner);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="profilePicture" className="text-right">
                        Profile Picture
                      </Label>
                      <Input
                        id="profilePicture"
                        value={owner.profilePicture || ""}
                        onChange={(e) =>
                          setOwner({ ...owner, profilePicture: e.target.value })
                        }
                        placeholder="Enter image URL"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstName" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={owner.firstName || ""}
                        onChange={(e) =>
                          setOwner({ ...owner, firstName: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastName" className="text-right">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={owner.lastName || ""}
                        onChange={(e) =>
                          setOwner({ ...owner, lastName: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contact" className="text-right">
                        Contact
                      </Label>
                      <Input
                        id="contact"
                        value={owner.contact}
                        onChange={(e) =>
                          setOwner({ ...owner, contact: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button type="submit">Save changes</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <AppointmentDialog
              trigger={<Button className="w-full">Book Appointment</Button>}
              ownerId={owner.id}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ScrollArea className="h-80">
                  <div className="flex flex-col gap-2 p-4">
                    <h4 className="font-medium leading-none mb-2">
                      Notifications
                    </h4>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex flex-col gap-1 border-b pb-2"
                        >
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No notifications
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Pets
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Your Pets</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full">
                  {pets.map((pet) => (
                    <div key={pet.id} className="mb-4 p-4 border rounded">
                      <h3 className="text-lg font-semibold">{pet.name}</h3>
                      <p>Type: {pet.type}</p>
                      <p>Breed: {pet.breed || "Not specified"}</p>
                      <p>Gender: {pet.gender || "Not specified"}</p>
                      <p>Bio: {pet.bio}</p>
                    </div>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Pet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{upcomingAppointment.date}</TableCell>
                    <TableCell>{upcomingAppointment.time}</TableCell>
                    <TableCell>{upcomingAppointment.services}</TableCell>
                    <TableCell>{upcomingAppointment.petName}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p>No upcoming appointments</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.services}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.notes || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
