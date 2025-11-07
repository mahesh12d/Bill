import RateCardTable from '../RateCardTable';

export default function RateCardTableExample() {
  const sampleItems = [
    {
      srNo: 1,
      description: "Standard Lighting/Fan Point Fitting & Wiring (Tube Light, Fan, Light Point)",
      laborWork: "₹250",
      materialSpecs: "Vinay Adora Switches, Polycab/Patel Wires/Cables",
      rateWithMaterial: "₹750",
    },
    {
      srNo: 2,
      description: "Computer/Power Board Wiring Point (1 Point)",
      laborWork: "₹200",
      materialSpecs: "Vinay Adora Switches, Polycab/Patel Wires/Cables",
      rateWithMaterial: "₹600",
    },
  ];

  return <RateCardTable items={sampleItems} />;
}
