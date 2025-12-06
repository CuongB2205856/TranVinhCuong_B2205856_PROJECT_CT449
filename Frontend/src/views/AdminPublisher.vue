<template>
  <v-container class="max-w-7xl mx-auto py-12">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-3xl font-weight-bold text-black">
        Quản Lý Nhà Xuất Bản
      </h2>
      <v-btn color="black" prepend-icon="mdi-plus" @click="openDialog" class="text-white">
        Thêm NXB Mới
      </v-btn>
    </div>

    <v-alert
      v-if="error"
      type="error"
      closable
      class="mb-4"
      @click:close="error = null"
      >{{ error }}</v-alert
    >
    <v-alert
      v-if="success"
      type="success"
      closable
      class="mb-4"
      @click:close="success = null"
      >{{ success }}</v-alert
    >

    <v-data-table
      :headers="headers"
      :items="publishers"
      :loading="isLoading"
      class="elevation-2 rounded-lg border"
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
          color="black"
        ></v-text-field>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="mr-2 text-black" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" class="text-grey-darken-1" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="bg-black text-white pa-4">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem._id"
                  label="Mã NXB"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-identifier"
                  readonly
                  disabled
                  color="grey"
                  hint="Tự động tạo"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.TenNXB"
                  label="Tên Nhà Xuất Bản *"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-domain"
                  :rules="[(v) => !!v || 'Bắt buộc']"
                  color="black"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.DiaChi"
                  :items="provinces"
                  item-title="name"
                  item-value="name" 
                  label="Địa chỉ (Tỉnh / Thành phố)"
                  placeholder="Nhập tên tỉnh để tìm..."
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-map-marker"
                  :loading="loadingProvinces"
                  no-data-text="Đang tải hoặc không có dữ liệu"
                  clearable
                  color="black"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="close">Hủy</v-btn>
          <v-btn
            color="black"
            variant="elevated"
            @click="save"
            :loading="isSaving"
            class="text-white"
            >Lưu</v-btn
          >
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
          <v-btn color="black" variant="elevated" @click="deleteItemConfirm" class="text-white">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PublisherService from "@/services/Publisher.service";
import axios from "axios";

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
      { title: "Địa Chỉ (Tỉnh/Thành)", key: "DiaChi" },
      { title: "Thao tác", key: "actions", sortable: false },
    ],

    editedIndex: -1,
    editedItem: {
      _id: "",
      TenNXB: "",
      DiaChi: "",
    },
    defaultItem: {
      _id: "",
      TenNXB: "",
      DiaChi: "",
    },
    itemToDelete: null,

    provinces: [],
    loadingProvinces: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm NXB Mới" : "Cập Nhật NXB";
    },
  },

  created() {
    this.fetchPublishers();
    this.fetchProvinces();
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

    generateId() {
      const timestamp = Date.now().toString().slice(-6);
      return `NXB${timestamp}`;
    },

    openDialog() {
      this.editedIndex = -1;
      this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
      this.editedItem._id = this.generateId();
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
          await PublisherService.updatePublisher(
            this.editedItem._id,
            this.editedItem
          );
          this.success = "Cập nhật thành công!";
        } else {
          await PublisherService.createPublisher(this.editedItem);
          this.success = "Thêm NXB thành công!";
        }
        await this.fetchPublishers();
        this.close();
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>