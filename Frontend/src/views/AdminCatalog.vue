<template>
  <v-container class="max-w-7xl mx-auto py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-3xl font-weight-bold text-red-darken-3">
        Quản Lý Kho Sách
      </h2>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">
        Thêm Sách Mới
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" closable class="mb-4">{{ error }}</v-alert>
    <v-alert v-if="success" type="success" closable class="mb-4">{{ success }}</v-alert>

    <v-data-table
      :headers="headers"
      :items="allBooks"
      :loading="isLoading"
      class="elevation-4 rounded-lg"
    >
      <template v-slot:item.DonGia="{ item }">
        {{ formatCurrency(item.DonGia) }}
      </template>

      <template v-slot:item.SoQuyen="{ item }">
        <v-chip :color="item.SoQuyen > 0 ? 'green' : 'red'" dark small>
          {{ item.SoQuyen }}
        </v-chip>
      </template>

      <template v-slot:item.NXB="{ item }">
        {{ item.NXB?.TenNXB }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="mr-2 text-blue-500" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" class="text-red-500" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="editedItem.MaSach"
                  label="Mã Sách (Tùy chọn)"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="editedItem.TenSach"
                  label="Tên Sách *"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.DonGia"
                  label="Đơn Giá *"
                  type="number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.SoQuyen"
                  label="Số Quyển *"
                  type="number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.NamXuatBan"
                  label="Năm Xuất Bản"
                  type="number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.TacGia"
                  label="Tác Giả"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                  <span class="text-subtitle-2 font-weight-bold">Thông tin Nhà Xuất Bản</span>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="editedItem.NXB.MaNXB"
                  label="Mã NXB *"
                  variant="outlined"
                  density="compact"
                  placeholder="VD: NXB01"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="editedItem.NXB.TenNXB"
                  label="Tên NXB *"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">Hủy</v-btn>
          <v-btn color="blue-darken-1" variant="elevated" @click="save">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Bạn có chắc chắn muốn xóa sách này?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Hủy</v-btn>
          <v-btn color="red-darken-1" variant="elevated" @click="deleteItemConfirm">Xóa</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import BookService from "@/services/Book.Service";

export default {
  name: "AdminCatalog",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    isLoading: true,
    error: null,
    success: null,
    allBooks: [],
    headers: [
      { title: "Mã Sách", key: "_id", align: "start" },
      { title: "Tên Sách", key: "TenSach" },
      { title: "Đơn Giá", key: "DonGia" },
      { title: "Kho", key: "SoQuyen" },
      { title: "NXB", key: "NXB" },
      { title: "Thao tác", key: "actions", sortable: false },
    ],
    editedIndex: -1,
    // Cấu trúc mặc định khớp với Model Backend
    editedItem: {
      MaSach: "", // Dùng cho trường hợp nhập tay _id
      TenSach: "",
      DonGia: 0,
      SoQuyen: 0,
      NamXuatBan: new Date().getFullYear(),
      TacGia: "",
      NXB: {
          MaNXB: "",
          TenNXB: ""
      }
    },
    defaultItem: {
      MaSach: "",
      TenSach: "",
      DonGia: 0,
      SoQuyen: 0,
      NamXuatBan: new Date().getFullYear(),
      TacGia: "",
      NXB: {
          MaNXB: "",
          TenNXB: ""
      }
    },
    itemToDelete: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm Sách Mới" : "Cập Nhật Sách";
    },
  },

  created() {
    this.fetchAllBooks();
  },

  methods: {
    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },

    async fetchAllBooks() {
      this.isLoading = true;
      try {
        this.allBooks = await BookService.getAllBooksAdmin();
      } catch (err) {
        this.error = "Lỗi tải dữ liệu. Bạn có thể cần đăng nhập lại.";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    openDialog() {
        this.editedIndex = -1;
        // Deep copy để tránh tham chiếu object con (NXB)
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.allBooks.indexOf(item);
      // Deep copy item vào editedItem
      this.editedItem = JSON.parse(JSON.stringify(item));
      // Nếu có _id, gán vào MaSach để hiển thị (tùy chọn)
      if(!this.editedItem.MaSach) this.editedItem.MaSach = item._id;
      
      this.dialog = true;
    },

    deleteItem(item) {
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await BookService.deleteBook(this.itemToDelete._id);
        this.success = "Đã xóa sách thành công.";
        this.fetchAllBooks(); // Tải lại danh sách
      } catch (err) {
        this.error = "Xóa thất bại. Có thể sách đang được mượn.";
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.itemToDelete = null;
      });
    },

    async save() {
      // Validate cơ bản
      if (!this.editedItem.TenSach || !this.editedItem.NXB.MaNXB) {
          this.error = "Vui lòng nhập Tên sách và thông tin NXB.";
          setTimeout(() => this.error = null, 3000);
          return;
      }

      try {
        // Chuẩn bị payload
        const payload = { ...this.editedItem };
        // Nếu tạo mới và người dùng nhập MaSach, backend dùng nó làm _id
        if (this.editedIndex === -1 && payload.MaSach) {
            payload._id = payload.MaSach;
        }

        if (this.editedIndex > -1) {
          // --- UPDATE ---
          // Backend route: PUT /api/sach/:id
          await BookService.updateBook(this.editedItem._id, payload);
          this.success = "Cập nhật thành công!";
        } else {
          // --- CREATE ---
          // Backend route: POST /api/sach
          await BookService.createBook(payload);
          this.success = "Thêm sách mới thành công!";
        }
        
        this.fetchAllBooks(); // Refresh list
        this.close();

      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      }
    },
  },
};
</script>