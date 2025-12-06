<template>
  <v-app-bar color="red-darken-3" dark elevation="2" style="z-index: 1000">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>

    <v-toolbar-title class="font-weight-bold text-xl ml-2">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-shield-crown</v-icon>
        Hệ Thống Quản Trị
      </div>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu min-width="200px" rounded offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2">
          <v-avatar color="white" size="40">
            <v-img
              v-if="adminUser.HinhAnh"
              :src="adminUser.HinhAnh"
              alt="Admin"
              cover
            ></v-img>
            <span v-else class="text-red-darken-3 font-weight-bold text-h6">
              {{ getInitials(adminUser.HoTenNV || adminUser.Ten) }}
            </span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card>
        <v-list-item class="px-4 pt-4 pb-2">
          <template v-slot:prepend>
            <v-avatar color="red-darken-3">
              <v-img
                v-if="adminUser.HinhAnh"
                :src="adminUser.HinhAnh"
                cover
              ></v-img>
              <span v-else class="text-white font-weight-bold">
                {{ getInitials(adminUser.HoTenNV || adminUser.Ten) }}
              </span>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold">{{
            adminUser.HoTenNV || "Admin"
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            adminUser.Chucvu || "Administrator"
          }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-account-cog"
            title="Hồ sơ cá nhân"
            to="/admin/profile"
            color="primary"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Đăng xuất"
            @click="logout"
            color="error"
          ></v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <div class="mr-4 ml-2 font-weight-medium hidden-sm-and-down cursor-pointer">
      {{ adminUser.HoTenNV || "Admin" }}
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "AdminHeader",
  emits: ["toggle-drawer"],
  data() {
    return {
      adminUser: {},
    };
  },
  methods: {
    loadUser() {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          this.adminUser = JSON.parse(userStr);
        } catch (e) {
          this.adminUser = {};
        }
      }
    },
    getInitials(name) {
      return name ? name.charAt(0).toUpperCase() : "A";
    },
    logout() {
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/admin/login");
      }
    },
  },
  mounted() {
    this.loadUser();
    // Lắng nghe sự kiện storage để cập nhật avatar nếu có thay đổi từ tab khác
    window.addEventListener("storage", this.loadUser);
  },
};
</script>
