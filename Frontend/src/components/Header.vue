<template>
    <v-app-bar app color="black" dark flat elevation="2">
        <v-container fluid class="d-flex align-center py-0 px-6">
            <v-toolbar-title class="font-weight-bold text-h6 d-flex align-center cursor-pointer" @click="$router.push('/')">
                <v-icon class="mr-2">mdi-book-open-variant</v-icon>
                Thư Viện Trực Tuyến
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <div class="hidden-sm-and-down mr-4">
                <v-btn text to="/" class="text-capitalize font-weight-medium">Trang chủ</v-btn>
                <v-btn text to="/books" class="text-capitalize font-weight-medium">Sách</v-btn>
            </div>

            <template v-if="user">
                <v-menu offset-y transition="scale-transition">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" text class="pl-2 pr-4 text-capitalize">
                            <v-avatar size="32" class="mr-2 border">
                                <v-img 
                                    :src="user.HinhAnh || defaultAvatar" 
                                    alt="Avatar" 
                                    cover
                                ></v-img>
                            </v-avatar>
                            <span class="font-weight-bold">{{ user.Ten || 'Tài khoản' }}</span>
                            <v-icon right>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>

                    <v-list density="compact" class="py-2">
                        <v-list-item to="/profile" prepend-icon="mdi-account-circle">
                            <v-list-item-title>Hồ sơ cá nhân</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item v-if="user.Chucvu" to="/admin/dashboard" prepend-icon="mdi-view-dashboard">
                            <v-list-item-title>Quản lý thư viện</v-list-item-title>
                        </v-list-item>

                        <v-divider class="my-2"></v-divider>

                        <v-list-item @click="logout" prepend-icon="mdi-logout" class="text-red">
                            <v-list-item-title>Đăng xuất</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>

            <template v-else>
                <div class="d-flex gap-2">
                    <v-btn text to="/login" class="text-capitalize">Đăng nhập</v-btn>
                    <v-btn color="white" class="text-black font-weight-bold text-capitalize" to="/register">
                        Đăng ký
                    </v-btn>
                </div>
            </template>
        </v-container>
    </v-app-bar>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            user: null,
            defaultAvatar: 'https://i.pravatar.cc/300?img=12'
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
        logout() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.checkUserStatus();
            this.$router.push('/login');
            window.location.reload();
        }
    },
    created() {
        this.checkUserStatus();
        window.addEventListener('storage', this.checkUserStatus);
    },
    watch: {
        '$route': 'checkUserStatus'
    }
};
</script>

<style scoped>
.v-btn {
    letter-spacing: 0.5px;
}
</style>