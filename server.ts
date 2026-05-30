import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPOINTMENTS_FILE = path.join(process.cwd(), "appointments.json");

interface Appointment {
  id: string;
  serviceId: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

// Read appointments safely from JSON file
function readAppointments(): Appointment[] {
  try {
    if (!fs.existsSync(APPOINTMENTS_FILE)) {
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(APPOINTMENTS_FILE, "utf-8");
    return JSON.parse(data) as Appointment[];
  } catch (err) {
    console.error("Error reading appointments file:", err);
    return [];
  }
}

// Write appointments safely to JSON file
function writeAppointments(appointments: Appointment[]): boolean {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing appointments file:", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API: Get all appointments
  app.get("/api/appointments", (req, res) => {
    try {
      const appointments = readAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to load appointments" });
    }
  });

  // API: Create an appointment (and block slot)
  app.post("/api/appointments", (req, res) => {
    try {
      const {
        serviceId,
        dentistId,
        date,
        timeSlot,
        patientName,
        patientEmail,
        patientPhone,
        notes,
      } = req.body;

      // Primary validation
      if (!serviceId || !dentistId || !date || !timeSlot || !patientName || !patientEmail || !patientPhone) {
        return res.status(400).json({ error: "Missing required booking details." });
      }

      const appointments = readAppointments();

      // Check for slot availability: clinician + date + timeslot configuration
      const alreadyBooked = appointments.some(
        (apt) =>
          apt.dentistId === dentistId &&
          apt.date === date &&
          apt.timeSlot === timeSlot &&
          apt.status === "confirmed"
      );

      if (alreadyBooked) {
        return res.status(409).json({
          error: "This time slot has already been reserved. Please choose a different appointment slot.",
        });
      }

      // Generate secure unique ID
      const newAppointment: Appointment = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
        serviceId,
        dentistId,
        date,
        timeSlot,
        patientName,
        patientEmail,
        patientPhone,
        notes: notes || "",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      appointments.unshift(newAppointment);
      const saved = writeAppointments(appointments);

      if (!saved) {
        return res.status(500).json({ error: "Error committing reservation." });
      }

      res.status(201).json(newAppointment);
    } catch (err) {
      console.error("Error booking appointment on server:", err);
      res.status(500).json({ error: "Booking execution failed." });
    }
  });

  // API: Cancel an appointment
  app.post("/api/appointments/:id/cancel", (req, res) => {
    try {
      const { id } = req.params;
      const appointments = readAppointments();
      const index = appointments.findIndex((apt) => apt.id === id);

      if (index === -1) {
        return res.status(404).json({ error: "Appointment not found." });
      }

      appointments[index].status = "cancelled";
      const saved = writeAppointments(appointments);

      if (!saved) {
        return res.status(500).json({ error: "Error updating cancellation." });
      }

      res.json(appointments[index]);
    } catch (err) {
      console.error("Cancellation routing broken:", err);
      res.status(500).json({ error: "Cancellation transaction failed." });
    }
  });

  // API: Reschedule an appointment
  app.post("/api/appointments/:id/reschedule", (req, res) => {
    try {
      const { id } = req.params;
      const { date, timeSlot } = req.body;

      if (!date || !timeSlot) {
        return res.status(400).json({ error: "Missing new date or time slot." });
      }

      const appointments = readAppointments();
      const index = appointments.findIndex((apt) => apt.id === id);

      if (index === -1) {
        return res.status(404).json({ error: "Appointment not found." });
      }

      const targetApt = appointments[index];

      // Check if slot taken by another active appointment
      const slotTaken = appointments.some(
        (apt) =>
          apt.id !== id &&
          apt.dentistId === targetApt.dentistId &&
          apt.date === date &&
          apt.timeSlot === timeSlot &&
          apt.status === "confirmed"
      );

      if (slotTaken) {
        return res.status(409).json({
          error: "This timeslot is already reserved by another patient. Please select a different slot.",
        });
      }

      appointments[index].date = date;
      appointments[index].timeSlot = timeSlot;
      appointments[index].status = "confirmed";
      const saved = writeAppointments(appointments);

      if (!saved) {
        return res.status(500).json({ error: "Error saving reschedule." });
      }

      res.json(appointments[index]);
    } catch (err) {
      console.error("Reschedule route error:", err);
      res.status(500).json({ error: "Failed to reschedule on backend." });
    }
  });

  // Serve static assets in production, otherwise mount Vite Dev server middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auradent Server running on http://localhost:${PORT}`);
  });
}

startServer();
