<template>
  <v-container class="max-w-4xl mx-auto py-10">
    <v-card class="rounded-xl shadow-lg" elevation="10">
        <v-toolbar color="red-darken-3" dark>
             <v-toolbar-title>Hồ Sơ Nhân Sự</v-toolbar-title>
        </v-toolbar>

        <v-tabs v-model="activeTab" color="red-darken-3" align-tabs="center">
            <v-tab value="info" prepend-icon="mdi-account-box">Thông tin chung</v-tab>
            <v-tab value="password" prepend-icon="mdi-lock">Đổi mật khẩu</v-tab>
        </v-tabs>

        <v-card-text class="pa-6">
            <v-window v-model="activeTab">
                
                <v-window-item value="info">
                    <div class="d-flex flex-column align-center mb-6">
                        <div class="position-relative">
                            <v-avatar color="grey-lighten-2" size="120" class="elevation-4 border">
                                <v-img v-if="staffData.HinhAnh" :src="staffData.HinhAnh" cover></v-img>
                                <span v-else class="text-h3 font-weight-bold text-red-darken-3">
                                    {{ getInitials(staffData.HoTenNV) }}
                                </span>
                            </v-avatar>
                            
                            <v-btn
                                icon="mdi-camera"
                                size="small"
                                color="red-darken-3"
                                class="avatar-edit-btn"
                                @click="$refs.fileInput.click()"
                                :loading="isUploading"
                            ></v-btn>
                            
                            <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleFileUpload" />
                        </div>
                        <h2 class="text-2xl font-bold mt-4">{{ staffData.HoTenNV }}</h2>
                        <v-chip color="red" size="small" class="mt-1">{{ staffData.Chucvu }}</v-chip>
                    </div>

                    <v-form ref="formInfo" @submit.prevent="submitUpdateInfo">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="staffData._id" label="Mã Số Nhân Viên (MSNV)" variant="outlined" readonly disabled prepend-inner-icon="mdi-identifier"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="staffData.HoTenNV" label="Họ và Tên" variant="outlined" color="red-darken-3" prepend-inner-icon="mdi-account"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="staffData.SoDienThoai" label="Số Điện Thoại" variant="outlined" color="red-darken-3" prepend-inner-icon="mdi-phone"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="staffData.Diachi" label="Địa Chỉ" variant="outlined" color="red-darken-3" prepend-inner-icon="mdi-map-marker"></v-text-field>
                            </v-col>
                        </v-row>
                        <div class="d-flex justify-end mt-4">
                             <v-btn type="submit" color="red-darken-3" size="large" :loading="isLoading" prepend-icon="mdi-content-save">Lưu Thay Đổi</v-btn>
                        </div>
                    </v-form>
                </v-window-item>

                <v-window-item value="password">
                     <v-form ref="formPwd" @submit.prevent="submitChangePassword">
                        <v-text-field v-model="pwd.newPassword" label="Mật khẩu mới" type="password" variant="outlined" color="red-darken-3" class="mb-2"></v-text-field>
                        <v-text-field v-model="pwd.confirmPassword" label="Nhập lại mật khẩu mới" type="password" variant="outlined" color="red-darken-3"></v-text-field>
                        
                        <div class="d-flex justify-end mt-4">
                             <v-btn type="submit" color="red-darken-3" :loading="isLoading">Đổi Mật Khẩu</v-btn>
                        </div>
                    </v-form>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import StaffService from "@/services/Staff.service";
import axios from "axios";

export default {
    name: "AdminProfile",
    data() {
        return {
            activeTab: 'info',
            isLoading: false,
            isUploading: false,
            staffData: { _id: '', HoTenNV: '', SoDienThoai: '', Diachi: '', Chucvu: '', HinhAnh: '' },
            pwd: { newPassword: '', confirmPassword: '' },
            snackbar: { show: false, message: '', color: 'success' },
            CLOUDINARY_NAME: import.meta.env.VITE_CLOUDINARY_NAME,
            CLOUDINARY_PRESET: import.meta.env.VITE_CLOUDINARY_PRESET,
        }
    },
    methods: {
        getInitials(name) { return name ? name.charAt(0).toUpperCase() : 'A'; },
        async fetchProfile() {
            try {
                this.staffData = await StaffService.getProfile();
            } catch(e) { console.error(e); }
        },
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if(!file) return;
            this.isUploading = true;
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", this.CLOUDINARY_PRESET);
                const res = await axios.post(`https://api.cloudinary.com/v1_1/${this.CLOUDINARY_NAME}/image/upload`, formData);
                
                // Cập nhật ngay vào DB
                const imgUrl = res.data.secure_url;
                await StaffService.updateProfile({ HinhAnh: imgUrl });
                this.staffData.HinhAnh = imgUrl;
                
                // Cập nhật sessionStorage để Header nhận diện ngay
                const user = JSON.parse(sessionStorage.getItem('user'));
                user.HinhAnh = imgUrl;
                sessionStorage.setItem('user', JSON.stringify(user));
                
                this.showMsg("Cập nhật ảnh đại diện thành công", "success");
            } catch(e) { this.showMsg("Lỗi upload ảnh", "error"); }
            finally { this.isUploading = false; }
        },
        async submitUpdateInfo() {
            this.isLoading = true;
            try {
                await StaffService.updateProfile(this.staffData);
                // Cập nhật sessionStorage
                const user = JSON.parse(sessionStorage.getItem('user'));
                user.HoTenNV = this.staffData.HoTenNV;
                sessionStorage.setItem('user', JSON.stringify(user));
                
                this.showMsg("Cập nhật thông tin thành công", "success");
            } catch(e) { this.showMsg("Lỗi cập nhật", "error"); }
            finally { this.isLoading = false; }
        },
        async submitChangePassword() {
            if(this.pwd.newPassword !== this.pwd.confirmPassword) return this.showMsg("Mật khẩu không khớp", "error");
            if(this.pwd.newPassword.length < 6) return this.showMsg("Mật khẩu quá ngắn", "error");
            
            this.isLoading = true;
            try {
                await StaffService.updateProfile({ Password: this.pwd.newPassword });
                this.showMsg("Đổi mật khẩu thành công", "success");
                this.pwd = { newPassword: '', confirmPassword: '' };
            } catch(e) { this.showMsg("Lỗi đổi mật khẩu", "error"); }
            finally { this.isLoading = false; }
        },
        showMsg(msg, color) { this.snackbar = { show: true, message: msg, color }; }
    },
    created() { this.fetchProfile(); }
}
</script>

<style scoped>
.avatar-edit-btn { position: absolute; bottom: 0; right: 0; border: 2px solid white; }
.position-relative { position: relative; display: inline-block; }
</style>