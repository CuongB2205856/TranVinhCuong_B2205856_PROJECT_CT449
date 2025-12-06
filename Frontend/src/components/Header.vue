<template>
    <v-app-bar app color="#5865f2" dark elevation="4">
        <router-link to="/" class="text-decoration-none text-white">
            <v-toolbar-title class="font-weight-bold text-xl ml-4">
                <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
                QLTV - Tự học
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn text to="/books" class="font-weight-medium hidden-sm-and-down mr-2">
            Danh Mục Sách
        </v-btn>
        
        <template v-if="user">
            <v-menu min-width="200px" rounded offset-y>
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        class="text-none font-weight-medium"
                        prepend-icon="mdi-account-circle"
                        append-icon="mdi-chevron-down"
                    >
                        Xin chào, {{ user.Ten }}
                    </v-btn>
                </template>
                
                <v-list density="compact" class="pa-2">
                    <v-list-item @click="goToProfile('info')" rounded="lg" color="primary">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-account-details-outline" class="mr-2"></v-icon>
                        </template>
                        <v-list-item-title>Thông tin cá nhân</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="goToProfile('history')" rounded="lg" color="primary">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-history" class="mr-2"></v-icon>
                        </template>
                        <v-list-item-title>Lịch sử mượn sách</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="goToProfile('password')" rounded="lg" color="primary">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-lock-reset" class="mr-2"></v-icon>
                        </template>
                        <v-list-item-title>Đổi mật khẩu</v-list-item-title>
                    </v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item @click="logout" rounded="lg" color="error">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-logout" color="error" class="mr-2"></v-icon>
                        </template>
                        <v-list-item-title class="text-red">Đăng Xuất</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
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
            const userData = sessionStorage.getItem('user');
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
        // Hàm điều hướng thông minh dựa trên lựa chọn dropdown
        goToProfile(tab) {
            if (tab === 'password') {
                // Nếu chọn đổi mật khẩu, vẫn mở tab info nhưng kèm query action
                this.$router.push({ name: 'Profile', query: { tab: 'info', action: 'change-password' } });
            } else {
                // Chuyển tab bình thường
                this.$router.push({ name: 'Profile', query: { tab: tab } });
            }
        },
        logout() {
            if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                this.checkUserStatus();
                this.$router.push('/login');
            }
        }
    },
    created() {
        this.checkUserStatus();
    },
    watch: {
        '$route': 'checkUserStatus'
    }
};
</script>