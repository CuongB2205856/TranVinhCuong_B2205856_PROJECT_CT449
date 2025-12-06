<template>
  <v-container class="max-w-7xl mx-auto py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-3xl font-weight-bold text-red-darken-3">
        Quản Lý Nhân Sự
      </h2>
      <v-btn color="red-darken-3" prepend-icon="mdi-account-plus" @click="openDialog">
        Thêm Nhân Viên
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" closable class="mb-4" @click:close="error = null">{{ error }}</v-alert>
    <v-alert v-if="success" type="success" closable class="mb-4" @click:close="success = null">{{ success }}</v-alert>

    <v-card class="elevation-4 rounded-lg">
      <v-data-table
        :headers="headers"
        :items="staffList"
        :loading="isLoading"
        :search="search"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Tìm kiếm nhân viên..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="pa-4"
            hide-details
          ></v-text-field>
        </template>

        <template v-slot:item.Chucvu="{ item }">
          <v-chip
            :color="item.Chucvu === 'Admin' ? 'red' : 'blue'"
            class="font-weight-bold text-white"
            size="small"
          >
            {{ item.Chucvu }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="bg-red-darken-3 text-white pa-4">
          <span class="text-h5">Thêm Nhân Viên Mới</span>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-form ref="form" v-model="valid">
            <v-row>
              
              <v-col cols="12">
                <v-text-field
                v-model="newItem.HoTenNV"
                label="Họ và Tên *"
                variant="outlined"
                density="compact"
                :rules="[v => !!v || 'Bắt buộc']"
                prepend-inner-icon="mdi-account"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                v-model="newItem.Password"
                label="Mật khẩu *"
                type="password"
                variant="outlined"
                density="compact"
                :rules="[v => !!v || 'Bắt buộc', v => (v && v.length >= 6) || 'Tối thiểu 6 ký tự']"
                prepend-inner-icon="mdi-lock"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="newItem.Chucvu"
                  :items="['Admin', 'Thủ thư']"
                  label="Chức vụ *"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Bắt buộc']"
                  prepend-inner-icon="mdi-badge-account"
                ></v-select>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newItem.SoDienThoai"
                  label="Số Điện Thoại"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-phone"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Hủy</v-btn>
          <v-btn color="red-darken-3" variant="elevated" @click="save" :loading="isSaving">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import StaffService from "@/services/Staff.service";

export default {
  name: "AdminStaff",
  data() {
    return {
      dialog: false,
      valid: false,
      isLoading: false,
      isSaving: false,
      search: "",
      error: null,
      success: null,
      
      staffList: [],
      headers: [
        { title: "MSNV", key: "_id", align: "start" }, // Vẫn hiển thị MSNV trong bảng để Admin biết
        { title: "Họ Tên", key: "HoTenNV" },
        { title: "Chức Vụ", key: "Chucvu" },
        { title: "SĐT", key: "SoDienThoai" },
      ],

      newItem: {
        _id: "",
        HoTenNV: "",
        Password: "",
        Chucvu: "Thủ thư",
        SoDienThoai: ""
      },
      defaultItem: {
        _id: "",
        HoTenNV: "",
        Password: "",
        Chucvu: "Thủ thư",
        SoDienThoai: ""
      }
    };
  },
  created() {
    this.fetchStaffs();
  },
  methods: {
    async fetchStaffs() {
      this.isLoading = true;
      try {
        this.staffList = await StaffService.getAllStaff();
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    
    openDialog() {
      this.newItem = { ...this.defaultItem };
      
      // Tự động tạo MSNV ngẫu nhiên (Ví dụ: NV1701234567)
      // Sử dụng Date.now() để đảm bảo không trùng lặp
      this.newItem._id = "NV" + Date.now().toString(); 
      
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.error = null;
    },

    async save() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.isSaving = true;
      this.error = null;
      try {
        await StaffService.createStaff(this.newItem);
        this.success = `Thêm nhân viên thành công! Mã số: ${this.newItem._id}`;
        this.fetchStaffs();
        this.closeDialog();
      } catch (err) {
        this.error = err.response?.data?.message || "Lỗi khi thêm nhân viên.";
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>