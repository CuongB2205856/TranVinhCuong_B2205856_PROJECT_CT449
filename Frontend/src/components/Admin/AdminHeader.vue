<template>
  <v-app-bar color="black" dark elevation="1" style="z-index: 1000">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>

    <v-toolbar-title class="font-weight-bold text-xl ml-2">
      <div class="d-flex align-center">
        <span class="hidden-xs-only">Hệ Thống Quản Trị</span>
      </div>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu min-width="200px" rounded offset-y transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-btn 
            v-bind="props" 
            class="text-none px-2 ml-2" 
            height="48" 
            variant="text"
        >
            <v-avatar color="grey-darken-3" size="32" class="border border-white mr-2">
                <v-img
                    v-if="adminUser.HinhAnh"
                    :src="adminUser.HinhAnh"
                    alt="Admin"
                    cover
                ></v-img>
                <span v-else class="text-white font-weight-bold text-subtitle-2">
                    {{ getInitials(adminUser.HoTenNV || adminUser.Ten) }}
                </span>
            </v-avatar>

            <div class="d-flex flex-column align-start mr-1 hidden-sm-and-down">
                <span class="font-weight-bold text-body-2 text-white">
                    {{ adminUser.HoTenNV || "Admin" }}
                </span>
            </div>

            <v-icon size="small" color="grey-lighten-1">mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list-item class="px-4 pt-4 pb-2">
          <template v-slot:prepend>
            <v-avatar color="black">
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
            active-color="black"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-logout"
            title="Đăng xuất"
            @click="logoutDialog = true"
            class="text-red"
          ></v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-dialog v-model="logoutDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-bold pa-4">Xác nhận đăng xuất</v-card-title>
        <v-card-text class="pt-2 text-body-1 text-grey-darken-1">
          Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="logoutDialog = false"
            class="font-weight-bold"
          >
            Hủy
          </v-btn>
          <v-btn 
            color="red" 
            variant="elevated" 
            @click="confirmLogout"
            class="font-weight-bold px-4"
          >
            Đăng xuất
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app-bar>
</template>

<script>
export default {
  name: "AdminHeader",
  emits: ["toggle-drawer"],
  data() {
    return {
      adminUser: {},
      logoutDialog: false, // Biến điều khiển hiển thị dialog
    };
  },
  methods: {
    loadUser() {
      const userStr = sessionStorage.getItem("user");
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
    // Hàm thực hiện đăng xuất sau khi người dùng xác nhận trên Dialog
    confirmLogout() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      this.logoutDialog = false; // Đóng dialog
      this.$router.push("/admin/login");
    },
  },
  mounted() {
    this.loadUser();
    window.addEventListener("storage", this.loadUser);
  },
};
</script>