import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  LayoutGrid,
  Calendar as CalendarIcon,
  Users,
  Image,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

interface AdminDashboardProps {
  userRole: "staff" | "admin";
}

const sidebarItems = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: CalendarIcon, label: "Appointments" },
  { icon: Users, label: "Patients" },
  { icon: Image, label: "Pet Showcase" },
  { icon: MessageSquare, label: "Messages" },
];

const appointmentRequests = [
  {
    name: "Christian Angelo Juan",
    date: "Sat, 24 May, 8:00am",
    status: "Accepted",
  },
  {
    name: "Jefferson Garcia",
    date: "Sat, 27 May, 10:00am",
    status: "Declined",
  },
  {
    name: "Marco Joemar Salazar",
    date: "Sun, 30 May, 2:00pm",
    status: "Accepted",
  },
  { name: "John Rovic Agar", date: "Sat, 3 June, 09:00am", status: "Accepted" },
  { name: "Joboy Mendoza", date: "Sun, 5 June, 03:00pm", status: "Pending" },
  { name: "Gabiru Mallari", date: "Sun, 11 June, 11:00am", status: "Pending" },
  { name: "Yuri Villanueva", date: "Sat, 14 June, 12:00pm", status: "Pending" },
  { name: "Jan Jan Visco", date: "Sat, 20 June, 5:00pm", status: "Pending" },
];

const patientData = [
  { name: "Dogs", value: 40, color: "#36A2EB" },
  { name: "Cats", value: 50, color: "#4BC0C0" },
  { name: "Guinea Pig", value: 10, color: "#FFCE56" },
];

const recentPatients = [
  {
    name: "Christian Angelo Juan",
    visitId: "OPD-425",
    date: "04/30/24",
    pet: "Shoya / Cat",
    status: "Out-Patient",
  },
];

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-orange-500">Dogs Central</h1>
          <p className="text-sm text-gray-500">Veterinary Care & Grooming</p>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-3 text-gray-700 ${
                item.active ? "bg-orange-100 border-r-4 border-orange-500" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to the Main Website
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <Input type="search" placeholder="Search..." className="w-64" />
            <div className="flex items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback>CJ</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Christian Juan</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome, Admin Juan</h2>
          <p className="text-gray-600 mb-8">Have a nice day at work!</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <Card className="bg-green-500 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-bold">3</CardTitle>
                <CalendarIcon className="w-6 h-6 opacity-75" />
              </CardHeader>
              <CardContent>
                <p className="text-lg">Appointments</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-bold">10</CardTitle>
                <Users className="w-6 h-6 opacity-75" />
              </CardHeader>
              <CardContent>
                <p className="text-lg">Patients</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Appointment Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentRequests.map((appointment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarFallback>{appointment.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {appointment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.date}
                          </p>
                        </div>
                      </div>
                      {appointment.status === "Pending" ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500 border-green-500"
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-500"
                          >
                            ✗
                          </Button>
                        </div>
                      ) : (
                        <span
                          className={`text-sm ${
                            appointment.status === "Accepted"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {patientData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4">
                    {patientData.map((entry, index) => (
                      <div key={index} className="flex items-center mx-2">
                        <div
                          className="w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Today's Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500">None</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <Calendar />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2">Patient Name</th>
                    <th className="pb-2">Visit ID</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Pet</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{patient.name}</td>
                      <td className="py-2">{patient.visitId}</td>
                      <td className="py-2">{patient.date}</td>
                      <td className="py-2">{patient.pet}</td>
                      <td className="py-2">{patient.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
