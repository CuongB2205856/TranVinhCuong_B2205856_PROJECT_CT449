<template>
    <v-footer padless class="bg-gray-800 text-black py-4 mt-8">
        <v-container class="max-w-6xl">
            <v-row justify="center" align="center" class="text-center">
                <v-col cols="12" sm="6" md="4" class="text-sm">
                    <v-icon left>mdi-map-marker</v-icon>
                    Khoa CNTT&TT, Trường Đại học Cần Thơ
                </v-col>

                <v-col cols="12" sm="6" md="4" class="text-sm">
                    <v-icon left>mdi-code-braces</v-icon>
                    Dự án Phát triển Ứng dụng Web - CT449
                </v-col>
                
                <v-col cols="12" md="4" class="text-sm font-weight-medium">
                    &copy; {{ new Date().getFullYear() }} - B2205856 - Trần Vĩnh Cường
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