# 🎬 Movie Vision
Movie Vision is a smart movie recommendation platform designed to help users find the perfect movie based on their mood. By answering a few simple questions, users get personalized movie suggestions. The platform also allows users to search for movies and web series, explore popular movies, web series, and anime, and save movies to a 'Watch Later' list after signing in.

With an intuitive UI and real-time data fetching from TMDB, Movie Vision makes discovering and organizing your favorite movies effortless.

## 🚀 Features

- **Mood-Based Recommendations**: Get personalized movie suggestions by answering questions.
- **Search Functionality**: Find movies and web series easily.
- **Watch Later Section**: Save movies and web series after logging in.
- **Popular Content**: Discover trending movies, web series, and anime.
- **User Authentication**: Secure login and account management.
- **Fully Responsive**: Optimized for all devices.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase/Auth
- **API**: TMDB API

## 🎨 Installation & Setup

Follow these steps to install and run the project locally:

### 1️⃣ Clone the Repository
```
 git clone https://github.com/Kunal182001/Movie_Vision.git
 cd moive
```

### 2️⃣ Install Dependencies
```
 npm install
```

### 3️⃣ Install Tailwind CSS 4.0
```
 npm install tailwindcss @tailwindcss/vite
```

### 4️⃣ Configure Tailwind CSS in Vite
Edit **vite.config.js** and add the Tailwind plugin:
js
```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### 5️⃣ Import Tailwind CSS
In **index.css** or your main CSS file, add:
css
```
@import "tailwindcss";
```

###  Create a .env File
Add the following environment variables:
```
VITE_SERVER_API=https://movie-vision-server.onrender.com
VITE_TMDB_API_KEY=your_tmdb_api_key
```
### 6️⃣ Run the Project
```
 npm run dev
```
## 📁 Folder Structure

```
Movie_Vision/
├── public/            # Static files
├── src/
│   ├── assets/        # Images and icons
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── App.js         # Main application entry
│   └── index.js       # Root file
└── README.md          # Documentation
```

## 📌 Live Preview

Check out the live site **[here](https://movie-vision-01.vercel.app/)**.

## 📝 License

This project is **open-source**. Feel free to use it, but please credit the repository if you do.

