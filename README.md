# HopeSchoolHub 🎓

**HopeSchoolHub** is a fullstack web application built for a private school in Myanmar to modernize and digitize their traditional paper-based system. Students and teachers can now submit online applications, and the school admin can easily manage everything from a beautiful, responsive dashboard.

---

## 🌟 Features

- 🔐 **Admin Login + Guest Mode** (Guest can only view limited data)
- 🧑‍🎓 Add, Edit, View Students (Full CRUD)
- 🧑‍🏫 Add, Edit, View Teachers
- 📄 Online Application Forms (for both students and teachers)
- ✅ Application Approval & Rejection Panel
- 💸 Monthly Fee Tracker with Status (Paid / Unpaid)
- 👀 Protected Fields in Guest Mode (like contact info, address, etc.)
- 🔍 Search, Sort & Filter Students
- 📱 Fully Responsive UI

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: [Appwrite](https://appwrite.io/) (Database, Auth, Storage)
- **Icons**: Lucide
- **State & Forms**: React Hook Form, Zod
- **Design System**: Custom ShadCN UI

---

## 💡 The Hardest Part

The most challenging part was implementing the **Monthly Fee Tracker**. Appwrite doesn't support large array fields, so instead of saving an array of payments in the student document, I created a **separate collection** for monthly payments. Each payment links to its student ID, which solved the size limit and made tracking more scalable 💪

---

## 📸 Demo

[🎥 Click here to watch the demo](https://hopeschoolhub-myanmar.vercel.app/login)

---

## 🚀 Project Status

✅ Completed and deployed for a private school in Myanmar  
🧑‍💻 Built completely by me as a freelance project after graduating from **TripleTen**  
🫶 Big thanks to TripleTen for helping me become a software engineer and build real-world apps

---

## 📂 Setup & Run Locally

1.  Clone the repo:
    ```bash
    git clone https://github.com/SawSimonLinn/hopeschoolhub
    ```
2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up .env.local:

    ```bash
    NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_url
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_db_id
    NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID=your_students_collection_id
    NEXT_PUBLIC_APPWRITE_TEACHERS_COLLECTION_ID=your_teachers_collection_id
    NEXT_PUBLIC_APPWRITE_MONTHLY_PAYMENTS_COLLECTION_ID=your_monthly_payments_id
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=adminpassword
    ```

4.  Run the dev server:

        ``` bash
        npm run dev
        ```

## 📧 Contact

    If you have questions or would like to collaborate, feel free to connect with me on LinkedIn

Made with love, late nights, and lots of coffee ☕ by Simon Linn
