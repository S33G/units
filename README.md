# Units

> A transparent unit converter that shows you the math behind every conversion.

[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/s33g/units)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**Live Demo**: [units.s33g.uk](https://units.s33g.uk)

---

## Why Units?

Most converters are black boxes. You type a number, get a result, and have no idea if it's accurate.

**Units is different:**
- 📐 **Transparent**: See the exact formula and conversion steps
- 🔬 **Accurate**: Every conversion factor is sourced (SI definitions, international standards)
- 🎨 **Beautiful**: Clean, modern UI built with Next.js 16 and Tailwind CSS 4
- 🔒 **Private**: 100% client-side. No tracking, no servers, no data collection
- ⚡ **Fast**: Instant conversions with sharable URLs

---

## Features

### 22 Unit Categories with 250+ Units

**Core Categories:**
- **Length & Distance** — meters, feet, miles, nautical miles, light-years, Chinese lǐ/chǐ, Scandinavian mil, picometers, decimeters
- **Temperature** — Celsius, Fahrenheit, Kelvin, Rankine, Réaumur, Delisle
- **Mass & Weight** — kilograms, pounds, ounces, tons, Indian tola/seer, Japanese momme, Thai baht, pennyweights
- **Volume** — liters, gallons, cups, cubic meters, imperial cups/tbsp/tsp, Japanese gō
- **Time** — seconds, hours, days, weeks, years, months, decades
- **Speed** — m/s, mph, km/h, knots, Mach, speed of light, cm/s
- **Energy** — joules, calories, BTU, kWh, foot-pounds, ergs
- **Pressure** — pascals, PSI, bar, atmospheres, mmHg, inHg
- **Power** — watts, horsepower, BTU/h
- **Digital Storage** — bytes through petabytes/pebibytes (decimal and binary prefixes)
- **Data Rate** — bps, Mbps, Gbps
- **Area** — square meters, acres, hectares, Chinese mǔ, Japanese tsubo, Korean pyeong, Indian bigha, Thai rai, Vietnamese mẫu, dunam
- **Force** — newtons, pounds-force, dynes
- **Frequency** — hertz, RPM, radians/sec
- **Fuel Economy** — MPG, L/100km
- **Flow Rate** — L/s, GPM, cubic meters/hour
- **Density** — kg/m³, g/cm³, lb/ft³, kg/L, g/mL, lb/gal
- **Concentration** — mol/L, ppm, ppb
- **Angle** — degrees, radians, gradians, turns, milliradians
- **Torque** — N⋅m, lb⋅ft, kg⋅m

**New Categories:**
- **Illuminance** — lux, kilolux, foot-candles, phot
- **Cooking Volume** — metric/Australian/Japanese cups, tablespoons, teaspoons, dessert spoons, drops, pinches

### Formula Transparency

Every conversion shows:
- Step-by-step calculation
- Exact conversion factors
- Source documentation (e.g., "SI base unit", "International mile, exact by definition")
- Precision indicator (exact vs. approximate)

### Share Conversions

URL-based state means every conversion is sharable:
```
https://units.s33g.uk/?c=length&from=miles&to=km&v=26.2
```

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/s33g/units.git
cd units

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start converting!

---

## Development

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint check
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run with coverage report (100% threshold)
```

### Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Testing Library
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Project Structure

```
units/
├── app/
│   ├── components/       # UI components
│   ├── globals.css       # Tailwind + theme tokens
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   ├── convert.ts        # Conversion engine
│   ├── types.ts          # TypeScript types
│   └── categories/       # Unit definitions (22 category files, 250+ units)
└── public/               # Static assets
```

---

## Contributing

We love contributions! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- ✨ New unit categories
- 🧪 Test improvements

**Read our [Contributing Guide](CONTRIBUTING.md) to get started.**

### Good First Issues

- Add new units to existing categories
- Improve conversion accuracy with better sources
- Add translations (i18n)
- Performance optimizations

---

## Adding a New Unit Category

1. Create `lib/categories/my-category.ts`:
```typescript
import type { Category } from "@/lib/types";

export const myCategory: Category = {
  id: "my-category",
  name: "My Category",
  icon: "🔥",
  baseUnitId: "base-unit",
  units: [
    {
      id: "base-unit",
      name: "Base Unit",
      symbol: "bu",
      factor: 1,
      precision: "exact",
      formulaToBase: "value",
      source: "Definition source here",
    },
    // Add more units...
  ],
};
```

2. Export it from `lib/categories/index.ts`
3. Add tests in `lib/categories/categories.test.ts`
4. Submit a PR!

---

## Testing

We maintain **100% test coverage** to ensure conversion accuracy.

```bash
npm test                           # Run all tests
npm run test:coverage              # Coverage report
npx vitest run path/to/file.test.ts  # Single file
```

---

## License

[MIT](LICENSE) © s33g

Free to use, modify, and distribute. Attribution appreciated but not required.

---

## Acknowledgments

- Conversion factors sourced from [NIST](https://www.nist.gov/), [SI Brochure](https://www.bipm.org/en/publications/si-brochure/), and international standards
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## Community

- **Issues**: [Report bugs or request features](https://github.com/USERNAME/units/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/USERNAME/units/discussions)
- **Pull Requests**: [Contribute code](https://github.com/USERNAME/units/pulls)

---

<div align="center">

**[⭐ Star this repo](https://github.com/s33g/units)** if you find it useful!

</div>
