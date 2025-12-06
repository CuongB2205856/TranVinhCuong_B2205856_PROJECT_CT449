<template>
  <v-container class="max-w-7xl mx-auto py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-3xl font-weight-bold text-red-darken-3">
        Quản Lý Độc Giả
      </h2>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="fetchReaders">
        Làm mới
      </v-btn>
    </div>

    <v-card class="elevation-4 rounded-lg">
      <v-data-table
        :headers="headers"
        :items="readers"
        :loading="isLoading"
        :search="search"
        item-value="_id"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Tìm kiếm (Tên, SĐT)..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="pa-4"
            hide-details
          ></v-text-field>
        </template>

        <template v-slot:item.HoTen="{ item }">
          <div class="font-weight-bold">{{ item.HoLot }} {{ item.Ten }}</div>
        </template>

        <template v-slot:item.SoLanViPham="{ item }">
          <v-chip
            :color="getWarningColor(item.SoLanViPham)"
            class="font-weight-bold text-white"
            size="small"
          >
            {{ item.SoLanViPham }} lần
          </v-chip>
        </template>

        <template v-slot:item.TrangThai="{ item }">
          <v-chip
            :color="item.TrangThai === 'Blocked' ? 'red' : 'green'"
            variant="elevated"
            size="small"
          >
            <v-icon start size="small">
                {{ item.TrangThai === 'Blocked' ? 'mdi-lock' : 'mdi-check-circle' }}
            </v-icon>
            {{ item.TrangThai === 'Blocked' ? 'Đã Khóa' : 'Hoạt Động' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn 
            size="small" 
            color="primary" 
            variant="text" 
            icon="mdi-shield-edit"
            @click="openEditDialog(item)"
            title="Cập nhật trạng thái"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-red-darken-3 text-white pa-4 font-weight-bold">
          <v-icon class="mr-2">mdi-account-cog</v-icon> Quản Lý Trạng Thái
        </v-card-title>
        
        <v-card-text class="pt-6">
            <v-row>
                <v-col cols="12">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="grey-lighten-2" size="40" class="mr-3">
                            <span class="text-h6 font-weight-bold">{{ editedItem.Ten?.charAt(0) }}</span>
                        </v-avatar>
                        <div>
                            <div class="text-h6">{{ editedItem.HoLot }} {{ editedItem.Ten }}</div>
                            <div class="text-caption text-grey">{{ editedItem.DienThoai }}</div>
                        </div>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </v-col>

                <v-col cols="12">
                   <v-alert
                    type="warning"
                    variant="tonal"
                    density="compact"
                    icon="mdi-alert-circle"
                   >
                     Số lần vi phạm hiện tại: <strong>{{ editedItem.SoLanViPham }}</strong>
                   </v-alert>
                </v-col>

                <v-col cols="12">
                    <v-select
                        v-model="editedItem.TrangThai"
                        :items="['Active', 'Blocked']"
                        label="Trạng thái tài khoản"
                        variant="outlined"
                        prepend-inner-icon="mdi-shield-account"
                        :color="editedItem.TrangThai === 'Blocked' ? 'red' : 'green'"
                    >
                        <template v-slot:selection="{ item }">
                            <span :class="item.raw === 'Blocked' ? 'text-red font-weight-bold' : 'text-green font-weight-bold'">
                                {{ item.raw === 'Blocked' ? 'Đã Khóa (Blocked)' : 'Hoạt Động (Active)' }}
                            </span>
                        </template>
                    </v-select>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 border-t bg-grey-lighten-4">
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="dialog = false">Đóng</v-btn>
            <v-btn color="red-darken-3" variant="elevated" @click="saveReader" :loading="isSaving">Lưu Trạng Thái</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import ReaderService from "@/services/Reader.service";

export default {
  name: "AdminReader",
  data() {
    return {
      isLoading: false,
      isSaving: false,
      search: "",
      readers: [],
      dialog: false,
      editedItem: {},
      
      headers: [
        { title: "Mã ĐG", key: "_id", align: "start" },
        { title: "Họ và Tên", key: "HoTen" }, 
        { title: "Số Điện Thoại", key: "DienThoai" },
        { title: "Giới Tính", key: "Phai" },
        { title: "Vi Phạm", key: "SoLanViPham", align: "center" },
        { title: "Trạng Thái", key: "TrangThai", align: "center" },
        { title: "Thao tác", key: "actions", sortable: false, align: "end" },
      ],
    };
  },
  created() {
    this.fetchReaders();
  },
  methods: {
    async fetchReaders() {
      this.isLoading = true;
      try {
        this.readers = await ReaderService.getAllReaders();
      } catch (error) {
        console.error("Lỗi tải danh sách độc giả:", error);
      } finally {
        this.isLoading = false;
      }
    },
    
    getWarningColor(count) {
        if (count >= 3) return 'red';
        if (count > 0) return 'orange';
        return 'green';
    },

    openEditDialog(item) {
        // Clone item để không ảnh hưởng dữ liệu bảng khi chưa lưu
        this.editedItem = { ...item };
        this.dialog = true;
    },

    async saveReader() {
        this.isSaving = true;
        try {
            // THAY ĐỔI: Chỉ gửi TrangThai lên server
            await ReaderService.updateReader(this.editedItem._id, {
                TrangThai: this.editedItem.TrangThai
                // Không gửi SoLanViPham nữa
            });
            
            // Cập nhật giao diện (Thủ công hoặc gọi lại API)
            // Cách nhanh: gọi lại API
            await this.fetchReaders();
            
            this.dialog = false;
            // Dùng alert hoặc snackbar nếu bạn có cấu hình snackbar global
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            alert("Cập nhật thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
        } finally {
            this.isSaving = false;
        }
    }
  },
};
</script>