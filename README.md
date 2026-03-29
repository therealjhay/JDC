# JDC Watches — Watch Dropshipping Platform

A scalable watch retail platform built with a dropshipping model. Customers browse watches and place orders via WhatsApp.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query, Axios
- **Backend**: Django REST Framework, Python
- **Database**: PostgreSQL
- **Storage**: Cloudinary
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## Features

- Product catalog with categories and brands
- Multiple variants per product (color, strap type, size)
- Multi-image upload per product/variant via Cloudinary
- WhatsApp order flow (generates pre-filled message)
- Admin dashboard (login, product/variant/image management, orders)
- Search and filtering with pagination
- Responsive design

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL and WhatsApp number
npm run dev
```

## Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Debug mode (True/False) |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `DATABASE_URL` | PostgreSQL connection URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ALLOWED_ORIGINS` | Frontend URL(s) |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (with country code, no +) |

## API Endpoints

- `POST /api/login/` — Admin login (returns token)
- `POST /api/logout/` — Admin logout
- `GET/POST /api/products/` — List/create products
- `GET/PUT/DELETE /api/products/{id}/` — Product detail/update/delete
- `GET/POST /api/categories/` — Categories
- `GET/POST /api/brands/` — Brands
- `GET/POST /api/variants/` — Variants
- `GET/POST /api/images/` — Product images
- `POST /api/upload/` — Upload image to Cloudinary
- `GET/POST /api/orders/` — Orders
- `GET /api/schema/swagger-ui/` — API documentation

## Deployment

### Backend (Render/Railway)

1. Set environment variables in the platform dashboard
2. Set build command: `pip install -r requirements.txt && python manage.py migrate`
3. Set start command: `gunicorn config.wsgi:application`

### Frontend (Vercel)

1. Connect GitHub repo and select `frontend` as root directory
2. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variables
3. Deploy
