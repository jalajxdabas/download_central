
# 📥 Download Central

**Download Central** is a full-stack web application that lets users view and download monthly data files stored in Google Cloud Storage (GCS). It provides a clean interface to display file metadata and supports secure downloads using signed URLs. PostgreSQL is used to store metadata for better performance and control.

---

## 🚀 Features

- View file name, size, type, and last updated time
- Download files securely via signed GCS URLs
- Sync GCS metadata to local PostgreSQL database
- React.js frontend styled with Tailwind CSS
- Smart API routing based on request type
- Node.js Express backend with Google Cloud integration

---

## 🧰 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, @google-cloud/storage, dotenv
- **Database**: PostgreSQL (`pg` npm package)

---

## 🗂️ Project Structure

```

/
├── backend/
│   ├── app.js
│   ├── db.js
│   ├── routes/
│   ├── gcs/
│   ├── .env
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js

````

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/download-central.git
cd download-central
````

---

### 2. Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file in `backend/`

```env
PORT=3000
GCS_BUCKET_NAME=your-bucket-name
SERVICE_ACCOUNT_KEY_PATH=./path/to/your-service-account-key.json
DATABASE_URL=postgresql://username:password@localhost:5432/filemeta
```

#### Start the backend server

```bash
npm start
```

---

### 3. Setup PostgreSQL

Install PostgreSQL via Homebrew:

```bash
brew install postgresql
brew services start postgresql
```

Create a database and table:

```bash
createdb filemeta
psql filemeta
```

Then in the `psql` shell:

```sql
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  filename TEXT,
  type TEXT,
  size BIGINT,
  last_updated TIMESTAMP,
  gcs_path TEXT
);
```

---

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## 🔄 API Endpoints

| Method | Endpoint                  | Description                         |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/api/files`              | Fetch file metadata from DB         |
| POST   | `/api/files/sync`         | Sync GCS files → Update DB          |
| GET    | `/api/files/download/:id` | Get signed URL and trigger download |

---

## ✅ Usage Flow

1. Visit frontend to view file table
2. Click "Sync" to update DB from GCS
3. Click "Download" to trigger file download via signed URL

---

## 🔐 Environment Variables

| Key                        | Description                    |
| -------------------------- | ------------------------------ |
| `PORT`                     | Server port (default: 3000)    |
| `GCS_BUCKET_NAME`          | Your GCS bucket name           |
| `SERVICE_ACCOUNT_KEY_PATH` | Path to your GCS JSON key file |
| `DATABASE_URL`             | PostgreSQL connection string   |

---

## ✨ Future Enhancements

* 🔍 Search, sort, and pagination
* 👥 User authentication
* 📅 Scheduled sync using `node-cron`
* 📊 File usage analytics dashboard

---

## 🙌 Acknowledgments

* [Google Cloud Storage](https://cloud.google.com/storage)
* [PostgreSQL](https://www.postgresql.org/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)

```

