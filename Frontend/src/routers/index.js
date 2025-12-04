// src/routers/index.js
import { createRouter, createWebHistory } from "vue-router";

// Import các Components
import HomePage from "../views/Home.vue";
import BooksPage from "../views/BookCatalog.vue";
import BookDetail from "../views/BookDetail.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AdminLogin from "../views/AdminLogin.vue";
import AdminLayout from "../components/Admin/AdminLayout.vue";
import AdminCatalog from "../views/AdminCatalog.vue";
import Profile from "../views/Profile.vue";
import AdminPublisher from "../views/AdminPublisher.vue"; // Component NXB
import AdminStats from "../views/AdminStats.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/books",
    name: "BooksPage",
    component: BooksPage,
  },
  {
    path: "/books/:id",
    name: "BookDetail",
    component: BookDetail,
    props: true,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next("/login");
      }
    },
  },
  // --- ADMIN AREA ---
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ["Admin"] },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      // SỬA: Dashboard trỏ về AdminStats
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: AdminStats, // Component mới
        meta: { requiresAuth: true, roles: ["Admin"] },
      },
      // Thêm route riêng cho quản lý sách (Catalog)
      {
        path: "books",
        name: "AdminBooks",
        component: AdminCatalog,
        meta: { requiresAuth: true, roles: ["Admin"] },
      },
      // --- SỬA LẠI: Đưa route publishers vào trong children ---
      {
        path: "publishers", // Khi đó URL sẽ là /admin/publishers
        name: "AdminPublishers",
        component: AdminPublisher,
        meta: { requiresAuth: true, roles: ["Admin"] },
      },
      {
        path: "borrowings",
        name: "AdminBorrowings",
        component: () => import("../views/AdminBorrowing.vue"),
        meta: { requiresAuth: true, roles: ["Admin", "Thủ thư"] }, // Thêm quyền Thủ thư nếu có
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- PHẦN QUAN TRỌNG: NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // 1. Lấy thông tin đăng nhập từ LocalStorage
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Kiểm tra nếu route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !token) {
    // Nếu là route admin -> Chuyển về Admin Login
    if (to.path.startsWith("/admin")) {
      return next("/admin/login");
    }
    // Route thường -> Chuyển về Login độc giả
    return next("/login");
  }

  // 3. Kiểm tra quyền (Roles) cho Admin
  if (to.meta.requiresAuth && user) {
    // Xác định vai trò hiện tại (Staff có Chucvu, Reader thì không)
    const userRole = user.Chucvu || "Reader";

    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      // Đã đăng nhập nhưng không đủ quyền (VD: Độc giả vào trang Admin)
      alert("Bạn không có quyền truy cập trang này!");
      return next("/"); // Quay về trang chủ
    }
  }

  // 4. (Tuỳ chọn) Chặn người đã đăng nhập quay lại trang Login/Register
  if (
    token &&
    (to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/admin/login")
  ) {
    if (to.path.includes("admin") && !user.Chucvu) return next(); // Độc giả muốn vào admin login thì cho qua
    return next("/"); // Còn lại về trang chủ
  }

  next();
});

export default router;
