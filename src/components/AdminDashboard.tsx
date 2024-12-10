"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  // Check,
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
import { generateUploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { Label } from "@/components/ui/label";

// type UserRole = "admin" | "veterinarian" | "staff";

// interface UserProfile {
//   role: UserRole;
// }

export const UploadButton = generateUploadButton({
  url: import.meta.env.VITE_UPLOAD_THING_URL,
});

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
  gender: string | null;
  ownerid: string;
  created_at: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
}

interface GalleryItem {
  id: number;
  imageUrl: string;
  pet: Pet;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "admin" | "veterinarian" | "staff";
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

interface CurrentUser {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  googleId: string;
  user: { role: string; email: string };
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
  const [, setIsEditDialogOpen] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [totalPets] = useState(0);
  const [newPetsCount] = useState(0);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);

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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingGalleryItem, setEditingGalleryItem] =
    useState<GalleryItem | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const [selectedPetId, setSelectedPetId] = useState<string>("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  // const [isEditPetDialogOpen, setIsEditPetDialogOpen] = useState(false);
  // const [uploadImage, setUploadImage] = useState({ imageUrl: "", petId: "" });

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
    fetchCurrentUser();
    fetchGallery();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Appointment[]>("/api/appointments");
      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        `An error occurred while fetching appointments: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAppointment = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointmentData = Object.fromEntries(formData);

      // Include petName and petType in the appointment data
      if (selectedPet) {
        newAppointmentData.petName = selectedPet.name;
        newAppointmentData.petType = selectedPet.type;
      }

      const response = await api.post<Appointment>(
        "/api/appointments",
        newAppointmentData,
      );
      setAppointments([...appointments, response.data]);
      setIsAddDialogOpen(false);
      setSelectedPet(null); // Reset selected pet after adding appointment
    } catch (err) {
      console.error("Error adding appointment:", err);
      setError(
        `An error occurred while adding the appointment: ${err instanceof Error ? err.message : String(err)}`,
      );
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

      // Get the selected owner from the owners array
      const selectedOwner = owners.find(
        (o) => o.id === updatedAppointmentData.ownerId,
      );
      if (!selectedOwner) throw new Error("Selected owner not found");

      // Get the selected pet from the owner's pets
      const selectedPet = selectedOwner.pets.find(
        (p) => p.id === updatedAppointmentData.petId,
      );
      if (!selectedPet) throw new Error("Selected pet not found");

      // Add pet and owner information to the appointment data
      const appointmentToUpdate = {
        ...updatedAppointmentData,
        petName: selectedPet.name,
        petType: selectedPet.type,
      };

      const response = await api.put<Appointment>(
        `/api/appointments/${editingAppointment.id}`,
        appointmentToUpdate,
      );
      setAppointments(
        appointments.map((app) =>
          app.id === editingAppointment.id ? response.data : app,
        ),
      );
      setEditingAppointment(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(
        `An error occurred while updating the appointment: ${err instanceof Error ? err.message : String(err)}`,
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
      setAppointments(appointments.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError(
        `An error occurred while deleting the appointment: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOwnerSelect = (ownerId: string) => {
    const owner = owners.find((o) => o.id === ownerId);
    setSelectedOwner(owner || null);
    setSelectedPet(null);
  };

  // const handleAddOwner = async (formData: FormData) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const newOwnerData = Object.fromEntries(formData);
  //     const response = await api.post<Owner>("/api/profiles", newOwnerData);
  //     if (response.status === 201) {
  //       setOwners([...owners, response.data]);
  //     } else {
  //       throw new Error(`Failed to add owner. Status: ${response.status}`);
  //     }
  //   } catch (err) {
  //     console.error("Error adding owner:", err);
  //     setError(
  //       `An error occurred while adding the owner: ${
  //         err instanceof Error ? err.message : String(err)
  //       }`
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchOwners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Owner[]>("/api/profiles");
      setOwners(response.data);
    } catch (err) {
      console.error("Error fetching owners:", err);
      setError(
        `An error occurred while fetching owners: ${err instanceof Error ? err.message : String(err)}`,
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
        updatedOwnerData,
      );
      setOwners(
        owners.map((owner) =>
          owner.id === editingOwner.id ? response.data : owner,
        ),
      );
      setEditingOwner(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating owner:", err);
      setError(
        `An error occurred while updating the owner: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOwner = async (ownerId: string) => {
    if (!confirm("Are you sure you want to delete this owner?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/api/profiles/${ownerId}`);
      setOwners(owners.filter((owner) => owner.id !== ownerId));
    } catch (err) {
      console.error("Error deleting owner:", err);
      setError(
        `An error occurred while deleting the owner: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePetSelect = (petId: string) => {
    const pet = selectedOwner?.pets.find((p) => p.id === petId);
    setSelectedPet(pet || null);
  };

  // const filteredPets = selectedOwner ? pets.filter(pet => pet.ownerid === selectedOwner.id) : pets;

  const fetchPets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Pet[]>("/api/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(
        `An error occurred while fetching pets: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPet = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    const dataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      dataObject[key] = value.toString();
    });

    // Display the form data in the console (or wherever needed)
    console.log(dataObject);

    try {
      await api.post<Pet>("/api/pets", dataObject);
      // setPets([...pets, response.data]);
      fetchPets();
    } catch (err) {
      console.error("Error adding pet:", err);
      setError(
        `An error occurred while adding the pet: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPet = async (id: string, formData: FormData) => {
    setIsLoading(true);
    setError(null);

    const dataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      dataObject[key] = value.toString();
    });

    // Display the form data in the console (or wherever needed)
    console.log(dataObject);

    try {
      await api.put<Pet>(`/api/pets/${id}`, dataObject);
      // setPets(pets.map((pet) => (pet.id === id ? response.data : pet)));
      fetchPets();
    } catch (err) {
      console.error("Error updating pet:", err);
      setError(
        `An error occurred while updating the pet: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/api/pets/${id}`);
      setPets(pets.filter((pet) => pet.id !== id));
    } catch (err) {
      console.error("Error deleting pet:", err);
      setError(
        `An error occurred while deleting the pet: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    isEditing: boolean,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (isEditing && editingPet) {
      handleEditPet(editingPet.id, formData);
      setEditingPet(null);
    } else {
      handleAddPet(formData);
      setIsAddPetDialogOpen(false);
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
        newNotificationData,
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
        updatedNotificationData,
      );
      setNotifications(
        notifications.map((notification) =>
          notification.id === editingNotification.id
            ? response.data
            : notification,
        ),
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
        notifications.filter((notification) => notification.id !== id),
      );
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the notification");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string | number) => {
    try {
      // If the timestamp is a string and looks like an ISO 8601 date string
      const date = new Date(timestamp);

      // Validate the date
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      // Format the date
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
        .format(date)
        .toLowerCase() // Convert AM/PM to lowercase
        .replace(",", ", ") // Ensure correct spacing after the comma
        .replace(/\s*am/i, "am") // Ensure no extra spaces before 'am'
        .replace(/\s*pm/i, "pm"); // Ensure no extra spaces before 'pm'
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
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
        }`,
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
        newVaccinationData,
      );
      if (response.status === 201) {
        setVaccinations([...vaccinations, response.data]);
      } else {
        throw new Error(
          `Failed to add vaccination. Status: ${response.status}`,
        );
      }
    } catch (err) {
      console.error("Error adding vaccination:", err);
      setError(
        `An error occurred while adding the vaccination: ${
          err instanceof Error ? err.message : String(err)
        }`,
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
        updatedVaccinationData,
      );
      if (response.status === 200) {
        setVaccinations(
          vaccinations.map((vaccination) =>
            vaccination.id === editingVaccination.id
              ? response.data
              : vaccination,
          ),
        );
        setEditingVaccination(null);
      } else {
        throw new Error(
          `Failed to update vaccination. Status: ${response.status}`,
        );
      }
    } catch (err) {
      console.error("Error updating vaccination:", err);
      setError(
        `An error occurred while updating the vaccination: ${
          err instanceof Error ? err.message : String(err)
        }`,
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
          vaccinations.filter((vaccination) => vaccination.id !== id),
        );
      } else {
        throw new Error(
          `Failed to delete vaccination. Status: ${response.status}`,
        );
      }
    } catch (err) {
      console.error("Error deleting vaccination:", err);
      setError(
        `An error occurred while deleting the vaccination: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get<CurrentUser>("/api/users/profile");
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

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
        }`,
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
        }`,
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
        updatedUserData,
      );
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user,
          ),
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
        }`,
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
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGallery = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<GalleryItem[]>("/api/gallery");
      setGalleryItems(response.data);
    } catch (err) {
      console.error("Error fetching gallery items:", err);
      setError("An error occurred while fetching gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGallery = async (imageUrl: string, petId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<GalleryItem>("/api/gallery", {
        imageUrl,
        petId,
      });
      setGalleryItems([...galleryItems, response.data]);
      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error adding gallery item:", err);
      setError("An error occurred while adding the gallery item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGallery = async (imageUrl: string) => {
    if (!editingGalleryItem) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.put<GalleryItem>(
        `/api/gallery/${editingGalleryItem.id}`,
        {
          imageUrl,
          petId: editingGalleryItem.pet.id,
        },
      );
      setGalleryItems(
        galleryItems.map((item) =>
          item.id === editingGalleryItem.id ? response.data : item,
        ),
      );
      setEditingGalleryItem(null);
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error updating gallery item:", err);
      setError("An error occurred while updating the gallery item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/api/gallery/${id}`);
      setGalleryItems(galleryItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      setError("An error occurred while deleting the gallery item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab.toLowerCase());
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

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
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            currentUser?.profilePicture ||
                            "/placeholder.svg?height=32&width=32"
                          }
                          alt={currentUser?.firstName || "User"}
                        />
                        <AvatarFallback>
                          {currentUser?.firstName} {currentUser?.lastName}
                          {currentUser?.user.email}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {currentUser?.firstName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.user.email}
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
                      Welcome, {currentUser?.firstName} {currentUser?.lastName}
                    </h1>
                    <p className="text-muted-foreground">
                      Have a nice day at work!
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Notifications
                        </CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {notifications.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notifications.filter((n) => !n.read).length} unread
                          notifications
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
                        <CardTitle>Recent Notifications</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNavClick("notifications")}
                        >
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          {notifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.id}
                              className="flex items-center"
                            >
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={
                                    notification.owner?.profilePicture ||
                                    undefined
                                  }
                                  alt={`${
                                    notification.owner?.firstName || ""
                                  } ${notification.owner?.lastName || ""}`}
                                />
                                <AvatarFallback>
                                  {notification.owner?.firstName?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="ml-auto font-medium text-sm text-muted-foreground">
                                {formatDate(notification.created_at)}
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
                                    appointment.status,
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
                      <CardTitle>
                        Patient History (Completed Appointments)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pet Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {appointments
                            .filter(
                              (appointment) =>
                                appointment.status === "completed",
                            )
                            .map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>{appointment.pet.name}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.services}</TableCell>
                                <TableCell>
                                  {appointment.notes || "N/A"}
                                </TableCell>
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
                    <CardDescription>Manage pet appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Appointment List
                        </h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="opacity-100 hover:opacity-90">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Appointment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add New Appointment</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddAppointment(
                                  new FormData(e.currentTarget),
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="ownerId">Owner</Label>
                                <Select
                                  name="ownerId"
                                  required
                                  onValueChange={(value) =>
                                    handleOwnerSelect(value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an owner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {owners.map((owner) => (
                                      <SelectItem
                                        key={owner.id}
                                        value={owner.id}
                                      >
                                        {owner.firstName} {owner.lastName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="petId">Pet</Label>
                                <Select
                                  name="petId"
                                  required
                                  onValueChange={(value) =>
                                    handlePetSelect(value)
                                  }
                                  disabled={!selectedOwner}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        selectedOwner
                                          ? "Select a pet"
                                          : "Select an owner first"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedOwner?.pets.map((pet) => (
                                      <SelectItem key={pet.id} value={pet.id}>
                                        {pet.name} ({pet.type})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {selectedPet && (
                                <>
                                  <Input
                                    type="hidden"
                                    name="petName"
                                    value={selectedPet.name}
                                  />
                                  <Input
                                    type="hidden"
                                    name="petType"
                                    value={selectedPet.type}
                                  />
                                </>
                              )}
                              <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                  id="date"
                                  name="date"
                                  type="date"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="time">Time</Label>
                                <Select name="time" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="services">Services</Label>
                                <Select name="services" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {servicesOptions.map((service) => (
                                      <SelectItem key={service} value={service}>
                                        {service}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() +
                                          status.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes</Label>
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
                              <TableHead>Pet</TableHead>
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
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          appointment.owner?.profilePicture ||
                                          "/placeholder-user.jpg"
                                        }
                                      />
                                      <AvatarFallback>
                                        {appointment.owner?.firstName?.[0]}
                                        {appointment.owner?.lastName?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {appointment.owner?.firstName}{" "}
                                      {appointment.owner?.lastName}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {appointment.pet?.name} (
                                  {appointment.pet?.type})
                                </TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{appointment.services}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}
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
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Edit Appointment
                                          </DialogTitle>
                                        </DialogHeader>
                                        {editingAppointment && (
                                          <form
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              handleEditAppointment(
                                                new FormData(e.currentTarget),
                                              );
                                            }}
                                            className="space-y-4"
                                          >
                                            <div>
                                              <Label htmlFor="editOwnerId">
                                                Owner
                                              </Label>
                                              <Select
                                                name="ownerId"
                                                defaultValue={
                                                  editingAppointment.ownerId
                                                }
                                                onValueChange={(value) => {
                                                  const owner = owners.find(
                                                    (o) => o.id === value,
                                                  );
                                                  if (owner) {
                                                    setEditingAppointment({
                                                      ...editingAppointment,
                                                      owner: owner,
                                                    });
                                                  }
                                                }}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select an owner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {owners.map((owner) => (
                                                    <SelectItem
                                                      key={owner.id}
                                                      value={owner.id}
                                                    >
                                                      {owner.firstName}{" "}
                                                      {owner.lastName}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="editPetId">
                                                Pet
                                              </Label>
                                              <Select
                                                name="petId"
                                                defaultValue={
                                                  editingAppointment.pet.id
                                                }
                                                onValueChange={(value) => {
                                                  const pet =
                                                    editingAppointment.owner.pets.find(
                                                      (p) => p.id === value,
                                                    );
                                                  if (pet) {
                                                    setEditingAppointment({
                                                      ...editingAppointment,
                                                      pet: pet,
                                                    });
                                                  }
                                                }}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a pet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {editingAppointment.owner?.pets?.map(
                                                    (pet) => (
                                                      <SelectItem
                                                        key={pet.id}
                                                        value={pet.id}
                                                      >
                                                        {pet.name} ({pet.type})
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="editDate">
                                                Date
                                              </Label>
                                              <Input
                                                id="editDate"
                                                name="date"
                                                type="date"
                                                defaultValue={
                                                  editingAppointment.date
                                                }
                                                required
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="editTime">
                                                Time
                                              </Label>
                                              <Select
                                                name="time"
                                                defaultValue={
                                                  editingAppointment.time
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {timeOptions.map((option) => (
                                                    <SelectItem
                                                      key={option}
                                                      value={option}
                                                    >
                                                      {option}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="editServices">
                                                Services
                                              </Label>
                                              <Select
                                                name="services"
                                                defaultValue={
                                                  editingAppointment.services
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {servicesOptions.map(
                                                    (service) => (
                                                      <SelectItem
                                                        key={service}
                                                        value={service}
                                                      >
                                                        {service}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="editStatus">
                                                Status
                                              </Label>
                                              <Select
                                                name="status"
                                                defaultValue={
                                                  editingAppointment.status
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {statusOptions.map(
                                                    (status) => (
                                                      <SelectItem
                                                        key={status}
                                                        value={status}
                                                      >
                                                        {status
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          status.slice(1)}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor="editNotes">
                                                Notes
                                              </Label>
                                              <Input
                                                id="editNotes"
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
                      <h3 className="text-lg font-semibold mb-4">Owner List</h3>
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
                                        alt={`${owner.firstName} ${owner.lastName || ""}`}
                                      />
                                      <AvatarFallback>
                                        {owner.firstName?.charAt(0)}
                                        {owner.lastName?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {owner.firstName} {owner.lastName || ""}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>{owner.contact}</div>
                                </TableCell>
                                <TableCell>
                                  {owner.pets
                                    ?.map((pet) => pet.name)
                                    .join(", ")}
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
                                              e.currentTarget,
                                            );
                                            formData.append("id", owner.id);
                                            handleEditOwner(formData);
                                          }}
                                          className="space-y-4"
                                        >
                                          <div>
                                            <Label htmlFor="editFirstName">
                                              First Name
                                            </Label>
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
                                            <Label htmlFor="editLastName">
                                              Last Name
                                            </Label>
                                            <Input
                                              id="editLastName"
                                              name="lastName"
                                              defaultValue={
                                                owner.lastName || ""
                                              }
                                            />
                                          </div>

                                          <div>
                                            <Label htmlFor="editContact">
                                              Phone
                                            </Label>
                                            <Input
                                              id="editContact"
                                              name="contact"
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
                                        alt={`${pet.owner?.firstName || "Unknown"} ${pet.owner?.lastName || "Owner"}`}
                                      />
                                      <AvatarFallback>
                                        {pet.owner?.firstName?.[0] || ""}
                                        {pet.owner?.lastName?.[0] || ""}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {pet.owner
                                        ? `${pet.owner.firstName || ""} ${pet.owner.lastName || ""}`.trim() ||
                                          "Unnamed Owner"
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
                                        {editingPet && (
                                          <form
                                            onSubmit={(e) =>
                                              handleFormSubmit(e, true)
                                            }
                                            className="space-y-4"
                                          >
                                            <div className="space-y-2">
                                              <Label htmlFor="editName">
                                                Pet Name
                                              </Label>
                                              <Input
                                                id="editName"
                                                name="name"
                                                defaultValue={editingPet.name}
                                                required
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="editType">
                                                Pet Type
                                              </Label>
                                              <Select
                                                name="type"
                                                defaultValue={editingPet.type}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select pet type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {petTypeOptions.map(
                                                    (type) => (
                                                      <SelectItem
                                                        key={type}
                                                        value={type}
                                                      >
                                                        {type
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          type.slice(1)}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="editBreed">
                                                Breed
                                              </Label>
                                              <Input
                                                id="editBreed"
                                                name="breed"
                                                defaultValue={
                                                  editingPet.breed || ""
                                                }
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="editGender">
                                                Gender
                                              </Label>
                                              <Select
                                                name="gender"
                                                defaultValue={
                                                  editingPet.gender || ""
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {genderOptions.map(
                                                    (option) => (
                                                      <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                      >
                                                        {option.label}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="editOwnerid">
                                                Owner
                                              </Label>
                                              <Select
                                                name="ownerId"
                                                defaultValue={
                                                  editingPet.ownerid
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select an owner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {owners.map((owner) => (
                                                    <SelectItem
                                                      key={owner.id}
                                                      value={owner.id}
                                                    >
                                                      {owner.firstName}{" "}
                                                      {owner.lastName}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <Button type="submit">
                                              Update Pet
                                            </Button>
                                          </form>
                                        )}
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
                              new FormData(e.currentTarget),
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
                                        notification.owner?.profilePicture ||
                                        undefined
                                      }
                                      alt={`${notification.owner?.firstName} ${notification.owner?.lastName}`}
                                    />
                                    <AvatarFallback>
                                      {notification.owner?.firstName?.[0]}
                                      {notification.owner?.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {notification.owner?.firstName}{" "}
                                    {notification.owner?.lastName}
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
                                            new FormData(e.currentTarget),
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
                                              notification.id,
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
                        <Dialog
                          open={isAddDialogOpen}
                          onOpenChange={setIsAddDialogOpen}
                        >
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
                            <div className="space-y-4">
                              <Select
                                onValueChange={(value) =>
                                  setSelectedPetId(value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a pet" />
                                </SelectTrigger>
                                <SelectContent>
                                  {pets.map((pet) => (
                                    <SelectItem key={pet.id} value={pet.id}>
                                      {pet.name} ({pet.type})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <UploadButton
                                endpoint="galleryUpload"
                                onClientUploadComplete={async (res) => {
                                  if (res && res.length > 0 && selectedPetId) {
                                    try {
                                      await handleAddGallery(
                                        res[0].url,
                                        selectedPetId,
                                      );
                                    } catch (err) {
                                      console.error(
                                        "Error adding gallery item:",
                                        err,
                                      );
                                      setError(
                                        "An error occurred while adding the gallery item",
                                      );
                                    }
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  console.error("Error uploading file:", error);
                                  setError(
                                    "An error occurred while uploading the file",
                                  );
                                }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <p className="text-lg text-gray-500">
                            Loading gallery...
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {galleryItems.map((item) => (
                            <div
                              key={item.id}
                              className="relative group overflow-hidden rounded-lg aspect-[9/16]"
                            >
                              <img
                                src={item.imageUrl}
                                alt={`${item.pet?.name}'s photo`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-center p-2">
                                  {item.pet?.name} ({item.pet?.type})
                                </p>
                                <div className="mt-2 space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() =>
                                          setEditingGalleryItem(item)
                                        }
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Gallery Item
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <p>
                                          Current pet: {item.pet?.name} (
                                          {item.pet?.type})
                                        </p>
                                        <UploadButton
                                          endpoint="galleryUpload"
                                          onClientUploadComplete={async (
                                            res,
                                          ) => {
                                            if (res && res.length > 0) {
                                              try {
                                                await handleEditGallery(
                                                  res[0].url,
                                                );
                                              } catch (err) {
                                                console.error(
                                                  "Error updating gallery item:",
                                                  err,
                                                );
                                                setError(
                                                  "An error occurred while updating the gallery item",
                                                );
                                              }
                                            }
                                          }}
                                          onUploadError={(error: Error) => {
                                            console.error(
                                              "Error uploading file:",
                                              error,
                                            );
                                            setError(
                                              "An error occurred while uploading the file",
                                            );
                                          }}
                                        />
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteGallery(item.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Dialog
                  open={isSuccessDialogOpen}
                  onOpenChange={setIsSuccessDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Success</DialogTitle>
                    </DialogHeader>
                    <p>The image was uploaded successfully!</p>
                    <DialogFooter>
                      <Button onClick={() => setIsSuccessDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                                  new FormData(e.target as HTMLFormElement),
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
                                              e.currentTarget,
                                            );
                                            formData.append(
                                              "id",
                                              vaccination.id,
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
                                  new FormData(e.target as HTMLFormElement),
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
                                              e.currentTarget,
                                            );
                                            formData.append(
                                              "id",
                                              user.id.toString(),
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
