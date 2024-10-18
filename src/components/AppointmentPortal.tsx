import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type Appointment = {
  id: number;
  petName: string;
  ownerName: string;
  date: Date;
  time: string;
};

export function AppointmentPortal() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      petName: "Max",
      ownerName: "John Doe",
      date: new Date(2023, 6, 1),
      time: "10:00 AM",
    },
    {
      id: 2,
      petName: "Bella",
      ownerName: "Jane Smith",
      date: new Date(2023, 6, 2),
      time: "2:00 PM",
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleScheduleAppointment = () => {
    if (selectedDate && petName && ownerName && selectedTime) {
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        petName,
        ownerName,
        date: selectedDate,
        time: selectedTime,
      };
      setAppointments([...appointments, newAppointment]);
      setPetName("");
      setOwnerName("");
      setSelectedTime("");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Appointment Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="view">
          <TabsList>
            <TabsTrigger value="view">View Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Appointment</TabsTrigger>
          </TabsList>
          <TabsContent value="view">
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <p>
                      <strong>Pet:</strong> {appointment.petName}
                    </p>
                    <p>
                      <strong>Owner:</strong> {appointment.ownerName}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(appointment.date, "MMMM d, yyyy")}
                    </p>
                    <p>
                      <strong>Time:</strong> {appointment.time}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="schedule">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="petName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pet Name
                </label>
                <Input
                  id="petName"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Enter pet name"
                />
              </div>
              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Owner Name
                </label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                    <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                    <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleScheduleAppointment}>
                Schedule Appointment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
