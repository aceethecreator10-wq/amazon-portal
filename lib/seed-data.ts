import type { User, Deal, Order, RefundRequest, StatusLog } from "./types";

const now = new Date().toISOString();

const demoStatusLogs = (statuses: string[], by: string): StatusLog[] =>
  statuses.map((s, i) => ({
    id: `log-${i}`,
    status: s,
    note: "",
    changedBy: by,
    createdAt: new Date(Date.now() - (statuses.length - i) * 3600000).toISOString(),
  }));

export const demoUsers: User[] = [
  {
    id: "user-1",
    name: "Demo Buyer",
    email: "buyer@demo.com",
    password: "demo123",
    role: "buyer",
    whatsapp: "+91-9876543210",
    createdAt: now,
  },
  {
    id: "user-2",
    name: "Demo Mediator",
    email: "mediator@demo.com",
    password: "demo123",
    role: "mediator",
    whatsapp: "+91-9876543211",
    createdAt: now,
  },
  {
    id: "user-3",
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "demo123",
    role: "admin",
    whatsapp: "+91-9876543212",
    createdAt: now,
  },
];

export const demoDeals: Deal[] = [
  { id: "deal-1", title: "iPhone 15 Pro Max 256GB", platform: "Amazon", category: "Electronics", originalPrice: 159900, dealPrice: 142990, cashbackAmount: 8500, effectivePrice: 134490, status: "active", createdAt: now },
  { id: "deal-2", title: "Samsung Galaxy S24 Ultra", platform: "Flipkart", category: "Electronics", originalPrice: 134999, dealPrice: 119999, cashbackAmount: 8000, effectivePrice: 111999, status: "active", createdAt: now },
  { id: "deal-3", title: "Sony WH-1000XM5 Headphones", platform: "Amazon", category: "Audio", originalPrice: 29990, dealPrice: 25990, cashbackAmount: 3000, effectivePrice: 22990, status: "closing_soon", createdAt: now },
  { id: "deal-4", title: "Nike Air Max 270 Shoes", platform: "Myntra", category: "Fashion", originalPrice: 16995, dealPrice: 11995, cashbackAmount: 2000, effectivePrice: 9995, status: "active", createdAt: now },
  { id: "deal-5", title: "MacBook Air M3 15-inch", platform: "Amazon", category: "Electronics", originalPrice: 164900, dealPrice: 149900, cashbackAmount: 12000, effectivePrice: 137900, status: "active", createdAt: now },
  { id: "deal-6", title: "Dyson V15 Detect Vacuum", platform: "Flipkart", category: "Appliances", originalPrice: 62900, dealPrice: 54900, cashbackAmount: 5000, effectivePrice: 49900, status: "expired", createdAt: now },
  { id: "deal-7", title: "H&M Slim Fit Blazer", platform: "Myntra", category: "Fashion", originalPrice: 5999, dealPrice: 3499, cashbackAmount: 1000, effectivePrice: 2499, status: "closing_soon", createdAt: now },
  { id: "deal-8", title: "boAt Airdopes 141 Pro", platform: "Amazon", category: "Audio", originalPrice: 2999, dealPrice: 1799, cashbackAmount: 500, effectivePrice: 1299, status: "active", createdAt: now },
];

export const demoOrders: Order[] = [
  {
    id: "ord-1", trackingId: "DF-ORD-1001", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-1", platform: "Amazon", orderId: "AMZ-ORD-98765", amount: 142990,
    status: "completed", notes: "Order delivered on time", statusLogs: demoStatusLogs(["submitted", "under_review", "approved", "processing", "completed"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: now,
  },
  {
    id: "ord-2", trackingId: "DF-ORD-1002", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-2", platform: "Flipkart", orderId: "FLP-ORD-54321", amount: 119999,
    status: "under_review", notes: "", statusLogs: demoStatusLogs(["submitted", "under_review"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ord-3", trackingId: "DF-ORD-1003", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-4", platform: "Myntra", orderId: "MYN-ORD-11223", amount: 11995,
    status: "submitted", notes: "", statusLogs: demoStatusLogs(["submitted"], "system"),
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ord-4", trackingId: "DF-ORD-1004", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-5", platform: "Amazon", orderId: "AMZ-ORD-77665", amount: 149900,
    status: "approved", notes: "Payment verified", statusLogs: demoStatusLogs(["submitted", "under_review", "approved"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ord-5", trackingId: "DF-ORD-1005", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-3", platform: "Amazon", orderId: "AMZ-ORD-33442", amount: 25990,
    status: "rejected", notes: "Invalid order ID", statusLogs: demoStatusLogs(["submitted", "under_review", "rejected"], "admin"),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ord-6", trackingId: "DF-ORD-1006", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-1", platform: "Amazon", orderId: "AMZ-ORD-99881", amount: 142990,
    status: "processing", notes: "Refund initiated", statusLogs: demoStatusLogs(["submitted", "under_review", "approved", "processing"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ord-7", trackingId: "DF-ORD-1007", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-8", platform: "Amazon", orderId: "AMZ-ORD-55443", amount: 1799,
    status: "submitted", notes: "", statusLogs: demoStatusLogs(["submitted"], "system"),
    createdAt: now, updatedAt: now,
  },
  {
    id: "ord-8", trackingId: "DF-ORD-1008", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-4", platform: "Myntra", orderId: "MYN-ORD-66778", amount: 11995,
    status: "under_review", notes: "Awaiting confirmation", statusLogs: demoStatusLogs(["submitted", "under_review"], "system"),
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ord-9", trackingId: "DF-ORD-1009", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-2", platform: "Flipkart", orderId: "FLP-ORD-22334", amount: 119999,
    status: "completed", notes: "Successfully delivered", statusLogs: demoStatusLogs(["submitted", "under_review", "approved", "processing", "completed"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: now,
  },
  {
    id: "ord-10", trackingId: "DF-ORD-1010", buyerId: "user-1", buyerName: "Demo Buyer", whatsapp: "+91-9876543210",
    email: "buyer@demo.com", dealId: "deal-7", platform: "Myntra", orderId: "MYN-ORD-88990", amount: 3499,
    status: "submitted", notes: "", statusLogs: demoStatusLogs(["submitted"], "system"),
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const demoRefundRequests: RefundRequest[] = [
  {
    id: "ref-1", refundId: "DF-REF-5001", trackingId: "DF-ORD-1001", orderId: "ord-1",
    buyerId: "user-1", paymentMethod: "upi", upiMasked: "demo***@paytm", bankLast4: "6789",
    accountHolder: "Demo Buyer", ifsc: "PAYTM0123456", whatsapp: "+91-9876543210",
    reason: "Product not delivered within promised timeframe", status: "paid",
    statusLogs: demoStatusLogs(["submitted", "documents_received", "verification", "approved", "paid"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), updatedAt: now,
  },
  {
    id: "ref-2", refundId: "DF-REF-5002", trackingId: "DF-ORD-1002", orderId: "ord-2",
    buyerId: "user-1", paymentMethod: "bank_transfer", upiMasked: "", bankLast4: "3456",
    accountHolder: "Demo Buyer", ifsc: "HDFC0001234", whatsapp: "+91-9876543210",
    reason: "Wrong color variant received", status: "verification",
    statusLogs: demoStatusLogs(["submitted", "documents_received", "verification"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ref-3", refundId: "DF-REF-5003", trackingId: "DF-ORD-1004", orderId: "ord-4",
    buyerId: "user-1", paymentMethod: "upi", upiMasked: "demo***@phonepe", bankLast4: "9012",
    accountHolder: "Demo Buyer", ifsc: "PHONPE0123456", whatsapp: "+91-9876543210",
    reason: "Item defective - screen has dead pixels", status: "submitted",
    statusLogs: demoStatusLogs(["submitted"], "system"),
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ref-4", refundId: "DF-REF-5004", trackingId: "DF-ORD-1005", orderId: "ord-5",
    buyerId: "user-1", paymentMethod: "bank_transfer", upiMasked: "", bankLast4: "5678",
    accountHolder: "Demo Buyer", ifsc: "ICICI0005678", whatsapp: "+91-9876543210",
    reason: "Order cancelled by seller after payment", status: "documents_received",
    statusLogs: demoStatusLogs(["submitted", "documents_received"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ref-5", refundId: "DF-REF-5005", trackingId: "DF-ORD-1006", orderId: "ord-6",
    buyerId: "user-1", paymentMethod: "upi", upiMasked: "demo***@gpay", bankLast4: "2345",
    accountHolder: "Demo Buyer", ifsc: "GPay0123456", whatsapp: "+91-9876543210",
    reason: "Product damaged during shipping", status: "approved",
    statusLogs: demoStatusLogs(["submitted", "documents_received", "verification", "approved"], "system"),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), updatedAt: now, assignedMediatorId: "user-2",
  },
  {
    id: "ref-6", refundId: "DF-REF-5006", trackingId: "DF-ORD-1003", orderId: "ord-3",
    buyerId: "user-1", paymentMethod: "upi", upiMasked: "demo***@paytm", bankLast4: "7890",
    accountHolder: "Demo Buyer", ifsc: "PAYTM0987654", whatsapp: "+91-9876543210",
    reason: "Size mismatch - ordered M, received L", status: "submitted",
    statusLogs: demoStatusLogs(["submitted"], "system"),
    createdAt: now, updatedAt: now,
  },
];
