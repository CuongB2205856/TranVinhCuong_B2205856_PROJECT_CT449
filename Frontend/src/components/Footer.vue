<template>
    <v-footer class="bg-black text-white py-6" elevation="0">
        <v-container>
            <v-row align="center">
                
                <v-col cols="12" md="6" class="text-center text-md-left">
                    <div class="d-flex align-center justify-center justify-md-start mb-2">
                        <v-icon class="mr-2" color="white">mdi-book-open-page-variant</v-icon>
                        <h3 class="font-weight-bold text-h6">Thư Viện CT449</h3>
                    </div>
                    
                    <p class="text-grey-lighten-1 text-body-2 mb-2">
                        Kết nối tri thức - Khơi nguồn đam mê đọc sách.
                    </p>
                    
                    <p class="text-caption text-grey-darken-1">
                        &copy; {{ new Date().getFullYear() }} - B2205856 - Trần Vĩnh Cường.
                    </p>
                </v-col>

                <v-col cols="12" md="6" class="text-center text-md-right">
                    <span class="text-body-2 font-weight-bold mr-2 d-none d-md-inline-block">Theo dõi chúng tôi:</span>
                    
                    <div class="d-inline-flex gap-2">
                        <v-btn icon variant="tonal" density="comfortable" color="white" class="hover-scale">
                            <v-icon size="small">mdi-facebook</v-icon>
                        </v-btn>
                        <v-btn icon variant="tonal" density="comfortable" color="white" class="hover-scale">
                            <v-icon size="small">mdi-instagram</v-icon>
                        </v-btn>
                        <v-btn icon variant="tonal" density="comfortable" color="white" class="hover-scale">
                            <v-icon size="small">mdi-twitter</v-icon>
                        </v-btn>
                    </div>
                </v-col>

            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
export default {
    name: 'Footer',
};
</script>

<style scoped>
/* Hiệu ứng nhỏ khi hover vào nút mạng xã hội */
.hover-scale {
    transition: transform 0.2s;
}
.hover-scale:hover {
    transform: translateY(-3px);
    background-color: rgba(255,255,255,0.1) !important;
}
</style>