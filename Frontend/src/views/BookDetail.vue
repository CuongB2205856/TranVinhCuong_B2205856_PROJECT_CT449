<template>
  <v-container class="max-w-4xl mx-auto py-12">
    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <div v-if="isLoading" class="text-center">
      <v-progress-circular
        indeterminate
        color="#5865f2"
        size="64"
      ></v-progress-circular>
      <p class="mt-3">Đang tải chi tiết sách...</p>
    </div>

    <v-card v-else-if="book" class="pa-6 border rounded-xl shadow-lg">
      <v-row>
        <v-col cols="12" md="4" class="text-center">
          <v-img
            :src="
              book.anh_bia ||
              'https://placehold.co/300x450/cccccc/333333?text=No+Cover'
            "
            aspect-ratio="2/3"
            class="rounded-lg mx-auto"
            max-width="280"
          ></v-img>
        </v-col>

        <v-col cols="12" md="8">
          <h2 class="text-3xl font-weight-bold mb-2 text-gray-900">
            {{ book.TenSach }}
          </h2>
          <p class="text-lg text-gray-600 mb-4">
            Tác giả: <span class="font-weight-medium">{{ book.TacGia }}</span>
          </p>

          <v-divider class="my-4"></v-divider>

          <v-list density="compact">
            <v-list-item>
                <v-list-item-title class="font-weight-medium">Mã sách:</v-list-item-title>
                <v-list-item-subtitle>{{ book._id }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title class="font-weight-medium">Nhà xuất bản:</v-list-item-title>
                <v-list-item-subtitle>
                    {{ book.NXB?.TenNXB }} ({{ book.NamXuatBan }})
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title class="font-weight-medium">Đơn giá:</v-list-item-title>
                <v-list-item-subtitle>
                    {{ formatCurrency(book.DonGia) }}
                </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <div class="d-flex align-center justify-space-between mt-4">
            <div class="text-xl font-weight-bold">
              Tồn kho:
              <span
                :class="{
                  'text-red-600': book.SoQuyen <= 1,
                  'text-green-600': book.SoQuyen > 1,
                }"
              >
                {{ book.SoQuyen }} quyển
              </span>
            </div>

            <v-btn
              color="primary"
              size="large"
              @click="handleBorrow"
              :disabled="book.SoQuyen <= 0 || !isAuthenticated"
              class="font-weight-bold"
            >
              <v-icon left>mdi-book-plus-multiple</v-icon>
              Mượn Sách
            </v-btn>
          </div>

          <p v-if="!isAuthenticated" class="text-sm text-red-500 mt-2">
            Vui lòng đăng nhập để mượn sách.
          </p>
        </v-col>
      </v-row>
    </v-card>

    <p v-else class="text-center text-red-500 text-xl">
      Không tìm thấy sách này.
    </p>
  </v-container>
</template>

<script>
// SỬA IMPORT
import BookService from "@/services/Book.service";
import BorrowingService from "@/services/Borrowing.service";

export default {
  name: "BookDetail",
  props: ["id"],
  data() {
    return {
      book: null,
      isLoading: true,
      error: null,
    };
  },
  computed: {
    isAuthenticated() {
      return !!sessionStorage.getItem("token");
    },
  },
  methods: {
    async fetchBookDetails() {
      this.isLoading = true;
      this.error = null;
      try {
        const bookId = this.$route.params.id;
        // Gọi hàm getBookById
        const data = await BookService.getBookById(bookId);
        this.book = data;
      } catch (err) {
        this.error = "Không thể tải chi tiết sách.";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async handleBorrow() {
      if (!this.isAuthenticated) {
        if (
          confirm(
            "Bạn cần đăng nhập để mượn sách. Đi đến trang đăng nhập ngay?"
          )
        ) {
          this.$router.push("/login");
        }
        return;
      }

      const userData = JSON.parse(sessionStorage.getItem("user"));
      // Backend trả về _id cho user (Reader)
      const readerId = userData ? userData._id : null;

      if (!readerId) {
        this.error = "Lỗi xác thực người dùng.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        // Gọi createBorrowing(BookId, ReaderId)
        // Lưu ý: this.book._id là BookId
        await BorrowingService.createBorrowing(this.book._id, readerId);

        alert(`✅ Mượn sách thành công!`);
        await this.fetchBookDetails();
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Lỗi hệ thống.";
        this.error = `Thất bại: ${errorMessage}`;
      } finally {
        this.isLoading = false;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
  created() {
    this.fetchBookDetails();
  },
};
</script>