# Environment Variables Setup Guide

## 🔧 **Setup Instructions**

### **1. Copy Environment Template**
```cmd
copy .env.example .env
```

### **2. Edit .env File**
Open `.env` file and set your values:

```env
# Airtable API Configuration
AIRTABLE_API_KEY=pat123.abc123_your_actual_token_here

# Server Configuration  
PORT=8080
SERVER_NAME=Contexa
SERVER_VERSION=0.1.0

# Contexa Trace Configuration
CONTEXA_TRACE_ENABLED=true
CONTEXA_SERVER_ID=airtable-mcp-server

# Development
NODE_ENV=development
DEBUG_MODE=false
```

### **3. Get Your Airtable API Token**
1. Go to https://airtable.com/create/tokens
2. Create a personal access token
3. Required permissions:
   - `schema.bases:read` (required)
   - `data.records:read` (required)  
   - `data.records:write` (optional, for write operations)
   - `schema.bases:write` (optional, for creating/updating tables)

### **4. Build and Run**
```cmd
npm run build
npm start
```

## 🌐 **Available Environment Variables**

| Variable | Default | Description |
|----------|---------|-------------|
| `AIRTABLE_API_KEY` | *required* | Your Airtable personal access token |
| `PORT` | `8080` | Port number for the HTTP server |
| `SERVER_NAME` | `Contexa` | Server name shown in responses |
| `SERVER_VERSION` | `0.1.0` | Server version |
| `CONTEXA_TRACE_ENABLED` | `true` | Enable/disable tracing middleware |
| `CONTEXA_SERVER_ID` | `airtable-mcp-server` | Server ID for tracing |
| `NODE_ENV` | `development` | Environment mode |
| `DEBUG_MODE` | `false` | Enable debug logging |

## 🚀 **Usage Examples**

### **Using .env file (Recommended)**
```cmd
# Edit .env file with your values
npm run build
npm start
```

### **Using environment variables directly**
```cmd
set AIRTABLE_API_KEY=your_token_here
set PORT=3000
npm start
```

### **Using command line (Deprecated)**
```cmd
node dist/index.js your_token_here
```

## ✅ **Testing**

### **1. Test without API key**
```cmd
# Remove or comment out AIRTABLE_API_KEY in .env
npm start
# Should show error message about missing API key
```

### **2. Test with API key**
```cmd
# Set AIRTABLE_API_KEY in .env
npm start
# Should start server successfully
```

### **3. Health check**
```cmd
curl http://localhost:8080/health
```

## 🔒 **Security Notes**

- ✅ `.env` file is in `.gitignore` - won't be committed to git
- ✅ Use `.env.example` as template for team sharing
- ✅ Never commit actual API keys to version control
- ✅ Use environment-specific .env files for different deployments
