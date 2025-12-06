<template>
  <div class="admin-layout h-100">
    <AdminHeader @toggle-drawer="drawer = !drawer" />

    <v-navigation-drawer v-model="drawer" color="white" elevation="1">
      <div
        class="d-flex flex-column align-center py-6 text-white"
      >
        <v-icon size="64" class="mb-2 text-black">mdi-shield-account</v-icon>
      </div>

      <v-divider></v-divider>

      <v-list density="compact" nav class="mt-2">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="black" 
          rounded="xl"
          class="mb-1 font-weight-medium"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div
      class="bg-grey-lighten-4 h-100 pa-6"
      style="min-height: 100vh; padding-top: 80px"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import AdminHeader from "./AdminHeader.vue";

export default {
  name: "AdminLayout",
  components: { AdminHeader },
  data() {
    return {
      drawer: true,
      userRole: "",
    };
  },
  computed: {
    items() {
      const allItems = [
        {
          title: "Thống Kê",
          icon: "mdi-view-dashboard",
          to: "/admin/dashboard",
        },
        {
          title: "Quản Lý Sách",
          icon: "mdi-book-open-page-variant",
          to: "/admin/books",
        },
        { title: "Nhà Xuất Bản", icon: "mdi-domain", to: "/admin/publishers" },
        {
          title: "Mượn Trả Sách",
          icon: "mdi-swap-horizontal-bold",
          to: "/admin/borrowings",
        },
        {
          title: "Quản Lý Độc Giả",
          icon: "mdi-account",
          to: "/admin/readers",
        },
        {
          title: "Quản Lý Nhân Sự",
          icon: "mdi-account-group",
          to: "/admin/staffs",
          role: "Admin",
        },
      ];

      return allItems.filter(
        (item) => !item.role || item.role === this.userRole
      );
    },
  },
  created() {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userRole = user.Chucvu;
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>