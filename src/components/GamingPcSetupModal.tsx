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

  const ownedCount = ALL_PC_PARTS.filter((p) => ownedPartIds[p.id]).length;
  const ringR = 52;
  const ringC = 2 * Math.PI * ringR;

  return (
    <div className="gp-overlay" onClick={onClose}>
      <div className="gp-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>

        {/* ── Sidebar: summary + categories + actions ── */}
        <aside className="gp-side">
          <div className="gp-brand">
            <div className="gp-brand-icon"><Gamepad2 size={22} color="#04121a" /></div>
            <div>
              <h2>Pro Gaming PC Blueprint</h2>
              <span className="badge badge-purple">2026 Edition · {ALL_PC_PARTS.length} components</span>
            </div>
          </div>
          <p className="gp-sub">Full hardware specs, individual prices, images, and live financial gap calculation</p>

          <div className="gp-ring">
            <svg viewBox="0 0 120 120" width="150" height="150">
              <circle cx="60" cy="60" r={ringR} fill="none" stroke="rgba(160,190,255,.12)" strokeWidth="10" />
              <circle cx="60" cy="60" r={ringR} fill="none" stroke="url(#gpg)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={ringC} strokeDashoffset={ringC * (1 - Math.min(100, percentFunded) / 100)} transform="rotate(-90 60 60)" />
              <defs><linearGradient id="gpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>
            </svg>
            <div className="gp-ring-label"><strong>{percentFunded}%</strong><span>funded</span></div>
          </div>

          <dl className="gp-stats">
            <div><dt>Total {ALL_PC_PARTS.length}-part setup cost</dt><dd>{formatINR(totalBuildPriceInr, true)}<small>${totalBuildPriceUsd.toLocaleString()} USD</small></dd></div>
            <div><dt>Your current net wealth</dt><dd className="pos">{formatINR(currentNetWealth, true)}<small>Bank + Gold + Crypto + Rewards</small></dd></div>
            <div><dt>Still needed</dt><dd className="neg">{formatINR(remainingNeededInr, true)}<small>Exact remaining gap to reach goal</small></dd></div>
            <div><dt>Parts status</dt><dd>{ownedCount} / {ALL_PC_PARTS.length} owned<small>{percentFunded}% of setup funded</small></dd></div>
          </dl>

          <nav className="gp-cats" aria-label="Part categories">
            {categories.map((cat) => (
              <button key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>
                <span>{cat}</span>
                <em>{cat === 'All' ? ALL_PC_PARTS.length : ALL_PC_PARTS.filter((p) => p.category === cat).length}</em>
              </button>
            ))}
          </nav>

          <div className="gp-actions">
            <button className="btn-secondary" onClick={handleExportCsv} title="Export parts list as CSV"><Download size={14} /> Export Parts CSV</button>
            <button className="btn-secondary gp-close" onClick={onClose} title="Close modal"><X size={16} /></button>
          </div>
        </aside>

        {/* ── Main: parts grid ── */}
        <section className="gp-main">
          <header className="gp-main-head">
            <div>
              <h3>{selectedCategory === 'All' ? 'All Components' : selectedCategory}</h3>
              <span>{filteredParts.length} parts</span>
            </div>
            <div className="gp-goal">Goal <strong>{formatINR(totalBuildPriceInr, true)}</strong> · Still needed <strong className="neg">{formatINR(remainingNeededInr, true)}</strong></div>
          </header>

          <div className="gp-grid">
            {filteredParts.map((part) => {
              const isOwned = Boolean(ownedPartIds[part.id]);
              return (
                <article key={part.id} className={`gp-card${isOwned ? ' owned' : ''}`}>
                  <div className="gp-img">
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span className="badge badge-purple gp-chip">{part.subcategory}</span>
                    <div className="gp-price"><strong>{formatINR(part.priceInr, true)}</strong><small>${part.priceUsd} USD</small></div>
                  </div>
                  <div className="gp-body">
                    <h4>{part.name}</h4>
                    <div className="gp-brandline">Recommended brand: {part.recommendedBrand}</div>
                    <p className="gp-why"><strong>Why chosen:</strong> {part.whyChosen}</p>
                    <div className="gp-specs">
                      {part.specs.map((spec, i) => (<span key={i}>{spec}</span>))}
                    </div>
                  </div>
                  <button className={`gp-own${isOwned ? ' on' : ''}`} onClick={() => toggleOwned(part.id)}>
                    <span className="gp-own-l">{isOwned ? <CheckCircle2 size={16} /> : <Circle size={16} />}{isOwned ? 'Purchased / Owned' : 'Mark as owned'}</span>
                    <span>{isOwned ? '₹0 still needed' : formatINR(part.priceInr, true)}</span>
                  </button>
                </article>
              );
            })}
          </div>

          <footer className="gp-foot">
            <button onClick={onClose} className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Done &amp; Return to Dashboard</button>
          </footer>
        </section>
      </div>
    </div>
  );
};
