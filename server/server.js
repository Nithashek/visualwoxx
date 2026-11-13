const express = require('express');
const cors = require('cors');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log helper
function logActivity(actionType, description, userName = 'Admin', entityType = null, entityId = null) {
  try {
    const id = 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    db.prepare(`
      INSERT INTO activity_logs (id, action_type, description, user_name, entity_type, entity_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, actionType, description, userName, entityType, entityId);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

// Notification helper
function createNotification(type, title, message, link) {
  try {
    const id = 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    db.prepare(`
      INSERT INTO notifications (id, type, title, message, link, is_read)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(id, type, title, message, link);
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}

// -------------------------------------------------------------
// AUTH
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const profile = db.prepare('SELECT * FROM profiles WHERE username = ? OR email = ?').get(username, username);
  if (!profile || profile.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid credentials. Try admin / admin123' });
  }

  logActivity('LOGIN', `User ${profile.full_name} (${profile.role}) logged in`, profile.full_name, 'profiles', profile.id);

  // Return session info (mock bearer token)
  const token = Buffer.from(`${profile.id}:${profile.role}:${Date.now()}`).toString('base64');
  res.json({
    token,
    user: {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      avatarUrl: profile.avatar_url
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Decode basic token
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [id] = decoded.split(':');
    const profile = db.prepare('SELECT id, username, email, full_name, role, avatar_url FROM profiles WHERE id = ?').get(id);
    if (!profile) return res.status(401).json({ error: 'Invalid session' });
    res.json({
      id: profile.id,
      username: profile.username,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      avatarUrl: profile.avatar_url
    });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------
app.get('/api/site-settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  const settings = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  res.json(settings);
});

app.put('/api/site-settings', (req, res) => {
  const settings = req.body;
  const updateStmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
  
  const updateMany = db.transaction((obj) => {
    for (const [k, v] of Object.entries(obj)) {
      updateStmt.run(k, String(v));
    }
  });

  updateMany(settings);
  logActivity('UPDATE', 'Updated company website configuration & brand settings', 'Super Admin', 'site_settings', 'all');
  res.json({ success: true, message: 'Settings saved successfully' });
});

// -------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------
app.get('/api/services', (req, res) => {
  const includeInactive = req.query.all === 'true';
  let query = 'SELECT * FROM services';
  if (!includeInactive) {
    query += ' WHERE is_active = 1';
  }
  query += ' ORDER BY display_order ASC, title ASC';
  const services = db.prepare(query).all().map(s => ({
    ...s,
    deliverables: JSON.parse(s.deliverables || '[]'),
    packages: JSON.parse(s.packages_json || '[]'),
    isActive: Boolean(s.is_active)
  }));
  res.json(services);
});

app.post('/api/services', (req, res) => {
  const { title, slug, shortDesc, fullDesc, iconName, deliverables, packages, imageUrl, displayOrder } = req.body;
  if (!title || !shortDesc) {
    return res.status(400).json({ error: 'Title and short description are required' });
  }
  const id = 'srv_' + Date.now();
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  db.prepare(`
    INSERT INTO services (id, title, slug, short_desc, full_desc, icon_name, deliverables, packages_json, image_url, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    id, title, finalSlug, shortDesc, fullDesc || shortDesc, iconName || 'Sparkles',
    JSON.stringify(deliverables || []), JSON.stringify(packages || []), imageUrl || '',
    displayOrder || 99
  );
  logActivity('CREATE', `Added service: ${title}`, 'Creative Admin', 'services', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const { title, slug, shortDesc, fullDesc, iconName, deliverables, packages, imageUrl, displayOrder, isActive } = req.body;
  db.prepare(`
    UPDATE services
    SET title = ?, slug = ?, short_desc = ?, full_desc = ?, icon_name = ?, deliverables = ?, packages_json = ?, image_url = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title, slug, shortDesc, fullDesc, iconName, JSON.stringify(deliverables || []),
    JSON.stringify(packages || []), imageUrl, displayOrder, isActive ? 1 : 0, id
  );
  logActivity('UPDATE', `Updated service: ${title}`, 'Creative Admin', 'services', id);
  res.json({ success: true });
});

app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM services WHERE id = ?').run(id);
  logActivity('DELETE', `Deleted service ID: ${id}`, 'Super Admin', 'services', id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// PORTFOLIO & MEDIA
// -------------------------------------------------------------
app.get('/api/portfolio', (req, res) => {
  const includeUnpublished = req.query.all === 'true';
  let query = 'SELECT * FROM portfolio_projects';
  if (!includeUnpublished) {
    query += ' WHERE is_published = 1';
  }
  query += ' ORDER BY display_order ASC, created_at DESC';

  const projects = db.prepare(query).all();
  const mediaStmt = db.prepare('SELECT * FROM portfolio_media WHERE portfolio_project_id = ? ORDER BY display_order ASC');

  const result = projects.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    clientName: p.client_name,
    projectDate: p.project_date,
    description: p.description,
    servicesProvided: JSON.parse(p.services_provided_json || '[]'),
    coverImage: p.cover_image,
    videoUrl: p.video_url,
    isFeatured: Boolean(p.is_featured),
    displayOrder: p.display_order,
    isPublished: Boolean(p.is_published),
    credits: JSON.parse(p.credits_json || '{}'),
    gallery: mediaStmt.all(p.id)
  }));

  res.json(result);
});

app.post('/api/portfolio', (req, res) => {
  const { title, slug, category, clientName, projectDate, description, servicesProvided, coverImage, videoUrl, isFeatured, displayOrder, isPublished, credits, gallery } = req.body;
  if (!title || !description || !coverImage) {
    return res.status(400).json({ error: 'Title, description, and cover image are required' });
  }

  const id = 'port_' + Date.now();
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  db.prepare(`
    INSERT INTO portfolio_projects (id, title, slug, category, client_name, project_date, description, services_provided_json, cover_image, video_url, is_featured, display_order, is_published, credits_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, title, finalSlug, category || 'Other', clientName || '', projectDate || '',
    description, JSON.stringify(servicesProvided || []), coverImage, videoUrl || '',
    isFeatured ? 1 : 0, displayOrder || 0, isPublished ? 1 : 0, JSON.stringify(credits || {})
  );

  if (Array.isArray(gallery)) {
    const insertMedia = db.prepare(`
      INSERT INTO portfolio_media (id, portfolio_project_id, media_type, media_url, caption, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    gallery.forEach((item, index) => {
      const mediaId = `med_${id}_${index + 1}`;
      insertMedia.run(mediaId, id, item.type || 'image', item.url, item.caption || '', index + 1);
    });
  }

  logActivity('CREATE', `Published portfolio showcase: ${title}`, 'Creative Admin', 'portfolio_projects', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/portfolio/:id', (req, res) => {
  const { id } = req.params;
  const { title, slug, category, clientName, projectDate, description, servicesProvided, coverImage, videoUrl, isFeatured, displayOrder, isPublished, credits, gallery } = req.body;

  db.prepare(`
    UPDATE portfolio_projects
    SET title = ?, slug = ?, category = ?, client_name = ?, project_date = ?, description = ?, services_provided_json = ?, cover_image = ?, video_url = ?, is_featured = ?, display_order = ?, is_published = ?, credits_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title, slug, category, clientName, projectDate, description,
    JSON.stringify(servicesProvided || []), coverImage, videoUrl || '',
    isFeatured ? 1 : 0, displayOrder, isPublished ? 1 : 0, JSON.stringify(credits || {}), id
  );

  if (Array.isArray(gallery)) {
    db.prepare('DELETE FROM portfolio_media WHERE portfolio_project_id = ?').run(id);
    const insertMedia = db.prepare(`
      INSERT INTO portfolio_media (id, portfolio_project_id, media_type, media_url, caption, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    gallery.forEach((item, index) => {
      const mediaId = `med_${id}_${Date.now()}_${index}`;
      insertMedia.run(mediaId, id, item.type || 'image', item.url, item.caption || '', index + 1);
    });
  }

  logActivity('UPDATE', `Updated portfolio showcase: ${title}`, 'Creative Admin', 'portfolio_projects', id);
  res.json({ success: true });
});

app.delete('/api/portfolio/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM portfolio_projects WHERE id = ?').run(id);
  logActivity('DELETE', `Deleted portfolio project ID: ${id}`, 'Super Admin', 'portfolio_projects', id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// TEAM MEMBERS
// -------------------------------------------------------------
app.get('/api/team', (req, res) => {
  const includeInactive = req.query.all === 'true';
  let query = 'SELECT * FROM team_members';
  if (!includeInactive) {
    query += ' WHERE is_active = 1';
  }
  query += ' ORDER BY display_order ASC, created_at ASC';

  const team = db.prepare(query).all().map(m => ({
    id: m.id,
    fullName: m.full_name,
    position: m.position,
    department: m.department,
    bio: m.bio,
    photoUrl: m.photo_url,
    email: m.email,
    socialLinks: JSON.parse(m.social_links_json || '{}'),
    joiningDate: m.joining_date,
    isActive: Boolean(m.is_active),
    displayOrder: m.display_order
  }));
  res.json(team);
});

app.post('/api/team', (req, res) => {
  const { fullName, position, department, bio, photoUrl, email, socialLinks, joiningDate, displayOrder } = req.body;
  if (!fullName || !position) {
    return res.status(400).json({ error: 'Full name and position are required' });
  }
  const id = 'tm_' + Date.now();
  db.prepare(`
    INSERT INTO team_members (id, full_name, position, department, bio, photo_url, email, social_links_json, joining_date, is_active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).run(
    id, fullName, position, department || 'Creative', bio || '', photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email || '', JSON.stringify(socialLinks || {}), joiningDate || new Date().toISOString().split('T')[0], displayOrder || 99
  );
  logActivity('CREATE', `Added team member: ${fullName} (${position})`, 'Super Admin', 'team_members', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const { fullName, position, department, bio, photoUrl, email, socialLinks, joiningDate, isActive, displayOrder } = req.body;

  db.prepare(`
    UPDATE team_members
    SET full_name = ?, position = ?, department = ?, bio = ?, photo_url = ?, email = ?, social_links_json = ?, joining_date = ?, is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    fullName, position, department, bio, photoUrl, email,
    JSON.stringify(socialLinks || {}), joiningDate, isActive ? 1 : 0, displayOrder, id
  );

  logActivity('UPDATE', `Updated team member profile: ${fullName}`, 'Super Admin', 'team_members', id);
  res.json({ success: true });
});

app.delete('/api/team/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM team_members WHERE id = ?').run(id);
  logActivity('DELETE', `Deleted team member profile ID: ${id}`, 'Super Admin', 'team_members', id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// INQUIRIES & APPOINTMENTS (BOOKING)
// -------------------------------------------------------------
app.post('/api/inquiries', (req, res) => {
  const {
    fullName, email, phone, organization, services, projectTitle,
    projectDescription, eventDate, eventLocation, preferredAppointmentDate,
    preferredAppointmentTime, budgetRange, preferredContactMethod
  } = req.body;

  if (!fullName || !email || !phone || !services || services.length === 0 || !projectTitle) {
    return res.status(400).json({ error: 'Please fill in all mandatory fields.' });
  }

  // Prevent accidental duplicates in last 60 seconds
  const recent = db.prepare(`
    SELECT id FROM inquiries
    WHERE email = ? AND project_title = ? AND created_at > datetime('now', '-1 minute')
  `).get(email, projectTitle);

  if (recent) {
    return res.status(409).json({ error: 'A duplicate inquiry was submitted recently. Our team will contact you shortly.' });
  }

  const inqId = 'inq_' + Date.now();
  const aptId = 'apt_' + Date.now();

  const servicesArr = Array.isArray(services) ? services : [services];

  // Insert inquiry
  db.prepare(`
    INSERT INTO inquiries (
      id, full_name, email, phone, organization, services_json,
      project_title, project_description, event_date,
      preferred_appointment_date, preferred_appointment_time,
      budget_range, preferred_contact_method, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new_inquiry')
  `).run(
    inqId, fullName, email, phone, organization || '', JSON.stringify(servicesArr),
    projectTitle, projectDescription || '', eventDate || '',
    preferredAppointmentDate || eventDate || '', preferredAppointmentTime || '10:00',
    budgetRange || 'Contact for Quote', preferredContactMethod || 'Email'
  );

  // Always create appointment record for every inquiry
  db.prepare(`
    INSERT INTO appointments (
      id, inquiry_id, client_name, client_email, client_phone,
      service_name, appointment_date, appointment_time, location, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(
    aptId, inqId, fullName, email, phone,
    servicesArr.join(', '),
    preferredAppointmentDate || eventDate || '',
    preferredAppointmentTime || '10:00',
    eventLocation || '',
    `Service: ${servicesArr.join(', ')}${eventDate ? ' | Event Date: ' + eventDate : ''}${eventLocation ? ' | Location: ' + eventLocation : ''}${projectDescription ? ' | Details: ' + projectDescription : ''}`
  );

  // Admin notification
  createNotification(
    'inquiry',
    'New Appointment Request',
    `${fullName} requested ${servicesArr.join(', ')}${eventLocation ? ' at ' + eventLocation : ''}`,
    '/admin/appointments'
  );

  logActivity('CREATE', `New appointment request from ${fullName}: ${servicesArr.join(', ')}`, 'Client / Visitor', 'inquiries', inqId);

  res.status(201).json({
    success: true,
    referenceId: inqId,
    message: 'Thank you! Your appointment request has been submitted. Our team will review and confirm your booking shortly.'
  });
});

app.get('/api/inquiries', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM inquiries';
  const params = [];
  if (status && status !== 'all') {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params).map(r => ({
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    organization: r.organization,
    services: JSON.parse(r.services_json || '[]'),
    projectTitle: r.project_title,
    projectDescription: r.project_description,
    eventDate: r.event_date,
    preferredAppointmentDate: r.preferred_appointment_date,
    preferredAppointmentTime: r.preferred_appointment_time,
    budgetRange: r.budget_range,
    preferredContactMethod: r.preferred_contact_method,
    status: r.status,
    clientId: r.client_id,
    internalNotes: r.internal_notes,
    createdAt: r.created_at
  }));

  res.json(rows);
});

app.put('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status, internalNotes, clientId } = req.body;

  db.prepare(`
    UPDATE inquiries
    SET status = ?, internal_notes = ?, client_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, internalNotes || null, clientId || null, id);

  // Also update corresponding appointment if confirmed
  if (status === 'confirmed') {
    db.prepare("UPDATE appointments SET status = 'confirmed' WHERE inquiry_id = ?").run(id);
  } else if (status === 'cancelled') {
    db.prepare("UPDATE appointments SET status = 'cancelled' WHERE inquiry_id = ?").run(id);
  }

  logActivity('UPDATE', `Updated inquiry ${id} status to ${status}`, 'Operations Admin', 'inquiries', id);
  res.json({ success: true });
});

// Convert Inquiry to Client & Project
app.post('/api/inquiries/:id/convert', (req, res) => {
  const { id } = req.params;
  const inq = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found' });

  // Check if client exists or create
  let client = db.prepare('SELECT id FROM clients WHERE email = ?').get(inq.email);
  let clientId = client ? client.id : null;

  if (!clientId) {
    clientId = 'cl_' + Date.now();
    db.prepare(`
      INSERT INTO clients (id, name, email, phone, organization, services_requested, project_history, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      clientId, inq.full_name, inq.email, inq.phone, inq.organization,
      inq.services_json, inq.project_title, `Created from inquiry ${id}`
    );
  }

  // Create Project
  const projectId = 'prj_' + Date.now();
  db.prepare(`
    INSERT INTO projects (
      id, project_name, client_id, client_name, description,
      services_json, start_date, deadline, priority, status, progress_pct, internal_notes
    ) VALUES (?, ?, ?, ?, ?, ?, date('now'), ?, 'medium', 'planning', 10, ?)
  `).run(
    projectId, inq.project_title, clientId, inq.full_name, inq.project_description,
    inq.services_json, inq.event_date || null, `Converted from inquiry ${id}`
  );

  // Update inquiry
  db.prepare("UPDATE inquiries SET status = 'confirmed', client_id = ? WHERE id = ?").run(clientId, id);

  logActivity('CONVERT', `Converted inquiry ${id} into Project ${projectId} for ${inq.full_name}`, 'Operations Admin', 'projects', projectId);

  res.json({ success: true, clientId, projectId });
});

// -------------------------------------------------------------
// APPOINTMENTS
// -------------------------------------------------------------
app.get('/api/appointments', (req, res) => {
  const { status } = req.query;
  let query = `
    SELECT a.*,
           i.event_date as inq_event_date,
           i.project_description as inq_description,
           i.project_title as inq_title,
           i.organization as inq_org
    FROM appointments a
    LEFT JOIN inquiries i ON a.inquiry_id = i.id
  `;
  const params = [];
  if (status && status !== 'all') {
    if (status === 'new_inquiry' || status === 'pending') {
      query += ' WHERE a.status IN (?, ?)';
      params.push('new_inquiry', 'pending');
    } else {
      query += ' WHERE a.status = ?';
      params.push(status);
    }
  }
  query += ' ORDER BY a.created_at DESC';

  const rows = db.prepare(query).all(...params).map(r => ({
    id: r.id,
    inquiryId: r.inquiry_id,
    clientId: r.client_id,
    clientName: r.client_name,
    clientEmail: r.client_email,
    clientPhone: r.client_phone,
    serviceName: r.service_name,
    appointmentDate: r.appointment_date,
    appointmentTime: r.appointment_time,
    location: r.location || '',
    purpose: r.purpose || r.service_name || '',
    status: r.status,
    notes: r.notes || '',
    meetingNotes: r.meeting_notes || '',
    createdAt: r.created_at,
    eventDate: r.inq_event_date || r.appointment_date || '',
    eventLocation: r.location || '',
    additionalDetails: r.inq_description || r.notes || ''
  }));
  res.json(rows);
});

app.post('/api/appointments', (req, res) => {
  const {
    clientName, clientEmail, clientPhone, appointmentDate,
    appointmentTime, location, purpose, notes, status
  } = req.body;

  if (!clientName || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ error: 'Client name, appointment date, and time are required.' });
  }

  const id = 'apt_' + Date.now();
  db.prepare(`
    INSERT INTO appointments (
      id, client_name, client_email, client_phone, service_name,
      appointment_date, appointment_time, location, purpose, status, notes, meeting_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, clientName, clientEmail || '', clientPhone || '', purpose || 'Discovery Consultation',
    appointmentDate, appointmentTime, location || 'Studio / Online', purpose || 'Meeting',
    status || 'pending', notes || '', ''
  );

  logActivity('CREATE', `Scheduled appointment with ${clientName} on ${appointmentDate}`, 'Admin', 'appointments', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, appointmentDate, appointmentTime, location, purpose, notes, meetingNotes } = req.body;

  const current = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  if (!current) return res.status(404).json({ error: 'Appointment not found' });

  db.prepare(`
    UPDATE appointments
    SET status = COALESCE(?, status),
        appointment_date = COALESCE(?, appointment_date),
        appointment_time = COALESCE(?, appointment_time),
        location = COALESCE(?, location),
        purpose = COALESCE(?, purpose),
        notes = COALESCE(?, notes),
        meeting_notes = COALESCE(?, meeting_notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    status !== undefined ? status : null,
    appointmentDate !== undefined ? appointmentDate : null,
    appointmentTime !== undefined ? appointmentTime : null,
    location !== undefined ? location : null,
    purpose !== undefined ? purpose : null,
    notes !== undefined ? notes : null,
    meetingNotes !== undefined ? meetingNotes : null,
    id
  );

  // Synchronize status with linked inquiry if present
  if (current.inquiry_id) {
    if (status === 'confirmed') {
      db.prepare("UPDATE inquiries SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(current.inquiry_id);
    } else if (status === 'cancelled') {
      db.prepare("UPDATE inquiries SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(current.inquiry_id);
    }
  }

  logActivity('UPDATE', `Updated appointment ${id} for ${current.client_name}`, 'Admin', 'appointments', id);
  res.json({ success: true });
});

// Approve & Convert Appointment into Project
app.post('/api/appointments/:id/convert-to-project', (req, res) => {
  const { id } = req.params;
  const apt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  let inq = null;
  if (apt.inquiry_id) {
    inq = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(apt.inquiry_id);
  }

  // Check or create client
  let client = db.prepare('SELECT id FROM clients WHERE email = ?').get(apt.client_email);
  let clientId = client ? client.id : null;

  if (!clientId) {
    clientId = 'cl_' + Date.now();
    db.prepare(`
      INSERT INTO clients (id, name, email, phone, organization, services_requested, project_history, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      clientId, apt.client_name, apt.client_email, apt.client_phone,
      inq?.organization || '',
      JSON.stringify([apt.service_name || 'Creative Service']),
      apt.service_name || 'Project',
      `Created from appointment ${id}`
    );
  }

  // Create Project
  const projectId = 'prj_' + Date.now();
  const projectName = inq?.project_title || `${apt.service_name || 'Creative'} Project - ${apt.client_name}`;
  const projectDesc = inq?.project_description || apt.notes || `Project for ${apt.client_name}`;
  const eventDate = inq?.event_date || apt.appointment_date || null;

  db.prepare(`
    INSERT INTO projects (
      id, project_name, client_id, client_name, description,
      services_json, start_date, deadline, priority, status, progress_pct, internal_notes
    ) VALUES (?, ?, ?, ?, ?, ?, date('now'), ?, 'medium', 'in_progress', 20, ?)
  `).run(
    projectId, projectName, clientId, apt.client_name, projectDesc,
    JSON.stringify([apt.service_name || 'Creative Service']),
    eventDate,
    `Approved project from appointment ${id}`
  );

  // Update appointment & inquiry to confirmed
  db.prepare("UPDATE appointments SET status = 'confirmed', client_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(clientId, id);
  if (apt.inquiry_id) {
    db.prepare("UPDATE inquiries SET status = 'confirmed', client_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(clientId, apt.inquiry_id);
  }

  logActivity('CONVERT', `Approved project ${projectId} for ${apt.client_name}`, 'Admin', 'projects', projectId);
  res.json({ success: true, clientId, projectId });
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
  logActivity('DELETE', `Deleted appointment ${id}`, 'Admin', 'appointments', id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// FREELANCER APPLICATION & RECRUITMENT
// -------------------------------------------------------------
app.post('/api/freelancers/apply', (req, res) => {
  const {
    fullName, email, phone, location, primarySkill, additionalSkills,
    experienceLevel, portfolioUrl, instagramUrl, linkedinUrl,
    workingStyle, availability, introduction, resumeUrl
  } = req.body;

  if (!fullName || !email || !phone || !location || !primarySkill || !portfolioUrl || !introduction) {
    return res.status(400).json({ error: 'Please fill in all mandatory application fields.' });
  }

  const id = 'fapp_' + Date.now();
  db.prepare(`
    INSERT INTO freelancer_applications (
      id, full_name, email, phone, location, primary_skill,
      additional_skills_json, experience_level, portfolio_url,
      instagram_url, linkedin_url, working_style, availability,
      introduction, resume_url, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new_application')
  `).run(
    id, fullName, email, phone, location, primarySkill,
    JSON.stringify(additionalSkills || []), experienceLevel || '1-3 years',
    portfolioUrl, instagramUrl || '', linkedinUrl || '',
    workingStyle || 'Remote', availability || 'Project-based',
    introduction, resumeUrl || ''
  );

  createNotification(
    'application',
    'New Freelancer Application',
    `${fullName} applied for ${primarySkill} (${location})`,
    '/admin/freelancers'
  );

  logActivity('APPLICATION', `New freelancer application from ${fullName} (${primarySkill})`, 'Applicant', 'freelancer_applications', id);

  res.status(201).json({
    success: true,
    message: 'Thank you for applying to join the Visual Woxx creative team! Your portfolio and profile have been submitted directly to our recruitment committee.'
  });
});

app.get('/api/freelancers/applications', (req, res) => {
  const { status, skill, search } = req.query;
  let query = 'SELECT * FROM freelancer_applications WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }
  if (skill && skill !== 'all') {
    query += ' AND primary_skill = ?';
    params.push(skill);
  }
  if (search) {
    query += ' AND (full_name LIKE ? OR email LIKE ? OR location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params).map(r => ({
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    location: r.location,
    primarySkill: r.primary_skill,
    additionalSkills: JSON.parse(r.additional_skills_json || '[]'),
    experienceLevel: r.experience_level,
    portfolioUrl: r.portfolio_url,
    instagramUrl: r.instagram_url,
    linkedinUrl: r.linkedin_url,
    workingStyle: r.working_style,
    availability: r.availability,
    introduction: r.introduction,
    resumeUrl: r.resume_url,
    status: r.status,
    internalNotes: r.internal_notes,
    createdAt: r.created_at
  }));
  res.json(rows);
});

app.put('/api/freelancers/applications/:id', (req, res) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;

  db.prepare(`
    UPDATE freelancer_applications
    SET status = ?, internal_notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, internalNotes, id);

  // If accepted, add to approved freelancers pool if not already added
  if (status === 'accepted') {
    const existing = db.prepare('SELECT id FROM freelancers WHERE application_id = ?').get(id);
    if (!existing) {
      const appRecord = db.prepare('SELECT * FROM freelancer_applications WHERE id = ?').get(id);
      if (appRecord) {
        const flId = 'fl_' + Date.now();
        db.prepare(`
          INSERT INTO freelancers (id, application_id, full_name, email, phone, location, primary_skill, skills_json, experience_level, portfolio_url, availability_status, rating, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', 5.0, ?)
        `).run(
          flId, id, appRecord.full_name, appRecord.email, appRecord.phone,
          appRecord.location, appRecord.primary_skill, appRecord.additional_skills_json,
          appRecord.experience_level, appRecord.portfolio_url, internalNotes || 'Approved applicant'
        );
      }
    }
  }

  logActivity('UPDATE', `Updated application ${id} status to ${status}`, 'Recruitment Admin', 'freelancer_applications', id);
  res.json({ success: true });
});

app.get('/api/freelancers', (req, res) => {
  const rows = db.prepare('SELECT * FROM freelancers ORDER BY rating DESC, created_at DESC').all().map(r => ({
    id: r.id,
    applicationId: r.application_id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    location: r.location,
    primarySkill: r.primary_skill,
    skills: JSON.parse(r.skills_json || '[]'),
    experienceLevel: r.experience_level,
    portfolioUrl: r.portfolio_url,
    availabilityStatus: r.availability_status,
    rating: r.rating,
    notes: r.notes,
    createdAt: r.created_at
  }));
  res.json(rows);
});

app.put('/api/freelancers/:id', (req, res) => {
  const { id } = req.params;
  const { availabilityStatus, rating, notes } = req.body;
  db.prepare(`
    UPDATE freelancers
    SET availability_status = ?, rating = ?, notes = ?
    WHERE id = ?
  `).run(availabilityStatus, rating, notes, id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// CLIENTS
// -------------------------------------------------------------
app.get('/api/clients', (req, res) => {
  const clients = db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all().map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || '',
    organization: c.organization || '',
    activeProject: c.active_project || c.services_requested || '',
    servicesRequested: c.services_requested || '',
    notes: c.notes || '',
    status: c.status || 'active',
    createdAt: c.created_at
  }));
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone, organization, activeProject, servicesRequested, notes, status } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const id = 'cl_' + Date.now();
  db.prepare(`
    INSERT INTO clients (id, name, email, phone, organization, active_project, services_requested, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, email, phone || '', organization || '', activeProject || '', servicesRequested || '', notes || '', status || 'active');

  logActivity('CREATE', `Added client: ${name}`, 'Admin', 'clients', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, organization, activeProject, servicesRequested, notes, status } = req.body;
  db.prepare(`
    UPDATE clients
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        organization = COALESCE(?, organization),
        active_project = COALESCE(?, active_project),
        services_requested = COALESCE(?, services_requested),
        notes = COALESCE(?, notes),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, email, phone, organization, activeProject, servicesRequested, notes, status, id);

  logActivity('UPDATE', `Updated client: ${name}`, 'Admin', 'clients', id);
  res.json({ success: true });
});

app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  logActivity('DELETE', `Deleted client ${id}`, 'Admin', 'clients', id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// PROJECTS & WORK PROGRESS MANAGEMENT (KANBAN + TASKS)
// -------------------------------------------------------------
app.get('/api/projects', (req, res) => {
  const { status, clientId } = req.query;
  let query = 'SELECT * FROM projects WHERE 1=1';
  const params = [];
  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }
  if (clientId) {
    query += ' AND client_id = ?';
    params.push(clientId);
  }
  query += ' ORDER BY created_at DESC';

  const projects = db.prepare(query).all();
  const tasksStmt = db.prepare('SELECT * FROM project_tasks WHERE project_id = ? ORDER BY due_date ASC');
  const updatesStmt = db.prepare('SELECT * FROM project_updates WHERE project_id = ? ORDER BY created_at DESC');

  const result = projects.map(p => ({
    id: p.id,
    projectName: p.project_name,
    projectType: p.project_type || 'Event',
    totalCost: p.total_cost || 0,
    progressStage: p.progress_stage || p.status,
    clientId: p.client_id,
    clientName: p.client_name,
    description: p.description,
    services: JSON.parse(p.services_json || '[]'),
    assignedTeam: JSON.parse(p.assigned_team_json || '[]'),
    assignedFreelancers: JSON.parse(p.assigned_freelancers_json || '[]'),
    startDate: p.start_date,
    deadline: p.deadline,
    priority: p.priority,
    status: p.status,
    progressPct: p.progress_pct,
    internalNotes: p.internal_notes,
    deliverables: JSON.parse(p.deliverable_links_json || '[]'),
    tasks: tasksStmt.all(p.id).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      assignedTo: t.assigned_to,
      dueDate: t.due_date,
      isCompleted: Boolean(t.is_completed)
    })),
    updates: updatesStmt.all(p.id).map(u => ({
      id: u.id,
      type: u.update_type,
      title: u.title,
      description: u.description,
      author: u.author_name,
      createdAt: u.created_at
    }))
  }));

  res.json(result);
});

app.post('/api/projects', (req, res) => {
  const {
    projectName, projectType, clientName, totalCost, clientId,
    description, services, assignedTeam, assignedFreelancers,
    startDate, deadline, priority, status, progressStage, progressPct,
    internalNotes, deliverables
  } = req.body;

  if (!projectName || !clientName) {
    return res.status(400).json({ error: 'Project name and client name are required' });
  }

  const id = 'prj_' + Date.now();
  db.prepare(`
    INSERT INTO projects (
      id, project_name, project_type, total_cost, client_id, client_name, description,
      services_json, assigned_team_json, assigned_freelancers_json,
      start_date, deadline, priority, status, progress_stage, progress_pct,
      internal_notes, deliverable_links_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, projectName, projectType || 'Event', totalCost || 0, clientId || null, clientName, description || '',
    JSON.stringify(services || []), JSON.stringify(assignedTeam || []),
    JSON.stringify(assignedFreelancers || []), startDate || null,
    deadline || null, priority || 'medium', status || 'planning',
    progressStage || status || 'planning', progressPct || 0,
    internalNotes || '', JSON.stringify(deliverables || [])
  );

  // Add initial timeline update
  db.prepare(`
    INSERT INTO project_updates (id, project_id, update_type, title, description, author_name)
    VALUES (?, ?, 'status_change', 'Project Created', 'Project initialized in status: ' || ?, 'Admin')
  `).run('upd_' + Date.now(), id, status || 'planning');

  logActivity('CREATE', `Created project: ${projectName}`, 'Admin', 'projects', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const {
    projectName, projectType, clientName, totalCost, description, services,
    assignedTeam, assignedFreelancers, startDate, deadline, priority,
    status, progressStage, progressPct, internalNotes, deliverables, updateNote
  } = req.body;

  const current = db.prepare('SELECT status, project_name FROM projects WHERE id = ?').get(id);
  if (!current) return res.status(404).json({ error: 'Project not found' });

  db.prepare(`
    UPDATE projects
    SET project_name = COALESCE(?, project_name),
        project_type = COALESCE(?, project_type),
        total_cost = COALESCE(?, total_cost),
        client_name = COALESCE(?, client_name),
        description = COALESCE(?, description),
        services_json = COALESCE(?, services_json),
        assigned_team_json = COALESCE(?, assigned_team_json),
        assigned_freelancers_json = COALESCE(?, assigned_freelancers_json),
        start_date = COALESCE(?, start_date),
        deadline = COALESCE(?, deadline),
        priority = COALESCE(?, priority),
        status = COALESCE(?, status),
        progress_stage = COALESCE(?, progress_stage),
        progress_pct = COALESCE(?, progress_pct),
        internal_notes = COALESCE(?, internal_notes),
        deliverable_links_json = COALESCE(?, deliverable_links_json),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    projectName !== undefined ? projectName : null,
    projectType !== undefined ? projectType : null,
    totalCost !== undefined ? totalCost : null,
    clientName !== undefined ? clientName : null,
    description !== undefined ? description : null,
    services !== undefined ? JSON.stringify(services) : null,
    assignedTeam !== undefined ? JSON.stringify(assignedTeam) : null,
    assignedFreelancers !== undefined ? JSON.stringify(assignedFreelancers) : null,
    startDate !== undefined ? startDate : null,
    deadline !== undefined ? deadline : null,
    priority !== undefined ? priority : null,
    status !== undefined ? status : null,
    progressStage !== undefined ? progressStage : null,
    progressPct !== undefined ? progressPct : null,
    internalNotes !== undefined ? internalNotes : null,
    deliverables !== undefined ? JSON.stringify(deliverables) : null,
    id
  );

  // If status/stage changed or note provided, log update
  if ((status && current.status !== status) || updateNote) {
    db.prepare(`
      INSERT INTO project_updates (id, project_id, update_type, title, description, author_name)
      VALUES (?, ?, 'status_change', ?, ?, 'Admin')
    `).run(
      'upd_' + Date.now(), id,
      status && current.status !== status ? `Status updated to ${status.replace('_', ' ').toUpperCase()}` : 'Progress Update',
      updateNote || `Progress updated: ${progressStage || status}`
    );
  }

  logActivity('UPDATE', `Updated project ${projectName || current.project_name} (${status || 'updated'})`, 'Admin', 'projects', id);
  res.json({ success: true });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  logActivity('DELETE', `Deleted project ${id}`, 'Admin', 'projects', id);
  res.json({ success: true });
});

// Project Tasks
app.post('/api/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { title, description, assignedTo, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Task title is required' });

  const taskId = 'tsk_' + Date.now();
  db.prepare(`
    INSERT INTO project_tasks (id, project_id, title, description, assigned_to, due_date, is_completed)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `).run(taskId, id, title, description || '', assignedTo || '', dueDate || null);

  res.status(201).json({ id: taskId, success: true });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { isCompleted, title, assignedTo, dueDate } = req.body;

  if (isCompleted !== undefined) {
    db.prepare('UPDATE project_tasks SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(isCompleted ? 1 : 0, id);
  } else {
    db.prepare(`
      UPDATE project_tasks
      SET title = ?, assigned_to = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, assignedTo, dueDate, id);
  }

  res.json({ success: true });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM project_tasks WHERE id = ?').run(id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// CONTACT MESSAGES
// -------------------------------------------------------------
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
  }

  const id = 'msg_' + Date.now();
  db.prepare(`
    INSERT INTO contact_messages (id, name, email, phone, subject, message, status, is_read)
    VALUES (?, ?, ?, ?, ?, ?, 'new', 0)
  `).run(id, name, email, phone || '', subject, message);

  createNotification(
    'message',
    'New Contact Message',
    `Message from ${name}: "${subject}"`,
    '/admin/messages'
  );

  logActivity('MESSAGE', `New message from ${name} regarding ${subject}`, 'Visitor', 'contact_messages', id);

  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully! A Visual Woxx representative will reply to your email shortly.'
  });
});

app.get('/api/contact', (req, res) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM contact_messages WHERE 1=1';
  const params = [];
  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params).map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    status: r.status,
    isRead: Boolean(r.is_read),
    internalNotes: r.internal_notes,
    responseNotes: r.response_notes,
    createdAt: r.created_at
  }));
  res.json(rows);
});

app.put('/api/contact/:id', (req, res) => {
  const { id } = req.params;
  const { status, isRead, internalNotes, responseNotes } = req.body;

  db.prepare(`
    UPDATE contact_messages
    SET status = COALESCE(?, status),
        is_read = COALESCE(?, is_read),
        internal_notes = COALESCE(?, internal_notes),
        response_notes = COALESCE(?, response_notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, isRead !== undefined ? (isRead ? 1 : 0) : null, internalNotes, responseNotes, id);

  res.json({ success: true });
});

// -------------------------------------------------------------
// LIVE DASHBOARD STATS & KPI AGGREGATION
// -------------------------------------------------------------
app.get('/api/stats', (req, res) => {
  const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
  const newInquiries = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new_inquiry'").get().count;
  const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status IN ('planning', 'in_progress', 'client_review', 'revisions')").get().count;
  const completedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'completed'").get().count;
  const pendingTasks = db.prepare('SELECT COUNT(*) as count FROM project_tasks WHERE is_completed = 0').get().count;
  const upcomingAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status IN ('new_inquiry', 'confirmed')").get().count;
  const totalFreelancers = db.prepare('SELECT COUNT(*) as count FROM freelancers').get().count;
  const newApplications = db.prepare("SELECT COUNT(*) as count FROM freelancer_applications WHERE status = 'new_application'").get().count;
  const unreadMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').get().count;
  const totalPortfolio = db.prepare('SELECT COUNT(*) as count FROM portfolio_projects').get().count;
  const totalReviews = db.prepare('SELECT COUNT(*) as count FROM client_reviews').get().count;

  const recentActivity = db.prepare('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 8').all();
  const recentInquiries = db.prepare('SELECT id, full_name, email, project_title, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 5').all();
  const upcomingAppointmentsList = db.prepare("SELECT * FROM appointments WHERE status IN ('new_inquiry', 'confirmed') ORDER BY appointment_date ASC, appointment_time ASC LIMIT 5").all();

  res.json({
    totalClients,
    newInquiries,
    activeProjects,
    completedProjects,
    pendingTasks,
    upcomingAppointments,
    totalFreelancers,
    newApplications,
    unreadMessages,
    totalPortfolio,
    totalReviews,
    recentActivity,
    recentInquiries,
    upcomingAppointmentsList
  });
});

// -------------------------------------------------------------
// CLIENT REVIEWS (TESTIMONIALS & PUBLIC REVIEWS)
// -------------------------------------------------------------
app.get('/api/reviews', (req, res) => {
  const includeAll = req.query.all === 'true';
  const query = includeAll
    ? 'SELECT * FROM client_reviews ORDER BY display_order ASC, created_at DESC'
    : 'SELECT * FROM client_reviews WHERE is_published = 1 ORDER BY display_order ASC, created_at DESC';
  
  const rows = db.prepare(query).all().map(r => ({
    id: r.id,
    clientName: r.client_name,
    designation: r.designation,
    company: r.company,
    quote: r.quote,
    rating: r.rating,
    avatarUrl: r.avatar_url,
    isPublished: Boolean(r.is_published),
    displayOrder: r.display_order,
    createdAt: r.created_at
  }));
  res.json(rows);
});

app.post('/api/reviews', (req, res) => {
  const { clientName, designation, company, quote, rating = 5, avatarUrl = '', isPublished = true, displayOrder = 0 } = req.body;
  if (!clientName || !quote) {
    return res.status(400).json({ error: 'Client name and quote are required' });
  }

  const id = 'rev_' + Date.now();
  db.prepare(`
    INSERT INTO client_reviews (id, client_name, designation, company, quote, rating, avatar_url, is_published, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, clientName, designation || 'Client', company || '', quote, rating, avatarUrl, isPublished ? 1 : 0, displayOrder);

  logActivity('CREATE_REVIEW', `Added review by ${clientName}`, 'Admin', 'client_reviews', id);
  res.status(201).json({ id, success: true });
});

app.put('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { clientName, designation, company, quote, rating, avatarUrl, isPublished, displayOrder } = req.body;

  const current = db.prepare('SELECT * FROM client_reviews WHERE id = ?').get(id);
  if (!current) {
    return res.status(404).json({ error: 'Review not found' });
  }

  db.prepare(`
    UPDATE client_reviews
    SET client_name = COALESCE(?, client_name),
        designation = COALESCE(?, designation),
        company = COALESCE(?, company),
        quote = COALESCE(?, quote),
        rating = COALESCE(?, rating),
        avatar_url = COALESCE(?, avatar_url),
        is_published = COALESCE(?, is_published),
        display_order = COALESCE(?, display_order)
    WHERE id = ?
  `).run(
    clientName !== undefined ? clientName : null,
    designation !== undefined ? designation : null,
    company !== undefined ? company : null,
    quote !== undefined ? quote : null,
    rating !== undefined ? rating : null,
    avatarUrl !== undefined ? avatarUrl : null,
    isPublished !== undefined ? (isPublished ? 1 : 0) : null,
    displayOrder !== undefined ? displayOrder : null,
    id
  );

  logActivity('UPDATE_REVIEW', `Updated review for ${current.client_name}`, 'Admin', 'client_reviews', id);
  res.json({ success: true });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const current = db.prepare('SELECT * FROM client_reviews WHERE id = ?').get(id);
  if (!current) {
    return res.status(404).json({ error: 'Review not found' });
  }

  db.prepare('DELETE FROM client_reviews WHERE id = ?').run(id);
  logActivity('DELETE_REVIEW', `Deleted review by ${current.client_name}`, 'Admin', 'client_reviews', id);
  res.json({ success: true });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const rows = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20').all().map(n => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    isRead: Boolean(n.is_read),
    createdAt: n.created_at
  }));
  res.json(rows);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
  res.json({ success: true });
});

app.put('/api/notifications/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1').run();
  res.json({ success: true });
});

// Activity logs
app.get('/api/activity-logs', (req, res) => {
  const logs = db.prepare('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50').all();
  res.json(logs);
});

const server = app.listen(PORT, () => {
  console.log(`Visual Woxx Backend API server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
