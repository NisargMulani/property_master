const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { authenticateToken } = require('../middleware/auth');

// GET /api/properties  (public)
router.get('/', async (req, res) => {
  try {
    const { listing_type, property_group, search, is_new_launch } = req.query;
    let filter = {};

    if (listing_type) {
      filter.listing_type = listing_type;
    }

    if (property_group) {
      const group = property_group.toLowerCase();
      if (group === 'residential') {
        filter.property_type = 'Residential House';
      } else if (group === 'commercial') {
        filter.property_type = { $in: ['Commercial Office', 'Commercial Shop', 'Commercial Land'] };
      } else if (group === 'plot/land') {
        filter.property_type = { $in: ['Residential Plot/Land', 'Commercial Land'] };
      }
    }

    if (is_new_launch === 'true') {
      filter.is_new_launch = true;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// GET /api/properties/:id  (public — full document including image_urls)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// POST /api/properties  (protected — create listing with Base64 images in body)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      listing_type, property_type, city, state, address,
      area_sqft, bhk, price, description, contact_number,
      image_urls, is_new_launch,
    } = req.body;

    // Validate at least one image
    if (!image_urls || image_urls.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    // Basic validation that each entry looks like a data URI or a URL
    const validImages = image_urls.filter(
      url => typeof url === 'string' && (url.startsWith('data:image/') || url.startsWith('http'))
    );
    if (validImages.length === 0) {
      return res.status(400).json({ message: 'No valid images provided.' });
    }

    const property = new Property({
      user_id: req.user.id,
      listing_type,
      property_type,
      city,
      state,
      address,
      area_sqft: parseFloat(area_sqft),
      bhk: bhk ? parseInt(bhk) : null,
      price: parseFloat(price),
      description,
      contact_number,
      image_urls: validImages,   // Stored as Base64 data URIs in MongoDB
      is_new_launch: is_new_launch || false,
    });

    await property.save();
    res.status(201).json({ message: 'Property listed successfully!', property });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;

