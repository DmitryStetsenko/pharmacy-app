import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../data/db';
import { Medicine } from '../types';

export const getAllMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    let { search, category, manufacturer, sortBy, order, page, limit } = req.query;

    let result = [...db.medicines];

    // Filter by search query (case-insensitive name or description)
    if (search) {
      const searchStr = String(search).toLowerCase();
      result = result.filter(
        m => m.name.toLowerCase().includes(searchStr) || 
             m.description.toLowerCase().includes(searchStr)
      );
    }

    // Filter by category
    if (category) {
      const catStr = String(category).toLowerCase();
      result = result.filter(m => m.category.toLowerCase() === catStr);
    }

    // Filter by manufacturer
    if (manufacturer) {
      const mfgStr = String(manufacturer).toLowerCase();
      result = result.filter(m => m.manufacturer.toLowerCase() === mfgStr);
    }

    // Sorting (can be by price, name, or inStock)
    if (sortBy) {
      const sortField = String(sortBy) as keyof Medicine;
      const isAsc = String(order).toLowerCase() !== 'desc';
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return isAsc ? valA - valB : valB - valA;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return 0;
      });
    }

    // Pagination
    const pageNum = parseInt(String(page)) || 1;
    const limitNum = parseInt(String(limit)) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedResult = result.slice(startIndex, endIndex);

    // Get unique categories and manufacturers for filtering in frontend
    const categories = Array.from(new Set(db.medicines.map(m => m.category)));
    const manufacturers = Array.from(new Set(db.medicines.map(m => m.manufacturer)));

    res.status(200).json({
      medicines: paginatedResult,
      totalCount: result.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(result.length / limitNum),
      categories,
      manufacturers
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicines' });
  }
};

export const getMedicineById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const medicine = db.medicines.find(m => m.id === id);
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicine' });
  }
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, description, price, inStock, category, manufacturer, image } = req.body;

  try {
    const newMedicine: Medicine = {
      id: `med_${Date.now()}`,
      name,
      description,
      price: parseFloat(price),
      inStock: parseInt(inStock),
      category,
      manufacturer,
      image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60',
      createdAt: new Date().toISOString()
    };

    db.medicines.push(newMedicine);
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create medicine' });
  }
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { name, description, price, inStock, category, manufacturer, image } = req.body;

  try {
    const medicineIndex = db.medicines.findIndex(m => m.id === id);
    if (medicineIndex === -1) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    const updatedMedicine: Medicine = {
      ...db.medicines[medicineIndex],
      name: name ?? db.medicines[medicineIndex].name,
      description: description ?? db.medicines[medicineIndex].description,
      price: price ? parseFloat(price) : db.medicines[medicineIndex].price,
      inStock: inStock !== undefined ? parseInt(inStock) : db.medicines[medicineIndex].inStock,
      category: category ?? db.medicines[medicineIndex].category,
      manufacturer: manufacturer ?? db.medicines[medicineIndex].manufacturer,
      image: image ?? db.medicines[medicineIndex].image
    };

    db.medicines[medicineIndex] = updatedMedicine;
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medicine' });
  }
};

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const medicineIndex = db.medicines.findIndex(m => m.id === id);
    if (medicineIndex === -1) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    db.medicines.splice(medicineIndex, 1);
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete medicine' });
  }
};
