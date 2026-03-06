export const projects = [
  {
    id: 1,
    name: "Cairo Garden Residences",
    location: "New Cairo City",
    totalUnits: 250,
    availableUnits: 45,
    priceRange: "1.5M - 3.5M EGP",
    type: "Apartments",
    status: "active",
    completionDate: "2024-12-31",
    description: "Modern residential complex with green spaces and amenities"
  },
  {
    id: 2,
    name: "Alexandria Coastal Towers",
    location: "Alexandria",
    totalUnits: 180,
    availableUnits: 23,
    priceRange: "2M - 4M EGP",
    type: "Apartments",
    status: "active",
    completionDate: "2024-09-30",
    description: "Luxury sea-view apartments with premium facilities"
  },
  {
    id: 3,
    name: "New Capital City Complex",
    location: "New Administrative Capital",
    totalUnits: 320,
    availableUnits: 67,
    priceRange: "1.8M - 5M EGP",
    type: "Mixed",
    status: "active",
    completionDate: "2025-06-30",
    description: "Integrated residential and commercial development"
  },
  {
    id: 4,
    name: "Luxor Riverside Homes",
    location: "Luxor",
    totalUnits: 150,
    availableUnits: 12,
    priceRange: "800K - 1.5M EGP",
    type: "Villas",
    status: "active",
    completionDate: "2024-08-31",
    description: "Traditional-style villas with modern amenities"
  },
  {
    id: 5,
    name: "Aswan Mountain View",
    location: "Aswan",
    totalUnits: 100,
    availableUnits: 34,
    priceRange: "600K - 1.2M EGP",
    type: "Apartments",
    status: "active",
    completionDate: "2024-11-30",
    description: "Affordable housing with mountain views"
  },
  {
    id: 6,
    name: "Sharm El Sheikh Resort",
    location: "Sharm El Sheikh",
    totalUnits: 80,
    availableUnits: 5,
    priceRange: "2.5M - 6M EGP",
    type: "Villas",
    status: "active",
    completionDate: "2024-07-31",
    description: "Luxury resort-style living with private beaches"
  },
  {
    id: 7,
    name: "Giza Pyramids View",
    location: "Giza",
    totalUnits: 120,
    availableUnits: 0,
    priceRange: "3M - 7M EGP",
    type: "Apartments",
    status: "completed",
    completionDate: "2023-12-31",
    description: "Premium apartments with pyramids view"
  },
  {
    id: 8,
    name: "Delta Green Community",
    location: "Mansoura",
    totalUnits: 200,
    availableUnits: 89,
    priceRange: "700K - 1.8M EGP",
    type: "Mixed",
    status: "planning",
    completionDate: "2025-12-31",
    description: "Eco-friendly residential community"
  }
];

export const projectStats = {
  total: projects.length,
  active: projects.filter(p => p.status === 'active').length,
  completed: projects.filter(p => p.status === 'completed').length,
  planning: projects.filter(p => p.status === 'planning').length,
  totalUnits: projects.reduce((sum, p) => sum + p.totalUnits, 0),
  availableUnits: projects.reduce((sum, p) => sum + p.availableUnits, 0)
};
