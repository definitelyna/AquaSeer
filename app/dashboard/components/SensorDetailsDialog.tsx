"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  Calendar,
  Settings,
} from "lucide-react";
import { Sensor } from "../page";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SensorDetailsDialogProps {
  sensor: Sensor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    temperatureThreshold: { min: number; max: number };
    phThreshold: { min: number; max: number };
    measurementSchedule: string;
  };
}

export function SensorDetailsDialog({
  sensor,
  open,
  onOpenChange,
  settings,
}: SensorDetailsDialogProps) {
  const minTemp = settings?.temperatureThreshold?.min ?? 10;
  const maxTemp = settings?.temperatureThreshold?.max ?? 45;
  const minPh = settings?.phThreshold?.min ?? 6.5;
  const maxPh = settings?.phThreshold?.max ?? 8.5;

  const historicalData = sensor.readings.map((reading) => {
    console.log(reading);
    return {
      time: reading.datetime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: reading.temp,
      ph: reading.pH,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-700 border-green-200";
      case "offline":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2">{sensor.name}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                {sensor.location}
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor(sensor.status)}>
              {sensor.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Readings */}
          <div>
            <h3 className="text-lg text-gray-900 mb-3">Current Readings</h3>
            <div className="flex gap-4">
              {/* Temperature */}
              <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Thermometer className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Temperature</span>
                </div>
                <p className="text-2xl text-blue-900">
                  {sensor.readings[0].temp.toFixed(1)}°C
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {minTemp}-{maxTemp}°C
                </p>
              </div>

              {/* pH */}
              <div className="flex-1 bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Droplets className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">pH Level</span>
                </div>
                <p className="text-2xl text-purple-900">
                  {sensor.readings[0].pH.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {minPh}-{maxPh}
                </p>
              </div>
            </div>
          </div>

          {/* Historical Data Chart */}
          <div>
            <h3 className="text-lg text-gray-900 mb-3">24-Hour History</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} reversed />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) =>
                      typeof value === "number" ? value.toFixed(2) : value
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#2563eb"
                    name="Temperature (°C)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ph"
                    stroke="#9333ea"
                    name="pH"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sensor Information */}
          <div>
            <h3 className="text-lg text-gray-900 mb-3">Sensor Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Measurement Schedule
                  </span>
                </div>
                <span className="text-sm text-gray-900">{sensor.schedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Device ID</span>
                </div>
                <span className="text-sm text-gray-900 font-mono">
                  ESP32-{sensor.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {sensor.lastUpdate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" className="flex-1">
              Export Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
