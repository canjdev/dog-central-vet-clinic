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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  // BookOpen,
  Image as ImageIcon,
  LogOut,
  Search,
  Menu,
  Plus,
  Edit,
  Trash,
  // FileText,
  UserCog,
  Syringe,
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

// type UserRole = "admin" | "veterinarian" | "staff";

// interface UserProfile {
//   role: UserRole;
// }

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
  email: string;
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

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
}

interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
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
  owner: Owner;
  created_at: string;
}

interface Vaccination {
  id: string;
  name: string;
  quantity: string;
  date: string;
  pet: Pet;
  created_at: string;
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

const petTypeOptions = ["cat", "dog", "other"];

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
  const [owners, setOwners] = useState<Owner[]>([]);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [totalPets, setTotalPets] = useState(0);
  const [newPetsCount, setNewPetsCount] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [userRole, setUserRole] = useState<UserRole | null>(null);
  // const [deletingNotificationId, setDeletingNotificationId] = useState<
  //   number | null
  // >(null);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [editingVaccination, setEditingVaccination] =
    useState<Vaccination | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
    fetchOwners();
    fetchPets();
    fetchNotifications();
    fetchVaccinations();
    fetchUsers();
    // fetchUserProfile();
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

  const handleAddAppointment = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointmentData = Object.fromEntries(formData);
      const response = await api.post<Appointment>(
        "/api/appointments",
        newAppointmentData
      );
      const newAppointment: Appointment = {
        ...response.data,
        // pet: {
        //   id: response.data.id,
        //   name: newAppointmentData.petName as string,
        //   type: newAppointmentData.petType as string,
        // },
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
      const response = await api.put<Appointment>(
        `/api/appointments/${editingAppointment.id}`,
        updatedAppointmentData
      );
      if (response.status === 200) {
        const updatedAppointment: Appointment = {
          ...response.data,
          // pet: {
          //   id: response.data.petId,
          //   name: updatedAppointmentData.petName as string,
          //   type: updatedAppointmentData.petType as string,
          // },
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

  const fetchOwners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Owner[]>("/api/profiles");
      if (response.status === 200) {
        setOwners(response.data);
      } else {
        throw new Error(`Failed to fetch owners. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching owners:", err);
      setError(
        `An error occurred while fetching owners: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOwner = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newOwnerData = Object.fromEntries(formData);
      const response = await api.post<Owner>("/api/profiles", newOwnerData);
      if (response.status === 201) {
        setOwners([...owners, response.data]);
      } else {
        throw new Error(`Failed to add owner. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error adding owner:", err);
      setError(
        `An error occurred while adding the owner: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOwner = async (formData: FormData) => {
    if (!editingOwner) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedOwnerData = Object.fromEntries(formData);
      const response = await api.put<Owner>(
        `/api/profiles/${editingOwner.id}`,
        updatedOwnerData
      );
      if (response.status === 200) {
        setOwners(
          owners.map((owner) =>
            owner.id === editingOwner.id ? response.data : owner
          )
        );
        setEditingOwner(null);
      } else {
        throw new Error(`Failed to update owner. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating owner:", err);
      setError(
        `An error occurred while updating the owner: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOwner = async (ownerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/profiles/${ownerId}`);
      if (response.status === 200) {
        setOwners(owners.filter((owner) => owner.id !== ownerId));
      } else {
        throw new Error(`Failed to delete owner. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting owner:", err);
      setError(
        `An error occurred while deleting the owner: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Pet[]>("/api/pets");
      setPets(response.data);
      setTotalPets(response.data.length);
      const lastHour = new Date(Date.now() - 60 * 60 * 1000);
      const recentPets = response.data.filter((pet) => {
        const petCreatedAt = new Date(pet.created_at);
        return petCreatedAt > lastHour;
      });
      setNewPetsCount(recentPets.length);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(
        `An error occurred while fetching pets: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPet = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPetData = Object.fromEntries(formData);
      const response = await api.post<Pet>("/api/pets", newPetData);
      if (response.status === 201) {
        setPets([...pets, response.data]);
        setTotalPets(totalPets + 1);
        setNewPetsCount(newPetsCount + 1);
      } else {
        throw new Error(`Failed to add pet. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error adding pet:", err);
      setError(
        `An error occurred while adding the pet: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPet = async (formData: FormData) => {
    if (!editingPet) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedPetData = Object.fromEntries(formData);
      const response = await api.put<Pet>(
        `/api/pets/${editingPet.id}`,
        updatedPetData
      );
      if (response.status === 200) {
        setPets(
          pets.map((pet) => (pet.id === editingPet.id ? response.data : pet))
        );
        setEditingPet(null);
      } else {
        throw new Error(`Failed to update pet. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating pet:", err);
      setError(
        `An error occurred while updating the pet: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm("Are you sure you want to delete this pet?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/pets/${petId}`);
      if (response.status === 200) {
        setPets(pets.filter((pet) => pet.id !== petId));
        setTotalPets(totalPets - 1);
      } else {
        throw new Error(`Failed to delete pet. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting pet:", err);
      setError(
        `An error occurred while deleting the pet: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Notification[]>("/api/notifications");
      setNotifications(response.data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNotification = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newNotificationData = {
        title: formData.get("title") as string,
        message: formData.get("message") as string,
        ownerId: formData.get("ownerId") as string,
      };
      const response = await api.post<Notification>(
        "/api/notifications",
        newNotificationData
      );
      setNotifications([...notifications, response.data]);
    } catch (err) {
      console.error(err);
      setError("An error occurred while adding the notification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNotification = async (formData: FormData) => {
    if (!editingNotification) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedNotificationData = {
        title: formData.get("title") as string,
        message: formData.get("message") as string,
      };
      const response = await api.put<Notification>(
        `/api/notifications/${editingNotification.id}`,
        updatedNotificationData
      );
      setNotifications(
        notifications.map((notification) =>
          notification.id === editingNotification.id
            ? response.data
            : notification
        )
      );
      setEditingNotification(null);
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the notification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the notification");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  const fetchVaccinations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Vaccination[]>("/api/vaccinations");
      setVaccinations(response.data);
    } catch (err) {
      console.error("Error fetching vaccinations:", err);
      setError(
        `An error occurred while fetching vaccinations: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVaccination = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newVaccinationData = Object.fromEntries(formData);
      const response = await api.post<Vaccination>(
        "/api/vaccinations",
        newVaccinationData
      );
      if (response.status === 201) {
        setVaccinations([...vaccinations, response.data]);
      } else {
        throw new Error(
          `Failed to add vaccination. Status: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error adding vaccination:", err);
      setError(
        `An error occurred while adding the vaccination: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVaccination = async (formData: FormData) => {
    if (!editingVaccination) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedVaccinationData = Object.fromEntries(formData);
      const response = await api.put<Vaccination>(
        `/api/vaccinations/${editingVaccination.id}`,
        updatedVaccinationData
      );
      if (response.status === 200) {
        setVaccinations(
          vaccinations.map((vaccination) =>
            vaccination.id === editingVaccination.id
              ? response.data
              : vaccination
          )
        );
        setEditingVaccination(null);
      } else {
        throw new Error(
          `Failed to update vaccination. Status: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error updating vaccination:", err);
      setError(
        `An error occurred while updating the vaccination: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVaccination = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vaccination?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/vaccinations/${id}`);
      if (response.status === 200) {
        setVaccinations(
          vaccinations.filter((vaccination) => vaccination.id !== id)
        );
      } else {
        throw new Error(
          `Failed to delete vaccination. Status: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error deleting vaccination:", err);
      setError(
        `An error occurred while deleting the vaccination: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await api.get<UserProfile>("/api/users/profile");
  //     setUserRole(response.data.role);
  //   } catch (error) {
  //     console.error("Error fetching user profile:", error);
  //     setError("Failed to fetch user profile");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<User[]>("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        `An error occurred while fetching users: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUserData = Object.fromEntries(formData);
      const response = await api.post<User>("/api/users", newUserData);
      if (response.status === 201) {
        setUsers([...users, response.data]);
      } else {
        throw new Error(`Failed to add user. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError(
        `An error occurred while adding the user: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (formData: FormData) => {
    if (!editingUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedUserData = Object.fromEntries(formData);
      const response = await api.put<User>(
        `/api/users/${editingUser.id}`,
        updatedUserData
      );
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setEditingUser(null);
      } else {
        throw new Error(`Failed to update user. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(
        `An error occurred while updating the user: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/users/${id}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(
        `An error occurred while deleting the user: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const markAsRead = async (id: number) => {
  //   try {
  //     const response = await fetch(`/api/notifications/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ read: true }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to mark notification as read");
  //     }
  //     setNotifications(
  //       notifications.map((notification) =>
  //         notification.id === id
  //           ? { ...notification, read: true }
  //           : notification
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error marking notification as read:", error);
  //   }
  // };

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

  // const markNotificationAsRead = (id: number) => {
  //   setNotifications(
  //     notifications.map((notification) =>
  //       notification.id === id ? { ...notification, read: true } : notification
  //     )
  //   );
  // };
  // const addNotification = (
  //   newNotification: Omit<Notification, "id" | "read">
  // ) => {
  //   setNotifications([
  //     ...notifications,
  //     { ...newNotification, id: notifications.length + 1, read: false },
  //   ]);
  // };
  // const deleteNotification = (id: number) => {
  //   setNotifications(
  //     notifications.filter((notification) => notification.id !== id)
  //   );
  // };

  const getAccessibleTabs = () => {
    const commonTabs = [
      { icon: Calendar, label: "Overview" },
      { icon: Calendar, label: "Appointments" },
      { icon: Users, label: "Owners" },
      { icon: PawPrint, label: "Pets" },
      { icon: Bell, label: "Notifications" },
      { icon: ImageIcon, label: "Gallery" },
      { icon: Syringe, label: "Vaccinations" },
      { icon: UserCog, label: "User Management" },
    ];

    return commonTabs;
  };
  // const getAccessibleTabs = () => {
  //   if (!userRole) return [];

  //   const commonTabs = [
  //     { icon: Calendar, label: "Overview" },
  //     { icon: Calendar, label: "Appointments" },
  //     { icon: Users, label: "Owners" },
  //     { icon: PawPrint, label: "Pets" },
  //     { icon: Bell, label: "Notifications" },
  //     { icon: ImageIcon, label: "Gallery" },
  //   ];

  //   switch (userRole) {
  //     case "veterinarian":
  //       return [...commonTabs, { icon: Syringe, label: "Vaccinations" }];
  //     case "admin":
  //       return [{ icon: UserCog, label: "User Management" }];
  //     case "staff":
  //       return commonTabs;
  //     default:
  //       return [];
  //   }
  // };

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
        <aside
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
        </aside>

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
                                <select
                                  id="petType"
                                  name="petType"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
                                >
                                  {petTypeOptions.map((type) => (
                                    <option key={type} value={type}>
                                      {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                    </option>
                                  ))}
                                </select>
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
                        <div className="flex justify-center items-center h-32">
                          <p className="text-lg text-gray-500">
                            Loading appointments...
                          </p>
                        </div>
                      ) : error ? (
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">Error:</strong>
                          <span className="block sm:inline"> {error}</span>
                        </div>
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
                                  {appointment.owner?.firstName}{" "}
                                  {appointment.owner?.lastName}
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
                                  <div className="flex items-center space-x-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            setEditingAppointment(appointment)
                                          }
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">
                                            Edit appointment
                                          </span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Edit Appointment
                                          </DialogTitle>
                                        </DialogHeader>
                                        {editingAppointment && (
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
                                              <select
                                                id="petType"
                                                name="petType"
                                                defaultValue={
                                                  editingAppointment.pet.type
                                                }
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                required
                                              >
                                                {petTypeOptions.map((type) => (
                                                  <option
                                                    key={type}
                                                    value={type}
                                                  >
                                                    {type
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                      type.slice(1)}
                                                  </option>
                                                ))}
                                              </select>
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
                                                {statusOptions.map((status) => (
                                                  <option
                                                    key={status}
                                                    value={status}
                                                  >
                                                    {status
                                                      .charAt(0)
                                                      .toUpperCase() +
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
                                              <Input
                                                id="notes"
                                                name="notes"
                                                defaultValue={
                                                  editingAppointment.notes || ""
                                                }
                                              />
                                            </div>
                                            <Button type="submit">
                                              Update Appointment
                                            </Button>
                                          </form>
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
                                      <span className="sr-only">
                                        Delete appointment
                                      </span>
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
                    <CardTitle>Owners</CardTitle>
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
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddOwner(
                                  new FormData(e.target as HTMLFormElement)
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <label
                                  htmlFor="firstName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  First Name
                                </label>
                                <Input
                                  id="firstName"
                                  name="firstName"
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="lastName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Last Name
                                </label>
                                <Input id="lastName" name="lastName" />
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
                                  name="email"
                                  type="email"
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="phone"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Phone
                                </label>
                                <Input id="phone" name="phone" type="tel" />
                              </div>
                              <Button type="submit">Add Owner</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <p className="text-lg text-gray-500">
                            Loading owners...
                          </p>
                        </div>
                      ) : error ? (
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">Error:</strong>
                          <span className="block sm:inline"> {error}</span>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Pets</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {owners.map((owner) => (
                              <TableRow key={owner.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          owner.profilePicture ||
                                          "/placeholder-user.jpg"
                                        }
                                        alt={`${owner.firstName} ${
                                          owner.lastName || ""
                                        }`}
                                      />
                                      <AvatarFallback>
                                        {owner.firstName?.charAt(0)}
                                        {owner.lastName
                                          ? owner.lastName?.charAt(0)
                                          : ""}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {owner.firstName} {owner.lastName || ""}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>{owner.email}</div>
                                  <div>{owner.contact}</div>
                                </TableCell>
                                <TableCell>
                                  {owner.pets.map((pet) => pet.name).join(", ")}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setEditingOwner(owner)}
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">
                                            Edit owner
                                          </span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Owner</DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(
                                              e.currentTarget
                                            );
                                            formData.append("id", owner.id);
                                            handleEditOwner(formData);
                                          }}
                                          className="space-y-4"
                                        >
                                          <div>
                                            <label
                                              htmlFor="editFirstName"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              First Name
                                            </label>
                                            <Input
                                              id="editFirstName"
                                              name="firstName"
                                              defaultValue={
                                                owner.firstName as string
                                              }
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editLastName"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Last Name
                                            </label>
                                            <Input
                                              id="editLastName"
                                              name="lastName"
                                              defaultValue={
                                                owner.lastName || ""
                                              }
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editEmail"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Email
                                            </label>
                                            <Input
                                              id="editEmail"
                                              name="email"
                                              type="email"
                                              defaultValue={owner.email}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editPhone"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Phone
                                            </label>
                                            <Input
                                              id="editPhone"
                                              name="phone"
                                              type="tel"
                                              defaultValue={owner.contact || ""}
                                            />
                                          </div>
                                          <Button type="submit">
                                            Update Owner
                                          </Button>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Trash className="h-4 w-4" />
                                          <span className="sr-only">
                                            Delete owner
                                          </span>
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Are you absolutely sure?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete the owner
                                            and remove the data from our
                                            servers.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDeleteOwner(owner.id)
                                            }
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
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
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddPet(
                                  new FormData(e.target as HTMLFormElement)
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Pet Name
                                </label>
                                <Input id="name" name="name" required />
                              </div>
                              <div>
                                <label
                                  htmlFor="type"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Pet Type
                                </label>
                                <Input id="type" name="type" required />
                              </div>
                              <div>
                                <label
                                  htmlFor="breed"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Breed
                                </label>
                                <Input id="breed" name="breed" />
                              </div>
                              <div>
                                <label
                                  htmlFor="gender"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Gender
                                </label>
                                <Input id="gender" name="gender" />
                              </div>
                              <div>
                                <label
                                  htmlFor="ownerid"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Owner ID
                                </label>
                                <Input id="ownerid" name="ownerid" required />
                              </div>
                              <Button type="submit">Add Pet</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <p className="text-lg text-gray-500">
                            Loading pets...
                          </p>
                        </div>
                      ) : error ? (
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">Error:</strong>
                          <span className="block sm:inline"> {error}</span>
                        </div>
                      ) : (
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
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          pet.owner?.profilePicture ||
                                          "/placeholder-user.jpg"
                                        }
                                        alt={`${
                                          pet.owner?.firstName || "Unknown"
                                        } ${pet.owner?.lastName || "Owner"}`}
                                      />
                                      <AvatarFallback>
                                        {pet.owner?.firstName?.[0] || ""}
                                        {pet.owner?.lastName?.[0] || ""}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {pet.owner
                                        ? `${pet.owner.firstName || ""} ${
                                            pet.owner.lastName || ""
                                          }`.trim() || "Unnamed Owner"
                                        : "No Owner"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{pet.gender}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setEditingPet(pet)}
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">
                                            Edit pet
                                          </span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Pet</DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(
                                              e.currentTarget
                                            );
                                            formData.append("id", pet.id);
                                            handleEditPet(formData);
                                          }}
                                          className="space-y-4"
                                        >
                                          <div>
                                            <label
                                              htmlFor="editName"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Pet Name
                                            </label>
                                            <Input
                                              id="editName"
                                              name="name"
                                              defaultValue={pet.name}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editType"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Pet Type
                                            </label>
                                            <Input
                                              id="editType"
                                              name="type"
                                              defaultValue={pet.type}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editBreed"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Breed
                                            </label>
                                            <Input
                                              id="editBreed"
                                              name="breed"
                                              defaultValue={pet.breed || ""}
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editGender"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Gender
                                            </label>
                                            <Input
                                              id="editGender"
                                              name="gender"
                                              defaultValue={pet.gender || ""}
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editOwnerid"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Owner ID
                                            </label>
                                            <Input
                                              id="editOwnerid"
                                              name="ownerid"
                                              defaultValue={pet.ownerid}
                                              required
                                            />
                                          </div>
                                          <Button type="submit">
                                            Update Pet
                                          </Button>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeletePet(pet.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">
                                        Delete pet
                                      </span>
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

              <TabsContent value="notifications">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                      Notifications
                    </CardTitle>
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
                            handleAddNotification(
                              new FormData(e.currentTarget)
                            );
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
                            <Input id="title" name="title" required />
                          </div>
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium"
                            >
                              Message
                            </label>
                            <Input id="message" name="message" required />
                          </div>
                          <div>
                            <label
                              htmlFor="ownerId"
                              className="block text-sm font-medium"
                            >
                              Owner
                            </label>
                            <Select name="ownerId" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an owner" />
                              </SelectTrigger>
                              <SelectContent>
                                {owners.map((owner) => (
                                  <SelectItem key={owner.id} value={owner.id}>
                                    {owner.firstName} {owner.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit">Add Notification</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <p className="text-lg text-gray-500">
                          Loading notifications...
                        </p>
                      </div>
                    ) : error ? (
                      <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                      >
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Owner</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {notifications.map((notification) => (
                            <TableRow key={notification.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification.owner.profilePicture ||
                                        undefined
                                      }
                                      alt={`${notification.owner.firstName} ${notification.owner.lastName}`}
                                    />
                                    <AvatarFallback>
                                      {notification.owner.firstName?.[0]}
                                      {notification.owner.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {notification.owner.firstName}{" "}
                                    {notification.owner.lastName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{notification.title}</TableCell>
                              <TableCell>{notification.message}</TableCell>
                              <TableCell>
                                {formatDate(notification.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          setEditingNotification(notification)
                                        }
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">
                                          Edit notification
                                        </span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Notification
                                        </DialogTitle>
                                      </DialogHeader>
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          handleEditNotification(
                                            new FormData(e.currentTarget)
                                          );
                                        }}
                                        className="space-y-4"
                                      >
                                        <div>
                                          <label
                                            htmlFor="editTitle"
                                            className="block text-sm font-medium"
                                          >
                                            Title
                                          </label>
                                          <Input
                                            id="editTitle"
                                            name="title"
                                            defaultValue={
                                              editingNotification?.title
                                            }
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label
                                            htmlFor="editMessage"
                                            className="block text-sm font-medium"
                                          >
                                            Message
                                          </label>
                                          <Input
                                            id="editMessage"
                                            name="message"
                                            defaultValue={
                                              editingNotification?.message
                                            }
                                            required
                                          />
                                        </div>
                                        <Button type="submit">
                                          Update Notification
                                        </Button>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash className="h-4 w-4" />
                                        <span className="sr-only">
                                          Delete notification
                                        </span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete the
                                          notification and remove it from our
                                          servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteNotification(
                                              notification.id
                                            )
                                          }
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
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
              <TabsContent value="vaccinations">
                <Card>
                  <CardHeader>
                    <CardTitle>Vaccinations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Vaccination List
                        </h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Vaccination
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Vaccination</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddVaccination(
                                  new FormData(e.target as HTMLFormElement)
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Vaccine Name
                                </label>
                                <Input id="name" name="name" required />
                              </div>
                              <div>
                                <label
                                  htmlFor="quantity"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Quantity
                                </label>
                                <Input id="quantity" name="quantity" required />
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
                                  htmlFor="petId"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Pet
                                </label>
                                <select
                                  id="petId"
                                  name="petId"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
                                >
                                  {pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>
                                      {pet.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <Button type="submit">Add Vaccination</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <p className="text-lg text-gray-500">
                            Loading vaccinations...
                          </p>
                        </div>
                      ) : error ? (
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">Error:</strong>
                          <span className="block sm:inline"> {error}</span>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Pet</TableHead>
                              <TableHead>Vaccine</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vaccinations.map((vaccination) => (
                              <TableRow key={vaccination.id}>
                                <TableCell>{vaccination.pet?.name}</TableCell>
                                <TableCell>{vaccination.name}</TableCell>
                                <TableCell>{vaccination.quantity}</TableCell>
                                <TableCell>{vaccination.date}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            setEditingVaccination(vaccination)
                                          }
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">
                                            Edit vaccination
                                          </span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Edit Vaccination
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
                                              vaccination.id
                                            );
                                            handleEditVaccination(formData);
                                          }}
                                          className="space-y-4"
                                        >
                                          <div>
                                            <label
                                              htmlFor="editName"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Vaccine Name
                                            </label>
                                            <Input
                                              id="editName"
                                              name="name"
                                              defaultValue={vaccination.name}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editQuantity"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Quantity
                                            </label>
                                            <Input
                                              id="editQuantity"
                                              name="quantity"
                                              defaultValue={
                                                vaccination.quantity
                                              }
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editDate"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Date
                                            </label>
                                            <Input
                                              id="editDate"
                                              name="date"
                                              type="date"
                                              defaultValue={vaccination.date}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editPetId"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Pet
                                            </label>
                                            <select
                                              id="editPetId"
                                              name="petId"
                                              defaultValue={vaccination.pet?.id}
                                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                              required
                                            >
                                              {pets.map((pet) => (
                                                <option
                                                  key={pet.id}
                                                  value={pet.id}
                                                >
                                                  {pet.name}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <Button type="submit">
                                            Update Vaccination
                                          </Button>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteVaccination(vaccination.id)
                                      }
                                    >
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">
                                        Delete vaccination
                                      </span>
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
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddUser(
                                  new FormData(e.target as HTMLFormElement)
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Username
                                </label>
                                <Input id="username" name="username" required />
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
                                  name="email"
                                  type="email"
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="password"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Password
                                </label>
                                <Input
                                  id="password"
                                  name="password"
                                  type="password"
                                  required
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
                                  name="role"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  required
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
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <p className="text-lg text-gray-500">
                            Loading users...
                          </p>
                        </div>
                      ) : error ? (
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">Error:</strong>
                          <span className="block sm:inline"> {error}</span>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Username</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Password</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  {editingUser?.id === user.id
                                    ? user.password
                                    : "*****"}
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setEditingUser(user)}
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">
                                            Edit user
                                          </span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit User</DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(
                                              e.currentTarget
                                            );
                                            formData.append(
                                              "id",
                                              user.id.toString()
                                            );
                                            handleEditUser(formData);
                                          }}
                                          className="space-y-4"
                                        >
                                          <div>
                                            <label
                                              htmlFor="editUsername"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Username
                                            </label>
                                            <Input
                                              id="editUsername"
                                              name="username"
                                              defaultValue={user.username}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editEmail"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Email
                                            </label>
                                            <Input
                                              id="editEmail"
                                              name="email"
                                              type="email"
                                              defaultValue={user.email}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editPassword"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Password
                                            </label>
                                            <Input
                                              id="editPassword"
                                              name="password"
                                              type="password"
                                              defaultValue={user.password}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label
                                              htmlFor="editRole"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Role
                                            </label>
                                            <select
                                              id="editRole"
                                              name="role"
                                              defaultValue={user.role}
                                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                              required
                                            >
                                              <option value="admin">
                                                Admin
                                              </option>
                                              <option value="veterinarian">
                                                Veterinarian
                                              </option>
                                              <option value="staff">
                                                Staff
                                              </option>
                                            </select>
                                          </div>
                                          <Button type="submit">
                                            Update User
                                          </Button>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">
                                        Delete user
                                      </span>
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
            </Tabs>
          </main>
        </div>

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
