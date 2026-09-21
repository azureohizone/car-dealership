require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Garage = require('../models/Garage');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/legendary_motors';

const vehiclesData = [
  // 1. Lamborghini Revuelto (Supercars / Featured)
  {
    brand: 'Lamborghini',
    model: 'Revuelto',
    year: 2026,
    category: 'Supercars',
    price: 550000,
    badge: 'V12 HYBRID FLAGSHIP',
    isFeatured: true,
    description: 'The Lamborghini Revuelto is the first High Performance Electrified Vehicle (HPEV) hybrid super sports car. Born from the legendary Sant\'Agata Bolognese heritage, it pairs an exhilarating 6.5-liter naturally aspirated V12 engine with three electric motors to forge an unforgettable 1,001 horsepower symphonic experience.',
    specifications: {
      engine: '6.5L Naturally Aspirated V12 + 3 Electric Motors',
      horsepower: 1001,
      torque: '1,062 Nm (783 lb-ft)',
      topSpeed: '350 km/h (217 mph)',
      acceleration0to100: '2.5s',
      transmission: '8-Speed Dual-Clutch E-Gear',
      fuelType: 'Plug-in Hybrid (Petrol/Electric)',
      seats: 2,
      driveType: 'All-Wheel Drive (AWD)',
      weight: '1,772 kg'
    },
    features: [
      'Carbon-Fiber Monofuselage Chassis',
      'Active Aerodynamics with 3 Wing Angles',
      'Torque Vectoring AWD System',
      'Carbon Ceramic Brakes Plus (CCB Plus)',
      '13 Customizable Driving Modes including Corsa & Citta'
    ],
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 3
  },
  // 2. Bugatti Chiron Super Sport (Supercars / Special)
  {
    brand: 'Bugatti',
    model: 'Chiron Super Sport',
    year: 2026,
    category: 'Special',
    price: 3900000,
    badge: 'QUAD-TURBO HYPERCAR',
    isFeatured: true,
    description: 'The definitive hyper sports car designed for extreme velocity without compromising luxury. With its extended longtail bodywork, bespoke Michelin Pilot Sport Cup 2 tyres, and an 8.0-liter W16 powerplant delivering 1,600 horsepower, the Chiron Super Sport reigns supreme at the pinnacle of hypercar engineering.',
    specifications: {
      engine: '8.0L Quad-Turbocharged W16',
      horsepower: 1600,
      torque: '1,600 Nm (1,180 lb-ft)',
      topSpeed: '440 km/h (273 mph)',
      acceleration0to100: '2.3s',
      transmission: '7-Speed Dual-Clutch Ricardo',
      fuelType: 'High-Octane Premium Petrol',
      seats: 2,
      driveType: 'Permanent All-Wheel Drive',
      weight: '1,995 kg'
    },
    features: [
      'Bespoke Aerodynamic Longtail Body',
      'Titanium Quad-Exhaust System with 3D-Printed Tips',
      'Carbon Fiber Aero-Blades Wheels',
      'Full Anodized Aluminum Interior Trim',
      'Accuton High-End Audio System'
    ],
    images: [
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'low_stock',
    stockCount: 1
  },
  // 3. Ferrari SF90 Stradale (Supercars)
  {
    brand: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2026,
    category: 'Supercars',
    price: 625000,
    badge: 'PRANCING HORSE HYBRID',
    isFeatured: true,
    description: 'The SF90 Stradale is the most powerful road-legal Ferrari ever produced. Encapsulating cutting-edge Formula 1 hybrid technology, its twin-turbo V8 combines with three electric motors to generate an astonishing 1,000 cv, delivering instantaneous throttle response and mind-bending cornering agility.',
    specifications: {
      engine: '4.0L Twin-Turbo V8 + 3 Electric Motors',
      horsepower: 1000,
      torque: '800 Nm (590 lb-ft)',
      topSpeed: '340 km/h (211 mph)',
      acceleration0to100: '2.5s',
      transmission: '8-Speed F1 Dual-Clutch',
      fuelType: 'PHEV (Plug-in Hybrid Electric)',
      seats: 2,
      driveType: 'e-4WD (Electric Front Axle)',
      weight: '1,570 kg'
    },
    features: [
      'Shut-Off Gurney Patented Active Aero',
      'RAC-e (Electronic Cornering Regulating System)',
      'Digital Touch Cockpit with 16-inch Curved Display',
      'Head-Up Display with Track Telemetry',
      'Assetto Fiorano Lightweight Track Package'
    ],
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 2
  },
  // 4. Koenigsegg Jesko Attack (Special / Featured)
  {
    brand: 'Koenigsegg',
    model: 'Jesko Attack',
    year: 2026,
    category: 'Special',
    price: 3400000,
    badge: '1600 HP TRACK MONSTER',
    isFeatured: true,
    description: 'Engineered in Ängelholm, Sweden, the Jesko Attack is a bespoke high-downforce megacar producing up to 1,400 kg of downforce. Fitted with Koenigsegg’s groundbreaking 9-speed Light Speed Transmission (LST) and a twin-turbo flat-plane crank V8 revving to 8,500 RPM.',
    specifications: {
      engine: '5.0L Twin-Turbo Flat-Plane V8 (E85/Flexfuel)',
      horsepower: 1600,
      torque: '1,500 Nm (1,106 lb-ft)',
      topSpeed: '480 km/h (298 mph)',
      acceleration0to100: '2.5s',
      transmission: '9-Speed Light Speed Transmission (LST)',
      fuelType: 'E85 Biofuel / Premium Unleaded',
      seats: 2,
      driveType: 'Rear-Wheel Drive with Active Diff',
      weight: '1,420 kg'
    },
    features: [
      'Active Top-Mounted Boomerang Rear Wing',
      'Autoskin Automated Hydraulic Doors & Hoods',
      'G-Force Meter with SmartCluster Digital Instrument',
      'Aircore Superlight Carbon Wheels',
      'Triplex Rear & Front Damper System'
    ],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'low_stock',
    stockCount: 1
  },
  // 5. Porsche 911 GT3 RS (992) (2 Door / Featured)
  {
    brand: 'Porsche',
    model: '911 GT3 RS (992)',
    year: 2026,
    category: '2 Door',
    price: 315000,
    badge: 'ATMOSPHERIC MOTORSPORT',
    isFeatured: true,
    description: 'The Porsche 911 GT3 RS is motorsport distilled for the open road. Featuring active aerodynamics with DRS (Drag Reduction System), a screaming 4.0-liter naturally aspirated boxer engine revving to 9,000 RPM, and an aggressive swan-neck carbon rear wing.',
    specifications: {
      engine: '4.0L Naturally Aspirated Boxer-6',
      horsepower: 525,
      torque: '465 Nm (343 lb-ft)',
      topSpeed: '296 km/h (184 mph)',
      acceleration0to100: '3.2s',
      transmission: '7-Speed Porsche Doppelkupplung (PDK)',
      fuelType: 'Premium Super Plus Petrol',
      seats: 2,
      driveType: 'Rear-Wheel Drive (RWD)',
      weight: '1,450 kg'
    },
    features: [
      'F1-Derived Drag Reduction System (DRS)',
      'Weissach Carbon Pack with Magnesium Forged Wheels',
      'Full Carbon-Fiber Reinforced Plastic (CFRP) Doors',
      'Track-Screen with Differential Preload Dial',
      'Titanium Roll Cage and 6-Point Harnesses'
    ],
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 3
  },
  // 6. Rolls-Royce Ghost Black Badge (4 Door / Featured)
  {
    brand: 'Rolls-Royce',
    model: 'Ghost Black Badge',
    year: 2026,
    category: '4 Door',
    price: 460000,
    badge: 'ULTRA-LUXURY SEDAN',
    isFeatured: true,
    description: 'The darker, more rebellious alter-ego of Rolls-Royce. The Ghost Black Badge delivers imperious whisper-quiet luxury paired with a twin-turbocharged 6.75L V12 engine tuned for urgent performance, black chrome Spirit of Ecstasy, and Starlight Headliner.',
    specifications: {
      engine: '6.75L Twin-Turbocharged V12',
      horsepower: 600,
      torque: '900 Nm (664 lb-ft)',
      topSpeed: '250 km/h (155 mph)',
      acceleration0to100: '4.7s',
      transmission: '8-Speed Satellite-Aided Automatic',
      fuelType: 'Premium Petrol',
      seats: 4,
      driveType: 'All-Wheel Drive (AWD)',
      weight: '2,490 kg'
    },
    features: [
      'Shooting Star Fiber-Optic Starlight Headliner',
      'Bespoke High-Gloss Carbon & Technical Weave Interior',
      'Planar Suspension System with Flagbearer Camera',
      'Electrically Closing Coach Doors',
      'Bespoke 18-Speaker Rolls-Royce Audio System'
    ],
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 2
  },
  // 7. Lamborghini Urus Performante (SUV / Featured)
  {
    brand: 'Lamborghini',
    model: 'Urus Performante',
    year: 2026,
    category: 'SUV',
    price: 270000,
    badge: 'SUPER SUV',
    isFeatured: true,
    description: 'Raising the bar in the Super SUV segment, the Urus Performante features sharp aerodynamic redesigns, carbon fiber hood and roof, reduced weight, and recalibrated Rally driving mode designed for ultimate speed over any terrain.',
    specifications: {
      engine: '4.0L Twin-Turbo V8',
      horsepower: 666,
      torque: '850 Nm (627 lb-ft)',
      topSpeed: '306 km/h (190 mph)',
      acceleration0to100: '3.3s',
      transmission: '8-Speed Automatic Transmission',
      fuelType: 'Premium Petrol',
      seats: 5,
      driveType: 'Permanent 4WD with Active Torque Vectoring',
      weight: '2,150 kg'
    },
    features: [
      'Carbon-Fiber Front Splitter and Vented Hood',
      'Akrapovic Titanium Sport Exhaust System',
      'Rally Driving Mode for Loose Surface Drift Control',
      'Alcantara Performante Monogram Upholstery',
      'Pirelli P Zero Trofeo R Custom Track Tyres'
    ],
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 4
  },
  // 8. Ferrari Purosangue (SUV)
  {
    brand: 'Ferrari',
    model: 'Purosangue',
    year: 2026,
    category: 'SUV',
    price: 430000,
    badge: 'V12 THOROUGHBRED',
    isFeatured: false,
    description: 'The first-ever four-door, four-seater Ferrari in history. Powered by a legendary mid-front mounted 6.5L naturally aspirated V12 engine connected to suicide welcome doors and Multimatic active spool-valve suspension.',
    specifications: {
      engine: '6.5L Naturally Aspirated 65° V12',
      horsepower: 725,
      torque: '716 Nm (528 lb-ft)',
      topSpeed: '310 km/h (193 mph)',
      acceleration0to100: '3.3s',
      transmission: '8-Speed Dual-Clutch F1 Gearbox',
      fuelType: 'Premium Unleaded Petrol',
      seats: 4,
      driveType: '4RM-S evo 4-Wheel Drive',
      weight: '2,033 kg'
    },
    features: [
      'Electric Rear-Hinged Welcome Doors',
      'Active True-Active Spool Valve (TASV) Suspension',
      '4 Independent Ergonomic Massaging Sport Seats',
      'Burmester 3D High-End Surround Sound System',
      'Aerodynamic Pass-Through Bridge Bodywork'
    ],
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 2
  },
  // 9. Aston Martin DBS 770 Ultimate (2 Door)
  {
    brand: 'Aston Martin',
    model: 'DBS 770 Ultimate',
    year: 2026,
    category: '2 Door',
    price: 415000,
    badge: 'LIMITED V12 APEX',
    isFeatured: false,
    description: 'The most ferocious production Aston Martin ever conceived. A farewell masterpiece to the iconic twin-turbo V12 generation with carbon aerodynamic louvres, flared sills, and bespoke semi-aniline leather sports seats.',
    specifications: {
      engine: '5.2L Quad-Cam 48V Twin-Turbo V12',
      horsepower: 770,
      torque: '900 Nm (664 lb-ft)',
      topSpeed: '340 km/h (211 mph)',
      acceleration0to100: '3.4s',
      transmission: 'ZF 8-Speed Automatic with Paddle Shift',
      fuelType: 'High Performance Petrol',
      seats: 2,
      driveType: 'Rear-Wheel Drive with Mechanical LSD',
      weight: '1,845 kg'
    },
    features: [
      'Carbon-Fiber Horseshoe Engine Hood Vent',
      'Bespoke 21-inch Honeycomb Satin Wheel Set',
      'Carbon Ceramic Brakes (410mm Front / 360mm Rear)',
      'Solid Forged Carbon Paddle Shifters',
      'Bang & Olufsen BeoSound Audio Integration'
    ],
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 2
  },
  // 10. Mercedes-AMG GT 63 S E-Performance 4-Door (4 Door)
  {
    brand: 'Mercedes-AMG',
    model: 'GT 63 S E-Performance',
    year: 2026,
    category: '4 Door',
    price: 220000,
    badge: '843 HP EXECUTIVE MISSILE',
    isFeatured: false,
    description: 'Affalterbach’s pinnacle four-door coupe combining a 4.0-liter handcrafted biturbo V8 with an electric motor derived directly from Formula 1 hybrid expertise. Massive torque on demand and executive-class rear lounge comfort.',
    specifications: {
      engine: '4.0L V8 Biturbo + Rear Axle Electric Motor',
      horsepower: 843,
      torque: '1,400 Nm (1,032 lb-ft)',
      topSpeed: '316 km/h (196 mph)',
      acceleration0to100: '2.9s',
      transmission: 'AMG SPEEDSHIFT MCT 9G + 2-Speed EV Unit',
      fuelType: 'Performance Plug-in Hybrid',
      seats: 4,
      driveType: 'AMG Performance 4MATIC+ All-Wheel Drive',
      weight: '2,380 kg'
    },
    features: [
      'AMG High-Performance Lithium-Ion Battery (HPB)',
      'AMG RIDE CONTROL+ Multi-Chamber Air Suspension',
      'Drift Mode with Pure Rear-Wheel Drive Disengagement',
      'Burmester High-End 3D Sound System',
      'MBUX Interior Assistant with Track Pace telemetry'
    ],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 3
  },
  // 11. Porsche Taycan Turbo GT (4 Door)
  {
    brand: 'Porsche',
    model: 'Taycan Turbo GT',
    year: 2026,
    category: '4 Door',
    price: 230000,
    badge: '1034 HP EV RECORD BREAKER',
    isFeatured: false,
    description: 'The Nürburgring electric king. Armed with silicon-carbide inverter technology, attack mode boost for track overtakes, carbon aero enhancements, and sub-2.3s acceleration that redefines physics.',
    specifications: {
      engine: 'Dual Permanent-Magnet Synchronous Motors',
      horsepower: 1034,
      torque: '1,300 Nm (959 lb-ft)',
      topSpeed: '305 km/h (190 mph)',
      acceleration0to100: '2.2s',
      transmission: '2-Speed Transmission on Rear Axle',
      fuelType: 'Full Electric (105 kWh Performance Battery Plus)',
      seats: 4,
      driveType: 'All-Wheel Drive (AWD)',
      weight: '2,220 kg'
    },
    features: [
      'Attack Mode Push-to-Pass Power Boost (120 kW Boost)',
      'Porsche Active Ride Air Suspension',
      'Carbon Ceramic Brakes with Gold Anodized Calipers',
      'Carbon Aeroblade Package with Fixed Rear Wing',
      '320 kW Ultra-Fast 800V DC Charging Architecture'
    ],
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 2
  },
  // 12. Pagani Utopia (Special)
  {
    brand: 'Pagani',
    model: 'Utopia',
    year: 2026,
    category: 'Special',
    price: 2800000,
    badge: 'PAGANI ARTISAN V12',
    isFeatured: true,
    description: 'Six years of passion culminated in the Pagani Utopia. Pure automotive sculpture featuring a Mercedes-AMG bespoke twin-turbo V12 with an available 7-speed gated manual shifter, Carbo-Titanium monocoque, and horology-inspired analog instruments.',
    specifications: {
      engine: '6.0L Mercedes-AMG 60° Twin-Turbo V12',
      horsepower: 864,
      torque: '1,100 Nm (811 lb-ft)',
      topSpeed: '354 km/h (220 mph)',
      acceleration0to100: '2.7s',
      transmission: '7-Speed Transverse Automated Manual',
      fuelType: 'Premium Unleaded',
      seats: 2,
      driveType: 'Rear-Wheel Drive (RWD)',
      weight: '1,280 kg'
    },
    features: [
      'Carbo-Triax HP62 Monocoque Tub',
      'Exposed Titanium Linkage Gated Gear Shifter',
      'Mechanical Swiss-Timepiece Analog Instrument Cluster',
      'Quad-Inconel Exhaust with Ceramic Coating',
      'Forged Monolithic Aluminum Wheels with Carbon Extractors'
    ],
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'low_stock',
    stockCount: 1
  },
  // 13. Ducati Panigale V4 R (Motorcycles / Featured)
  {
    brand: 'Ducati',
    model: 'Panigale V4 R',
    year: 2026,
    category: 'Motorcycles',
    price: 45000,
    badge: 'WSBK HOMOLOGATION BIKE',
    isFeatured: true,
    description: 'The closest thing to an official World Superbike on public roads. Revving to a dizzying 16,500 RPM in sixth gear, the Desmosedici Stradale R engine delivers race-grade power paired with aerodynamic carbon biplane winglets.',
    specifications: {
      engine: '998cc Desmosedici Stradale R 90° V4',
      horsepower: 240,
      torque: '118 Nm (87 lb-ft)',
      topSpeed: '318 km/h (198 mph)',
      acceleration0to100: '2.7s',
      transmission: '6-Speed with Ducati Quick Shift (DQS) EVO 2',
      fuelType: 'Racing Fuel / Unleaded',
      seats: 1,
      driveType: 'Regina Chain Final Drive',
      weight: '167 kg (Dry)'
    },
    features: [
      'Cornering ABS EVO and Ducati Traction Control EVO 3',
      'Öhlins NPX 25/30 Pressurized Fork & TTX36 Shock',
      'Carbon Fiber Biplane Wings (30kg downforce at 270km/h)',
      'Brushed Aluminum Fuel Tank with WSBK Ergonomics',
      'Akrapovic Full Titanium Racing Exhaust'
    ],
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 3
  },
  // 14. BMW M 1000 RR (Motorcycles)
  {
    brand: 'BMW Motorrad',
    model: 'M 1000 RR',
    year: 2026,
    category: 'Motorcycles',
    price: 38000,
    badge: 'M POWER SUPERBIKE',
    isFeatured: false,
    description: 'Born on the racetrack, perfected for street dominators. The M 1000 RR features extensive carbon aerodynamic bodywork, BMW ShiftCam variable valve timing, and lightweight carbon wheels for surgical handling.',
    specifications: {
      engine: '999cc Water-Cooled 4-Cylinder with ShiftCam',
      horsepower: 212,
      torque: '113 Nm (83 lb-ft)',
      topSpeed: '314 km/h (195 mph)',
      acceleration0to100: '2.9s',
      transmission: '6-Speed Claw-Shifted with Shift Assistant Pro',
      fuelType: 'Premium Unleaded',
      seats: 1,
      driveType: '525 M Endurance Chain',
      weight: '170 kg (Dry)'
    },
    features: [
      'M Carbon Aerodynamic Winglets (22.6kg Downforce)',
      'M Carbon Wheelset with Titanium Axles',
      'M Brakes developed directly with WorldSBK',
      '6.5-inch TFT Screen with M GPS Laptrigger',
      'Titanium Exhaust System by Akrapovic'
    ],
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1400&q=85'
    ],
    availability: 'in_stock',
    stockCount: 2
  }
];

const garagesData = [
  {
    name: 'Phnom Penh Premium Garage',
    code: 'LM-PNH-01',
    city: 'Phnom Penh',
    locationDescription: 'Diamond Island (Koh Pich), Elite Commercial District, Phnom Penh, Cambodia',
    latitude: 11.5540,
    longitude: 104.9350,
    capacity: 50,
    availableSlots: 32,
    securityInformation: '24/7 Armed Security & Biometric Vault Access',
    securityFeatures: [
      '24/7 Armed Guards on Site',
      'Iris & Biometric Keycard Scanners',
      'Climate & Humidity Controlled Chambers (20°C / 45% RH)',
      'Underground Reinforced Seismic Structure',
      'Laser Beam Motion Grid System'
    ],
    facilityPerks: [
      'Dedicated Detailing & Ceramic Coating Bay',
      'VIP Members Cigar Lounge & Boardroom',
      'Helipad Access for Direct Airport Transfer',
      'Trickle Charger Power Stations on Every Spot'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Siem Reap Heritage Depot',
    code: 'LM-REP-01',
    city: 'Siem Reap',
    locationDescription: 'Angkor Sanctuary Boulevard, Charles de Gaulle Enclave, Siem Reap, Cambodia',
    latitude: 13.3671,
    longitude: 103.8448,
    capacity: 30,
    availableSlots: 18,
    securityInformation: 'Climate-Controlled Luxury Bunker with 24/7 Patrol',
    securityFeatures: [
      'Continuous 24/7 Perimeter Patrol',
      'Encrypted RFID Access Gates',
      'HEPA Dust Filtration & Constant Dehumidification',
      'Infrared Night Vision Surveillance Array'
    ],
    facilityPerks: [
      'Direct Private Runway Access (Siem Reap VIP Airport)',
      'Private Chauffeur & Concierge Staging',
      'Master Mechanic Inspection Pit'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Battambang Colonial Reserve',
    code: 'LM-BBM-01',
    city: 'Battambang',
    locationDescription: 'Sangker Riverside Way, Central Heritage Quarter, Battambang, Cambodia',
    latitude: 13.0957,
    longitude: 103.2022,
    capacity: 25,
    availableSlots: 14,
    securityInformation: 'Laser Perimeter & Private Concierge Maintenance',
    securityFeatures: [
      'Laser Perimeter Tripwire Detection',
      'Double Steel Blast Vault Doors',
      'Automated CO2 Fire Suppression System',
      '24/7 Armed Security Post'
    ],
    facilityPerks: [
      'Monthly Engine Fluid & Battery Health Cycles',
      'Collector Showroom Stage with Studio Spotlights',
      'Enclosed Armored Transport Loading Dock'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Sihanoukville Coastal Harbor',
    code: 'LM-KOS-01',
    city: 'Sihanoukville',
    locationDescription: 'Independence Marina Boulevard, Coastal Port Zone, Sihanoukville, Cambodia',
    latitude: 10.6275,
    longitude: 103.5255,
    capacity: 40,
    availableSlots: 22,
    securityInformation: 'Maritime-Grade Dehumidified Vault with 24/7 Guard',
    securityFeatures: [
      'Anti-Corrosion Anti-Salt Marine Air Filtration',
      'Subterranean Waterproof Sealed Vault',
      '24/7 Armed Maritime Security Force',
      'High-Resolution 4K CCTV with Cloud Backup'
    ],
    facilityPerks: [
      'Direct Superyacht Berthing & Loading Crane',
      'Ceramic Wash & Paint Protection Center',
      'Private High-Speed Test Strip Access'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Kampot Riverfront Haven',
    code: 'LM-KPT-01',
    city: 'Kampot',
    locationDescription: 'Teuk Chhou Riverfront Estate, Old French Bridge Enclave, Kampot, Cambodia',
    latitude: 10.5942,
    longitude: 104.1815,
    capacity: 20,
    availableSlots: 9,
    securityInformation: 'Subterranean Monitored Safehouse & VIP Valet',
    securityFeatures: [
      'Discreet Underground Vault Architecture',
      'Biometric Thumbprint Gate Locking',
      '24/7 Security Operations Room',
      'Gas & Thermal Sensing Systems'
    ],
    facilityPerks: [
      'Scenic Bokor Mountain Test-Drive Route Access',
      'Valet Concierge & Full Vehicle Shakedown Prep',
      'Vintage & Modern Supercar Storage Specialists'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Poipet Border Fortress',
    code: 'LM-POI-01',
    city: 'Poipet',
    locationDescription: 'Golden Gateway Expressway, International Trade Hub, Banteay Meanchey, Cambodia',
    latitude: 13.6558,
    longitude: 102.5630,
    capacity: 35,
    availableSlots: 19,
    securityInformation: 'High-Security Armored Transport Hub & Biometric Gates',
    securityFeatures: [
      'Reinforced Armored Concrete Enclosure',
      'Bullet-Resistant Glass & Guard Towers',
      '24/7 Elite Armed Tactical Team',
      'Facial Recognition Entry Verification'
    ],
    facilityPerks: [
      'Customs & Cross-Border Logistics Lounge',
      'Enclosed Hydraulic Trailer Logistics Support',
      'Continuous Diagnostic Health Monitoring'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[Seed] Connected to MongoDB at ${MONGODB_URI}`);

    // Clear existing collections for a fresh rich state
    await Vehicle.deleteMany({});
    await Garage.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // Seed Garages
    const createdGarages = await Garage.insertMany(garagesData);
    console.log(`[Seed] Inserted ${createdGarages.length} Cambodia Luxury Garages.`);

    // Seed Vehicles
    const createdVehicles = await Vehicle.insertMany(vehiclesData);
    console.log(`[Seed] Inserted ${createdVehicles.length} Exotic & Luxury Vehicles.`);

    // Seed a sample customer with an existing purchase for instant "My Garage" demo
    const demoCustomer = await Customer.create({
      name: 'Michael Townley',
      email: 'collector@legendarymotors.vip',
      phone: '+855 12 999 888'
    });

    const revuelto = createdVehicles[0];
    const phnomPenhGarage = createdGarages[0];

    const demoOrder = await Order.create({
      orderNumber: 'LM-20260921-8891',
      customerId: demoCustomer._id,
      vehicleId: revuelto._id,
      garageId: phnomPenhGarage._id,
      price: revuelto.price,
      status: 'Stored',
      purchaseDate: new Date('2026-09-20T14:30:00Z'),
      customerSnapshot: {
        name: demoCustomer.name,
        email: demoCustomer.email,
        phone: demoCustomer.phone
      },
      vehicleSnapshot: {
        brand: revuelto.brand,
        model: revuelto.model,
        category: revuelto.category,
        price: revuelto.price,
        image: revuelto.images[0],
        engine: revuelto.specifications.engine,
        horsepower: revuelto.specifications.horsepower,
        topSpeed: revuelto.specifications.topSpeed
      },
      garageSnapshot: {
        name: phnomPenhGarage.name,
        city: phnomPenhGarage.city,
        locationDescription: phnomPenhGarage.locationDescription,
        securityInformation: phnomPenhGarage.securityInformation
      },
      emailDispatched: true
    });

    console.log(`[Seed] Created sample collector (${demoCustomer.email}) with order: ${demoOrder.orderNumber}`);

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
