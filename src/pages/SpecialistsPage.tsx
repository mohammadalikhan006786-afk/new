import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DENTISTS } from '../data';
import { Dentist } from '../types';
import { Star, ShieldCheck, Award, Calendar, GraduationCap, ArrowRight, X, Sparkles, Building2, Landmark, Check } from 'lucide-react';

interface SpecialistsPageProps {
  onSelectDentist: (dentistId: string) => void;
}

export default function SpecialistsPage({ onSelectDentist }: SpecialistsPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'cosmetic' | 'surgical'>('all');
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);

  const filteredDentists = DENTISTS.filter(d => {
    if (activeTab === 'all') return true;
    if (activeTab === 'cosmetic') return d.specialty.toLowerCase().includes('cosmetic') || d.specialty.toLowerCase().includes('orthodontist');
    if (activeTab === 'surgical') return d.specialty.toLowerCase().includes('surgeon') || d.specialty.toLowerCase().includes('implant');
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="py-12 bg-slate-50 min-h-screen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12 mt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            Accredited Clinical Staff
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 font-sans sm:text-5xl">
            Our Dental Team Specialists
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Our board-certified dentists serve on national oral healthcare committees, conducting leading-edge research while delivering meticulous patient transformations.
          </p>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex justify-center items-center gap-2 mb-12">
          {(['all', 'cosmetic', 'surgical'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'all' ? 'All Clinicians' : tab === 'cosmetic' ? 'Aesthetic Specialties' : 'Surgical Specialties'}
            </button>
          ))}
        </div>

        {/* Specialists Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredDentists.map((dentist, index) => (
            <motion.div
              layout
              key={dentist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-3xl border border-slate-100 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all"
            >
              <div className="relative h-80 bg-slate-150 overflow-hidden">
                <img
                  src={dentist.image}
                  alt={dentist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-103"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 bg-slate-900 text-[10px] font-extrabold uppercase tracking-wider rounded-lg">
                  {dentist.experience} clinical competence
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest">{dentist.title}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {dentist.rating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{dentist.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mb-4 italic">{dentist.specialty}</p>
                  
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {dentist.bio}
                  </p>

                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <span className="text-3xs uppercase text-slate-400 font-extrabold tracking-wider block">Clinical Competencies</span>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <li className="flex items-center gap-1.5 text-2xs text-slate-600">
                        <Check className="h-3 w-3 text-teal-600" /> Board Certified
                      </li>
                      <li className="flex items-center gap-1.5 text-2xs text-slate-600">
                        <Check className="h-3 w-3 text-teal-600" /> NIH Registered
                      </li>
                      <li className="flex items-center gap-1.5 text-2xs text-slate-600">
                        <Check className="h-3 w-3 text-teal-600" /> Clinical Lecturer
                      </li>
                      <li className="flex items-center gap-1.5 text-2xs text-slate-600">
                        <Check className="h-3 w-3 text-teal-600" /> Laser Certified
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDentist(dentist)}
                    className="text-2xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-wider"
                  >
                    View Background
                  </button>
                  <button
                    onClick={() => onSelectDentist(dentist.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white px-3.5 py-2 text-2xs font-bold transition-all"
                  >
                    Book Doctor <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Academic Affiliations */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-3xs text-teal-400 font-extrabold uppercase tracking-widest block mb-1">Affiliated Memberships</span>
              <h2 className="text-2xl font-bold font-sans">Accredited by Elite Global Dental Institutes</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Our specialists maintain active status as board examiners, clinical directors, and active lecturers across premier global orthodontic forums. This ensures our facility implements modern guidelines before general clinics.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Landmark className="h-6 w-6 text-teal-400 mx-auto mb-2" />
                <span className="text-[10px] font-bold block uppercase tracking-widest text-slate-300">ADA Registered</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Award className="h-6 w-6 text-teal-400 mx-auto mb-2" />
                <span className="text-[10px] font-bold block uppercase tracking-widest text-slate-300">Board Certified</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dentist Biography Details Modal */}
      <AnimatePresence>
        {selectedDentist && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setSelectedDentist(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12">
                <div className="sm:col-span-5 h-56 sm:h-auto bg-slate-100">
                  <img
                    src={selectedDentist.image}
                    alt={selectedDentist.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="sm:col-span-7 p-6 sm:p-8 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-widest">
                      <GraduationCap className="h-4 w-4" /> Comprehensive Bio
                    </div>
                    <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{selectedDentist.name}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{selectedDentist.title}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedDentist.bio}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Award className="h-4 w-4 text-teal-500" />
                      <span>Specialty Scope: <strong className="text-slate-800">{selectedDentist.specialty}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck className="h-4 w-4 text-teal-500" />
                      <span>Positive Reviews: <strong className="text-slate-800">{selectedDentist.rating} ({selectedDentist.reviewsCount} checked ratings)</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4 text-teal-500" />
                      <span>Weekly Service: <strong className="text-slate-800">Advanced consultation slot appointments</strong></span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedDentist(null)}
                      className="rounded-xl px-4 py-2 border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Close Bio
                    </button>
                    <button
                      onClick={() => {
                        onSelectDentist(selectedDentist.id);
                        setSelectedDentist(null);
                      }}
                      className="rounded-xl px-5 py-2.5 bg-teal-600 text-white text-xs font-bold transition-all hover:bg-teal-700 shadow-md shadow-teal-600/10 cursor-pointer"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
