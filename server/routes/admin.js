const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const { requireAdmin } = require('../middleware/auth');

// ── Users ──────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// PATCH /api/admin/users/:id  — update role
router.patch('/users/:id', requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ── Properties ────────────────────────────────────────

// GET /api/admin/properties
router.get('/properties', requireAdmin, async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// PATCH /api/admin/properties/:id  — toggle is_new_launch / featured
router.patch('/properties/:id', requireAdmin, async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.is_new_launch === 'boolean') {
      updates.is_new_launch = req.body.is_new_launch;
    }
    const property = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// DELETE /api/admin/properties/:id
router.delete('/properties/:id', requireAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    res.json({ message: 'Property deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [totalUsers, totalProperties, newUsers, newProperties, admins] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Property.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      User.countDocuments({ role: 'admin' }),
    ]);
    res.json({ totalUsers, totalProperties, newUsers, newProperties, admins });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
