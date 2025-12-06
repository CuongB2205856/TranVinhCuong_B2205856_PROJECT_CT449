<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4 text-center">
        <div class="animate-bounce text-red-600 text-8xl font-extrabold drop-shadow-lg">
            404
        </div>
        <h1 class="text-3xl font-bold mt-4">Oops! Trang không tồn tại.</h1>
        <p class="mt-2 text-gray-600">
            Có vẻ như bạn đã truy cập một liên kết không hợp lệ hoặc trang đã bị xóa.
        </p>
        <router-link to="/" class="mt-6 inline-block px-6 py-3 bg-black text-white rounded-lg shadow-md">
            Quay về trang chủ
        </router-link>
    </div>
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