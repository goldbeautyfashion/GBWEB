export const mockOrders = [
  { id: "GB-2024-001", customer: "Dilini Senanayake", products: ["Gold Radiance Foundation"], date: "2024-05-01", status: "Completed", amount: 4500 },
  { id: "GB-2024-002", customer: "Amandi Perera", products: ["Velvet Rose Lipstick", "Berry Bliss Lip Gloss"], date: "2024-05-02", status: "In Progress", amount: 5000 },
  { id: "GB-2024-003", customer: "Shenali Wijesinghe", products: ["Oud Noir Perfume"], date: "2024-05-02", status: "Pending", amount: 8900 },
  { id: "GB-2024-004", customer: "Chamari Fernando", products: ["Smoky Gold Eye Palette"], date: "2024-05-03", status: "Completed", amount: 6500 },
  { id: "GB-2024-005", customer: "Nadeesha Jayawardene", products: ["Glowing Skin Serum", "Flawless Concealer"], date: "2024-05-03", status: "Completed", amount: 8400 },
  { id: "GB-2024-006", customer: "Thisari Bandara", products: ["Champagne Highlight Powder"], date: "2024-05-04", status: "Cancelled", amount: 3800 },
  { id: "GB-2024-007", customer: "Kaushalya Silva", products: ["Rose Gold Blush"], date: "2024-05-04", status: "In Progress", amount: 3500 },
  { id: "GB-2024-008", customer: "Sachini Rathnayake", products: ["Luxe Mascara Volume"], date: "2024-05-05", status: "Pending", amount: 2900 },
  { id: "GB-2024-009", customer: "Pavithra Dissanayake", products: ["Night Jasmine Perfume"], date: "2024-05-05", status: "Completed", amount: 7800 },
  { id: "GB-2024-010", customer: "Ishara Gunasekara", products: ["Intense Drama Eyeshadow"], date: "2024-05-06", status: "Completed", amount: 5800 },
  { id: "GB-2024-011", customer: "Nilmini Karunaratne", products: ["Gold Radiance Foundation", "Flawless Concealer"], date: "2024-05-06", status: "In Progress", amount: 7700 },
  { id: "GB-2024-012", customer: "Harshi Madushan", products: ["Velvet Rose Lipstick"], date: "2024-05-07", status: "Completed", amount: 2800 },
  { id: "GB-2024-013", customer: "Imasha Rajapaksha", products: ["Oud Noir Perfume", "Night Jasmine Perfume"], date: "2024-05-07", status: "Pending", amount: 16700 },
  { id: "GB-2024-014", customer: "Thilanka Herath", products: ["Smoky Gold Eye Palette", "Champagne Highlight Powder"], date: "2024-05-08", status: "Completed", amount: 10300 },
  { id: "GB-2024-015", customer: "Dilruwan Wickramasinghe", products: ["Glowing Skin Serum"], date: "2024-05-08", status: "In Progress", amount: 5200 },
];

export const mockCustomers = [
  { id: "C001", name: "Dilini Senanayake", email: "dilini@gmail.com", phone: "+94 77 123 4567", orders: 5, spent: 24500, lastOrder: "2024-05-01", status: "Active" },
  { id: "C002", name: "Amandi Perera", email: "amandi.p@hotmail.com", phone: "+94 71 987 6543", orders: 2, spent: 5000, lastOrder: "2024-05-02", status: "Active" },
  { id: "C003", name: "Shenali Wijesinghe", email: "shenaliw@yahoo.com", phone: "+94 76 543 2109", orders: 1, spent: 8900, lastOrder: "2024-05-02", status: "New" },
  { id: "C004", name: "Chamari Fernando", email: "chamari.f@gmail.com", phone: "+94 77 111 2222", orders: 8, spent: 45000, lastOrder: "2024-05-03", status: "Active" },
  { id: "C005", name: "Nadeesha Jayawardene", email: "nadeeshaj@outlook.com", phone: "+94 70 333 4444", orders: 3, spent: 15400, lastOrder: "2024-05-03", status: "Active" },
  { id: "C006", name: "Thisari Bandara", email: "thisarib@gmail.com", phone: "+94 78 555 6666", orders: 1, spent: 3800, lastOrder: "2024-05-04", status: "Inactive" },
  { id: "C007", name: "Kaushalya Silva", email: "kau.silva@gmail.com", phone: "+94 71 777 8888", orders: 4, spent: 18500, lastOrder: "2024-05-04", status: "Active" },
  { id: "C008", name: "Sachini Rathnayake", email: "sachinir@yahoo.com", phone: "+94 77 999 0000", orders: 2, spent: 7500, lastOrder: "2024-05-05", status: "New" },
  { id: "C009", name: "Pavithra Dissanayake", email: "pavi.diss@hotmail.com", phone: "+94 76 123 9876", orders: 6, spent: 32800, lastOrder: "2024-05-05", status: "Active" },
  { id: "C010", name: "Ishara Gunasekara", email: "ishara.g@gmail.com", phone: "+94 70 456 1234", orders: 1, spent: 5800, lastOrder: "2024-05-06", status: "New" },
  { id: "C011", name: "Nilmini Karunaratne", email: "nilminik@outlook.com", phone: "+94 78 789 4561", orders: 7, spent: 41200, lastOrder: "2024-05-06", status: "Active" },
  { id: "C012", name: "Harshi Madushan", email: "harshim@yahoo.com", phone: "+94 71 321 6549", orders: 2, spent: 6400, lastOrder: "2024-05-07", status: "Inactive" },
];

export const monthlyRevenue = [
  { month: "Jun", revenue: 450000, orders: 48 },
  { month: "Jul", revenue: 520000, orders: 56 },
  { month: "Aug", revenue: 480000, orders: 50 },
  { month: "Sep", revenue: 610000, orders: 65 },
  { month: "Oct", revenue: 590000, orders: 62 },
  { month: "Nov", revenue: 750000, orders: 85 },
  { month: "Dec", revenue: 980000, orders: 110 },
  { month: "Jan", revenue: 1050000, orders: 120 },
  { month: "Feb", revenue: 820000, orders: 90 },
  { month: "Mar", revenue: 890000, orders: 95 },
  { month: "Apr", revenue: 1100000, orders: 115 },
  { month: "May", revenue: 1245420, orders: 135 },
];

export const dailySales = [
  { date: "01 May", sales: 45 },
  { date: "02 May", sales: 78 },
  { date: "03 May", sales: 65 },
  { date: "04 May", sales: 82 },
  { date: "05 May", sales: 55 },
  { date: "06 May", sales: 90 },
  { date: "07 May", sales: 115 },
  { date: "08 May", sales: 88 },
  { date: "09 May", sales: 105 },
  { date: "10 May", sales: 130 },
  { date: "11 May", sales: 145 },
];

export const categorySales = [
  { name: "Foundation", value: 35, color: "#A77F1B" },
  { name: "Lipstick", value: 22, color: "#D4A843" },
  { name: "Skincare", value: 18, color: "#8E6B15" },
  { name: "Fragrance", value: 15, color: "#B89632" },
  { name: "Eyeshadow", value: 10, color: "#E0B857" },
];
