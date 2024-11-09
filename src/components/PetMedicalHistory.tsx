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

export function PetMedicalHistory() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg");

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
      };
      reader.readAsDataURL(file);
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
            <Button
              variant="outline"
              className="w-full"
              onClick={() => console.log("Navigate to booking history")}
            >
              View Booking History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No upcoming appointments</p>
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
                <TableHead>Treatment</TableHead>
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
