import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import wilayaRoutes from './routes/wilayas.js';
import discountRoutes from './routes/discounts.js';
import orderRoutes from './routes/orders.js';
import tailoringRoutes from './routes/tailoring.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(authenticate);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wilayas', wilayaRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tailoring', tailoringRoutes);
app.use('/api/admin', adminRoutes);

// Proxy Cloudflare R2 images when running local Express server
app.use('/api/images', async (req, res) => {
  try {
    const remoteUrl = `https://mystyle-api.djebiriabdrazak.workers.dev${req.originalUrl}`;
    const remoteRes = await fetch(remoteUrl);
    if (!remoteRes.ok) {
      return res.status(remoteRes.status).send('Image not found');
    }
    const contentType = remoteRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    const buffer = await remoteRes.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'MyStyle Algeria',
    time: new Date().toISOString(),
  });
});

// Serve frontend static build in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing fallback in production
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) next();
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[MyStyle Server] Running on http://localhost:${PORT}`);
});
