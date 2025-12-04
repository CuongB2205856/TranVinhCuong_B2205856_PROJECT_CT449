<template>
    <v-app-bar app color="red-darken-3" dark elevation="4">
        <v-toolbar-title class="font-weight-bold text-xl ml-4">
            <v-icon class="mr-2">mdi-lock</v-icon>
            Bảng Điều Khiển Quản Trị
        </v-toolbar-title>
        <v-spacer></v-spacer>
        
        <v-btn text to="/admin/dashboard" class="font-weight-medium">Quản lý Sách</v-btn>
        
        <v-btn text to="/admin/publishers" class="font-weight-medium ml-2">Quản lý NXB</v-btn>
        
        <v-btn color="error" class="ml-3 font-weight-medium" @click="logout">
            Đăng Xuất
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AdminHeader',
    methods: {
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$router.push('/admin/login'); 
        }
    }
};
</script>