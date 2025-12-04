<template>
  <v-container class="max-w-7xl mx-auto py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-3xl font-weight-bold text-red-darken-3">
        Quản Lý Nhà Xuất Bản
      </h2>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">
        Thêm NXB Mới
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" closable class="mb-4">{{ error }}</v-alert>
    <v-alert v-if="success" type="success" closable class="mb-4">{{ success }}</v-alert>

    <v-data-table
      :headers="headers"
      :items="publishers"
      :loading="isLoading"
      class="elevation-4 rounded-lg"
      :search="search"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Tìm kiếm nhà xuất bản..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="pa-4"
          hide-details
        ></v-text-field>
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

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.TenNXB"
                  label="Tên Nhà Xuất Bản *"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-domain"
                  :rules="[v => !!v || 'Bắt buộc']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.DiaChi"
                  label="Địa Chỉ"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="close">Hủy</v-btn>
          <v-btn color="primary" variant="elevated" @click="save" :loading="isSaving">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Xác nhận xóa</v-card-title>
        <v-card-text>Bạn có chắc chắn muốn xóa NXB <strong>{{ itemToDelete?.TenNXB }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDelete">Hủy</v-btn>
          <v-btn color="red" variant="elevated" @click="deleteItemConfirm">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PublisherService from "@/services/Publisher.service";

export default {
  name: "AdminPublisher",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    isLoading: false,
    isSaving: false,
    error: null,
    success: null,
    search: "",
    
    publishers: [],
    
    headers: [
      { title: "Mã NXB", key: "_id", align: "start" },
      { title: "Tên NXB", key: "TenNXB" },
      { title: "Địa Chỉ", key: "DiaChi" },
      { title: "Thao tác", key: "actions", sortable: false },
    ],
    
    editedIndex: -1,
    editedItem: {
      TenNXB: "",
      DiaChi: ""
    },
    defaultItem: {
      TenNXB: "",
      DiaChi: ""
    },
    itemToDelete: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm NXB Mới" : "Cập Nhật NXB";
    },
  },

  created() {
    this.fetchPublishers();
  },

  methods: {
    async fetchPublishers() {
      this.isLoading = true;
      try {
        this.publishers = await PublisherService.getAllPublishers();
      } catch (err) {
        this.error = "Lỗi tải dữ liệu NXB.";
      } finally {
        this.isLoading = false;
      }
    },

    openDialog() {
      this.editedIndex = -1;
      this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.publishers.indexOf(item);
      this.editedItem = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },

    deleteItem(item) {
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await PublisherService.deletePublisher(this.itemToDelete._id);
        this.success = "Đã xóa NXB thành công.";
        this.fetchPublishers();
      } catch (err) {
        // Hiển thị lỗi từ backend (ví dụ: NXB đang có sách)
        this.error = err.response?.data?.message || "Xóa thất bại.";
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.editedIndex = -1;
        this.error = null;
        this.success = null;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.itemToDelete = null;
      });
    },

    async save() {
      if (!this.editedItem.TenNXB) return;

      this.isSaving = true;
      try {
        if (this.editedIndex > -1) {
          // UPDATE
          await PublisherService.updatePublisher(this.editedItem._id, this.editedItem);
          this.success = "Cập nhật thành công!";
        } else {
          // CREATE
          await PublisherService.createPublisher(this.editedItem);
          this.success = "Thêm NXB thành công!";
        }
        await this.fetchPublishers();
        this.close();
      } catch (err) {
        this.error = err.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>