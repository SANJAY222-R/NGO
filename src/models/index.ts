import { DataTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

// --- Enums ---
export const Role = {
  DONOR: 'DONOR',
  NGO: 'NGO',
  ADMIN: 'ADMIN',
};

export const VerificationStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

export const FoodStatus = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  PICKED_UP: 'PICKED_UP',
  EXPIRED: 'EXPIRED',
};

export const ClaimStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// --- NextAuth Custom Models ---

export const User = sequelize.define('user', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  emailVerified: { type: DataTypes.DATE },
  image: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM(Role.DONOR, Role.NGO, Role.ADMIN), defaultValue: Role.DONOR },
  verificationStatus: { type: DataTypes.ENUM(VerificationStatus.PENDING, VerificationStatus.VERIFIED, VerificationStatus.REJECTED), defaultValue: VerificationStatus.PENDING },
  phone: { type: DataTypes.STRING },
  organizationName: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  password: { type: DataTypes.STRING, allowNull: true }, // allowNull true because existing OAuth users wouldn't have it, though we are removing OAuth
});

// --- Domain Models ---

export const FoodPost = sequelize.define('foodPost', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  quantity: { type: DataTypes.STRING, allowNull: false },
  foodType: { type: DataTypes.STRING, allowNull: false },
  expiryDate: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM(FoodStatus.AVAILABLE, FoodStatus.RESERVED, FoodStatus.PICKED_UP, FoodStatus.EXPIRED), defaultValue: FoodStatus.AVAILABLE },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  address: { type: DataTypes.STRING },
});

export const Claim = sequelize.define('claim', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: { type: DataTypes.ENUM(ClaimStatus.PENDING, ClaimStatus.ACCEPTED, ClaimStatus.COMPLETED, ClaimStatus.CANCELLED), defaultValue: ClaimStatus.PENDING },
  claimedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completedAt: { type: DataTypes.DATE },
});

// --- Relations ---

User.hasMany(FoodPost, { as: 'DonorPosts', foreignKey: 'donorId' });
FoodPost.belongsTo(User, { as: 'Donor', foreignKey: 'donorId' });

User.hasMany(Claim, { as: 'NgoClaims', foreignKey: 'ngoId' });
Claim.belongsTo(User, { as: 'Ngo', foreignKey: 'ngoId' });

FoodPost.hasMany(Claim, { foreignKey: 'foodPostId' });
Claim.belongsTo(FoodPost, { foreignKey: 'foodPostId' });

// We export a sync function to easily sync models to DB in development
export const syncDB = async () => {
  await sequelize.sync({ alter: true });
};

// Automatically run sync in development
if (process.env.NODE_ENV !== 'production') {
  syncDB();
}
