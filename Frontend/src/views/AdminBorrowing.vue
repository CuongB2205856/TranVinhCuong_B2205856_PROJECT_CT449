<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-red-darken-3">Quản Lý Mượn Trả</h2>

    <v-card class="rounded-lg elevation-3">
      <v-data-table
        :headers="headers"
        :items="borrowings"
        :loading="isLoading"
        :search="search"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Tìm kiếm..."
            single-line
            hide-details
            class="pa-4"
          ></v-text-field>
        </template>

        <template v-slot:item.TrangThai="{ item }">
          <v-chip
            :color="getStatusColor(item.TrangThai)"
            class="font-weight-bold text-white"
          >
            {{ getStatusText(item.TrangThai) }}
          </v-chip>
        </template>

        <template v-slot:item.NgayMuon="{ item }">
          {{ formatDate(item.NgayMuon) }}
        </template>
        <template v-slot:item.NgayTra="{ item }">
          {{ item.NgayTra ? formatDate(item.NgayTra) : "-" }}
        </template>

        <template v-slot:item.actions="{ item }">
          <div v-if="item.TrangThai === 'cho_xac_nhan'" class="d-flex gap-2">
            <v-btn
              color="success"
              size="small"
              @click="approve(item._id)"
              :loading="isProcessing === item._id"
            >
              <v-icon start>mdi-check</v-icon> Duyệt
            </v-btn>

            <v-btn
              color="error"
              size="small"
              @click="reject(item._id)"
              :loading="isProcessing === item._id"
            >
              <v-icon start>mdi-close</v-icon> Từ chối
            </v-btn>
          </div>

          <v-btn
            v-if="item.TrangThai === 'dang_muon'"
            color="primary"
            size="small"
            @click="returnBook(item._id)"
            :loading="isProcessing === item._id"
          >
            <v-icon start>mdi-book-arrow-left</v-icon> Trả Sách
          </v-btn>

          <span
            v-if="['da_tra', 'da_tu_choi'].includes(item.TrangThai)"
            class="text-grey text-sm font-italic"
          >
            Hoàn tất
          </span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import api from "@/services/api.service";

export default {
  name: "AdminBorrowing",
  data() {
    return {
      isLoading: false,
      isProcessing: null,
      search: "",
      borrowings: [],
      headers: [
        { title: "Mã Phiếu", key: "_id" },
        { title: "Độc Giả", key: "MaDocGia.Ten" },
        { title: "SĐT", key: "MaDocGia.DienThoai" },
        { title: "Sách", key: "MaSach.TenSach" },
        { title: "Ngày Mượn", key: "NgayMuon" },
        { title: "Ngày Trả", key: "NgayTra" },
        { title: "Trạng Thái", key: "TrangThai" },
        { title: "Thao Tác", key: "actions", sortable: false },
      ],
    };
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },
    getStatusColor(status) {
      switch (status) {
        case "cho_xac_nhan":
          return "orange";
        case "dang_muon":
          return "blue";
        case "da_tra":
          return "green";
        case "da_tu_choi":
          return "red"; // Màu đỏ cho từ chối
        default:
          return "grey";
      }
    },
    getStatusText(status) {
      switch (status) {
        case "cho_xac_nhan":
          return "Chờ duyệt";
        case "dang_muon":
          return "Đang mượn";
        case "da_tra":
          return "Đã trả";
        case "da_tu_choi":
          return "Đã từ chối"; // Text hiển thị
        case "da_huy":
          return "Đã hủy"; // Text hiển thị
        default:
          return status;
      }
    },
    async fetchData() {
      this.isLoading = true;
      try {
        const res = await api.get("/api/borrowings");
        this.borrowings = res.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async approve(id) {
      if (!confirm("Xác nhận cho mượn sách?")) return;
      this.isProcessing = id;
      try {
        await api.put(`/api/borrowings/approve/${id}`);
        await this.fetchData();
      } catch (e) {
        alert("Lỗi khi duyệt phiếu.");
      } finally {
        this.isProcessing = null;
      }
    },
    async returnBook(id) {
      if (!confirm("Xác nhận độc giả đã trả sách?")) return;
      this.isProcessing = id;
      try {
        await api.put(`/api/borrowings/return/${id}`);
        await this.fetchData();
      } catch (e) {
        alert("Lỗi khi trả sách.");
      } finally {
        this.isProcessing = null;
      }
    },
    async reject(id) {
      if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;
      this.isProcessing = id;
      try {
        await api.put(`/api/borrowings/reject/${id}`);
        await this.fetchData();
        alert("Đã từ chối yêu cầu.");
      } catch (e) {
        alert("Lỗi khi từ chối.");
      } finally {
        this.isProcessing = null;
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>