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
import NotFound from "../views/NotFound.vue";
import AdminStaff from "../views/AdminStaff.vue"; // Component Nhân viên
import AdminProfile from "../views/AdminProfile.vue"; // Component Hồ sơ nhân sự

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
      if (sessionStorage.getItem("token")) {
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
    meta: {hideHeader: true, hideFooter: true},
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ["Admin", "Thủ thư"] }, // Bảo mật cấp cha
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: AdminStats,
      },
      {
        path: "books",
        name: "AdminBooks",
        component: AdminCatalog,
      },
      {
        path: "publishers",
        name: "AdminPublishers",
        component: AdminPublisher,
      },
      {
        path: "borrowings",
        name: "AdminBorrowings",
        component: () => import("../views/AdminBorrowing.vue"),
      },
      {
        path: "readers",
        name: "AdminReaders",
        component: () => import("../views/AdminReader.vue"),
      },
      {
        path: "staffs",
        name: "AdminStaffs",
        component: AdminStaff,
      },
      {
        path: "profile",
        name: "AdminProfile",
        component: () => import("../views/AdminProfile.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- PHẦN QUAN TRỌNG: NAVIGATION GUARD (ĐÃ SỬA LỖI CRASH JSON) ---
router.beforeEach((to, from, next) => {
  // 1. Lấy thông tin đăng nhập từ sessionStorage
  const token = sessionStorage.getItem("token");
  const userStr = sessionStorage.getItem("user");
  
  // [FIX LỖI] Sử dụng try-catch để parse JSON an toàn
  let user = null;
  try {
      if (userStr && userStr !== "undefined") {
          user = JSON.parse(userStr);
      }
  } catch (e) {
      console.warn("Dữ liệu user bị lỗi, tiến hành reset session:", e);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      // Nếu dữ liệu lỗi, coi như chưa đăng nhập
      user = null;
  }

  // 2. Kiểm tra nếu route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !token) {
    if (to.path.startsWith("/admin")) {
      return next("/admin/login");
    }
    return next("/login");
  }

  // 3. Kiểm tra quyền (Roles) cho Admin
  if (to.meta.requiresAuth && user) {
    const userRole = user.Chucvu || "Reader";

    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      alert("Bạn không có quyền truy cập trang này!");
      return next("/");
    }
  }

  // 4. Chặn người đã đăng nhập quay lại trang Login/Register
  if (
    token && user &&
    (to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/admin/login")
  ) {
    if (to.path.includes("admin") && !user.Chucvu) return next();
    if (user.Chucvu) return next("/admin/dashboard");
    return next("/");
  }

  next();
});

export default router;