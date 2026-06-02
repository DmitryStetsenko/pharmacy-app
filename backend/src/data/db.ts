import bcrypt from 'bcryptjs';
import { User, Medicine, Order } from '../types';

class InMemoryDatabase {
  public users: User[] = [];
  public medicines: Medicine[] = [];
  public orders: Order[] = [];

  constructor() {
    this.seedUsers();
    this.seedMedicines();
  }

  private seedUsers() {
    const salt = bcrypt.genSaltSync(10);
    
    // Seed Admin User
    this.users.push({
      id: 'usr_admin',
      email: 'admin@pharmacy.com',
      passwordHash: bcrypt.hashSync('admin123', salt),
      name: 'System Admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    // Seed Normal User
    this.users.push({
      id: 'usr_user1',
      email: 'user@pharmacy.com',
      passwordHash: bcrypt.hashSync('user123', salt),
      name: 'John Doe',
      role: 'user',
      createdAt: new Date().toISOString()
    });
  }

  private seedMedicines() {
    const medicinesData = [
      {
        id: 'med_1',
        name: 'Paracetamol 500mg',
        description: 'Pain reliever and fever reducer. Used to treat mild to moderate pain.',
        price: 4.50,
        inStock: 120,
        category: 'Tablets',
        manufacturer: 'PharmaCare Ltd',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_2',
        name: 'Ibuprofen 400mg',
        description: 'Nonsteroidal anti-inflammatory drug (NSAID) that reduces hormones causing pain and inflammation.',
        price: 5.80,
        inStock: 85,
        category: 'Tablets',
        manufacturer: 'Aurobindo',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_3',
        name: 'Amoxicillin 250mg',
        description: 'Penicillin antibiotic used to treat bacterial infections such as tonsillitis, bronchitis, and pneumonia.',
        price: 12.00,
        inStock: 40,
        category: 'Capsules',
        manufacturer: 'Sandoz',
        image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_4',
        name: 'Cough Syrup Bromhexine',
        description: 'Mucolytic agent used to treat respiratory disorders associated with viscid or excessive mucus.',
        price: 8.20,
        inStock: 50,
        category: 'Syrup',
        manufacturer: 'Bionorica',
        image: 'https://images.unsplash.com/photo-1550572017-ed950b55104?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_5',
        name: 'Loratadine 10mg',
        description: 'Antihistamine that reduces the effects of natural chemical histamine in the body.',
        price: 6.90,
        inStock: 200,
        category: 'Tablets',
        manufacturer: 'Teva',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_6',
        name: 'Vitamin C 1000mg Effervescent',
        description: 'Supports immune health, antioxidant protection, and collagen production.',
        price: 7.50,
        inStock: 150,
        category: 'Tablets',
        manufacturer: 'BioTech USA',
        image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_7',
        name: 'Hydrocortisone Ointment 1%',
        description: 'Mild corticosteroid used to reduce skin irritation, itching, and redness.',
        price: 9.10,
        inStock: 30,
        category: 'Ointment',
        manufacturer: 'GlaxoSmithKline',
        image: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3c8a?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_8',
        name: 'Omeprazole 20mg',
        description: 'Proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach.',
        price: 10.50,
        inStock: 95,
        category: 'Capsules',
        manufacturer: 'Sandoz',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_9',
        name: 'Atorvastatin 20mg',
        description: 'Statin medication used to prevent cardiovascular disease and lower lipids.',
        price: 15.30,
        inStock: 0, // Out of stock for testing Variant 8-9
        category: 'Tablets',
        manufacturer: 'Pfizer',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med_10',
        name: 'Aspirin Cardio 100mg',
        description: 'Low-dose aspirin used to prevent blood clots and reduce the risk of stroke or heart attack.',
        price: 3.90,
        inStock: 180,
        category: 'Tablets',
        manufacturer: 'Bayer',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      }
    ];

    this.medicines = medicinesData.map(m => ({
      ...m,
      createdAt: new Date().toISOString()
    }));
  }
}

export const db = new InMemoryDatabase();
export default db;
