<template>
    <v-card
        class="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
        elevation="0"
    >
        <div class="pa-4">
            <!-- book.anh_bia là URL ảnh từ Cloudinary, hoặc placeholder -->
            <v-img 
                :src="book.anh_bia || 'https://placehold.co/300x450/cccccc/333333?text=No+Cover'" 
                height="280" 
                aspect-ratio="2/3" 
                cover
                class="rounded-lg shadow-md"
            ></v-img>
        </div>

        <v-card-title class="text-lg font-weight-medium text-gray-900 pt-2 pb-0">
            {{ book.TenSach }}
        </v-card-title>

        <v-card-subtitle class="text-gray-600 text-sm pb-2">
            Tác giả: {{ book.TacGia || 'Đang cập nhật' }}
        </v-card-subtitle>
        
        <v-card-text class="text-gray-700 text-base py-1">
            <div class="font-weight-bold">Kho: <span :class="{'text-red-500': book.SoQuyen <= 1, 'text-green-600': book.SoQuyen > 1}">{{ book.SoQuyen }}</span></div>
            <div class="text-xs">NXB: {{ book.NXB?.TenNXB || 'Không rõ' }} ({{ book.NamXuatBan }})</div>
        </v-card-text>

        <v-card-actions class="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <!-- Gắn link router tới trang chi tiết sách -->
            <router-link :to="`/books/${book._id}`" class="text-decoration-none">
                <v-btn variant="elevated" color="#5865f2" class="font-weight-medium rounded-lg transition-colors text-white">
                    Chi tiết
                </v-btn>
            </router-link>
            <v-spacer></v-spacer>
            <!-- Nút mượn sách (sẽ được thêm logic sau) -->
            <v-btn variant="outlined" color="success" :disabled="book.SoQuyen <= 0">
                Mượn
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'BookCard',
    props: {
        book: {
            type: Object,
            required: true,
            // Định nghĩa các trường dữ liệu theo Backend Model
            validator: (value) => {
                return value.TenSach !== undefined && value.SoQuyen !== undefined;
            }
        }
    },
};
</script>