import React, { useState } from "react";
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

type UserRole = "customer" | "staff" | "admin";

interface AdminDashboardProps {
  userRole: UserRole;
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("appointments");

  const appointments = [
    {
      id: 1,
      petName: "Max",
      ownerName: "John Doe",
      date: "2023-07-01",
      time: "10:00 AM",
    },
    {
      id: 2,
      petName: "Bella",
      ownerName: "Jane Smith",
      date: "2023-07-02",
      time: "2:00 PM",
    },
    // Add more appointments as needed
  ];

  const messages = [
    { id: 1, from: "Alice Johnson", message: "When is my next appointment?" },
    { id: 2, from: "Bob Williams", message: "Do you offer grooming services?" },
    // Add more messages as needed
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            {userRole === "admin" && (
              <TabsTrigger value="staff">Staff</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="appointments">
            <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
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
                      <strong>Date:</strong> {appointment.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {appointment.time}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <h3 className="text-lg font-semibold mb-4">User Messages</h3>
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="p-4">
                    <p>
                      <strong>From:</strong> {message.from}
                    </p>
                    <p>{message.message}</p>
                    <Input className="mt-2" placeholder="Type your reply..." />
                    <Button className="mt-2">Send Reply</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pets">
            <h3 className="text-lg font-semibold mb-4">Assign Pets to Users</h3>
            <div className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Max</SelectItem>
                  <SelectItem value="bella">Bella</SelectItem>
                  <SelectItem value="charlie">Charlie</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                  <SelectItem value="alice">Alice Johnson</SelectItem>
                </SelectContent>
              </Select>
              <Button>Assign Pet to User</Button>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <h3 className="text-lg font-semibold mb-4">
              Add Photos to Gallery
            </h3>
            <Input type="file" accept="image/*" />
            <Button className="mt-2">Upload Photo</Button>
          </TabsContent>

          <TabsContent value="customers">
            <h3 className="text-lg font-semibold mb-4">Create New Customer</h3>
            <div className="space-y-4">
              <Input placeholder="Customer Name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" type="tel" />
              <Button>Create Customer</Button>
            </div>
          </TabsContent>

          {userRole === "admin" && (
            <TabsContent value="staff">
              <h3 className="text-lg font-semibold mb-4">
                Assign Roles to Staff
              </h3>
              <div className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Brown</SelectItem>
                    <SelectItem value="emily">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Assign Role</Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
