// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import BooksPage from "../views/BookCatalog.vue";
import BookDetail from "../views/BookDetail.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AdminLogin from "../views/AdminLogin.vue";
import AdminLayout from "../components/Admin/AdminLayout.vue";
import AdminCatalog from "../views/AdminCatalog.vue";

const routes = [
  {
    path: "/books",
    name: "BooksPage",
    component: BooksPage,
  },
  {
    path: "/books/:id",
    name: "BookDetail",
    component: BookDetail,
    props: true, // ⚠️ Quan trọng: Cho phép truyền tham số URL (:id) vào props của component
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register", // Sửa path này nếu bạn đang dùng path /register cho đăng ký độc giả
    name: "Register",
    component: Register,
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/admin",
    name: "AdminArea",
    component: AdminLayout, // Sử dụng Layout riêng
    meta: { requiresAuth: true, roles: ['Admin'] },
    children: [
      {
        path: '', // Đường dẫn rỗng (tức là /admin)
        redirect: '/admin/login', // Redirect tới trang login Admin
      },
      // KHU VỰC BẮT BUỘC ĐĂNG NHẬP SAU KHI LOGIN:
      {
        path: "dashboard", // /admin/dashboard
        name: "AdminDashboard",
        component: AdminCatalog,
        meta: { requiresAuth: true, roles: ['Admin'] }, // ⬅️ ĐẶT meta: { requiresAuth: true } Ở CÁC ROUTE CON CẦN BẢO VỆ
      },
    ],
  } ,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
