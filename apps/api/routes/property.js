import express from 'express';
import Property from '../models/Property.js';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';

import Bookmark from '../models/Bookmark.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

import User from '../models/User.js'; 


const router = express.Router();
// Middleware to check if user is the property owner or an admin
const requirePropertyOwnerOrAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    // Check if the user is an admin or the property owner
    if (req.user.role === 'admin' || property.landownerId.toString() === req.user.id) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all properties (no changes here)

router.get('/', async (req, res) => {
  const { location, type, maxPrice, duration } = req.query;
  const filter = {};
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };
  if (duration && duration !== 'Flexible') { // Only filter by duration if it's not "Flexible"
    filter.duration = duration;
  }
  // The "Flexible" option should show all properties
  if (duration === 'Flexible') {
    // No filter for duration, so all properties will match
  }
try {
    const props = await Property.find(filter).sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});
// GET a specific property by ID
router.get('/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(prop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// NEW: GET properties for a specific landowner
router.get('/landowner/my-properties', requireAuth, async (req, res) => {
  try {
    const props = await Property.find({ landownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch landowner properties' });
  }
});

// POST a new property (allowed for verified landowners and admins)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
     // Check if the user is an admin or a verified landowner
        const user = await User.findById(req.user.id);
         if (user.role === 'admin' || (user.role === 'landowner' && user.isLandownerVerified)) {
          const prop = await Property.create({
                  ...req.body,
                  landownerId: req.user.id // Automatically set the landowner ID
                });
                res.status(201).json(prop);
         }
        
    const prop = await Property.create(req.body);
    console.log(`🏠 New property created: ${prop.title} (${prop.location})`);

    const bookmarks = await Bookmark.find({ itemType: 'PROPERTY' }).populate('user');
    console.log(`🔖 Found ${bookmarks.length} property bookmarks`);

    for (const bookmark of bookmarks) {
      const bookmarkedProp = await Property.findById(bookmark.itemId);
      if (!bookmarkedProp) {
        console.log(`⚠️ Bookmark ${bookmark._id} has no valid property`);
        continue;
      }

     
      const newLoc = prop.location.toLowerCase();
      const oldLoc = bookmarkedProp.location.toLowerCase();

    
      if (newLoc.includes(oldLoc) || oldLoc.includes(newLoc)) {
        console.log(`Match found for user ${bookmark.user.email}: ${oldLoc} ↔ ${newLoc}`);

       
        await Notification.create({
          user: bookmark.user._id,
          message: `New property available in your preferred location: ${prop.title}`
        });

        
        await sendEmail({
          to: bookmark.user.email,
          subject: '🏠 New Rent Alert',
          text: `Hi ${bookmark.user.name},\n\nA new property in your preferred location (${prop.location}) is now available: ${prop.title}\n\nView: ${process.env.FRONTEND_URL}/property/${prop._id}`
        });
      } else {
        console.log(`No match for user ${bookmark.user.email}: ${oldLoc} vs ${newLoc}`);
        return res.status(403).json({ error: 'Forbidden: Only verified landowners and admins can create properties' });
      }
    }

    res.json(prop);
    } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// PUT to update a property (allowed for property owner or admin)
router.put('/:id', requireAuth, requirePropertyOwnerOrAdmin, async (req, res) => {
  try {
    const prop = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE a property (allowed for property owner or admin)
router.delete('/:id', requireAuth, requirePropertyOwnerOrAdmin, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
