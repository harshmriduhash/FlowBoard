# FlowBoard MVP - Deployment Checklist

## ✅ Pre-Deployment Verification

- [x] Backend API routes implemented
- [x] Frontend pages complete
- [x] Docker configuration ready
- [x] Environment variables documented
- [x] Database models created
- [x] Authentication working
- [x] Workflow engine functional
- [x] Audit logs implemented

## 🚀 Quick Deploy (Docker)

```bash
# 1. Ensure Docker is running
docker --version

# 2. Navigate to project root
cd FlowBoard

# 3. Build and start all services
docker-compose up --build

# 4. Verify services:
# - MongoDB: docker ps | grep mongo
# - Redis: docker ps | grep redis  
# - Backend: curl http://localhost:4000/health
# - Frontend: Open http://localhost:4173
```

## 🔧 Production Deployment Steps

### Option 1: Single Server (VPS/Cloud)

1. **Install dependencies:**
   ```bash
   # Install Node.js 20+, Docker, Docker Compose
   ```

2. **Clone repository:**
   ```bash
   git clone <your-repo>
   cd FlowBoard
   ```

3. **Set environment variables:**
   ```bash
   # Backend .env
   PORT=4000
   MONGO_URI=mongodb://mongo:27017/flowboard
   REDIS_URL=redis://redis:6379
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-different-secret>
   
   # Frontend .env
   VITE_API_URL=http://your-domain.com:4000
   ```

4. **Start with Docker:**
   ```bash
   docker-compose up -d
   ```

5. **Set up reverse proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:4173;
       }
       
       location /api {
           proxy_pass http://localhost:4000;
       }
   }
   ```

### Option 2: Separate Services

**Backend:**
```bash
cd backend
npm install --production
npm start
# Runs on port 4000
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with nginx/serve
```

**Database:**
- MongoDB: Use MongoDB Atlas or self-hosted
- Redis: Use Redis Cloud or self-hosted

## 🧪 Testing Before Demo

1. **Sign up** → Creates workspace
2. **Create workflow** → "Order Processing" with states: `New → Processing → Shipped → Delivered`
3. **Add transitions** → `New:Processing;Processing:Shipped;Shipped:Delivered`
4. **Create item** → Test item creation
5. **Transition item** → Move through states
6. **View logs** → Verify audit trail
7. **Test permissions** → Try unauthorized actions

## 📊 Demo Script for Investors

1. **Landing page** → "Workflow state engine + ops dashboard"
2. **Sign up** → Show workspace creation
3. **Create workflow** → Define states and transitions
4. **Create item** → Add real-world example
5. **Transition** → Show state validation
6. **Audit log** → Show immutable history
7. **Value prop** → "Saves 10-20 hrs/week, prevents ops errors"

## 🔒 Security Checklist

- [ ] Change JWT secrets in production
- [ ] Use HTTPS in production
- [ ] Set up CORS properly for your domain
- [ ] Enable MongoDB authentication
- [ ] Set Redis password
- [ ] Review environment variables
- [ ] Set up monitoring/logging

## 📈 Post-Deployment

- Monitor logs: `docker-compose logs -f`
- Check health: `curl http://localhost:4000/health`
- Verify database connections
- Test authentication flow
- Verify workspace isolation

## 🆘 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Check Redis is running
- Verify environment variables

**Frontend can't connect:**
- Check VITE_API_URL matches backend URL
- Check CORS settings
- Verify backend is running

**Database errors:**
- Verify MongoDB connection string
- Check Redis connection
- Ensure databases are accessible

---

**Ready to deploy. Ready to demo. Ready to sell.**
