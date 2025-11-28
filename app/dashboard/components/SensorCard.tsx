import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Thermometer, Droplets, Wind, MapPin, Clock } from "lucide-react";
import { Sensor } from "../page";

interface SensorCardProps {
  sensor: Sensor;
  onClick: () => void;
}

export function SensorCard({ sensor, onClick }: SensorCardProps) {
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

  const isOutOfRange = (value: number, min: number, max: number) => {
    return value < min || value > max;
  };

  const tempOutOfRange = isOutOfRange(sensor.readings.temperature, 10, 45);
  const phOutOfRange = isOutOfRange(sensor.readings.ph, 6.5, 8.5);
  const doOutOfRange = isOutOfRange(sensor.readings.dissolvedOxygen, 5, 8);

  const timeSinceUpdate = Math.floor(
    (Date.now() - sensor.lastUpdate.getTime()) / 1000
  );
  const getTimeString = () => {
    if (timeSinceUpdate < 60) return "Just now";
    if (timeSinceUpdate < 3600)
      return `${Math.floor(timeSinceUpdate / 60)}m ago`;
    return `${Math.floor(timeSinceUpdate / 3600)}h ago`;
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg text-gray-900 mb-1">{sensor.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              {sensor.location}
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(sensor.status)}>
            {sensor.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Temperature */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  tempOutOfRange ? "bg-red-100" : "bg-blue-100"
                }`}
              >
                <Thermometer
                  className={`w-4 h-4 ${
                    tempOutOfRange ? "text-red-600" : "text-blue-600"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">Temperature</span>
            </div>
            <span
              className={`${tempOutOfRange ? "text-red-600" : "text-gray-900"}`}
            >
              {sensor.readings.temperature.toFixed(1)}°C
            </span>
          </div>

          {/* pH */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  phOutOfRange ? "bg-red-100" : "bg-purple-100"
                }`}
              >
                <Droplets
                  className={`w-4 h-4 ${
                    phOutOfRange ? "text-red-600" : "text-purple-600"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">pH Level</span>
            </div>
            <span
              className={`${phOutOfRange ? "text-red-600" : "text-gray-900"}`}
            >
              {sensor.readings.ph.toFixed(1)}
            </span>
          </div>

          {/* Dissolved Oxygen */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  doOutOfRange ? "bg-red-100" : "bg-cyan-100"
                }`}
              >
                <Wind
                  className={`w-4 h-4 ${
                    doOutOfRange ? "text-red-600" : "text-cyan-600"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">Dissolved O₂</span>
            </div>
            <span
              className={`${doOutOfRange ? "text-red-600" : "text-gray-900"}`}
            >
              {sensor.readings.dissolvedOxygen.toFixed(1)} mg/L
            </span>
          </div>

          {/* Last Update */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
            <Clock className="w-3 h-3" />
            <span>Updated {getTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
