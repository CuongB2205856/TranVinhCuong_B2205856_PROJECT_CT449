<template>
  <v-container class="max-w-4xl mx-auto py-10">
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-black">Hồ Sơ Cá Nhân</h2>
      <p class="text-grey-darken-1">Quản lý thông tin và bảo mật tài khoản</p>
    </div>

    <v-card class="rounded-xl border" elevation="2">
        <v-tabs v-model="activeTab" color="black" align-tabs="start" class="border-b px-4">
            <v-tab value="info" class="text-capitalize font-weight-bold" prepend-icon="mdi-account-box-outline">Thông tin chung</v-tab>
            <v-tab value="password" class="text-capitalize font-weight-bold" prepend-icon="mdi-lock-outline">Đổi mật khẩu</v-tab>
        </v-tabs>

        <v-card-text class="pa-8">
            <v-window v-model="activeTab">
                
                <v-window-item value="info">
                    <v-row>
                        <v-col cols="12" md="4" class="d-flex flex-column align-center">
                            <div class="position-relative mb-4">
                                <v-avatar color="grey-lighten-4" size="160" class="elevation-2 border">
                                    <v-img v-if="staffData.HinhAnh" :src="staffData.HinhAnh" cover></v-img>
                                    <span v-else class="text-h2 font-weight-bold text-grey-darken-2">
                                        {{ getInitials(staffData.HoTenNV) }}
                                    </span>
                                </v-avatar>
                                
                                <v-btn
                                    icon="mdi-camera"
                                    size="small"
                                    color="black"
                                    class="avatar-edit-btn text-white elevation-3"
                                    @click="$refs.fileInput.click()"
                                    :loading="isUploading"
                                ></v-btn>
                                
                                <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleFileUpload" />
                            </div>
                            <h3 class="text-xl font-bold">{{ staffData.HoTenNV }}</h3>
                            <v-chip color="black" variant="outlined" size="small" class="mt-2 font-weight-medium text-uppercase">
                                {{ staffData.Chucvu }}
                            </v-chip>
                        </v-col>

                        <v-col cols="12" md="8">
                            <v-form ref="formInfo" @submit.prevent="submitUpdateInfo">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field 
                                            v-model="staffData._id" 
                                            label="Mã Nhân Viên" 
                                            variant="outlined" 
                                            readonly disabled 
                                            bg-color="grey-lighten-4"
                                            prepend-inner-icon="mdi-identifier"
                                            class="mt-2"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field 
                                            v-model="staffData.HoTenNV" 
                                            label="Họ và Tên" 
                                            variant="outlined" 
                                            density="comfortable"
                                            color="black" 
                                            prepend-inner-icon="mdi-account-outline"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field 
                                            v-model="staffData.SoDienThoai" 
                                            label="Số Điện Thoại" 
                                            variant="outlined" 
                                            density="comfortable"
                                            color="black" 
                                            prepend-inner-icon="mdi-phone-outline"
                                        ></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-autocomplete 
                                            v-model="staffData.Diachi" 
                                            :items="provinces"
                                            item-title="name"
                                            item-value="name"
                                            label="Địa Chỉ (Tỉnh/Thành)" 
                                            variant="outlined" 
                                            density="comfortable"
                                            color="black" 
                                            prepend-inner-icon="mdi-map-marker-outline"
                                            :loading="loadingProvinces"
                                            no-data-text="Không có dữ liệu"
                                            clearable
                                            placeholder="Chọn tỉnh thành..."
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-end mt-6">
                                     <v-btn type="submit" color="black" size="large" class="text-white px-6" elevation="2" :loading="isLoading" prepend-icon="mdi-content-save">Lưu Thay Đổi</v-btn>
                                </div>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-window-item>

                <v-window-item value="password">
                    <div class="max-w-md mx-auto py-4">
                         <v-form ref="formPwd" @submit.prevent="submitChangePassword">
                            <v-text-field 
                                v-model="pwd.newPassword" 
                                label="Mật khẩu mới" 
                                type="password" 
                                variant="outlined" 
                                color="black" 
                                density="comfortable"
                                prepend-inner-icon="mdi-lock-outline"
                                class="mb-2"
                            ></v-text-field>
                            <v-text-field 
                                v-model="pwd.confirmPassword" 
                                label="Nhập lại mật khẩu mới" 
                                type="password" 
                                variant="outlined" 
                                color="black" 
                                density="comfortable"
                                prepend-inner-icon="mdi-lock-check-outline"
                            ></v-text-field>
                            
                            <div class="d-flex justify-end mt-6">
                                 <v-btn type="submit" color="black" class="text-white" size="large" block :loading="isLoading">Đổi Mật Khẩu</v-btn>
                            </div>
                        </v-form>
                    </div>
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
            snackbar: { show: false, message: '', color: 'black' },
            CLOUDINARY_NAME: import.meta.env.VITE_CLOUDINARY_NAME,
            CLOUDINARY_PRESET: import.meta.env.VITE_CLOUDINARY_PRESET,
            
            // [THÊM MỚI] Dữ liệu tỉnh thành
            provinces: [],
            loadingProvinces: false,
        }
    },
    methods: {
        getInitials(name) { return name ? name.charAt(0).toUpperCase() : 'A'; },
        
        async fetchProfile() {
            try {
                this.staffData = await StaffService.getProfile();
            } catch(e) { console.error(e); }
        },

        // [THÊM MỚI] Hàm lấy danh sách tỉnh
        async fetchProvinces() {
            this.loadingProvinces = true;
            try {
                const res = await axios.get("https://provinces.open-api.vn/api/?depth=1");
                this.provinces = res.data; 
            } catch (e) {
                console.error("Lỗi tải tỉnh thành:", e);
            } finally {
                this.loadingProvinces = false;
            }
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
                
                const imgUrl = res.data.secure_url;
                await StaffService.updateProfile({ HinhAnh: imgUrl });
                this.staffData.HinhAnh = imgUrl;
                
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
        showMsg(msg, color) { 
            this.snackbar = { show: true, message: msg, color: color === 'error' ? 'red-darken-3' : 'black' }; 
        }
    },
    created() { 
        this.fetchProfile(); 
        this.fetchProvinces(); // [THÊM MỚI] Gọi API tỉnh khi khởi tạo
    }
}
</script>

<style scoped>
.avatar-edit-btn { position: absolute; bottom: 5px; right: 5px; border: 3px solid white; }
.position-relative { position: relative; display: inline-block; }
</style>