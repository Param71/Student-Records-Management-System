# 🎓 SAKEC ECS-1 Student Records Manager

> **DSA MicroProject By Roll No.: 10, 31, 68 | Topic: AVL Tree**

A Student Records Management System built with **HTML**, **CSS**, **JavaScript**, and **C** to implement various Data Structures and Algorithm (DSA) concepts — specially **AVL Trees**.

---

## 📸 Screenshots

### 🏠 Home Page
The main dashboard with Student Management panel on the left and Student Records display on the right.

![Home Page](screenshots/home-page.png)

### ✅ Add Student Success
A success toast notification appears when a student record is added successfully.

![Add Student Success](screenshots/add-student-success.png)

### 🔍 Search & Delete
Search students by roll number, delete records, and search by name pattern. Individual search results are displayed on the right panel.

![Search and Delete](screenshots/search-and-delete.png)

### 📊 Sorted View
View all student records sorted in order (Inorder traversal of AVL Tree) with details like Roll Number, GPA, and Grade.

![Sorted View](screenshots/sorted-view.png)

---

## ✨ Features

- **Add / Update Student** — Enter Roll Number, Student Name, and GPA to add or update a student record
- **Search by Roll Number** — Quickly find a student using their roll number
- **Delete Student** — Remove a student record by roll number
- **Name Search** — Search students by name pattern
- **GPA Range Filter** — Filter students within a minimum and maximum GPA range
- **Sorted View (Inorder)** — View all records sorted using AVL Tree inorder traversal
- **Level Order View** — View records in level order traversal of the AVL Tree
- **Statistics** — View statistics about the student records
- **Auto Grade Assignment** — Grades (A+, A, B, etc.) are automatically assigned based on GPA

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML** | Structure and layout of the web interface |
| **CSS** | Styling and responsive design |
| **JavaScript** | AVL Tree implementation, DOM manipulation, and application logic |
| **C** | Backend DSA implementation of AVL Tree operations |

---

## 📁 Project Structure

```
Student-Records-Management-System/
├── index.html                    # Main HTML page
├── styles.css                    # Stylesheet for the UI
├── script.js                     # JavaScript — AVL Tree logic & interactivity
├── DsaMicroProject_65,66,68.c    # C implementation of AVL Tree
├── screenshots/                  # Application screenshots
│   ├── home-page.png
│   ├── add-student-success.png
│   ├── search-and-delete.png
│   └── sorted-view.png
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Param71/Student-Records-Management-System.git
   ```

2. **Open the application**
   - Simply open `index.html` in your web browser

3. **For the C implementation**
   ```bash
   gcc DsaMicroProject_65,66,68.c -o student_records
   ./student_records
   ```

---

## 📚 DSA Concepts Used

- **AVL Tree** — Self-balancing Binary Search Tree for efficient student record management
- **Inorder Traversal** — For displaying sorted student records
- **Level Order Traversal** — For breadth-first display of records
- **Search Operations** — Efficient O(log n) search in AVL Tree
- **Insertion & Deletion** — With automatic rebalancing via rotations

---

## 👥 Team Members

| Roll No. | Contribution |
|----------|-------------|
| 10 | DSA MicroProject |
| 31 | DSA MicroProject |
| 68 | DSA MicroProject |

---

## 📄 License

This project is part of an academic microproject for SAKEC ECS-1.

---

<p align="center">Made with ❤️ for DSA MicroProject</p>
