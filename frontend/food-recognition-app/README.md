# **CaloriSee Frontend**  
_Your AI-Powered Meal Tracking Solution_

CaloriSee is a modern web application designed to simplify meal tracking. With AI-powered food detection, users can upload meal photos and instantly receive detailed nutritional information.

---

## **Features**  
- **AI-Powered Food Detection:** Upload a meal photo, and the app detects food items using YOLOv5.  
- **Instant Nutritional Insights:** Provides calorie, protein, carbs, and fat breakdown.  
- **Daily Logs:** Tracks meals by categories (Breakfast, Lunch, Dinner, Snack) with calorie goals.  
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.  

---

## **Tech Stack**  
### **Frontend**  
- **React** (Vite + TypeScript)  
- **React Router** for navigation  
- **React Bootstrap** for UI components  
- **Axios** for API requests  
- **Context API** for authentication  
- **CSS Modules** for styling  

---

## **Installation and Setup**  
### **Prerequisites**  
- Node.js (v16+ recommended)  
- npm or yarn  

### **Clone the Repository**  
```bash
git clone git@github.com:thapelomagqazana/food-snap.git
cd food-snap/frontend/food-recognition-app/
```

### **Install Dependencies**  
```bash
npm install
# or
yarn install
```

### **Run the Development Server**  
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### **Build for Production**  
```bash
npm run build
# or
yarn build
```

---

## **Environment Variables**  
Create a `.env` file in the root directory with the following variables:

```bash
VITE_API_URL=https://your-api-url.com
```

---

## **Folder Structure**  
```plaintext
src
├── components
│   ├── BottomNav.tsx         // Bottom navigation bar
│   ├── DailyLogsScreen.tsx   // Daily logs screen
│   ├── ResultsScreen.tsx     // Displays AI results and nutritional info
│   ├── SignInSignUp.tsx      // Sign in and sign up form
│   ├── SplashScreen.tsx      // Initial splash screen
│   └── RegistrationScreen.tsx// User registration form
├── context
│   └── AuthContext.tsx       // Authentication context for managing user state
├── styles
│   ├── BottomNav.css
│   ├── DailyLogsScreen.css
│   ├── ResultsScreen.css
│   └── SignInSignUp.css
├── App.tsx                   // Main app component
├── main.tsx                  // Entry point
└── index.html                // HTML template
```

---

## **Deployment**  
1. Build the app using `npm run build`.  
2. Deploy the `dist` folder using a hosting service like **Vercel**, **Netlify**, or **Railway**.

---

## **Demo**  
Try the live demo here: [Live Demo Link](https://calorisee.up.railway.app)

---

## **Contributing**  
Contributions are welcome! Please fork the repository and create a pull request.

---

## **License**  
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**  
For any queries, feel free to reach out:  
Follow me on [LinkedIn](www.linkedin.com/in/thapelo-magqazana-90632a174).

---

