import mongoose, { Schema, Document, Model } from 'mongoose';

// Caching connection globally for Next.js hot-reloads and serverless execution
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

const cached = global.mongooseCache;

export async function dbConnect(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI || "mongodb+srv://eternalsanctuarygg_db_user:ubxXFdPE8bWJLzbx@cluster0.7z0wnq7.mongodb.net/eternals-studio?retryWrites=true&w=majority&appName=Cluster0";

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ==========================================
// 1. Products Schema
// ==========================================
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  created_at: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image_url: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// ==========================================
// 2. Orders Schema
// ==========================================
export interface IOrderItem {
  product_name: string;
  price: number;
}

export interface IOrder extends Document {
  user_id: string;
  user_email: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'failed';
  stripe_session_id?: string;
  items: IOrderItem[];
  created_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: String, required: true },
  user_email: { type: String, required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  stripe_session_id: { type: String, unique: true, sparse: true },
  items: [
    {
      product_name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// ==========================================
// 3. Contact Messages Schema
// ==========================================
export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, required: true, default: 'unread' },
  created_at: { type: Date, default: Date.now },
});

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

// ==========================================
// 4. QuickBooks OAuth Tokens Schema
// ==========================================
export interface IQuickBooksToken extends Document {
  customId: string;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  refresh_expires_at: Date;
  realm_id: string;
  updated_at: Date;
}

const QuickBooksTokenSchema = new Schema<IQuickBooksToken>({
  customId: { type: String, default: 'quickbooks_tokens', unique: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true },
  refresh_expires_at: { type: Date, required: true },
  realm_id: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});

export const QuickBooksToken: Model<IQuickBooksToken> =
  mongoose.models.QuickBooksToken ||
  mongoose.model<IQuickBooksToken>('QuickBooksToken', QuickBooksTokenSchema);

// ==========================================
// 5. System Events Schema (Logger)
// ==========================================
export interface ISystemEvent extends Document {
  event_key: string;
  category: 'deployment' | 'stripe' | 'quickbooks' | 'database' | 'auth' | 'contact';
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

const SystemEventSchema = new Schema<ISystemEvent>({
  event_key: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
});

export const SystemEvent: Model<ISystemEvent> =
  mongoose.models.SystemEvent || mongoose.model<ISystemEvent>('SystemEvent', SystemEventSchema);

// ==========================================
// 6. Project Requests Schema
// ==========================================
export interface ICollaborator {
  user_id: string;
  user_name: string;
  joined_at: Date;
}

export interface IProjectRequest extends Document {
  client_name: string;
  client_email: string;
  client_phone?: string;
  subject: string;
  description: string;
  file_url?: string;
  status: 'pending' | 'awaiting_payment' | 'approved' | 'claimed' | 'completed';
  assigned_to_id?: string;
  assigned_to_name?: string;
  invoice_url?: string;
  invoice_amount?: number;
  collaborators: ICollaborator[];
  created_at: Date;
}

const ProjectRequestSchema = new Schema<IProjectRequest>({
  client_name: { type: String, required: true },
  client_email: { type: String, required: true },
  client_phone: { type: String, default: '' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  file_url: { type: String, default: '' },
  status: { type: String, required: true, default: 'pending' },
  assigned_to_id: { type: String, default: null },
  assigned_to_name: { type: String, default: null },
  invoice_url: { type: String, default: null },
  invoice_amount: { type: Number, default: null },
  collaborators: [
    {
      user_id: { type: String, required: true },
      user_name: { type: String, required: true },
      joined_at: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export const ProjectRequest: Model<IProjectRequest> =
  mongoose.models.ProjectRequest ||
  mongoose.model<IProjectRequest>('ProjectRequest', ProjectRequestSchema);

// ==========================================
// 7. Portfolio Schema
// ==========================================
export interface IPortfolio extends Document {
  title: string;
  category: 'branding' | 'esports' | 'sports' | '3d' | 'illustration' | 'design';
  subtitle: string;
  description: string;
  tags: string[];
  badges: string[];
  image_url?: string;
  created_at: Date;
}

const PortfolioSchema = new Schema<IPortfolio>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  badges: { type: [String], default: [] },
  image_url: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
});

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
