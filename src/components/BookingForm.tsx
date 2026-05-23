import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DENTAL_SERVICES, DENTISTS, TIME_SLOTS } from '../data';
import { Appointment, DentalService, Dentist } from '../types';
import { CalendarDays, Stethoscope, Clock, ShieldAlert, BadgeCheck, Phone, Mail, User, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface BookingFormProps {
  initialServiceId?: string;
  initialDentistId?: string;
  onBookingSuccess: () => void;
  onClose: () => void;
}

export default function BookingForm({ initialServiceId, initialDentistId, onBookingSuccess, onClose }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(initialServiceId || DENTAL_SERVICES[0].id);
  const [dentistId, setDentistId] = useState(initialDentistId || DENTISTS[0].id);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  
  // Patient details
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Local validation errors
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamically reset values if changed externally
  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
  }, [initialServiceId]);

  useEffect(() => {
    if (initialDentistId) setDentistId(initialDentistId);
  }, [initialDentistId]);

  // Selected details
  const selectedService = DENTAL_SERVICES.find(s => s.id === serviceId) || DENTAL_SERVICES[0];
  const selectedDentist = DENTISTS.find(d => d.id === dentistId) || DENTISTS[0];

  // Logic to calculate minimum and maximum available dates
  const today = new Date().toISOString().split('T')[0];
  const maxBookingDate = new Date();
  maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);
  const maxDateStr = maxBookingDate.toISOString().split('T')[0];

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!serviceId) {
        setErrorMsg('Please choose a clinical service.');
        return;
      }
      if (!dentistId) {
        setErrorMsg('Please choose a preferred dentist.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!date) {
        setErrorMsg('Please choose a valid checkup date.');
        return;
      }
      
      // Calculate day of the week (0 = Sunday, 6 = Saturday)
      const selectedDayOfWeek = new Date(date).getDay() + 1; // Translate so 1 = Monday
      
      if (selectedDayOfWeek === 1 || selectedDayOfWeek === 7) { 
        setErrorMsg('The clinic is closed on Sundays. Please select another date.');
        return;
      }

      // Check if dentist is available on that day
      const dentistDays = selectedDentist.availableDays;
      const parsedDayIndex = selectedDayOfWeek === 1 ? 7 : selectedDayOfWeek - 1; // Adjusted for dentist availableDays index: 1 = Mon to 5 = Fri
      if (parsedDayIndex > 5 || !dentistDays.includes(parsedDayIndex)) {
        setErrorMsg(`${selectedDentist.name} is not on rotation on this day. Please check their profile or select another day.`);
        return;
      }

      if (!timeSlot) {
        setErrorMsg('Please select an available hourly time slot.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please enter your legal name.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address for appointment confirmation.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 8) {
      setErrorMsg('Please provide a valid phone number for SMS emergency updates.');
      return;
    }

    // Save mock Appointment
    const newAppointment: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId,
      dentistId,
      date,
      timeSlot,
      patientName,
      patientEmail,
      patientPhone,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const existing = localStorage.getItem('auradent_appointments');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newAppointment);
    localStorage.setItem('auradent_appointments', JSON.stringify(list));

    // Callback on completed
    onBookingSuccess();
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col h-auto max-h-[90vh]"
      >
        {/* Banner header info */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Step {step} of 3</span>
            <h3 className="text-lg font-bold font-sans">Reserve Dental Appointment</h3>
          </div>
          <button
            id="btn-close-booking"
            onClick={onClose}
            className="rounded-lg bg-white/10 hover:bg-white/20 p-2 text-white/80 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Progress Bar indicator */}
        <div className="w-full h-1 bg-slate-100 relative">
          <motion.div 
            layout
            className="absolute top-0 left-0 bottom-0 bg-teal-600"
            style={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Error Alert messaging */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic Wizard Body Form */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* 1. Choose Service Section */}
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Stethoscope className="h-4 w-4 text-teal-600" />
                    1. Select Specialty Care Treatment
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[170px] overflow-y-auto pr-1">
                    {DENTAL_SERVICES.map((serv) => (
                      <button
                        key={serv.id}
                        id={`select-serv-${serv.id}`}
                        type="button"
                        onClick={() => setServiceId(serv.id)}
                        className={`flex items-start text-left gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                          serviceId === serv.id
                            ? 'border-teal-500 bg-teal-50/50'
                            : 'border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <div className={`mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                          serviceId === serv.id ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-300'
                        }`}>
                          {serviceId === serv.id && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{serv.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">{serv.duration}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Choose Dentist Expert */}
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-teal-600" />
                    2. Select Resident Clinician
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {DENTISTS.map((dent) => (
                      <button
                        key={dent.id}
                        id={`select-dent-${dent.id}`}
                        type="button"
                        onClick={() => setDentistId(dent.id)}
                        className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          dentistId === dent.id
                            ? 'border-teal-500 bg-teal-50/50'
                            : 'border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <div className="h-12 w-12 rounded-full overflow-hidden mb-2 border">
                          <img src={dent.image} alt={dent.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-none">{dent.name.split(' ').slice(1).join(' ')}</h4>
                          <span className="text-[9px] text-teal-600 font-semibold block mt-1 uppercase leading-none">{dent.title.split(',')[1] || 'Clinician'}</span>
                          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Rating: {dent.rating.toFixed(1)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Date Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4 text-teal-600" />
                    3. Pick Preferred Date
                  </label>
                  <input
                    type="date"
                    id="booking-date"
                    min={today}
                    max={maxDateStr}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTimeSlot(''); // clear time
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-hidden text-slate-800"
                  />
                  <p className="mt-2 text-[10px] text-slate-400">
                    * Available Mon - Fri: 8:00 AM - 6:00 PM. Weekend bookings are closed.
                  </p>
                </div>

                {/* 2. Timeslots Select */}
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-teal-600" />
                    4. Available Timeslots ({selectedDentist.name})
                  </label>
                  {date ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          id={`timeslot-${slot.replace(/\s+/g, '-')}`}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`rounded-xl py-2.5 text-xs font-semibold cursor-pointer text-center border transition-all ${
                            timeSlot === slot
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                      Please specify a checkup date first to display active timeslots.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shrink-0">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Aesthetic Summary</h4>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      <strong>Treatment:</strong> {selectedService.name}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      <strong>Clinical Dentist:</strong> {selectedDentist.name}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      <strong>Schedule Timestamp:</strong> {date} @ {timeSlot}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="patient-name" className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      Legal Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        id="patient-name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Marcus Sterling"
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Mail & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="patient-email" className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          id="patient-email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="marcus@example.com"
                          className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="patient-phone" className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        SMS & WhatsApp Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          id="patient-phone"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="+1 (555) 430-1004"
                          className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comments notes */}
                  <div>
                    <label htmlFor="patient-notes" className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      Notes / Symptoms / Sedation Preference (Optional)
                    </label>
                    <textarea
                      id="patient-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify if you have root sensitivity, pregnant status, or any drug allergies..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-teal-500 focus:outline-hidden resize-none"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wizard Footer Links */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100 shrink-0">
          {step > 1 ? (
            <button
              id="btn-prev-wizard"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              id="btn-next-wizard"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-teal-600 shadow-md cursor-pointer"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              id="btn-confirm-wizard"
              onClick={handleConfirmReservation}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-extrabold text-white transition hover:bg-teal-700 shadow-lg cursor-pointer shadow-teal-600/10"
            >
              Confirm Appointment Now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
