"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
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
  // FileText,
  // UserCog,
  Send,
  Bell,
  Check,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/config/api";

// export type UserRole = "customer" | "staff" | "veterinarian" | "admin";

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
  owner: string;
  profile: string | null;
  ownerid: string;
  created_at: string;
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

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  ownerName: string;
}

type Services =
  | "Check Up"
  | "Vaccination"
  | "Pet Grooming"
  | "Confinement"
  | "Dental Cleaning"
  | "Laboratory"
  | "Pet Boarding"
  | "Surgery"
  | "Ultrasound"
  | "Laser Therapy";
type AppointmentStatus = "confirmed" | "cancelled" | "completed" | "pending";

const servicesOptions: Services[] = [
  "Check Up",
  "Vaccination",
  "Pet Grooming",
  "Confinement",
  "Dental Cleaning",
  "Laboratory",
  "Pet Boarding",
  "Surgery",
  "Ultrasound",
  "Laser Therapy",
];

const statusOptions: AppointmentStatus[] = [
  "confirmed",
  "cancelled",
  "completed",
  "pending",
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timeOptions = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Appointment[]>("/api/appointments");
      setAppointments(response.data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching appointments");
    } finally {
      setIsLoading(false);
    }
  };
  // const fetchPetDetails = async (petId: string): Promise<Pet> => {
  //   try {
  //     const response = await api.get<Pet>(`/api/pets/${petId}`);
  //     return response.data;
  //   } catch (err) {
  //     console.error("Error fetching pet details:", err);
  //     throw new Error("Failed to fetch pet details");
  //   }
  // };

  const handleAddAppointment = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointmentData = Object.fromEntries(formData);
      console.log("Sending new appointment data:", newAppointmentData);
      const response = await api.post("/api/appointments", newAppointmentData);
      console.log("Received response:", response.data);

      const newAppointment: Appointment = {
        ...response.data,
        pet: {
          id: response.data.petId,
          name: newAppointmentData.petName as string,
          type: newAppointmentData.petType as string,
        },
      };

      setAppointments([...appointments, newAppointment]);
    } catch (err) {
      console.error(err);
      setError("An error occurred while adding the appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = async (formData: FormData) => {
    if (!editingAppointment) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedAppointmentData = Object.fromEntries(formData);
      console.log(
        `Sending update request to /api/appointments/${editingAppointment.id} with data:`,
        updatedAppointmentData
      );
      const response = await api.put(
        `/api/appointments/${editingAppointment.id}`,
        updatedAppointmentData
      );
      console.log("Received response:", response.data);

      if (response.status === 200) {
        const updatedAppointment: Appointment = {
          ...response.data,
          pet: {
            id: response.data.petId,
            name: updatedAppointmentData.petName as string,
            type: updatedAppointmentData.petType as string,
          },
        };

        setAppointments(
          appointments.map((app) =>
            app.id === editingAppointment.id ? updatedAppointment : app
          )
        );
        setEditingAppointment(null);
        setIsEditDialogOpen(false);
      } else {
        throw new Error(
          `Failed to update appointment. Status: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(
        `An error occurred while updating the appointment: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/api/appointments/${id}`);
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const [owners, setOwners] = useState<Owner[]>([]);

  const fetchOwner = async () => {
    try {
      const response = await api.get<Owner[]>("/api/profiles");
      setOwners(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchOwner();
  }, []);

  const deleteOwner = async (ownerId: string) => {
    try {
      await api.delete(`/api/profiles/${ownerId}`);
      fetchOwner(); // Refresh the list of owners
    } catch (err) {
      console.log(err);
    }
  };

  const [pets, setPets] = useState<Pet[]>([]);
  const [totalPets, setTotalPets] = useState(0);
  const [newPetsCount, setNewPetsCount] = useState(0);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get<Pet[]>("/api/pets");
        setPets(response.data);
        setTotalPets(response.data.length);
        const lastHour = new Date(Date.now() - 60 * 60 * 1000); // 1 hour in milliseconds
        const recentPets = response.data.filter((pet) => {
          const petCreatedAt = new Date(pet.created_at);
          return petCreatedAt > lastHour;
        });
        setNewPetsCount(recentPets.length);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPets();
  }, []);

  const deletePets = async (petId: string) => {
    try {
      await api.delete(`/api/pets/${petId}`);
      fetchOwner(); // Refresh the list of owners
    } catch (err) {
      console.log(err);
    }
  };

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

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Appointment",
      message: "You have a new appointment request",
      time: "5 min ago",
      read: false,
      ownerName: "Christian Angelo Juan",
    },
    {
      id: 2,
      title: "Medication Reminder",
      message: "Don't forget to administer Max's medication",
      time: "1 hour ago",
      read: false,
      ownerName: "Jefferson Garcia",
    },
    {
      id: 3,
      title: "System Update",
      message: "The system will undergo maintenance tonight",
      time: "2 hours ago",
      read: true,
      ownerName: "System",
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

  const handleLogout = async () => {
    const response = await api.post("/api/auth/logout");
    if (response.status === 204) {
      navigate("/");
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  const addNotification = (
    newNotification: Omit<Notification, "id" | "read">
  ) => {
    setNotifications([
      ...notifications,
      { ...newNotification, id: notifications.length + 1, read: false },
    ]);
  };
  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getAccessibleTabs = () => {
    const commonTabs = [
      { icon: Calendar, label: "Overview" },
      { icon: Calendar, label: "Appointments" },
      { icon: Users, label: "Owners" },
      { icon: PawPrint, label: "Pets" },
      { icon: Bell, label: "Notifications" },
      { icon: BookOpen, label: "Bookings" },
      { icon: ImageIcon, label: "Gallery" },
    ];

    // if (userRole === "veterinarian") {
    //   return [...commonTabs, { icon: FileText, label: "Prescriptions" }];
    // }

    // if (userRole === "admin") {
    //   return [...commonTabs, { icon: UserCog, label: "User Management" }];
    // }

    return commonTabs;
  };

  const accessibleTabs = getAccessibleTabs();

  if (!mounted) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex flex-col h-screen bg-background lg:flex-row">
        {/* Sidebar */}
        <div
          className={`w-64 bg-background border-r shadow-md flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${
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
          <div className="absolute bottom-4 left-4 right-4"></div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b shadow-sm p-4">
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
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-4 py-2 w-full"
                />
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {notifications.some((n) => !n.read) && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {notifications.filter((n) => !n.read).length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-4"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">
                            {notification.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between w-full mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                            >
                              <Check className="h-4 w-4 mr-1" /> Mark as read
                            </Button>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <DropdownMenuItem onClick={handleLogout}>
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
                        <div className="text-2xl font-bold">{totalPets}</div>
                        <p className="text-xs text-muted-foreground">
                          {newPetsCount > 0
                            ? `+${newPetsCount} new ${
                                newPetsCount === 1 ? "pet" : "pets"
                              } in the last hour`
                            : "No new pets in the last hour"}
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
                        {isLoading ? (
                          <p>Loading appointments...</p>
                        ) : error ? (
                          <p className="text-red-500">{error}</p>
                        ) : (
                          <div className="space-y-8">
                            {appointments.slice(0, 5).map((appointment) => (
                              <div
                                key={appointment.id}
                                className="flex items-center"
                              >
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={
                                      appointment.owner?.profilePicture ||
                                      undefined
                                    }
                                  />
                                  <AvatarFallback>
                                    {appointment.owner?.firstName?.[0] || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                  <p className="text-sm font-medium leading-none">
                                    {appointment.owner?.firstName}{" "}
                                    {appointment.owner?.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.date} at {appointment.time}
                                  </p>
                                </div>
                                <div
                                  className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                                    appointment.status
                                  )}`}
                                >
                                  {appointment.status.charAt(0).toUpperCase() +
                                    appointment.status.slice(1)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddAppointment(
                                  new FormData(e.target as HTMLFormElement)
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <label
                                  htmlFor="ownerId"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Owner
                                </label>
                                <select
                                  id="ownerId"
                                  name="ownerId"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
                                >
                                  <option value="">Select an owner</option>
                                  {owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                      {owner.firstName} {owner.lastName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="petName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Pet Name
                                </label>
                                <Input id="petName" name="petName" required />
                              </div>
                              <div>
                                <label
                                  htmlFor="petType"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Pet Type
                                </label>
                                <Input id="petType" name="petType" required />
                              </div>
                              <div>
                                <label
                                  htmlFor="date"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Date
                                </label>
                                <Input
                                  id="date"
                                  name="date"
                                  type="date"
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="time"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Time
                                </label>
                                <select
                                  id="time"
                                  name="time"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
                                >
                                  {timeOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="services"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Services
                                </label>
                                <select
                                  id="services"
                                  name="services"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
                                >
                                  {servicesOptions.map((service) => (
                                    <option key={service} value={service}>
                                      {service}
                                    </option>
                                  ))}
                                </select>
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
                                  name="status"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
                                >
                                  {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                      {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="notes"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Notes
                                </label>
                                <Input id="notes" name="notes" />
                              </div>
                              <Button type="submit">Add Appointment</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {isLoading ? (
                        <p>Loading appointments...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Owner</TableHead>
                              <TableHead>Pet Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Services</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointments.map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>
                                  {owners.find(
                                    (owner) => owner.id === appointment.ownerId
                                  )?.firstName || "Unknown"}{" "}
                                  {owners.find(
                                    (owner) => owner.id === appointment.ownerId
                                  )?.lastName || "Owner"}
                                </TableCell>
                                <TableCell>{appointment.pet.name}</TableCell>
                                <TableCell>{appointment.pet.type}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{appointment.services}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                      appointment.status
                                    )}`}
                                  >
                                    {appointment.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Dialog
                                      open={isEditDialogOpen}
                                      onOpenChange={setIsEditDialogOpen}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            setEditingAppointment(appointment);
                                            setIsEditDialogOpen(true);
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        {editingAppointment && (
                                          <>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Edit Appointment
                                              </DialogTitle>
                                            </DialogHeader>
                                            <form
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                const formData = new FormData(
                                                  e.currentTarget
                                                );
                                                formData.append(
                                                  "id",
                                                  editingAppointment.id
                                                );
                                                handleEditAppointment(formData);
                                              }}
                                              className="space-y-4"
                                            >
                                              <input
                                                type="hidden"
                                                name="id"
                                                value={editingAppointment.id}
                                              />
                                              <div>
                                                <label
                                                  htmlFor="ownerId"
                                                  className="block text-sm font-medium text-gray-700"
                                                >
                                                  Owner
                                                </label>
                                                <select
                                                  id="ownerId"
                                                  name="ownerId"
                                                  defaultValue={
                                                    editingAppointment.ownerId
                                                  }
                                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                  required
                                                >
                                                  {owners.map((owner) => (
                                                    <option
                                                      key={owner.id}
                                                      value={owner.id}
                                                    >
                                                      {owner.firstName}{" "}
                                                      {owner.lastName}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor="petName"
                                                  className="block text-sm font-medium text-gray-700"
                                                >
                                                  Pet Name
                                                </label>
                                                <Input
                                                  id="petName"
                                                  name="petName"
                                                  defaultValue={
                                                    editingAppointment.pet.name
                                                  }
                                                  required
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
                                                  name="petType"
                                                  defaultValue={
                                                    editingAppointment.pet.type
                                                  }
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor="date"
                                                  className="block text-sm font-medium text-gray-700"
                                                >
                                                  Date
                                                </label>
                                                <Input
                                                  id="date"
                                                  name="date"
                                                  type="date"
                                                  defaultValue={
                                                    editingAppointment.date
                                                  }
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor="time"
                                                  className="block text-sm font-medium text-gray-700"
                                                >
                                                  Time
                                                </label>
                                                <select
                                                  id="time"
                                                  name="time"
                                                  defaultValue={
                                                    editingAppointment.time
                                                  }
                                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                  required
                                                >
                                                  {timeOptions.map(
                                                    (option, index) => (
                                                      <option
                                                        key={index}
                                                        value={option}
                                                      >
                                                        {option}
                                                      </option>
                                                    )
                                                  )}
                                                </select>
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor="services"
                                                  className="block text-sm font-medium text-gray-700"
                                                >
                                                  Services
                                                </label>
                                                <select
                                                  id="services"
                                                  name="services"
                                                  defaultValue={
                                                    editingAppointment.services
                                                  }
                                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                  required
                                                >
                                                  {servicesOptions.map(
                                                    (service) => (
                                                      <option
                                                        key={service}
                                                        value={service}
                                                      >
                                                        {service}
                                                      </option>
                                                    )
                                                  )}
                                                </select>
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
                                                  name="status"
                                                  defaultValue={
                                                    editingAppointment.status
                                                  }
                                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                  required
                                                >
                                                  {statusOptions.map(
                                                    (status) => (
                                                      <option
                                                        key={status}
                                                        value={status}
                                                      >
                                                        {status
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          status.slice(1)}
                                                      </option>
                                                    )
                                                  )}
                                                </select>
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor="notes"
                                                  className="block text-sm font-medium text-gray-700"
                                                >
                                                  Notes
                                                </label>
                                                <Input
                                                  id="notes"
                                                  name="notes"
                                                  defaultValue={
                                                    editingAppointment.notes ||
                                                    ""
                                                  }
                                                />
                                              </div>
                                              <Button type="submit">
                                                Update Appointment
                                              </Button>
                                            </form>
                                          </>
                                        )}
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteAppointment(appointment.id)
                                      }
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
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
                                  placeholder="Enter pet names (comma separated)"
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
                              <TableCell>
                                {owner.firstName}, {owner.middleName}{" "}
                                {owner.lastName},{" "}
                              </TableCell>
                              <TableCell>
                                {" "}
                                {owner.pets.map((pet: Pet, index: number) => (
                                  <span key={index}>
                                    {pet.name}
                                    {index < owner.pets.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </TableCell>
                              <TableCell>{owner.contact}</TableCell>
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
                                  onClick={() => deleteOwner(owner.id)}
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
                            <TableHead>Gender</TableHead>
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
                              <TableCell>{pet.gender}</TableCell>
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
                                  onClick={() => deletePets(pet.id)}
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

              <TabsContent value="notifications">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Notifications</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Notification
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Notification</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            addNotification({
                              title: formData.get("title") as string,
                              ownerName: formData.get("ownerName") as string, // Add this line
                              message: formData.get("message") as string,
                              time: "Just now",
                            });
                            e.currentTarget.reset();
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium"
                            >
                              Title
                            </label>
                            <Input
                              id="title"
                              name="title"
                              placeholder="Enter notification title"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="ownerName"
                              className="block text-sm font-medium"
                            >
                              Owner Name
                            </label>
                            <Input
                              id="ownerName"
                              name="ownerName"
                              placeholder="Enter owner name"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium"
                            >
                              Message
                            </label>
                            <Input
                              id="message"
                              name="message"
                              placeholder="Enter notification message"
                              required
                            />
                          </div>
                          <Button type="submit">Add Notification</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border ${
                            !notification.read ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {notification.title}
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Owner: {notification.ownerName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  markNotificationAsRead(notification.id)
                                }
                              >
                                <Check className="h-4 w-4 mr-1" /> Mark as read
                              </Button>
                            )}
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
                                  placeholder="Enter service name"
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
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-center p-2">
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
                                  placeholder="Enter medication name"
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
            </Tabs>
          </main>
        </div>

        {/* Messaging window (keep it outside of the Tabs) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed bottom-4 right-4" size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Messages</DialogTitle>
            </DialogHeader>
            <div className="h-[300px] overflow-y-auto space-y-4 p-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.sender === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
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
            <div className="flex items-center gap-2 mt-4">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
