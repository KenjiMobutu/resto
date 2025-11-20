export enum UserRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  WAITER = 'waiter',
  HOST = 'host',
  KITCHEN = 'kitchen',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SEATED = 'seated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum WaitlistStatus {
  WAITING = 'waiting',
  NOTIFIED = 'notified',
  SEATED = 'seated',
  CANCELLED = 'cancelled',
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  SERVED = 'served',
  PAID = 'paid',
}

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  CLEANING = 'cleaning',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MOBILE = 'mobile',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  restaurantId: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  settings: RestaurantSettings;
  stripeAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSettings {
  openingHours: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  currency: string;
  timezone: string;
  reservationDuration: number; // minutes
  advanceBookingDays: number;
  smsNotifications: boolean;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
}

export interface Client {
  id: string;
  restaurantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  tags: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  preferences: string[];
  notes?: string;
  visitCount: number;
  totalSpent: number;
  averageRating?: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  clientId: string;
  client?: Client;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  tableId?: string;
  table?: Table;
  specialRequests?: string;
  notes?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Waitlist {
  id: string;
  restaurantId: string;
  clientId: string;
  client?: Client;
  partySize: number;
  status: WaitlistStatus;
  estimatedWaitTime?: number;
  notifiedAt?: string;
  joinedAt: string;
  seatedAt?: string;
  notes?: string;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  status: TableStatus;
  position: Position;
  shape: 'circle' | 'rectangle' | 'square';
  width: number;
  height: number;
  currentReservationId?: string;
  currentOrderId?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface FloorElement {
  id: string;
  restaurantId: string;
  type: 'table' | 'bar' | 'wall' | 'door' | 'window' | 'plant';
  position: Position;
  width: number;
  height: number;
  rotation?: number;
  label?: string;
  tableId?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  available: boolean;
  preparationTime?: number;
  allergens?: string[];
  tags?: string[];
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId?: string;
  table?: Table;
  clientId?: string;
  client?: Client;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentIntentId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
  notes?: string;
  modifiers?: string[];
}

export interface Tag {
  id: string;
  restaurantId: string;
  name: string;
  color: string;
  category: 'client' | 'reservation' | 'order';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reservation' | 'waitlist' | 'order' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}
