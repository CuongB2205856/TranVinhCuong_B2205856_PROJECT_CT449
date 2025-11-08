<template>
    <v-container class="max-w-6xl mx-auto py-12 bg-gray-100">
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Danh Mục Sách Thư Viện</h1>
        
        <!-- Header với tìm kiếm -->
        <v-row class="mb-8 items-center">
            <v-col cols="12" md="8" offset-md="2">
                <v-text-field v-model="searchQuery" 
                              label="Tìm kiếm theo Tên Sách hoặc Tác Giả" 
                              prepend-inner-icon="mdi-magnify"
                              variant="outlined" density="default" clearable
                              class="bg-white rounded-lg" 
                              @input="filterBooks"></v-text-field>
            </v-col>
        </v-row>

        <!-- Trạng thái tải -->
        <v-row v-if="isLoading">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="#5865f2" size="64"></v-progress-circular>
                <p class="mt-4 text-gray-600">Đang tải dữ liệu sách...</p>
            </v-col>
        </v-row>

        <!-- Danh sách sách -->
        <v-row v-else>
            <v-col v-if="filteredBooks.length === 0" cols="12">
                <v-alert type="info" icon="mdi-information-outline">
                    Không tìm thấy sách nào phù hợp với yêu cầu.
                </v-alert>
            </v-col>

            <v-col v-else v-for="book in paginatedBooks" :key="book._id" cols="12" sm="6" lg="3">
                <BookCard :book="book" />
            </v-col>
        </v-row>

        <!-- Phân trang -->
        <v-row v-if="totalPages > 1" class="mt-10">
            <v-col cols="12" class="flex justify-center">
                <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" density="comfortable"
                    rounded="circle" active-color="#5865f2" @update:modelValue="filterBooks"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BookService from "@/services/Book.service"; // Import Service
import BookCard from "@/components/BookCard.vue"; // Import Component Card

export default {
    name: 'BookCatalog',
    components: { BookCard },
    data() {
        return {
            isLoading: true,
            searchQuery: '',
            itemsPerPage: 12,
            currentPage: 1,
            allBooks: [],      // Lưu trữ toàn bộ sách từ backend
            filteredBooks: [], // Sách sau khi tìm kiếm/lọc
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
        },
        paginatedBooks() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBooks.slice(start, end);
        },
    },
    methods: {
        filterBooks() {
            let filtered = this.allBooks;

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (book) =>
                        book.TenSach.toLowerCase().includes(query) ||
                        book.TacGia.toLowerCase().includes(query)
                );
            }
            
            this.filteredBooks = filtered;
            this.currentPage = 1; // Reset về trang đầu tiên khi lọc
        },
        
        async fetchBooks() {
            this.isLoading = true;
            try {
                // Gọi service để lấy sách từ API /api/sach
                const data = await BookService.getAllSach();
                
                this.allBooks = data;
                this.filteredBooks = data; // Ban đầu, sách lọc = toàn bộ sách
                
            } catch (error) {
                console.error("Failed to load books from API:", error);
                // Có thể hiển thị thông báo lỗi cho người dùng ở đây
            } finally {
                this.isLoading = false;
            }
        }
    },
    created() {
        this.fetchBooks();
    },
};
</script>

<style scoped>
/* Vuetify sử dụng Tailwind CSS, nên không cần CSS quá phức tạp */
.v-container {
    padding: 3rem 1.5rem;
}
</style>