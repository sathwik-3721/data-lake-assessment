
// app.js
import express, { json, urlencoded, static as static_ } from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import appv1 from './server/src/app/v1/app.v1.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;

// enable CORS
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// body‐parser
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// serve your public folder if needed
app.use(static_(join(__dirname, 'public')));

// ─── THIS is the important part ───────────────────────────────────────────────
// Mount “/uploads” so that any GET /uploads/<filename> maps to
//    <project-root>/server/src/app/v1/controllers/uploads/<filename>
app.use(
  '/uploads',
  static_(
    join(__dirname, 'server', 'src', 'app', 'v1', 'controllers', 'uploads')
  )
);

// now mount your V1 API
app.use('/v1', appv1);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port: ${port}`);
});
