import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Calendar,
  Users,
  PawPrint,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  Search,
  Menu,
} from "lucide-react";

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  status: "confirmed" | "cancelled" | "completed";
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "Christian Angelo Juan",
    date: "May 24, 1:00pm",
    status: "confirmed",
  },
  {
    id: 2,
    patientName: "Jefferson Garcia",
    date: "May 27, 2:30pm",
    status: "cancelled",
  },
  {
    id: 3,
    patientName: "Marco Joemar Salazar",
    date: "May 30, 10:00am",
    status: "confirmed",
  },
  {
    id: 4,
    patientName: "John Rovic Agar",
    date: "June 1, 3:00pm",
    status: "confirmed",
  },
  {
    id: 5,
    patientName: "Jobby Mendoza",
    date: "June 3, 11:00am",
    status: "completed",
  },
];

interface Patient {
  id: number;
  name: string;
  visitId: string;
  date: string;
  pet: string;
  status: string;
}

const recentPatients: Patient[] = [
  {
    id: 1,
    name: "Christian Angelo Juan",
    visitId: "OPD-425",
    date: "04/30/24",
    pet: "Shopy / Cat",
    status: "Out-Patient",
  },
];

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <div
        className={`w-56 bg-white shadow-md flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-3 mb-1">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2020-H2WL8rPLJfpqcOkz3zhME4AbN8Gmaj.png"
            alt="Dog Central Clinic Logo"
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex-1">
          {[
            { icon: LayoutDashboard, label: "Overview" },
            { icon: Calendar, label: "Appointments" },
            { icon: Users, label: "Owners" },
            { icon: PawPrint, label: "Pets" },
            { icon: MessageSquare, label: "Messages" },
            { icon: BookOpen, label: "Bookings" },
            { icon: ImageIcon, label: "Gallery" },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start px-3 py-1.5 text-left text-sm ${
                activeTab === item.label.toLowerCase() ? "bg-gray-100" : ""
              }`}
              onClick={() => handleNavClick(item.label.toLowerCase())}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full text-sm py-1"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-3 w-3" /> Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="relative flex-1 max-w-xs mx-auto lg:mx-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="Admin"
                      />
                      <AvatarFallback>CJ</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Christian Juan
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@dogcentral.com
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="owners">Owners</TabsTrigger>
              <TabsTrigger value="pets">Pets</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome, Admin Juan
                </h1>
                <p className="text-gray-500">Have a nice day at work!</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-6">
                <Card className="bg-green-500 text-white">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <CardTitle className="text-4xl font-bold">3</CardTitle>
                      <p>Appointments</p>
                    </div>
                    <Calendar className="h-12 w-12" />
                  </CardContent>
                </Card>
                <Card className="bg-red-500 text-white">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <CardTitle className="text-4xl font-bold">10</CardTitle>
                      <p>Patients</p>
                    </div>
                    <Users className="h-12 w-12" />
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">
                      Appointments
                    </CardTitle>
                    <Button variant="link">View all</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center space-x-4"
                        >
                          <Avatar>
                            <AvatarFallback>
                              {appointment.patientName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {appointment.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">
                      Patients
                    </CardTitle>
                    <Button variant="link">View all</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <svg className="w-48 h-48" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="10"
                            strokeDasharray="188.5 251.3"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray="62.8 251.3"
                            strokeDashoffset="-188.5"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="10"
                            strokeDasharray="12.56 251.3"
                            strokeDashoffset="-251.3"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-wrap justify-around text-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span>Dogs 75%</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Cats 20%</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span>Guinea Pig 5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 bg-gray-50">Patient Name</th>
                        <th className="px-6 py-3 bg-gray-50">Visit ID</th>
                        <th className="px-6 py-3 bg-gray-50">Date</th>
                        <th className="px-6 py-3 bg-gray-50">Pet</th>
                        <th className="px-6 py-3 bg-gray-50">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPatients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {patient.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.visitId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.pet}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {appointment.patientName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.date}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="owners">
              <Card>
                <CardHeader>
                  <CardTitle>Pet Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "John Doe",
                        pets: ["Max (Dog)", "Whiskers (Cat)"],
                        phone: "123-456-7890",
                      },
                      {
                        name: "Jane Smith",
                        pets: ["Buddy (Dog)"],
                        phone: "098-765-4321",
                      },
                      {
                        name: "Mike Johnson",
                        pets: ["Fluffy (Cat)", "Tweety (Bird)"],
                        phone: "555-123-4567",
                      },
                    ].map((owner, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                      >
                        <div>
                          <p className="font-medium">{owner.name}</p>
                          <p className="text-sm text-gray-500">
                            {owner.pets.join(", ")}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {owner.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pets">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Max",
                        type: "Dog",
                        breed: "Golden Retriever",
                        owner: "John Doe",
                        age: 5,
                      },
                      {
                        name: "Whiskers",
                        type: "Cat",
                        breed: "Siamese",
                        owner: "John Doe",
                        age: 3,
                      },
                      {
                        name: "Buddy",
                        type: "Dog",
                        breed: "Labrador",
                        owner: "Jane Smith",
                        age: 2,
                      },
                      {
                        name: "Fluffy",
                        type: "Cat",
                        breed: "Persian",
                        owner: "Mike Johnson",
                        age: 4,
                      },
                    ].map((pet, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                      >
                        <div>
                          <p className="font-medium">{pet.name}</p>
                          <p className="text-sm text-gray-500">
                            {pet.type} - {pet.breed}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{pet.owner}</p>
                          <p className="text-sm text-gray-500">
                            {pet.age} years old
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        sender: "John Doe",
                        message: "When is my next appointment?",
                        time: "10:30 AM",
                      },
                      {
                        sender: "Jane Smith",
                        message: "I need to reschedule Buddy's checkup.",
                        time: "Yesterday",
                      },
                      {
                        sender: "Mike Johnson",
                        message: "Is Fluffy's medication ready for pickup?",
                        time: "2 days ago",
                      },
                    ].map((message, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow"
                      >
                        <Avatar>
                          <AvatarFallback>{message.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{message.sender}</p>
                          <p className="text-sm text-gray-500">
                            {message.message}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {message.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        service: "Grooming",
                        pet: "Max (Dog)",
                        owner: "John Doe",
                        date: "May 15, 2:00 PM",
                      },
                      {
                        service: "Vaccination",
                        pet: "Whiskers (Cat)",
                        owner: "John Doe",
                        date: "May 17, 10:00 AM",
                      },
                      {
                        service: "Checkup",
                        pet: "Buddy (Dog)",
                        owner: "Jane Smith",
                        date: "May 20, 3:30 PM",
                      },
                    ].map((booking, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                      >
                        <div>
                          <p className="font-medium">{booking.service}</p>
                          <p className="text-sm text-gray-500">
                            {booking.pet} - {booking.owner}
                          </p>
                        </div>
                        <div className="text-sm">{booking.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Pet Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={`/placeholder.svg?height=300&width=300&text=Pet ${item}`}
                          alt={`Pet ${item}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
        )}
      </div>
    </div>
  );
}
