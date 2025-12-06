<template>
  <v-container class="d-flex flex-column justify-center align-center h-100vh text-center">
    <div class="mb-6">
      <v-icon size="120" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
    </div>
    
    <h1 class="text-h2 font-weight-bold text-primary mb-2">404</h1>
    <h2 class="text-h5 font-weight-medium text-grey-darken-1 mb-6">
      Không tìm thấy trang bạn yêu cầu
    </h2>
    
    <p class="text-body-1 text-grey mb-8 max-w-md">
      Có vẻ như đường dẫn này không tồn tại hoặc đã bị xóa. 
      Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
    </p>

    <div class="d-flex gap-4">
      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-home"
        :to="homePath"
        elevation="2"
      >
        Về Trang Chủ
      </v-btn>
      
      <v-btn
        variant="outlined"
        color="primary"
        size="large"
        @click="$router.go(-1)"
      >
        Quay Lại
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "NotFound",
  computed: {
    homePath() {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Kiểm tra: Nếu user có thuộc tính 'Chucvu' thì là Nhân viên/Admin
          if (user.Chucvu) {
            return "/admin/dashboard";
          }
        } catch (e) {
          // Phòng trường hợp JSON lỗi
          return "/";
        }
      }
      // Mặc định cho Khách vãng lai hoặc Độc giả (không có Chucvu)
      return "/";
    }
  }
};
</script>

<style scoped>
.h-100vh {
  height: 80vh; 
}
.max-w-md {
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}
.gap-4 {
  gap: 16px;
}
</style>