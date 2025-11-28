"use client";
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Droplets, LogOut, Plus, Settings, Bell } from "lucide-react";
import { SensorCard } from "./components/SensorCard";
import { AddSensorDialog } from "./components/AddSensorDialog";
import { SensorDetailsDialog } from "./components/SensorDetailsDialog";
import { Badge } from "../../ui/badge";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export interface Sensor {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  lastUpdate: Date;
  readings: {
    temperature: number;
    ph: number;
    dissolvedOxygen: number;
  };
  schedule: string;
}

// Mock sensor data
const initialSensors: Sensor[] = [
  {
    id: "1",
    name: "Pond A - Main",
    location: "North Section, Mekong Delta",
    status: "online",
    lastUpdate: new Date(),
    readings: {
      temperature: 28.5,
      ph: 7.2,
      dissolvedOxygen: 6.8,
    },
    schedule: "Every 2 hours",
  },
  {
    id: "2",
    name: "Pond B - Secondary",
    location: "South Section, Mekong Delta",
    status: "online",
    lastUpdate: new Date(Date.now() - 300000),
    readings: {
      temperature: 29.8,
      ph: 7.5,
      dissolvedOxygen: 6.2,
    },
    schedule: "Every 4 hours",
  },
  {
    id: "3",
    name: "Pond C - Nursery",
    location: "East Section, Mekong Delta",
    status: "warning",
    lastUpdate: new Date(Date.now() - 600000),
    readings: {
      temperature: 31.2,
      ph: 8.1,
      dissolvedOxygen: 5.1,
    },
    schedule: "Every 1 hour",
  },
];

export default function DashboardPage() {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const user = auth.currentUser;

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          lastUpdate: new Date(),
          readings: {
            temperature: Math.max(
              25,
              Math.min(
                35,
                sensor.readings.temperature + (Math.random() - 0.5) * 0.5
              )
            ),
            ph: Math.max(
              6,
              Math.min(9, sensor.readings.ph + (Math.random() - 0.5) * 0.2)
            ),
            dissolvedOxygen: Math.max(
              4,
              Math.min(
                8,
                sensor.readings.dissolvedOxygen + (Math.random() - 0.5) * 0.3
              )
            ),
          },
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddSensor = (sensorData: Omit<Sensor, "id" | "lastUpdate">) => {
    const newSensor: Sensor = {
      ...sensorData,
      id: Date.now().toString(),
      lastUpdate: new Date(),
    };
    setSensors([...sensors, newSensor]);
  };

  const handleLogOut = () => {
    signOut(auth).then(() => {
      console.log("User signed out");
      router.push("/login");
    });
  };

  const onlineSensors = sensors.filter((s) => s.status === "online").length;
  const warningSensors = sensors.filter((s) => s.status === "warning").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-blue-900">AquaSeer</h1>
                <p className="text-xs text-gray-500">
                  Welcome, {user?.displayName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sensors</p>
                <p className="text-3xl text-gray-900 mt-1">{sensors.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Online</p>
                <p className="text-3xl text-green-600 mt-1">{onlineSensors}</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                Active
              </Badge>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Warnings</p>
                <p className="text-3xl text-orange-600 mt-1">
                  {warningSensors}
                </p>
              </div>
              {warningSensors > 0 && (
                <Badge
                  variant="default"
                  className="bg-orange-100 text-orange-700"
                >
                  Alert
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Sensors Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gray-900">Your Sensors</h2>
            <p className="text-sm text-gray-500 mt-1">
              Monitor your water quality in real-time
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sensor
          </Button>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onClick={() => setSelectedSensor(sensor)}
            />
          ))}
        </div>

        {sensors.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No Sensors Connected</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add your first sensor to start monitoring water quality
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Sensor
            </Button>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <AddSensorDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddSensor}
      />
      {selectedSensor && (
        <SensorDetailsDialog
          sensor={selectedSensor}
          open={!!selectedSensor}
          onOpenChange={(open) => !open && setSelectedSensor(null)}
        />
      )}
    </div>
  );
}
