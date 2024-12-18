import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  ownerId: string;
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

export function PetMedicalHistory() {
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const petTypes = ["dog", "cat", "other"];
  const petGenders = ["male", "female", "neutered"];

  useEffect(() => {
    fetchLoggedInUserData();
  }, []);

  const fetchLoggedInUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Owner>("/api/users/profile/");
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
        `/api/notifications/owner/${ownerId}`,
      );
      setNotifications(response.data);
      setHasUnreadNotifications(
        response.data.some((notification) => !notification.read),
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchAppointments = async (ownerId: string) => {
    try {
      const response = await api.get<Appointment[]>(
        `/api/appointments/owner/${ownerId}`,
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchPets = async (ownerId: string) => {
    try {
      const response = await api.get<Pet[]>(`/api/pets/owner/${ownerId}`);
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

  const handleAddPet = async (
    newPet: Omit<Pet, "id" | "owner" | "created_at">,
  ) => {
    console.log(newPet);
    try {
      const response = await api.post<Pet>("/api/pets", newPet);
      setPets([...pets, response.data]);
      setIsAddPetDialogOpen(false);
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  const upcomingAppointment = appointments.find(
    (appointment) =>
      appointment.status === "confirmed" || appointment.status === "pending",
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

  const handleSubmitAddPet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dataObject: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      dataObject[key] = value.toString();
    });

    let petOwner: Owner;
    api.get<Owner>("/api/users/profile").then((response) => {
      petOwner = response.data;

      const newPet = {
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        breed: (formData.get("breed") as string) || null,
        gender: (formData.get("gender") as string) || null,
        bio: formData.get("bio") as string,
        profile: null,
        ownerId: petOwner.id,
      };
      handleAddPet(newPet);
    });
  };

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
                <Button
                  variant="outline"
                  className={`w-full ${hasUnreadNotifications ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  {hasUnreadNotifications && (
                    <span className="ml-2 text-xs bg-white text-red-500 rounded-full px-2 py-1">
                      New
                    </span>
                  )}
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
                    </div>
                  ))}
                </ScrollArea>
                <Button
                  onClick={() => setIsAddPetDialogOpen(true)}
                  className="mt-4"
                >
                  Add Pet
                </Button>
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
                    <TableCell>{upcomingAppointment.pet.name}</TableCell>
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

      <Dialog open={isAddPetDialogOpen} onOpenChange={setIsAddPetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pet</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmitAddPet(e)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select name="type" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {petTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="breed" className="text-right">
                  Breed
                </Label>
                <Input id="breed" name="breed" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <Select name="gender">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select pet gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {petGenders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input id="bio" name="bio" className="col-span-3" />
              </div>
            </div>
            <Button type="submit">Add Pet</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
