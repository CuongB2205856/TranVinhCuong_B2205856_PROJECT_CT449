// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import BooksPage from "../views/BookCatalog.vue";
import BookDetail from "../views/BookDetail.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
