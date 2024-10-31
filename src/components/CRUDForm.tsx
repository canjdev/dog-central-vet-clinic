import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CRUDFormProps<T> {
  item: Partial<T>;
  onSubmit: (item: Partial<T>) => void;
  onCancel: () => void;
  fields: {
    key: keyof T;
    label: string;
    type: string;
  }[];
}

export function CRUDForm<T>({
  item,
  onSubmit,
  onCancel,
  fields,
}: CRUDFormProps<T>) {
  const [formData, setFormData] = React.useState<Partial<T>>(item);

  const handleChange = (key: keyof T, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key as string}>
          <Label htmlFor={field.key as string}>{field.label}</Label>
          <Input
            id={field.key as string}
            type={field.type}
            value={String(formData[field.key] || "")}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        </div>
      ))}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
