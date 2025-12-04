<template>
  <div class="home-page">
    <section class="hero-section text-white d-flex align-center">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="text-4xl md:text-5xl font-weight-bold mb-4 animate__animated animate__fadeInLeft">
              Thư Viện Trực Tuyến <br />
              <span class="text-yellow-300">CT449</span>
            </h1>
            <p class="text-lg md:text-xl mb-6 text-gray-100">
              Khám phá kho tàng tri thức khổng lồ với hàng ngàn đầu sách hấp dẫn.
              Mượn sách dễ dàng, quản lý thuận tiện ngay tại nhà.
            </p>
            <div class="d-flex gap-4">
              <v-btn
                color="white"
                class="text-primary font-weight-bold"
                size="large"
                to="/books"
                elevation="2"
              >
                <v-icon left>mdi-magnify</v-icon>
                Tìm Sách Ngay
              </v-btn>
              
              <v-btn
                v-if="!isLoggedIn"
                variant="outlined"
                color="white"
                class="font-weight-bold"
                size="large"
                to="/register"
              >
                Đăng Ký Thành Viên
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-center hidden-sm-and-down">
            <v-img
              src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
              max-height="400"
              contain
              class="animate__animated animate__fadeInRight"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-12 bg-white">
      <v-container>
        <div class="text-center mb-10">
          <h2 class="text-3xl font-weight-bold text-gray-800">Tại Sao Chọn Chúng Tôi?</h2>
          <v-divider class="mx-auto my-4 w-24 border-primary border-opacity-100" thickness="3"></v-divider>
        </div>
        
        <v-row>
          <v-col cols="12" md="4" class="text-center px-4">
            <v-card class="py-6 px-4 h-100 shadow-sm hover:shadow-lg transition-all" elevation="0">
              <v-icon size="64" color="#5865f2" class="mb-4">mdi-book-open-page-variant</v-icon>
              <h3 class="text-xl font-weight-bold mb-2">Đầu Sách Đa Dạng</h3>
              <p class="text-gray-600">Cập nhật liên tục các giáo trình, sách tham khảo và văn học mới nhất.</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="text-center px-4">
            <v-card class="py-6 px-4 h-100 shadow-sm hover:shadow-lg transition-all" elevation="0">
              <v-icon size="64" color="#5865f2" class="mb-4">mdi-clock-fast</v-icon>
              <h3 class="text-xl font-weight-bold mb-2">Mượn Trả Nhanh Chóng</h3>
              <p class="text-gray-600">Quy trình mượn sách được số hóa hoàn toàn, tiết kiệm thời gian cho bạn.</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="text-center px-4">
            <v-card class="py-6 px-4 h-100 shadow-sm hover:shadow-lg transition-all" elevation="0">
              <v-icon size="64" color="#5865f2" class="mb-4">mdi-account-group</v-icon>
              <h3 class="text-xl font-weight-bold mb-2">Hỗ Trợ 24/7</h3>
              <p class="text-gray-600">Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của độc giả.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-12 bg-gray-50">
      <v-container>
        <div class="d-flex justify-space-between align-center mb-8">
          <h2 class="text-2xl md:text-3xl font-weight-bold text-gray-800">
            <v-icon color="#5865f2" class="mr-2">mdi-star</v-icon>
            Sách Mới Cập Nhật
          </h2>
          <v-btn variant="text" color="#5865f2" to="/books" append-icon="mdi-arrow-right">
            Xem tất cả
          </v-btn>
        </div>

        <div v-if="isLoading" class="text-center py-10">
          <v-progress-circular indeterminate color="#5865f2" size="64"></v-progress-circular>
        </div>

        <v-row v-else>
          <v-col 
            v-for="book in featuredBooks" 
            :key="book._id" 
            cols="12" sm="6" md="4" lg="3"
          >
            <BookCard :book="book" />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section v-if="!isLoggedIn" class="py-16 bg-primary text-white text-center">
      <v-container>
        <h2 class="text-3xl font-weight-bold mb-4">Bạn chưa có tài khoản?</h2>
        <p class="text-lg mb-8 opacity-90">Đăng ký ngay để trải nghiệm đầy đủ các tính năng của thư viện.</p>
        <v-btn 
          color="white" 
          variant="elevated" 
          size="x-large" 
          class="text-primary font-weight-bold px-8"
          to="/register"
        >
          Đăng Ký Miễn Phí
        </v-btn>
      </v-container>
    </section>
  </div>
</template>

<script>
import BookService from "@/services/Book.service"; //
import BookCard from "@/components/Bookcard.vue"; //

export default {
  name: "HomePage",
  components: {
    BookCard,
  },
  data() {
    return {
      isLoading: true,
      featuredBooks: [],
      isLoggedIn: false,
    };
  },
  methods: {
    async fetchFeaturedBooks() {
      try {
        // Lấy tất cả sách và chỉ lấy 4 cuốn đầu tiên để hiển thị ở trang chủ
        const books = await BookService.getAllBooks();
        this.featuredBooks = books.slice(0, 4); 
      } catch (error) {
        console.error("Lỗi khi tải sách nổi bật:", error);
      } finally {
        this.isLoading = false;
      }
    },
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("token");
    }
  },
  created() {
    this.fetchFeaturedBooks();
    this.checkLoginStatus();
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
  min-height: 500px;
  position: relative;
  overflow: hidden;
}

/* Thêm một chút họa tiết nền (tùy chọn) */
.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.text-primary {
  color: #5865f2 !important;
}

.bg-primary {
  background-color: #5865f2 !important;
}
</style>