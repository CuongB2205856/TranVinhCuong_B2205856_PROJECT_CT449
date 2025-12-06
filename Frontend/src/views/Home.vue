<template>
    <div class="home-page bg-white">
        <section class="text-center py-16 bg-grey-lighten-5">
            <v-container>
                <h1 class="text-h3 md:text-h2 font-weight-bold text-black mb-4">
                    Chào mừng bạn đến với <br class="d-md-none" /> Thư viện Trực Tuyến
                </h1>
                <p class="text-grey-darken-2 text-subtitle-1 mb-6 max-w-2xl mx-auto">
                    Khám phá kho tàng tri thức khổng lồ với hàng ngàn đầu sách hấp dẫn.
                    Mượn sách dễ dàng, giao sách tận nơi.
                </p>
                <div class="mb-12">
                    <v-btn to="/books" color="black" size="x-large" class="px-8 text-white elevation-4" rounded="pill">
                        Khám phá ngay
                        <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                    </v-btn>
                </div>
                
                <BookSlider />
            </v-container>
        </section>

        <section class="py-16">
            <v-container class="text-center">
                <h3 class="text-h4 font-weight-bold mb-10">✨ Tại sao chọn chúng tôi?</h3>
                <v-row>
                    <v-col v-for="(feature, i) in features" :key="i" cols="12" sm="6" md="4">
                        <v-card class="pa-6 h-100 elevation-2 rounded-xl transition-swing hover:elevation-8 cursor-pointer">
                            <v-avatar color="grey-lighten-4" size="80" class="mb-4">
                                <v-icon size="40" color="black">{{ feature.icon }}</v-icon>
                            </v-avatar>
                            <h4 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h4>
                            <p class="text-body-2 text-grey-darken-1">{{ feature.description }}</p>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <section class="py-16 bg-grey-lighten-5">
            <v-container>
                <div class="d-flex justify-space-between align-center mb-8">
                    <h2 class="text-h4 font-weight-bold">📖 Sách nổi bật</h2>
                    <v-btn variant="text" to="/books" color="black" append-icon="mdi-arrow-right">Xem tất cả</v-btn>
                </div>

                <v-row>
                    <v-col v-for="book in featuredBooks" :key="book._id" cols="12" sm="6" md="3">
                        <BookCard :book="book" />
                    </v-col>
                </v-row>
                
                <div v-if="isLoading" class="text-center py-10">
                    <v-progress-circular indeterminate color="black"></v-progress-circular>
                </div>
            </v-container>
        </section>

        <section class="py-16">
            <v-container>
                <h3 class="text-center text-h4 font-weight-bold mb-10">🗣️ Người dùng nói gì?</h3>
                <v-row justify="center">
                    <v-col v-for="(item, i) in testimonials" :key="i" cols="12" md="4">
                        <v-card class="pa-6 rounded-xl elevation-2 h-100 bg-grey-lighten-5 border-thin">
                            <div class="d-flex align-center mb-4">
                                <v-avatar color="black" size="48" class="mr-3">
                                    <span class="text-white font-weight-bold">{{ item.name.charAt(0) }}</span>
                                </v-avatar>
                                <div>
                                    <div class="font-weight-bold text-subtitle-1">{{ item.name }}</div>
                                    <div class="text-caption text-grey">{{ item.role }}</div>
                                </div>
                            </div>
                            <v-icon color="grey-lighten-1" class="mb-2">mdi-format-quote-open</v-icon>
                            <p class="font-italic text-grey-darken-3">"{{ item.comment }}"</p>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <section class="py-16">
            <v-container>
                <v-card color="black" dark class="rounded-xl pa-10 text-center elevation-10">
                    <h2 class="text-h4 font-weight-bold text-white mb-4">📥 Bắt đầu hành trình đọc sách của bạn</h2>
                    <p class="text-grey-lighten-1 mb-8 text-lg">Chỉ với vài bước đơn giản, bạn đã có thể mượn sách trực tuyến miễn phí.</p>
                    <v-btn 
                        v-if="!isLoggedIn" 
                        to="/register" 
                        color="white" 
                        class="text-black font-weight-bold px-8" 
                        size="large" 
                        rounded="pill"
                    >
                        Đăng ký thành viên ngay
                    </v-btn>
                    <v-btn 
                        v-else 
                        to="/books" 
                        color="white" 
                        class="text-black font-weight-bold px-8" 
                        size="large" 
                        rounded="pill"
                    >
                        Mượn sách ngay
                    </v-btn>
                </v-card>
            </v-container>
        </section>
    </div>
</template>

<script>
import BookService from "@/services/Book.service";
import BookCard from "@/components/Bookcard.vue";
import BookSlider from "@/components/BookSlider.vue"; // Sử dụng lại slider của bạn

export default {
    name: "HomePage",
    components: {
        BookCard,
        BookSlider,
    },
    data() {
        return {
            isLoading: false,
            featuredBooks: [],
            isLoggedIn: false,
            // Dữ liệu giả cho phần Features
            features: [
                { icon: 'mdi-truck-fast', title: 'Giao sách tận nơi', description: 'Dịch vụ vận chuyển nhanh chóng, tiện lợi ngay tại nhà.' },
                { icon: 'mdi-book-open-page-variant', title: 'Kho sách phong phú', description: 'Hơn 10.000 đầu sách đa dạng thể loại cập nhật liên tục.' },
                { icon: 'mdi-account-group', title: 'Cộng đồng yêu sách', description: 'Nơi giao lưu, chia sẻ đam mê và review sách chất lượng.' }
            ],
            // Dữ liệu giả cho phần Testimonials
            testimonials: [
                { name: 'Nguyễn Văn A', role: 'Sinh viên ĐH Cần Thơ', comment: 'Dịch vụ rất tốt, sách mới và sạch sẽ! Tôi đã tìm được rất nhiều tài liệu quý.' },
                { name: 'Trần Thị B', role: 'Giáo viên', comment: 'Giao diện web rất dễ sử dụng. Việc mượn sách trở nên đơn giản hơn bao giờ hết.' },
                { name: 'Lê Hoàng C', role: 'Lập trình viên', comment: 'Rất thích tính năng đặt lịch mượn sách online. Tiết kiệm được rất nhiều thời gian.' }
            ]
        };
    },
    methods: {
        async fetchFeaturedBooks() {
            this.isLoading = true;
            try {
                // Lấy sách và hiển thị 4 cuốn mới nhất/nổi bật
                const books = await BookService.getAllBooks();
                this.featuredBooks = books.slice(0, 4); 
            } catch (error) {
                console.error("Lỗi khi tải sách:", error);
            } finally {
                this.isLoading = false;
            }
        },
        checkLoginStatus() {
            this.isLoggedIn = !!sessionStorage.getItem("token");
        }
    },
    created() {
        this.fetchFeaturedBooks();
        this.checkLoginStatus();
    },
};
</script>

<style scoped>
/* Hiệu ứng hover cho card */
.v-card.transition-swing {
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>