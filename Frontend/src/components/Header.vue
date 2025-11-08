<template>
    <v-app-bar app color="#5865f2" dark elevation="4">
        <router-link to="/" class="text-decoration-none text-white">
            <v-toolbar-title class="font-weight-bold text-xl ml-4">
                <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
                QLTV - Tự học
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn text to="/books" class="font-weight-medium hidden-sm-and-down">
            Danh Mục Sách
        </v-btn>
        
        <template v-if="user">
            <v-btn text :to="`/profile`" class="font-weight-medium">
                <v-icon left>mdi-account-circle</v-icon>
                Xin chào, {{ user.Ten }}
            </v-btn>
            <v-btn color="error" class="ml-3 font-weight-medium" @click="logout">
                Đăng Xuất
            </v-btn>
        </template>
        
        <template v-else>
            <v-btn text to="/login" class="font-weight-medium">
                Đăng Nhập
            </v-btn>
            <v-btn color="success" to="/register" class="ml-3 font-weight-medium">
                Đăng Ký
            </v-btn>
        </template>

    </v-app-bar>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            user: null,
        };
    },
    methods: {
        checkUserStatus() {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    this.user = JSON.parse(userData);
                } catch (e) {
                    this.user = null;
                }
            } else {
                this.user = null;
            }
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.checkUserStatus(); // Cập nhật trạng thái hiển thị
            this.$router.push('/login');
        }
    },
    created() {
        this.checkUserStatus();
    },
    // Lắng nghe sự kiện route thay đổi để cập nhật trạng thái user (sau khi đăng nhập/đăng xuất)
    watch: {
        '$route': 'checkUserStatus'
    }
};
</script>