// ---------------------------------------------------------------------------
// Business details. Everything the shop owner may want to change lives here.
// ---------------------------------------------------------------------------

export const BUSINESS = {
  name: 'Ameer Farms & Agro Allied Enterprises',
  shortName: 'Ameer Farms',
  address: 'Shop 18, Jaja Shopping Complex, University of Lagos (UNILAG)',
  domain: 'ameerfarmsunilag.com',
  // Support line, international format, digits only.
  whatsapp: '2348000000000',
  pickupMinutes: 15,
}

export const PAYMENT_ACCOUNTS = [
  {
    bank: 'OPay',
    accountName: 'Azeezat  Adesola Tawio-Raji',
    accountNumber: '8058077502',
  },
  {
    bank: 'Moniepoint',
    accountName: 'Ismaila Raji',
    accountNumber: '5481990843',
  },
]

export const CATEGORIES = ['Grains', 'Tubers', 'Vegetables', 'Oils', 'Protein', 'Bakery', 'Other']

// Storage bucket names created in supabase/schema.sql
export const BUCKETS = {
  uploads: 'uploads',
  productImages: 'product-images',
}
