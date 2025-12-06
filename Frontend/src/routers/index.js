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
      // 2. THÊM ROUTE NHÂN VIÊN VÀO ĐÂY
      {
        path: "staffs",
        name: "AdminStaffs",
        component: AdminStaff,
        // Route này tự động được bảo mật nhờ settings của route cha "/admin"
        // Chỉ Admin mới truy cập được.
      },
      // Thêm vào children của route /admin
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

// --- PHẦN QUAN TRỌNG: NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // 1. Lấy thông tin đăng nhập từ sessionStorage
  const token = sessionStorage.getItem("token");
  const userStr = sessionStorage.getItem("user");
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
