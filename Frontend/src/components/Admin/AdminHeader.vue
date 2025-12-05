<template>
  <v-app-bar app color="red-darken-3" dark elevation="4">
    <v-toolbar-title class="font-weight-bold text-xl ml-4">
      <v-icon class="mr-2">mdi-lock</v-icon>
      Quản Trị
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn text to="/admin/dashboard" class="font-weight-medium">
      Thống kê
    </v-btn>

    <v-btn text to="/admin/books" class="font-weight-medium">
      Sách
    </v-btn>

    <v-btn text to="/admin/publishers" class="font-weight-medium">
      NXB
    </v-btn>
    
    <v-btn text to="/admin/borrowings" class="font-weight-medium">
      Mượn Trả
    </v-btn>

    <v-btn text to="/admin/staffs" class="font-weight-medium">
      <v-icon start>mdi-account-group</v-icon>
      Nhân Sự
    </v-btn>
    <v-btn color="white" variant="outlined" class="ml-4 font-weight-medium" @click="logout">
      Đăng Xuất
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AdminHeader",
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/admin/login");
    },
  },
};
</script>