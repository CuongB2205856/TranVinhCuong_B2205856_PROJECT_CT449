<template>
    <div class="pa-0 ma-0 w-100" style="width: 100vw; overflow-x: hidden">
        <v-carousel 
            class="smooth-slider"
            :show-arrows="false" 
            hide-delimiters 
            cycle 
            :interval="4000"
            height="500" 
            v-if="featuredBooks.length > 0"
        >
            <v-carousel-item v-for="(book, index) in featuredBooks" :key="book.id" :value="index">
                <v-row no-gutters class="w-100 h-100">
                    
                    <v-col cols="12" md="4" class="bg-grey-lighten-3">
                        <div class="h-100 d-flex align-center justify-center pa-4">
                            <v-img 
                                :src="book.image" 
                                class="rounded-lg shadow-lg" 
                                contain
                                height="450"
                                width="100%"
                            />
                        </div>
                    </v-col>

                    <v-col cols="12" md="8" class="py-10 px-10" style="background-color: #111; color: white;">
                        <div class="d-flex flex-column justify-center align-start h-100">
                            <h2 class="text-h4 font-weight-bold mb-4 line-clamp-2">
                                {{ book.title }}
                            </h2>
                            <p class="text-subtitle-1 mb-2 text-grey-lighten-1">
                                Tác giả: {{ book.author }}
                            </p>
                            <p class="text-body-1 mb-6 line-clamp-3">
                                Một cuốn sách đặc sắc với nội dung hấp dẫn đang chờ bạn khám phá. Hãy mượn ngay hôm nay để trải nghiệm tri thức mới!
                            </p>
                            <v-btn 
                                :to="`/books/${book.id}`" 
                                color="white" 
                                variant="outlined" 
                                size="large"
                                class="text-capitalize font-weight-bold"
                            >
                                Xem chi tiết
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-carousel-item>
        </v-carousel>
        
        <div v-else class="d-flex justify-center align-center bg-grey-lighten-3" style="height: 500px;">
             <v-progress-circular indeterminate color="black" size="64"></v-progress-circular>
        </div>
    </div>
</template>

<script>
import BookService from "@/services/Book.service";

export default {
    name: "BookSlider",
    data() {
        return {
            featuredBooks: [],
        };
    },
    methods: {
        async fetchRandomBooks() {
            try {
                const books = await BookService.getAllBooks();
                if (books && books.length > 0) {
                    const shuffled = [...books].sort(() => 0.5 - Math.random());
                    const selectedBooks = shuffled.slice(0, 3);

                    this.featuredBooks = selectedBooks.map(book => ({
                        id: book._id,
                        title: book.TenSach,
                        author: book.TacGia,
                        image: book.anh_bia || 'https://placehold.co/600x900?text=No+Cover',
                    }));
                }
            } catch (error) {
                console.error("Lỗi khi tải sách slider:", error);
            }
        }
    },
    created() {
        this.fetchRandomBooks();
    }
};
</script>

<style scoped>
/* Class để cắt bớt chữ nếu tiêu đề quá dài */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: left;
}
.line-clamp-3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;    
    text-align: left;
}

:deep(.v-window__container) {
    transition: transform 1.5s ease-in-out !important; 
}
</style>