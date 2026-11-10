import React, { useState } from 'react';
import {
  X,
  Gamepad2,
  CheckCircle2,
  Circle,
  Download,
} from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface PcPartItem {
  id: string;
  name: string;
  category: 'PC Tower' | 'Display' | 'Peripherals' | 'Audio' | 'Furniture' | 'Power & Accessories';
  subcategory: string;
  priceInr: number;
  priceUsd: number;
  specs: string[];
  whyChosen: string;
  imageUrl: string;
  recommendedBrand: string;
}

const ALL_PC_PARTS: PcPartItem[] = [
  // ── 1. PC TOWER CORE ──────────────────────────────────────
  {
    id: 'part-cpu',
    name: 'AMD Ryzen 7 7800X3D Processor',
    category: 'PC Tower',
    subcategory: 'CPU (Processor)',
    priceInr: 36500,
    priceUsd: 399,
    recommendedBrand: 'AMD',
    specs: ['8 Cores / 16 Threads', '5.0 GHz Max Boost Clock', '96MB 3D V-Cache (104MB Total)', '120W TDP, AM5 Platform'],
    whyChosen: 'Undisputed champion for gaming. The massive 3D V-Cache eliminates 1% low frame dips in competitive esports and heavy AAA titles.',
    imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-gpu',
    name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
    category: 'PC Tower',
    subcategory: 'GPU (Graphics Card)',
    priceInr: 82000,
    priceUsd: 799,
    recommendedBrand: 'ASUS TUF / MSI Gaming X',
    specs: ['8,448 CUDA Cores', '16GB GDDR6X on 256-bit bus', 'DLSS 3.5 Frame Gen & Ray Reconstruction', '285W TDP, Native 12VHPWR'],
    whyChosen: 'Maximum 1440p ultra-high FPS and 4K capability. 16GB VRAM on a 256-bit bus ensures no texture memory bottlenecks in modern next-gen titles.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-motherboard',
    name: 'MSI MAG B650 TOMAHAWK WIFI Motherboard',
    category: 'PC Tower',
    subcategory: 'Motherboard',
    priceInr: 21500,
    priceUsd: 219,
    recommendedBrand: 'MSI',
    specs: ['14+2+1 Duet Rail VRM (80A SPS)', 'DDR5 7600+ MHz (OC)', '3x M.2 NVMe PCIe 4.0 slots with Shield Frozr', 'Wi-Fi 6E + 2.5G LAN, ALC4080 Audio'],
    whyChosen: 'High-end VRM power delivery ensures zero throttling for Ryzen 7000/9000 chips with clean all-black stealth aesthetics.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-ram',
    name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30',
    category: 'PC Tower',
    subcategory: 'RAM (Memory)',
    priceInr: 11500,
    priceUsd: 135,
    recommendedBrand: 'Corsair',
    specs: ['32GB Kit (2x 16GB)', '6000 MT/s Frequency', 'CL30-36-36-76 Timing (1:1 Ratio)', 'AMD EXPO Profile Support'],
    whyChosen: 'The exact optimal latency sweet spot for AMD Ryzen processors. Provides highest memory bandwidth and smoothest frame delivery.',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-ssd',
    name: 'Samsung 990 PRO 2TB NVMe M.2 PCIe Gen 4 SSD with Heatsink',
    category: 'PC Tower',
    subcategory: 'Storage (Primary SSD)',
    priceInr: 17500,
    priceUsd: 189,
    recommendedBrand: 'Samsung',
    specs: ['7,450 MB/s Seq. Read / 6,900 MB/s Write', '1,400K IOPS Random Read', 'Integrated Nickel Heatsink', '1200 TBW Endurance'],
    whyChosen: 'Blistering load speeds, zero-delay Windows boot, and DirectStorage acceleration in next-gen games.',
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-cooler',
    name: 'DeepCool LT720 360mm AIO Liquid Cooler',
    category: 'PC Tower',
    subcategory: 'CPU Cooler',
    priceInr: 10500,
    priceUsd: 125,
    recommendedBrand: 'DeepCool / Lian Li',
    specs: ['360mm Aluminum Radiator', '4th-Gen High-Pressure Microchannel Pump', '3x 120mm FK120 FDB PWM Fans (85.85 CFM)', 'Multi-Dimensional Infinity Mirror Cap'],
    whyChosen: 'Keeps the Ryzen 7 7800X3D below 65°C under intensive sustained gaming while maintaining whisper-quiet operation.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-psu',
    name: 'Corsair RM850x (ATX 3.0) 850W 80+ Gold Fully Modular',
    category: 'PC Tower',
    subcategory: 'Power Supply (PSU)',
    priceInr: 12000,
    priceUsd: 145,
    recommendedBrand: 'Corsair',
    specs: ['850 Watts Output', '80 PLUS Gold Certified', 'Native 12VHPWR PCIe 5.0 Cable', '100% Japanese 105°C Capacitors, Zero-RPM Fan Mode'],
    whyChosen: 'Clean, ripple-free power with a native 12VHPWR cable designed for modern RTX 40-series cards, eliminating messy adapter dongles.',
    imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-case',
    name: 'NZXT H9 Flow Dual-Chamber Mid-Tower ATX Case + 4x ARGB Fans',
    category: 'PC Tower',
    subcategory: 'Chassis / Case',
    priceInr: 14500,
    priceUsd: 170,
    recommendedBrand: 'NZXT',
    specs: ['Dual-Chamber Panoramic Tempered Glass', 'Direct GPU Bottom-Up Airflow Path', 'Supports up to ten 120mm fans', 'High-Airflow Perforated Top & Side Panels'],
    whyChosen: 'Separates power supply and cables into a rear compartment, providing unmatched direct cooling airflow to the graphics card.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
  },

  // ── 2. DISPLAY / MONITORS ─────────────────────────────────
  {
    id: 'part-monitor-primary',
    name: 'LG UltraGear 27GS95QE 27" OLED 240Hz 0.03ms QHD Gaming Monitor',
    category: 'Display',
    subcategory: 'Primary Esports Display',
    priceInr: 64000,
    priceUsd: 750,
    recommendedBrand: 'LG UltraGear',
    specs: ['27-inch 2560x1440 (1440p QHD)', 'Self-Lit OLED Per-Pixel Dimming', '240Hz Refresh Rate with 0.03ms Response Time', 'G-SYNC Compatible & FreeSync Premium Pro, 98.5% DCI-P3'],
    whyChosen: 'Infinite 1,500,000:1 contrast and 0.03ms response time completely eradicate motion blur and ghosting in competitive shooters.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-monitor-secondary',
    name: 'Dell S2722DGM 27" 165Hz QHD Curved VA Display',
    category: 'Display',
    subcategory: 'Secondary Companion Display',
    priceInr: 18000,
    priceUsd: 230,
    recommendedBrand: 'Dell',
    specs: ['27-inch 2560x1440 (1440p)', '165Hz Refresh Rate', '1500R Curved Panel', '3000:1 High Contrast Ratio'],
    whyChosen: 'Dedicated companion screen for Discord, OBS stream dashboard, Spotify, and telemetry without sacrificing primary screen FPS.',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80',
  },

  // ── 3. ESPORTS PERIPHERALS ────────────────────────────────
  {
    id: 'part-keyboard',
    name: 'Razer Huntsman V3 Pro TKL (Gen-2 Analog Optical Switches)',
    category: 'Peripherals',
    subcategory: 'Esports Keyboard',
    priceInr: 18500,
    priceUsd: 220,
    recommendedBrand: 'Razer',
    specs: ['Analog Optical Switches Gen-2', 'Rapid Trigger Mode (0.1mm - 4.0mm adjustable)', 'Doubleshot PBT Keycaps', 'Multi-Function Digital Dial & Macro Keys'],
    whyChosen: 'Rapid Trigger allows instantaneous counter-strafing by resetting the key the moment you lift your finger by 0.1mm.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-mouse',
    name: 'Logitech G PRO X SUPERLIGHT 2 Lightspeed Wireless Mouse',
    category: 'Peripherals',
    subcategory: 'Wireless Mouse',
    priceInr: 13500,
    priceUsd: 159,
    recommendedBrand: 'Logitech G',
    specs: ['60 Grams Featherlight Design', 'HERO 2 Sensor (up to 32,000 DPI, 500+ IPS)', '4,000Hz Polling Rate Wireless', 'LIGHTFORCE Hybrid Optical-Mechanical Switches, 95h Battery'],
    whyChosen: 'The gold standard in professional esports tournaments. Zero drag, zero latency, and flawless tracking accuracy.',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-mousepad',
    name: 'SteelSeries QcK Heavy XXL Extended Desk Mat (900x400x4mm)',
    category: 'Peripherals',
    subcategory: 'Desk Mat / Mousepad',
    priceInr: 3500,
    priceUsd: 45,
    recommendedBrand: 'SteelSeries',
    specs: ['900mm x 400mm x 4mm Dimensions', 'Extra-Thick Non-Slip Rubber Base', 'Exclusive QcK Micro-Woven Cloth', 'Stitched Anti-Fray Edges'],
    whyChosen: 'Thick 4mm cushioning smooths out desk imperfections while delivering balanced dynamic glide and stopping power.',
    imageUrl: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=600&auto=format&fit=crop&q=80',
  },

  // ── 4. AUDIO & STREAMING ──────────────────────────────────
  {
    id: 'part-headset',
    name: 'SteelSeries Arctis Nova Pro Wireless Headset (ANC + GameDAC Gen 2)',
    category: 'Audio',
    subcategory: 'Wireless Headset',
    priceInr: 32000,
    priceUsd: 380,
    recommendedBrand: 'SteelSeries',
    specs: ['Active Noise Cancellation (ANC)', 'Dual Hot-Swappable Batteries (Infinity Power)', 'Simultaneous 2.4GHz Wireless + Bluetooth 5.0', 'OLED GameDAC Gen 2 Multi-System Base Station'],
    whyChosen: 'High-fidelity audio with hot-swappable batteries so you never have to plug your headset into a cable mid-game.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-mic',
    name: 'Elgato Wave:3 USB Condenser Microphone + Wave Mic Arm LP',
    category: 'Audio',
    subcategory: 'Studio Streaming Mic',
    priceInr: 14000,
    priceUsd: 170,
    recommendedBrand: 'Elgato',
    specs: ['24-Bit / 96kHz Analog-to-Digital Converter', 'Proprietary Clipguard Anti-Distortion Tech', 'Capacitive Mute Button', 'Wave Link Digital Mixer with Low-Profile Boom Arm'],
    whyChosen: 'Studio-grade voice broadcast clarity with built-in hardware limiter preventing clipping during intense moments.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  },

  // ── 5. FURNITURE & ERGONOMICS ─────────────────────────────
  {
    id: 'part-desk',
    name: 'Secretlab MAGNUS Pro XL (70" Motorized Sit-Stand Metal Desk)',
    category: 'Furniture',
    subcategory: 'Motorized Sit-Stand Desk',
    priceInr: 68000,
    priceUsd: 820,
    recommendedBrand: 'Secretlab',
    specs: ['177cm (70") Solid Steel Construction', 'Integrated Leg Power Column (1 Plug Powers Everything)', 'Full-Length Magnetic Cable Concealment Tray', 'Ultra-Quiet Dual Motors with 3 Height Presets'],
    whyChosen: 'Revolutionary cable-free design. Completely conceals all power bricks, extension cords, and wires inside a magnetic hinged tray.',
    imageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-chair',
    name: 'Secretlab TITAN Evo Gaming Chair (SoftWeave Plus Fabric)',
    category: 'Furniture',
    subcategory: 'Ergonomic Chair',
    priceInr: 44000,
    priceUsd: 530,
    recommendedBrand: 'Secretlab',
    specs: ['4-Way L-ADAPT Internal Lumbar Support', 'SoftWeave Plus Breathable Fabric', 'Magnetic Memory Foam Head Pillow', 'Full-Metal 4D CloudSwap Armrests'],
    whyChosen: 'Engineered for 10+ hour marathon gaming sessions. The breathable weave keeps you cool in Indian climates without sticking.',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&auto=format&fit=crop&q=80',
  },

  // ── 6. POWER & ACCESSORIES ────────────────────────────────
  {
    id: 'part-ups',
    name: 'APC Back-UPS Pro BR1500G-IN (1500VA / 865W Pure Sine Wave UPS)',
    category: 'Power & Accessories',
    subcategory: 'Power Protection & UPS',
    priceInr: 18500,
    priceUsd: 220,
    recommendedBrand: 'APC by Schneider Electric',
    specs: ['1500VA / 865W Continuous Capacity', 'Pure Sine Wave Output (Safe for PFC Power Supplies)', 'Automatic Voltage Regulation (AVR)', 'LCD Diagnostic Screen with Surge Protection'],
    whyChosen: 'Essential insurance in India. Prevents sudden shutdown damage to the RTX 4070 Ti Super and OLED display during voltage drops.',
    imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-streamdeck',
    name: 'Elgato Stream Deck MK.2 (15 Customizable LCD Macro Keys)',
    category: 'Power & Accessories',
    subcategory: 'Macro Controller',
    priceInr: 12000,
    priceUsd: 145,
    recommendedBrand: 'Elgato',
    specs: ['15 Dynamic LCD Keys', 'Customizable Icon Profiles', 'One-Touch Discord Mute, OBS Scene Control', 'Removable Stand & Faceplate'],
    whyChosen: 'Total desktop control at your fingertips: mute mic, switch audio outputs, launch games, and monitor CPU/GPU temps.',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'part-lightbar',
    name: 'BenQ ScreenBar Halo Glare-Free Monitor Light Bar + Wireless Controller',
    category: 'Power & Accessories',
    subcategory: 'Eye-Care Light Bar',
    priceInr: 14000,
    priceUsd: 170,
    recommendedBrand: 'BenQ',
    specs: ['Asymmetric Optical Design (0 Screen Glare)', 'Front + Back Ambient Backlight', 'Smart Wireless Rotary Controller Dial', 'Auto-Dimming Light Sensor'],
    whyChosen: 'Illuminates your desk without reflecting onto the OLED screen, drastically reducing eye strain during night gaming.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  },
];

interface GamingPcSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetWealth: number;
}

export const GamingPcSetupModal: React.FC<GamingPcSetupModalProps> = ({
  isOpen,
  onClose,
  currentNetWealth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [ownedPartIds, setOwnedPartIds] = useState<{ [id: string]: boolean }>({});

  if (!isOpen) return null;

  const toggleOwned = (id: string) => {
    setOwnedPartIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalBuildPriceInr = ALL_PC_PARTS.reduce((sum, part) => sum + part.priceInr, 0);
  const totalBuildPriceUsd = ALL_PC_PARTS.reduce((sum, part) => sum + part.priceUsd, 0);

  const ownedTotalInr = ALL_PC_PARTS.filter((p) => ownedPartIds[p.id]).reduce((sum, p) => sum + p.priceInr, 0);
  const targetToBuyInr = totalBuildPriceInr - ownedTotalInr;

  // Real-time gap: How much is still remaining considering current net wealth
  const remainingNeededInr = Math.max(0, targetToBuyInr - currentNetWealth);
  const percentFunded = Math.min(100, Math.round((currentNetWealth / Math.max(1, targetToBuyInr)) * 1000) / 10);

  const categories = [
    'All',
    'PC Tower',
    'Display',
    'Peripherals',
    'Audio',
    'Furniture',
    'Power & Accessories',
  ];

  const filteredParts = selectedCategory === 'All'
    ? ALL_PC_PARTS
    : ALL_PC_PARTS.filter((p) => p.category === selectedCategory);

  const handleExportCsv = () => {
    const headers = ['Part Name', 'Category', 'Subcategory', 'Brand', 'Price INR', 'Price USD', 'Status'];
    const rows = ALL_PC_PARTS.map((p) => [
      `"${p.name}"`,
      `"${p.category}"`,
      `"${p.subcategory}"`,
      `"${p.recommendedBrand}"`,
      p.priceInr,
      p.priceUsd,
      ownedPartIds[p.id] ? 'Owned' : 'Needed',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gaming-pc-setup-parts-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      overflowY: 'auto',
    }}>
      <div style={{
        background: '#0d1526',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1240px',
        maxHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.25)',
        overflow: 'hidden',
      }}>

        {/* ── Top Modal Header ── */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(135deg, rgba(30, 20, 50, 0.8) 0%, rgba(13, 21, 38, 0.95) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            }}>
              <Gamepad2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Complete Pro Gaming PC Setup Blueprint
                </h2>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  2026 Edition · 20 Components
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0.15rem 0 0 0' }}>
                Full hardware specs, individual prices, images, and live financial gap calculation
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handleExportCsv}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Download size={13} /> Export Parts CSV
            </button>
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Financial Gap Dashboard Banner ── */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'rgba(10, 16, 30, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            {/* Total Build Price */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.9rem', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total 20-Part Setup Cost
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
                {formatINR(totalBuildPriceInr, true)}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#a855f7' }}>
                ${totalBuildPriceUsd.toLocaleString()} USD (All Categories)
              </span>
            </div>

            {/* Current Net Wealth */}
            <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '0.9rem', borderRadius: 12, border: '1px solid rgba(34, 197, 94, 0.25)' }}>
              <span style={{ fontSize: '0.72rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Current Net Wealth
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ade80', marginTop: '0.2rem' }}>
                {formatINR(currentNetWealth, true)}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#86efac' }}>
                Bank + Gold + Crypto + App Rewards
              </span>
            </div>

            {/* Still Remaining Needed Price (Highlighted!) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
              padding: '0.9rem',
              borderRadius: 12,
              border: '1px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 4px 18px rgba(239, 68, 68, 0.15)',
            }}>
              <span style={{ fontSize: '0.72rem', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                ⚡ Still How Much Price We Want
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f87171', marginTop: '0.2rem', letterSpacing: '-0.02em' }}>
                {formatINR(remainingNeededInr, true)}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#fecaca' }}>
                Exact Remaining Gap to Reach Goal
              </span>
            </div>

            {/* Owned vs Target */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.9rem', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Parts Status
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                {Object.values(ownedPartIds).filter(Boolean).length} / {ALL_PC_PARTS.length} Owned
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {percentFunded}% of setup funded
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
              <span>Progress: <strong>{percentFunded}%</strong> Funded</span>
              <span>Still Remaining: <strong style={{ color: '#f87171' }}>{formatINR(remainingNeededInr, true)}</strong></span>
            </div>
            <div style={{
              height: 8,
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.max(1, percentFunded)}%`,
                borderRadius: 999,
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #38bdf8 100%)',
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>

        {/* ── Category Filter Pills ── */}
        <div style={{
          padding: '0.75rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          background: 'rgba(15, 23, 42, 0.5)',
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: selectedCategory === cat ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedCategory === cat ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat} {cat === 'All' ? `(${ALL_PC_PARTS.length})` : `(${ALL_PC_PARTS.filter((p) => p.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* ── Scrollable Parts List Grid ── */}
        <div style={{
          padding: '1.5rem 1.75rem',
          overflowY: 'auto',
          flex: 1,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}>
            {filteredParts.map((part) => {
              const isOwned = Boolean(ownedPartIds[part.id]);

              return (
                <div
                  key={part.id}
                  style={{
                    background: isOwned ? 'rgba(34, 197, 94, 0.04)' : 'rgba(15, 23, 42, 0.8)',
                    border: isOwned ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Image with Category Badge & Price Tag */}
                  <div style={{
                    position: 'relative',
                    height: 190,
                    width: '100%',
                    background: '#070b14',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isOwned ? 0.6 : 0.9,
                        transition: 'transform 0.3s ease',
                      }}
                      onError={(e) => {
                        // Fallback image if unsplash link fails
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      display: 'flex',
                      gap: '0.4rem',
                    }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem', backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.85)' }}>
                        {part.subcategory}
                      </span>
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '8px',
                      padding: '0.3rem 0.65rem',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
                        {formatINR(part.priceInr, true)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'right' }}>
                        ${part.priceUsd} USD
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      {/* Title & Brand */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.3 }}>
                          {part.name}
                        </h4>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#a855f7', fontWeight: 600, marginBottom: '0.65rem' }}>
                        Recommended Brand: {part.recommendedBrand}
                      </div>

                      {/* Why Chosen Callout */}
                      <p style={{
                        fontSize: '0.78rem',
                        color: '#94a3b8',
                        lineHeight: 1.45,
                        marginBottom: '0.85rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        borderLeft: '3px solid #8b5cf6',
                      }}>
                        <strong style={{ color: '#cbd5e1' }}>Why Chosen:</strong> {part.whyChosen}
                      </p>

                      {/* Tech Specs List */}
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                          Technical Specs:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.3rem' }}>
                          {part.specs.map((spec, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.7rem',
                                color: '#e2e8f0',
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                              }}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Owned / Purchase Toggle */}
                    <div style={{
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <button
                        onClick={() => toggleOwned(part.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          background: isOwned ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: isOwned ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: isOwned ? '#4ade80' : '#94a3b8',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isOwned ? <CheckCircle2 size={15} color="#4ade80" /> : <Circle size={15} />}
                        {isOwned ? 'Purchased / Owned' : 'Mark as Owned'}
                      </button>

                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isOwned ? '#4ade80' : '#f8fafc' }}>
                        {isOwned ? '₹0 Still Needed' : formatINR(part.priceInr, true)}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#070b14',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Goal: <strong style={{ color: '#f8fafc' }}>{formatINR(totalBuildPriceInr, true)}</strong> · Still Needed: <strong style={{ color: '#f87171' }}>{formatINR(remainingNeededInr, true)}</strong>
          </div>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
          >
            Done &amp; Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
