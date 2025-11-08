<template>
    <v-container class="max-w-7xl mx-auto py-12">
        <h2 class="text-3xl font-weight-bold mb-6 text-red-darken-3">Danh Sách Toàn Bộ Sách (Admin)</h2>
        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

        <div v-if="isLoading" class="text-center py-10">
            <v-progress-circular indeterminate color="red-darken-3" size="50"></v-progress-circular>
            <p class="mt-3">Đang tải toàn bộ dữ liệu sách...</p>
        </div>

        <v-data-table
            v-else
            :headers="headers"
            :items="allBooks"
            :items-per-page="10"
            class="elevation-4 rounded-lg"
        >
            <template v-slot:item.SoQuyen="{ item }">
                <v-chip :color="item.SoQuyen > 0 ? 'green' : 'red'" dark>
                    {{ item.SoQuyen }}
                </v-chip>
            </template>
            <template v-slot:item.NXB="{ item }">
                 {{ item.NXB?.TenNXB }}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2 text-blue-500">mdi-pencil</v-icon>
                <v-icon small class="text-red-500">mdi-delete</v-icon>
            </template>
        </v-data-table>
        
    </v-container>
</template>

<script>
import BookService from "@/services/book.service";

export default {
    name: 'AdminCatalog',
    data() {
        return {
            isLoading: true,
            error: null,
            allBooks: [],
            headers: [
                { title: 'Mã Sách', key: '_id' },
                { title: 'Tên Sách', key: 'TenSach' },
                { title: 'Tác Giả', key: 'TacGia' },
                { title: 'NXB', key: 'NXB' },
                { title: 'Năm XB', key: 'NamXuatBan' },
                { title: 'Tồn Kho', key: 'SoQuyen' },
                { title: 'Thao tác', key: 'actions', sortable: false },
            ],
        };
    },
    methods: {
        async fetchAllBooks() {
            this.isLoading = true;
            try {
                // Gọi hàm Service mới
                this.allBooks = await BookService.getAllBooksAdmin(); 
            } catch (err) {
                this.error = "Không đủ quyền hoặc lỗi tải dữ liệu.";
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        }
    },
    created() {
        this.fetchAllBooks();
    }
};
</script>