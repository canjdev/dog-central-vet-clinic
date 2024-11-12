import { useState } from "react";
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
import api from "@/config/api";
import { useNavigate } from "react-router-dom";

// Mock data for medical and booking history
const mockMedicalRecords = [
  {
    date: "2023-05-15",
    treatment: "Annual Checkup",
    veterinarian: "Dr. Sarah Johnson",
    notes: "All vitals normal. Recommended dental cleaning.",
  },
  {
    date: "2023-07-22",
    treatment: "Vaccination",
    veterinarian: "Dr. Michael Lee",
    notes: "Administered annual vaccines. No adverse reactions.",
  },
  {
    date: "2023-09-10",
    treatment: "Dental Cleaning",
    veterinarian: "Dr. Sarah Johnson",
    notes: "Performed dental cleaning. No complications.",
  },
];

const mockBookingHistory = [
  {
    date: "2023-10-05",
    service: "Grooming",
    status: "Completed",
  },
  {
    date: "2023-11-15",
    service: "Vaccination",
    status: "Upcoming",
  },
];

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

interface Appointment {
  id: string;
  ownerId: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  notes: string | null;
  pets: Pet[];
  createdAt: string;
  owner: Owner[];
}

// Mock appointment data
const mockAppointment: Appointment = {
  id: "1",
  ownerId: "1",
  date: "2023-12-01",
  time: "14:00",
  status: "confirmed",
  notes: "Regular checkup",
  pets: [
    {
      id: "1",
      name: "Buddy",
      type: "Dog",
      breed: "Labrador",
      bio: "Friendly and energetic Labrador",
      gender: "Male",
      owner: "John Doe",
      profile: null,
      ownerid: "1",
      created_at: "2023-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Whiskers",
      type: "Cat",
      breed: "Siamese",
      bio: "Calm and affectionate Siamese cat",
      gender: "Female",
      owner: "John Doe",
      profile: null,
      ownerid: "1",
      created_at: "2023-02-20T14:30:00Z",
    },
  ],
  createdAt: "2023-11-15T10:00:00Z",
  owner: [],
};

export function PetMedicalHistory() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg");
  const [owner, setOwner] = useState<Owner>({
    id: "1",
    profilePicture: null,
    firstName: "",
    middleName: "",
    lastName: "",
    createdAt: new Date(),
    contact: "",
    pets: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [hasBookedAppointment /*setHasBookedAppointment*/] = useState(true); // Set to true for demonstration

  const handleLogout = async () => {
    const response = await api.post("/api/auth/logout");
    if (response.status === 204) {
      navigate("/");
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setOwner({ ...owner, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOwner({ ...owner, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      // Implement the API call to save the profile
      // await api.put('/api/owner', owner);
      console.log("Profile saved:", owner);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
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
              <AvatarImage src={avatarUrl} alt="User avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col items-center mb-4">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={avatarUrl} alt="User avatar" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm">
                        Change Picture
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={owner.firstName || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="middleName" className="text-right">
                      Middle Name
                    </Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={owner.middleName || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={owner.lastName || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Contact
                    </Label>
                    <Input
                      id="contact"
                      name="contact"
                      value={owner.contact}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>Save changes</Button>
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
            />
            {hasBookedAppointment && (
              <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Pet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Pet Information</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {mockAppointment.pets.map((pet) => (
                      <div key={pet.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{pet.name}</h3>
                        <p>Type: {pet.type}</p>
                        <p>Breed: {pet.breed || "Not specified"}</p>
                        <p>Gender: {pet.gender || "Not specified"}</p>
                        <p>Bio: {pet.bio}</p>
                        <p>
                          Created:{" "}
                          {new Date(pet.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {hasBookedAppointment ? (
              <div>
                <p>Date: {mockAppointment.date}</p>
                <p>Time: {mockAppointment.time}</p>
                <p>Status: {mockAppointment.status}</p>
                <p>Notes: {mockAppointment.notes}</p>
              </div>
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
                <TableHead>Veterinarian</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMedicalRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
                  <TableCell>{record.veterinarian}</TableCell>
                  <TableCell>{record.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookingHistory.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
