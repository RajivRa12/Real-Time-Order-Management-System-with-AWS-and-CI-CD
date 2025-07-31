# Real-Time Order Management System with AWS and CI/CD

A modern, full-stack order management system built with React, TypeScript, and AWS services, featuring real-time notifications and automated CI/CD pipelines.

## 🚀 Features

- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Real-time Notifications**: AWS SNS integration for instant order updates
- **File Upload**: PDF invoice upload with drag-and-drop functionality
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **Type Safety**: Full TypeScript implementation
- **CI/CD Pipeline**: Automated deployment with GitHub Actions
- **Serverless Backend**: AWS Lambda functions for scalability

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** for API routes
- **AWS Lambda** for serverless functions
- **AWS SNS** for notifications
- **AWS S3** for file storage

### DevOps
- **GitHub Actions** for CI/CD
- **Netlify** for hosting
- **Docker** for containerization

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── ui/                # Shadcn/ui components
├── server/                # Backend Node.js application
│   ├── routes/            # API route handlers
│   └── services/          # Business logic services
├── netlify/               # Netlify functions
│   └── functions/         # Serverless functions
├── shared/                # Shared types and utilities
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RajivRa12/Real-Time-Order-Management-System-with-AWS-and-CI-CD.git
   cd Real-Time-Order-Management-System-with-AWS-and-CI-CD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS credentials and configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# SNS Topics
SNS_ORDER_CREATED_TOPIC=arn:aws:sns:region:account:order-created
SNS_ORDER_UPDATED_TOPIC=arn:aws:sns:region:account:order-updated

# S3 Configuration
S3_BUCKET_NAME=your-invoice-bucket
S3_REGION=us-east-1

# API Configuration
API_BASE_URL=http://localhost:3000
```

## 🏗️ Architecture

### Frontend Architecture
- **Component-based**: Modular, reusable components
- **State Management**: React hooks for local state
- **Routing**: Client-side routing with React Router
- **Styling**: Utility-first CSS with Tailwind

### Backend Architecture
- **RESTful API**: Express.js with TypeScript
- **Serverless**: AWS Lambda functions
- **File Storage**: AWS S3 for invoice uploads
- **Notifications**: AWS SNS for real-time updates

### CI/CD Pipeline
1. **Code Push**: Triggers GitHub Actions
2. **Testing**: Automated tests and linting
3. **Build**: Production build generation
4. **Deploy**: Automatic deployment to Netlify

## 📱 Features in Detail

### Order Management
- Create new orders with customer details
- Upload PDF invoices with drag-and-drop
- Real-time order status updates
- Order history and search

### User Interface
- Dark/light theme toggle
- Responsive design for all devices
- Intuitive navigation
- Loading states and error handling

### File Upload
- Drag-and-drop PDF upload
- File validation and size limits
- Progress indicators
- Error handling for failed uploads

## 🔒 Security

- Input validation and sanitization
- File type restrictions
- Environment variable protection
- HTTPS enforcement in production

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables in Netlify dashboard
4. Deploy automatically on push to main branch

### AWS Deployment
1. Configure AWS credentials
2. Deploy Lambda functions
3. Set up S3 bucket for file storage
4. Configure SNS topics
5. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Vite](https://vitejs.dev/) for fast build tooling
- [AWS](https://aws.amazon.com/) for cloud services

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact: [Your Email]
- Documentation: [Link to docs]

---

**Built with ❤️ using modern web technologies** 