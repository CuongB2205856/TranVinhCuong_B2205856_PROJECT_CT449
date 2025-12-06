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

    <v-alert v-if="error" type="error" closable class="mb-4" @click:close="error = null">{{ error }}</v-alert>
    <v-alert v-if="success" type="success" closable class="mb-4" @click:close="success = null">{{ success }}</v-alert>

    <v-data-table
      :headers="headers"
      :items="allBooks"
      :loading="isLoading"
      class="elevation-4 rounded-lg"
      :search="search"
      item-value="_id" 
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Tìm kiếm sách..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="pa-4"
          hide-details
        ></v-text-field>
      </template>

      <template v-slot:item.anh_bia="{ item }">
        <v-img
          :src="item.anh_bia || 'https://placehold.co/100x150?text=No+Image'"
          width="50"
          height="75"
          cover
          class="rounded my-2 border bg-grey-lighten-2"
        ></v-img>
      </template>

      <template v-slot:item.DonGia="{ item }">
        {{ formatCurrency(item.DonGia) }}
      </template>

      <template v-slot:item.SoQuyen="{ item }">
        <v-chip :color="item.SoQuyen > 0 ? 'green' : 'red'" class="font-weight-bold text-white" size="small">
          {{ item.SoQuyen }}
        </v-chip>
      </template>

      <template v-slot:item.NXB="{ item }">
        {{ item.NXB?.TenNXB || 'Chưa cập nhật' }}
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

    <v-dialog v-model="dialog" max-width="900px" persistent>
        <v-card>
        <v-card-title class="bg-primary text-white pa-4">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-container>
            <v-row>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.TenSach"
                      label="Tên Sách *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-book-open-variant"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.TacGia"
                      label="Tác Giả *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-account-edit"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="selectedPublisher"
                      :items="publishers"
                      item-title="TenNXB"
                      item-value="_id" 
                      label="Nhà Xuất Bản *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-domain"
                      return-object
                      :rules="[rules.requiredObject]"
                      @update:modelValue="onPublisherChange"
                      no-data-text="Không tìm thấy NXB"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="editedItem.NamXuatBan"
                      label="Năm XB"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="editedItem.SoQuyen"
                      label="Số Quyển *"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="editedItem.DonGia"
                      label="Đơn Giá *"
                      type="number"
                      variant="outlined"
                      density="compact"
                      suffix="VND"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="4" class="text-center">
                <div class="border rounded-lg pa-4">
                  <v-label class="mb-2 font-weight-bold">Ảnh Bìa</v-label>
                  
                  <v-img
                    :src="previewImage || editedItem.anh_bia || 'https://placehold.co/300x450?text=No+Image'"
                    max-height="250"
                    contain
                    class="bg-grey-lighten-4 rounded mb-4 mx-auto"
                    style="border: 1px dashed #ccc;"
                  ></v-img>

                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    class="d-none"
                    @change="handleFileSelect"
                  />

                  <v-btn 
                    color="primary" 
                    variant="outlined" 
                    prepend-icon="mdi-camera"
                    @click="$refs.fileInput.click()"
                    :loading="isUploading"
                  >
                    {{ editedItem.anh_bia || previewImage ? 'Đổi ảnh' : 'Chọn ảnh' }}
                  </v-btn>
                  
                  <div v-if="selectedFile" class="text-caption mt-2 text-green">
                    Đã chọn: {{ selectedFile.name }}
                  </div>
                </div>
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
        <v-card-text>Bạn có chắc chắn muốn xóa cuốn sách <strong>{{ itemToDelete?.TenSach }}</strong> không?</v-card-text>
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
import BookService from "@/services/Book.service";
import PublisherService from "@/services/Publisher.service"; 
import axios from "axios"; 

export default {
  name: "AdminCatalog",
  data: () => ({
    CLOUDINARY_NAME: import.meta.env.VITE_CLOUDINARY_NAME,
    CLOUDINARY_PRESET: import.meta.env.VITE_CLOUDINARY_PRESET,
    CLOUDINARY_FOLDER: import.meta.env.VITE_CLOUDINARY_FOLDER,

    dialog: false,
    dialogDelete: false,
    isLoading: false,
    isSaving: false,
    isUploading: false,
    error: null,
    success: null,
    search: "",
    
    allBooks: [],
    publishers: [], 
    selectedPublisher: null, 
    
    selectedFile: null,
    previewImage: null,

    headers: [
      { title: "Mã Sách", key: "_id", align: "start" },
      { title: "Ảnh Bìa", key: "anh_bia", sortable: false },
      { title: "Tên Sách", key: "TenSach" },
      { title: "Tác Giả", key: "TacGia" },
      { title: "Giá", key: "DonGia" },
      { title: "Kho", key: "SoQuyen" },
      { title: "NXB", key: "NXB" },
      { title: "Thao tác", key: "actions", sortable: false },
    ],
    
    editedIndex: -1,
    editedItem: {
      MaSach: "",
      TenSach: "",
      DonGia: 0,
      SoQuyen: 0,
      NamXuatBan: new Date().getFullYear(),
      TacGia: "",
      anh_bia: "",
      NXB: { MaNXB: "", TenNXB: "" }
    },
    defaultItem: {
      MaSach: "",
      TenSach: "",
      DonGia: 0,
      SoQuyen: 0,
      NamXuatBan: new Date().getFullYear(),
      TacGia: "",
      anh_bia: "",
      NXB: { MaNXB: "", TenNXB: "" }
    },
    itemToDelete: null,
    
    rules: {
        required: value => !!value || 'Bắt buộc.',
        requiredObject: value => !!value || 'Vui lòng chọn một mục.'
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm Sách Mới" : "Cập Nhật Sách";
    }
  },

  created() {
    this.initData();
  },

  methods: {
    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },

    // --- HÀM initData ĐÃ ĐƯỢC SỬA LẠI ---
    async initData() {
        this.isLoading = true;
        this.error = null;
        try {
            // Tách Promise để lỗi NXB không chặn việc hiển thị sách
            const booksPromise = BookService.getAllBooksAdmin().catch(e => {
                console.error("Lỗi tải sách:", e);
                this.error = "Không thể tải danh sách sách.";
                return [];
            });
            
            const publishersPromise = PublisherService.getAllPublishers().catch(e => {
                console.error("Lỗi tải NXB (có thể do chưa tạo NXB hoặc lỗi route):", e);
                // Không set error ở đây để tránh che mất danh sách sách
                return [];
            });

            const [booksData, publishersData] = await Promise.all([booksPromise, publishersPromise]);
            
            this.allBooks = booksData;
            this.publishers = publishersData;
        } finally {
            this.isLoading = false;
        }
    },

    generateBookId() {
        const timestamp = Date.now().toString().slice(-6); 
        const random = Math.floor(Math.random() * 100); 
        return `S${timestamp}${random}`;
    },

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            alert("Kích thước ảnh quá lớn (>2MB).");
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
            alert("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP).");
            return;
        }

        this.selectedFile = file;
        this.previewImage = URL.createObjectURL(file);
    },

    async uploadToCloudinary() {
        if (!this.selectedFile) return null;

        this.isUploading = true;
        try {
            const formData = new FormData();
            formData.append("file", this.selectedFile);
            formData.append("upload_preset", this.CLOUDINARY_PRESET);
            formData.append("folder", `${this.CLOUDINARY_FOLDER}/books`); 

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_NAME}/image/upload`,
                formData
            );
            return res.data.secure_url;
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error("Lỗi khi tải ảnh lên Cloudinary.");
        } finally {
            this.isUploading = false;
        }
    },

    openDialog() {
        this.editedIndex = -1;
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.editedItem.MaSach = this.generateBookId();
        
        this.selectedFile = null;
        this.previewImage = null;
        this.selectedPublisher = null;
        this.dialog = true;
    },

    editItem(item) {
      // SỬA: Tìm index bằng ID thay vì object reference
      this.editedIndex = this.allBooks.findIndex(b => b._id === item._id);
      this.editedItem = JSON.parse(JSON.stringify(item));
      
      this.selectedFile = null;
      this.previewImage = null;

      // SỬA: Logic map NXB an toàn hơn
      const maNXB = item.NXB?.MaNXB;
      if (maNXB) {
          this.selectedPublisher = this.publishers.find(p => p._id === maNXB) || null;
          // Fallback: Nếu không tìm thấy trong list (VD: NXB bị xóa), vẫn hiện tên cũ
          if (!this.selectedPublisher && item.NXB.TenNXB) {
               this.selectedPublisher = { _id: maNXB, TenNXB: item.NXB.TenNXB };
          }
      } else {
          this.selectedPublisher = null;
      }
      
      if(!this.editedItem.MaSach) this.editedItem.MaSach = item._id;
      
      this.dialog = true;
    },
    
    onPublisherChange(val) {
        if (val) {
            this.editedItem.NXB = { MaNXB: val._id, TenNXB: val.TenNXB };
        } else {
            this.editedItem.NXB = { MaNXB: "", TenNXB: "" };
        }
    },

    deleteItem(item) {
      this.itemToDelete = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await BookService.deleteBook(this.itemToDelete._id);
        this.success = "Đã xóa sách thành công.";
        this.initData(); 
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
        this.selectedPublisher = null;
        this.selectedFile = null;
        this.previewImage = null;
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
      if (!this.editedItem.TenSach || !this.editedItem.TacGia || !this.editedItem.NXB.MaNXB) {
          this.error = "Vui lòng điền đầy đủ các trường bắt buộc (*)";
          return;
      }

      this.isSaving = true;
      try {
        if (this.selectedFile) {
            const imageUrl = await this.uploadToCloudinary();
            if (imageUrl) {
                this.editedItem.anh_bia = imageUrl;
            }
        }

        const payload = { ...this.editedItem };
        if (this.editedIndex === -1) {
            payload._id = payload.MaSach;
        }

        if (this.editedIndex > -1) {
          await BookService.updateBook(this.editedItem._id, payload);
          this.success = "Cập nhật sách thành công!";
        } else {
          await BookService.createBook(payload);
          this.success = "Thêm sách mới thành công!";
        }
        
        await this.initData(); 
        this.close();

      } catch (err) {
        console.error(err);
        this.error = err.message || err.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>