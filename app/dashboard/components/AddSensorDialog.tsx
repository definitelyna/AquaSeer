"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Sensor } from "../page";

interface AddSensorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (sensor: Omit<Sensor, "id" | "lastUpdate">) => void;
}

export function AddSensorDialog({
  open,
  onOpenChange,
  onAdd,
}: AddSensorDialogProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [schedule, setSchedule] = useState("Every 2 hours");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location) return;

    const newSensor: Omit<Sensor, "id" | "lastUpdate"> = {
      name,
      location,
      status: "online",
      readings: {
        temperature: 28.0 + Math.random() * 4,
        ph: 7.0 + Math.random(),
        dissolvedOxygen: 6.0 + Math.random() * 2,
      },
      schedule,
    };

    onAdd(newSensor);

    // Reset form
    setName("");
    setLocation("");
    setSchedule("Every 2 hours");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Sensor</DialogTitle>
          <DialogDescription>
            Connect a new ESP32 sensor to monitor water quality
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sensor-name">Sensor Name</Label>
            <Input
              id="sensor-name"
              placeholder="e.g., Pond A - Main"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sensor-location">Location</Label>
            <Input
              id="sensor-location"
              placeholder="e.g., North Section, Mekong Delta"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sensor-schedule">Measurement Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger id="sensor-schedule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Every 1 hour">Every 1 hour</SelectItem>
                <SelectItem value="Every 2 hours">Every 2 hours</SelectItem>
                <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Configure how often the sensor takes measurements
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm text-blue-900 mb-2">
              Connection Instructions
            </h4>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Power on your ESP32 device</li>
              <li>Connect to WiFi network</li>
              <li>Enter the sensor details above</li>
              <li>Device will appear in dashboard once connected</li>
            </ol>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Sensor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
