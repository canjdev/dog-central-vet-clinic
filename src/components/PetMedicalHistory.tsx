import { useNavigate } from "react-router-dom";
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

interface MedicalRecord {
  date: string;
  treatment: string;
  veterinarian: string;
  notes: string;
}

const mockMedicalRecords: MedicalRecord[] = [
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

export function PetMedicalHistory() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pet Medical History</h1>
        <Button onClick={handleBackToHome} variant="outline">
          Back to Home
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
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
    </div>
  );
}