"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Users,
  PawPrint,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  Search,
  Menu,
  Plus,
  Edit,
  Trash,
  FileText,
  UserCog,
  Send,
  Smile,
  Paperclip,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UserRole = "customer" | "staff" | "veterinarian" | "admin";
interface AdminDashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  status: "confirmed" | "cancelled" | "completed";
}

interface Owner {
  id: number;
  name: string;
  pets: string[];
  phone: string;
}

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  owner: string;
  age: number;
}

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
}

interface Booking {
  id: number;
  service: string;
  pet: string;
  owner: string;
  date: string;
}

interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
}

interface Prescription {
  id: number;
  petName: string;
  medication: string;
  dosage: string;
  instructions: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "veterinarian" | "staff";
}

interface PatientHistory {
  id: number;
  petName: string;
  date: string;
  diagnosis: string;
  treatment: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export function AdminDashboard({ userRole, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [appointments, setAppointments] = useState<Appointment[]>([
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
  ]);

  const [owners, setOwners] = useState<Owner[]>([
    {
      id: 1,
      name: "John Doe",
      pets: ["Max (Dog)", "Whiskers (Cat)"],
      phone: "123-456-7890",
    },
    { id: 2, name: "Jane Smith", pets: ["Buddy (Dog)"], phone: "098-765-4321" },
    {
      id: 3,
      name: "Mike Johnson",
      pets: ["Fluffy (Cat)", "Tweety (Bird)"],
      phone: "555-123-4567",
    },
  ]);

  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: "Max",
      type: "Dog",
      breed: "Golden Retriever",
      owner: "John Doe",
      age: 5,
    },
    {
      id: 2,
      name: "Whiskers",
      type: "Cat",
      breed: "Siamese",
      owner: "John Doe",
      age: 3,
    },
    {
      id: 3,
      name: "Buddy",
      type: "Dog",
      breed: "Labrador",
      owner: "Jane Smith",
      age: 2,
    },
    {
      id: 4,
      name: "Fluffy",
      type: "Cat",
      breed: "Persian",
      owner: "Mike Johnson",
      age: 4,
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: 1,
      sender: "John Doe",
      message: "When is my next appointment?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "Jane Smith",
      message: "I need to reschedule Buddy's checkup.",
      time: "Yesterday",
    },
    {
      id: 3,
      sender: "Mike Johnson",
      message: "Is Fluffy's medication ready for pickup?",
      time: "2 days ago",
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      service: "Grooming",
      pet: "Max (Dog)",
      owner: "John Doe",
      date: "May 15, 2:00 PM",
    },
    {
      id: 2,
      service: "Vaccination",
      pet: "Whiskers (Cat)",
      owner: "John Doe",
      date: "May 17, 10:00 AM",
    },
    {
      id: 3,
      service: "Checkup",
      pet: "Buddy (Dog)",
      owner: "Jane Smith",
      date: "May 20, 3:30 PM",
    },
  ]);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Pet 1",
      caption: "Max the Golden Retriever",
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Pet 2",
      caption: "Whiskers the Siamese Cat",
    },
    {
      id: 3,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Pet 3",
      caption: "Buddy the Labrador",
    },
    {
      id: 4,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Pet 4",
      caption: "Fluffy the Persian Cat",
    },
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      petName: "Max",
      medication: "Antibiotic",
      dosage: "1 pill",
      instructions: "Twice daily with food",
    },
    {
      id: 2,
      petName: "Whiskers",
      medication: "Flea treatment",
      dosage: "1 application",
      instructions: "Monthly",
    },
    {
      id: 3,
      petName: "Buddy",
      medication: "Joint supplement",
      dosage: "1 chew",
      instructions: "Once daily",
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Admin User", email: "admin@example.com", role: "admin" },
    { id: 2, name: "Vet User", email: "vet@example.com", role: "veterinarian" },
    { id: 3, name: "Staff User", email: "staff@example.com", role: "staff" },
  ]);

  const [patientHistory] = useState<PatientHistory[]>([
    {
      id: 1,
      petName: "Max",
      date: "2023-05-01",
      diagnosis: "Ear infection",
      treatment: "Prescribed ear drops",
    },
    {
      id: 2,
      petName: "Whiskers",
      date: "2023-05-10",
      diagnosis: "Annual checkup",
      treatment: "Vaccinations updated",
    },
    {
      id: 3,
      petName: "Buddy",
      date: "2023-05-15",
      diagnosis: "Sprained paw",
      treatment: "Rest and anti-inflammatory medication",
    },
  ]);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab.toLowerCase());
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDeleteItem = <T extends { id: number }>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: number
  ) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setChatMessages([
      {
        id: 1,
        sender: message.sender,
        content: message.message,
        timestamp: message.time,
      },
      {
        id: 2,
        sender: "You",
        content: "How can I help you today?",
        timestamp: "Just now",
      },
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: "Just now",
        },
      ]);
      setNewMessage("");
    }
  };

  const getAccessibleTabs = () => {
    const commonTabs = [
      { icon: Calendar, label: "Overview" },
      { icon: Calendar, label: "Appointments" },
      { icon: Users, label: "Owners" },
      { icon: PawPrint, label: "Pets" },
      { icon: MessageSquare, label: "Messages" },
      { icon: BookOpen, label: "Bookings" },
      { icon: ImageIcon, label: "Gallery" },
    ];

    if (userRole === "veterinarian") {
      return [...commonTabs, { icon: FileText, label: "Prescriptions" }];
    }

    if (userRole === "admin") {
      return [...commonTabs, { icon: UserCog, label: "User Management" }];
    }

    return commonTabs;
  };

  const accessibleTabs = getAccessibleTabs();

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <div
        className={`w-64 bg-white shadow-md flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-4">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2020-H2WL8rPLJfpqcOkz3zhME4AbN8Gmaj.png"
            alt="Dog Central Clinic Logo"
            className="h-8 w-auto mb-6"
          />
        </div>
        <nav className="space-y-2 px-2">
          {accessibleTabs.map((item) => (
            <Button
              key={item.label}
              variant={
                activeTab === item.label.toLowerCase() ? "secondary" : "ghost"
              }
              className="w-full justify-start"
              onClick={() => handleNavClick(item.label.toLowerCase())}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0  .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
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

        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              {accessibleTabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.label.toLowerCase()}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome, Admin Juan
                  </h1>
                  <p className="text-muted-foreground">
                    Have a nice day at work!
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Messages
                      </CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {messages.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +2 new messages
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Appointments
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +3 new appointments
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pets
                      </CardTitle>
                      <PawPrint className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pets.length}</div>
                      <p className="text-xs text-muted-foreground">
                        +1 new pet registered
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>Recent Messages</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavClick("messages")}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {messages.map((message) => (
                          <div key={message.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {message.sender[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {message.sender}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {message.message}
                              </p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-muted-foreground">
                              {message.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>Recent Appointments</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavClick("appointments")}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {appointments.slice(0, 5).map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center"
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {appointment.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {appointment.patientName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.date}
                              </p>
                            </div>
                            <div
                              className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                appointment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Patient History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pet Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Diagnosis</TableHead>
                          <TableHead>Treatment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientHistory.map((history) => (
                          <TableRow key={history.id}>
                            <TableCell>{history.petName}</TableCell>
                            <TableCell>{history.date}</TableCell>
                            <TableCell>{history.diagnosis}</TableCell>
                            <TableCell>{history.treatment}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Appointment List
                      </h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Appointment</DialogTitle>
                          </DialogHeader>
                          {/* Add appointment form */}
                          <form className="space-y-4">
                            <div>
                              <label
                                htmlFor="patientName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Patient Name
                              </label>
                              <Input
                                id="patientName"
                                placeholder="Enter patient name"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Date
                              </label>
                              <Input id="date" type="datetime-local" />
                            </div>
                            <div>
                              <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Status
                              </label>
                              <select
                                id="status"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              >
                                <option>confirmed</option>
                                <option>cancelled</option>
                                <option>completed</option>
                              </select>
                            </div>
                            <Button type="submit">Add Appointment</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{appointment.patientName}</TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem(
                                    appointments,
                                    setAppointments,
                                    appointment.id
                                  )
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Owner List</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Owner
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Owner</DialogTitle>
                          </DialogHeader>
                          {/* Add owner form */}
                          <form className="space-y-4">
                            <div>
                              <label
                                htmlFor="ownerName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Owner Name
                              </label>
                              <Input
                                id="ownerName"
                                placeholder="Enter owner name"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="pets"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Pets
                              </label>
                              <Input
                                id="pets"
                                placeholder="Enter pets (comma separated)"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Phone
                              </label>
                              <Input
                                id="phone"
                                placeholder="Enter phone number"
                              />
                            </div>
                            <Button type="submit">Add Owner</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Pets</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {owners.map((owner) => (
                          <TableRow key={owner.id}>
                            <TableCell>{owner.name}</TableCell>
                            <TableCell>{owner.pets.join(", ")}</TableCell>
                            <TableCell>{owner.phone}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem(owners, setOwners, owner.id)
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pets">
              <Card>
                <CardHeader>
                  <CardTitle>Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Pet List</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Pet
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Pet</DialogTitle>
                          </DialogHeader>
                          {/* Add pet form */}
                          <form className="space-y-4">
                            <div>
                              <label
                                htmlFor="petName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Pet Name
                              </label>
                              <Input
                                id="petName"
                                placeholder="Enter pet name"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="petType"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Pet Type
                              </label>
                              <Input
                                id="petType"
                                placeholder="Enter pet type"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="breed"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Breed
                              </label>
                              <Input id="breed" placeholder="Enter breed" />
                            </div>
                            <div>
                              <label
                                htmlFor="owner"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Owner
                              </label>
                              <Input
                                id="owner"
                                placeholder="Enter owner name"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="age"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Age
                              </label>
                              <Input
                                id="age"
                                type="number"
                                placeholder="Enter age"
                              />
                            </div>
                            <Button type="submit">Add Pet</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Breed</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pets.map((pet) => (
                          <TableRow key={pet.id}>
                            <TableCell>{pet.name}</TableCell>
                            <TableCell>{pet.type}</TableCell>
                            <TableCell>{pet.breed}</TableCell>
                            <TableCell>{pet.owner}</TableCell>
                            <TableCell>{pet.age}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem(pets, setPets, pet.id)
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="messages"
              className="h-[calc(100vh-8rem)] -mx-6 -my-6"
            >
              <div className="flex h-full">
                {/* Messages sidebar */}
                <div className="w-80 bg-white border-r">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Messages</h2>
                  </div>
                  <div className="h-[calc(100%-4rem)] overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-center p-4 gap-3 cursor-pointer hover:bg-gray-50 ${
                          selectedMessage?.id === message.id
                            ? "bg-gray-100"
                            : ""
                        }`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback>{message.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm">
                              {message.sender}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {message.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col bg-white">
                  {selectedMessage ? (
                    <>
                      <div className="px-4 h-16 flex items-center border-b">
                        <h2 className="font-semibold">
                          {selectedMessage.sender}
                        </h2>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender === "You"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-md px-4 py-2 rounded-lg ${
                                msg.sender === "You"
                                  ? "bg-primary text-primary-foreground ml-12"
                                  : "bg-muted mr-12"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <span className="text-xs opacity-75 block mt-1">
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
                            className="flex-1"
                          />
                          <Button size="icon" variant="ghost">
                            <Smile className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button size="icon" onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select a message to start chatting
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Booking List</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Booking
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Booking</DialogTitle>
                          </DialogHeader>
                          {/* Add booking form */}
                          <form className="space-y-4">
                            <div>
                              <label
                                htmlFor="service"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Service
                              </label>
                              <Input
                                id="service"
                                placeholder="Enter service type"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="pet"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Pet
                              </label>
                              <Input id="pet" placeholder="Enter pet name" />
                            </div>
                            <div>
                              <label
                                htmlFor="owner"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Owner
                              </label>
                              <Input
                                id="owner"
                                placeholder="Enter owner name"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Date
                              </label>
                              <Input id="date" type="datetime-local" />
                            </div>
                            <Button type="submit">Add Booking</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Pet</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>{booking.service}</TableCell>
                            <TableCell>{booking.pet}</TableCell>
                            <TableCell>{booking.owner}</TableCell>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteItem(
                                    bookings,
                                    setBookings,
                                    booking.id
                                  )
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Pet Gallery</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Image
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Image</DialogTitle>
                          </DialogHeader>
                          {/* Add image form */}
                          <form className="space-y-4">
                            <div>
                              <label
                                htmlFor="imageUrl"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Image URL
                              </label>
                              <Input
                                id="imageUrl"
                                placeholder="Enter image URL"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="caption"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Caption
                              </label>
                              <Input
                                id="caption"
                                placeholder="Enter image caption"
                              />
                            </div>
                            <Button type="submit">Add Image</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="relative group overflow-hidden rounded-lg"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.caption}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white text-center p-4">
                              {item.caption}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() =>
                              handleDeleteItem(
                                galleryItems,
                                setGalleryItems,
                                item.id
                              )
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {userRole === "veterinarian" && (
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader>
                    <CardTitle>Prescriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Prescription List
                        </h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Prescription
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Prescription</DialogTitle>
                            </DialogHeader>
                            {/* Add prescription form */}
                            <form className="space-y-4">
                              <div>
                                <label
                                  htmlFor="petName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Pet Name
                                </label>
                                <Input
                                  id="petName"
                                  placeholder="Enter pet name"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="medication"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Medication
                                </label>
                                <Input
                                  id="medication"
                                  placeholder="Enter medication"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="dosage"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Dosage
                                </label>
                                <Input id="dosage" placeholder="Enter dosage" />
                              </div>
                              <div>
                                <label
                                  htmlFor="instructions"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Instructions
                                </label>
                                <Input
                                  id="instructions"
                                  placeholder="Enter instructions"
                                />
                              </div>
                              <Button type="submit">Add Prescription</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pet Name</TableHead>
                            <TableHead>Medication</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Instructions</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prescriptions.map((prescription) => (
                            <TableRow key={prescription.id}>
                              <TableCell>{prescription.petName}</TableCell>
                              <TableCell>{prescription.medication}</TableCell>
                              <TableCell>{prescription.dosage}</TableCell>
                              <TableCell>{prescription.instructions}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mr-2"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteItem(
                                      prescriptions,
                                      setPrescriptions,
                                      prescription.id
                                    )
                                  }
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {userRole === "admin" && (
              <TabsContent value="user management">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">User List</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add User
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New User</DialogTitle>
                            </DialogHeader>
                            {/* Add user form */}
                            <form className="space-y-4">
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Name
                                </label>
                                <Input id="name" placeholder="Enter name" />
                              </div>
                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Email
                                </label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="Enter email"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="role"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Role
                                </label>
                                <select
                                  id="role"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="veterinarian">
                                    Veterinarian
                                  </option>
                                  <option value="staff">Staff</option>
                                </select>
                              </div>
                              <Button type="submit">Add User</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mr-2"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteItem(users, setUsers, user.id)
                                  }
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
}
