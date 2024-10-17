import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MedicalRecord = {
  date: string;
  type: "vaccination" | "service" | "medication";
  description: string;
};

type Pet = {
  name: string;
  records: MedicalRecord[];
};

const mockPets: Pet[] = [
  {
    name: "Max",
    records: [
      {
        date: "2023-05-15",
        type: "vaccination",
        description: "Rabies vaccine",
      },
      { date: "2023-06-01", type: "service", description: "Annual checkup" },
      { date: "2023-06-15", type: "medication", description: "Flea treatment" },
    ],
  },
  {
    name: "Luna",
    records: [
      { date: "2023-04-20", type: "vaccination", description: "FVRCP vaccine" },
      { date: "2023-05-10", type: "service", description: "Dental cleaning" },
      { date: "2023-06-05", type: "medication", description: "Deworming" },
    ],
  },
];

export function PetMedicalHistory() {
  const [selectedPet, setSelectedPet] = useState<Pet>(mockPets[0]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Pet Medical History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={selectedPet.name}
          onValueChange={(value) =>
            setSelectedPet(
              mockPets.find((pet) => pet.name === value) || mockPets[0]
            )
          }
        >
          <TabsList>
            {mockPets.map((pet) => (
              <TabsTrigger key={pet.name} value={pet.name}>
                {pet.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {mockPets.map((pet) => (
            <TabsContent key={pet.name} value={pet.name}>
              <h3 className="text-lg font-semibold mb-4">
                {pet.name}&apos;s Medical Records
              </h3>
              <div className="space-y-4">
                {pet.records.map((record, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p>
                        <strong>Date:</strong> {record.date}
                      </p>
                      <p>
                        <strong>Type:</strong> {record.type}
                      </p>
                      <p>
                        <strong>Description:</strong> {record.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
