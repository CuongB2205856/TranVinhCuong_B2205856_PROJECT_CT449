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
    name: "AdminArea",
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ["Admin"] },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard", // Chuyển hướng mặc định vào dashboard
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;