import { DentalService, Dentist, Testimonial } from './types';

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 'exam',
    name: 'Comprehensive Oral Checkup',
    category: 'preventative',
    duration: '45 mins',
    description: 'A full scan checkup including 3D X-rays, cavity detection, and custom health reports.',
    benefits: ['Detailed digital scan x-rays', 'Oral cancer screening check', 'Custom clinical treatment plan']
  },
  {
    id: 'cleaning',
    name: 'Professional Deep Cleaning',
    category: 'preventative',
    duration: '60 mins',
    description: 'Removal of plaque, tartar, and surface stains to maintain clean, strong teeth.',
    benefits: ['Ultrasonic plaque scaling', 'Advanced stain polishing', 'Fluoride protective barrier coat']
  },
  {
    id: 'whitening',
    name: 'Precision Laser Whitening',
    category: 'cosmetic',
    duration: '90 mins',
    description: 'Clinical-grade light-activated teeth whitening that elevates teeth up to 8 shades in a single session.',
    benefits: ['Immediate shade correction', 'Clinical-controlled minimal sensitivity', 'Take-home nourishment touchup kit']
  },
  {
    id: 'veneers',
    name: 'Custom Porcelain Veneers',
    category: 'cosmetic',
    duration: '120 mins',
    description: 'Thin, durable artisan veneers bonded to teeth surfaces to resolve spacing, cracks, or discoloration.',
    benefits: ['Permanently bright white surfaces', 'Custom-crafted structural shapes', 'Ultra-durable stain resistance']
  },
  {
    id: 'filling',
    name: 'Composite Cavity Restoration',
    category: 'restorative',
    duration: '45 mins',
    description: 'Metal-free, tooth-colored composite restorations that repair decay perfectly.',
    benefits: ['Seamless tooth-colored matching', 'Strong direct-bond architecture', '100% Mercury-free materials']
  },
  {
    id: 'implants',
    name: 'Advanced Dental Implants',
    category: 'surgical',
    duration: '150 mins',
    description: 'Elite titanium post substitution with high-fidelity porcelain crowns for full restoration.',
    benefits: ['Restores original biting force', 'Halts jawbone volume deterioration', 'Looks and feels like fully organic teeth']
  },
  {
    id: 'root-canal',
    name: 'Precise Root Canal Therapy',
    category: 'surgical',
    duration: '90 mins',
    description: 'Careful inner microscopic cleaning of infected nerves to save damaged, decaying teeth.',
    benefits: ['Stops throbbing systemic toothache', 'Rescues organic tooth structure', 'Advanced local numbing protocols']
  }
];

export const DENTISTS: Dentist[] = [
  {
    id: 'dr-jenkins',
    name: 'Dr. Sarah Jenkins',
    title: 'DDS, Principal Clinician',
    specialty: 'Cosmetic Dentistry & Aesthetic Reconstruction',
    experience: '12 Years',
    rating: 4.9,
    reviewsCount: 340,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Dr. Sarah graduated with distinction from the Columbia University School of Dental Medicine. She specializes in designing gorgeous, natural-looking smiles through veneer and cosmetic alignments.',
    availableDays: [1, 2, 3] // Monday, Tuesday, Wednesday
  },
  {
    id: 'dr-kim',
    name: 'Dr. Aaron Kim',
    title: 'DMD, Lead Surgeon',
    specialty: 'Invisalign Master & Advanced Oral Surgery',
    experience: '16 Years',
    rating: 4.9,
    reviewsCount: 480,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Dr. Kim has placed over 2,000 successful dental implants. He studied restorative dentistry at Penn Dental Medicine and leads all full-arch implant reconstructions with highly meticulous care.',
    availableDays: [3, 4, 5] // Wednesday, Thursday, Friday
  },
  {
    id: 'dr-rodriguez',
    name: 'Dr. Elena Rodriguez',
    title: 'DDS, Orthodontist Specialist',
    specialty: 'Pediatric Dentistry & Orthodontics',
    experience: '10 Years',
    rating: 5.0,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&w=400&q=80',
    bio: 'Dr. Rodriguez places patient comfort as her peak priority. Her friendly, educational teaching approach transforms complex dental visits into calm, pleasant visits for kids and adults alike.',
    availableDays: [1, 2, 4] // Monday, Tuesday, Thursday
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Marcus Sterling',
    role: 'Creative Director',
    rating: 5,
    comment: 'The Laser Whitening session was quick and produced beautiful results. I experienced zero tooth sensitivity because of Dr. Jenkins\' prep protocol. This clinic sets the peak gold standard!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't2',
    name: 'Clara Oswald',
    role: 'High School Educator',
    rating: 5,
    comment: 'My kids used to fear the dentist, but Dr. Rodriguez was incredible! She made them feel entirely safe and relaxed throughout the checkup. I highly recommend them to all local families!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't3',
    name: 'Julian Henderson',
    role: 'Tech Consultant',
    rating: 5,
    comment: 'Dr. Kim explained my tooth implant plan with maximum detail, showing me the digital 3D jaw scan model first. The procedure was comfortable, and recovery was completely seamless.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM'
];
