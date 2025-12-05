<template>
  <v-container class="max-w-4xl mx-auto py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-lg pa-6" elevation="10">
          <div class="d-flex flex-column align-center mb-6">
            <div class="position-relative">
              <v-avatar color="primary" size="120" class="elevation-4">
                <v-img
                  v-if="userData.HinhAnh"
                  :src="userData.HinhAnh"
                  alt="Avatar"
                  cover
                ></v-img>
                <span v-else class="text-5xl text-white font-weight-bold">
                  {{ userInitials }}
                </span>
              </v-avatar>

              <v-btn
                icon="mdi-camera"
                size="small"
                color="white"
                class="avatar-edit-btn shadow-md text-primary"
                @click="triggerFileInput"
                :loading="isUploading"
              ></v-btn>

              <input
                ref="fileInput"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                class="d-none"
                @change="handleFileUpload"
              />
            </div>

            <h2 class="text-2xl font-bold text-gray-800 mt-4">
              {{ userData.HoLot }} {{ userData.Ten }}
            </h2>
            <v-chip color="primary" variant="outlined" class="mt-2">
              Độc giả
            </v-chip>
          </div>

          <v-divider class="my-4"></v-divider>
          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-phone</v-icon>
              </template>
              <v-list-item-title class="font-weight-bold"
                >Số điện thoại</v-list-item-title
              >
              <v-list-item-subtitle class="text-base text-gray-700 mt-1">
                {{ userData.DienThoai }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mt-2">
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4"
                  >mdi-gender-male-female</v-icon
                >
              </template>
              <v-list-item-title class="font-weight-bold"
                >Giới tính</v-list-item-title
              >
              <v-list-item-subtitle class="text-base text-gray-700 mt-1">
                {{ userData.Phai }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-center gap-4 mt-8 mb-6">
            <v-btn
              prepend-icon="mdi-pencil"
              color="primary"
              variant="elevated"
              @click="openEditDialog"
            >
              Cập nhật thông tin
            </v-btn>
            <v-btn
              prepend-icon="mdi-lock-reset"
              color="error"
              variant="outlined"
              @click="dialogPassword = true"
            >
              Đổi mật khẩu
            </v-btn>
          </div>

          <v-divider class="my-6"></v-divider>
          <h3 class="text-xl font-bold text-gray-800 mb-4 ml-2">
            <v-icon color="primary" class="mr-2">mdi-history</v-icon>
            Lịch Sử Mượn Sách
          </h3>

          <v-data-table
  :headers="historyHeaders"
  :items="borrowHistory"
  :loading="historyLoading"
  class="elevation-1 border rounded"
  no-data-text="Bạn chưa mượn cuốn sách nào."
>
  <template v-slot:item.TrangThai="{ item }">
      <v-chip :color="getStatusColor(item.TrangThai)" size="small" class="text-white font-weight-bold">
          {{ getStatusText(item.TrangThai) }}
      </v-chip>
  </template>
  
  <template v-slot:item.NgayMuon="{ item }">
      {{ formatDate(item.NgayMuon) }}
  </template>
  
  <template v-slot:item.NgayTra="{ item }">
      {{ item.NgayTra ? formatDate(item.NgayTra) : '-' }}
  </template>

  <template v-slot:item.actions="{ item }">
    <v-btn
      v-if="item.TrangThai === 'cho_xac_nhan'"
      color="error"
      variant="outlined"
      size="x-small"
      @click="handleCancelBorrowing(item)"
      :loading="cancelingId === item._id"
    >
      Hủy yêu cầu
    </v-btn>
  </template>
</v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogEdit" max-width="600px" persistent>
      <v-card class="rounded-xl">
        <v-card-title
          class="text-h5 font-weight-bold pa-4 bg-primary text-white"
        >
          <v-icon class="mr-2">mdi-account-edit</v-icon>
          Cập nhật hồ sơ
        </v-card-title>
        <v-card-text class="pt-6">
          <Form
            :key="formKey"
            @submit="submitUpdateInfo"
            :validation-schema="infoSchema"
            :initial-values="editingData"
          >
            <v-row>
              <v-col cols="12" sm="6">
                <Field name="HoLot" v-slot="{ field, errors }">
                  <v-text-field
                    v-bind="field"
                    :model-value="field.value"
                    label="Họ lót"
                    variant="outlined"
                    color="primary"
                    :error-messages="errors"
                  ></v-text-field>
                </Field>
              </v-col>
              <v-col cols="12" sm="6">
                <Field name="Ten" v-slot="{ field, errors }">
                  <v-text-field
                    v-bind="field"
                    :model-value="field.value"
                    label="Tên"
                    variant="outlined"
                    color="primary"
                    :error-messages="errors"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>
            <Field name="Phai" v-slot="{ field, errors }">
              <v-select
                v-bind="field"
                :model-value="field.value"
                label="Giới tính"
                :items="['Nam', 'Nữ', 'Khác']"
                variant="outlined"
                color="primary"
                :error-messages="errors"
              ></v-select>
            </Field>
            <Field name="DienThoai" v-slot="{ field, errors }">
              <v-text-field
                v-bind="field"
                :model-value="field.value"
                label="Số điện thoại"
                variant="outlined"
                color="primary"
                :error-messages="errors"
              ></v-text-field>
            </Field>
            <div class="d-flex justify-end mt-4 gap-2">
              <v-btn
                variant="text"
                color="grey-darken-1"
                @click="dialogEdit = false"
                >Hủy bỏ</v-btn
              >
              <v-btn type="submit" color="primary" :loading="isLoading"
                >Lưu thay đổi</v-btn
              >
            </div>
          </Form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPassword" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title
          class="text-h5 font-weight-bold pa-4 bg-red-darken-1 text-white"
        >
          <v-icon class="mr-2">mdi-lock-reset</v-icon>
          Đổi mật khẩu
        </v-card-title>
        <v-card-text class="pt-6">
          <v-alert
            v-if="pwdError"
            type="error"
            dense
            class="mb-4"
            closable
            @click:close="pwdError = ''"
            >{{ pwdError }}</v-alert
          >
          <Form @submit="submitChangePassword" :validation-schema="pwdSchema">
            <Field name="currentPassword" v-slot="{ field, errors }">
              <v-text-field
                v-bind="field"
                label="Mật khẩu hiện tại"
                :type="showPass ? 'text' : 'password'"
                variant="outlined"
                color="error"
                prepend-inner-icon="mdi-key"
                :error-messages="errors"
                class="mb-2"
              ></v-text-field>
            </Field>
            <v-divider class="my-2 mb-4"></v-divider>
            <Field name="newPassword" v-slot="{ field, errors }">
              <v-text-field
                v-bind="field"
                label="Mật khẩu mới"
                :type="showPass ? 'text' : 'password'"
                variant="outlined"
                color="error"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPass = !showPass"
                :error-messages="errors"
                class="mb-2"
              ></v-text-field>
            </Field>
            <Field name="confirmPassword" v-slot="{ field, errors }">
              <v-text-field
                v-bind="field"
                label="Nhập lại mật khẩu mới"
                :type="showPass ? 'text' : 'password'"
                variant="outlined"
                color="error"
                prepend-inner-icon="mdi-lock-check-outline"
                :error-messages="errors"
              ></v-text-field>
            </Field>
            <div class="d-flex justify-end mt-4 gap-2">
              <v-btn
                variant="text"
                color="grey-darken-1"
                @click="dialogPassword = false"
                >Hủy bỏ</v-btn
              >
              <v-btn type="submit" color="error" :loading="isLoading"
                >Xác nhận</v-btn
              >
            </div>
          </Form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import axios from "axios";
import ReaderService from "@/services/Reader.service";
import BorrowingService from "@/services/Borrowing.service"; // Import Service

export default {
  name: "ProfilePage",
  components: { Form, Field },
  data() {
    return {
      CLOUDINARY_NAME: import.meta.env.VITE_CLOUDINARY_NAME,
      CLOUDINARY_PRESET: import.meta.env.VITE_CLOUDINARY_PRESET,
      CLOUDINARY_FOLDER: import.meta.env.VITE_CLOUDINARY_FOLDER,
      cancelingId: null,

      dialogEdit: false,
      dialogPassword: false,
      isLoading: false,
      isUploading: false,
      showPass: false,
      pwdError: "",
      formKey: 0,

      userData: {
        _id: "",
        HoLot: "",
        Ten: "",
        Phai: "Khác",
        DienThoai: "",
        HinhAnh: "",
      },
      editingData: {},
      snackbar: { show: false, message: "", color: "success" },

      // --- Dữ liệu cho Lịch sử mượn ---
      historyLoading: false,
      historyHeaders: [
        { title: "Sách", key: "MaSach.TenSach" },
        { title: "Ngày mượn", key: "NgayMuon" },
        { title: "Ngày trả", key: "NgayTra" },
        { title: "Trạng thái", key: "TrangThai" },
        { title: "Thao tác", key: "actions", sortable: false }, // Thêm cột này
      ],
      // -------------------------------

      infoSchema: yup.object({
        HoLot: yup.string().required("Họ lót không được để trống"),
        Ten: yup.string().required("Tên không được để trống"),
        Phai: yup.string().required("Vui lòng chọn giới tính"),
        DienThoai: yup
          .string()
          .required("SĐT không được để trống")
          .matches(
            /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
            "Số điện thoại không hợp lệ"
          ),
      }),

      pwdSchema: yup.object({
        currentPassword: yup
          .string()
          .required("Vui lòng nhập mật khẩu hiện tại"),
        newPassword: yup
          .string()
          .required("Nhập mật khẩu mới")
          .min(6, "Mật khẩu phải ít nhất 6 ký tự")
          .notOneOf(
            [yup.ref("currentPassword")],
            "Mật khẩu mới không được trùng mật khẩu cũ"
          ),
        confirmPassword: yup
          .string()
          .required("Vui lòng nhập lại mật khẩu mới")
          .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp"),
      }),
    };
  },
  computed: {
    userInitials() {
      return this.userData.Ten ? this.userData.Ten.charAt(0).toUpperCase() : "";
    },
  },
  methods: {
    loadUser() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.userData = JSON.parse(storedUser);
      } else {
        this.$router.push("/login");
      }
    },

    // --- Hàm xử lý Lịch sử mượn ---
    async fetchHistory() {
      this.historyLoading = true;
      try {
        this.borrowHistory = await BorrowingService.getMyBorrowings();
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        this.historyLoading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },
    getStatusColor(status) {
        if(status === 'cho_xac_nhan') return 'orange';
        if(status === 'dang_muon') return 'blue';
        if(status === 'da_tra') return 'green';
        if(status === 'da_tu_choi') return 'red';
        if(status === 'da_huy') return 'grey'; // Thêm màu cho trạng thái hủy
        return 'grey';
    },

    getStatusText(status) {
        if(status === 'cho_xac_nhan') return 'Chờ duyệt';
        if(status === 'dang_muon') return 'Đang mượn';
        if(status === 'da_tra') return 'Đã trả';
        if(status === 'da_tu_choi') return 'Đã bị từ chối';
        if(status === 'da_huy') return 'Đã hủy'; // Thêm text hiển thị
        return status;
    },

    // Hàm xử lý sự kiện bấm nút Hủy
    async handleCancelBorrowing(item) {
        if(!confirm(`Bạn có chắc muốn hủy yêu cầu mượn sách "${item.MaSach?.TenSach}" không?`)) return;

        this.cancelingId = item._id;
        try {
            await BorrowingService.cancelBorrowing(item._id);
            this.showSnackbar("Đã hủy yêu cầu mượn sách.", "success");
            
            // Load lại danh sách để cập nhật trạng thái mới
            await this.fetchHistory(); 
        } catch (error) {
            console.error(error);
            this.showSnackbar(error.response?.data?.message || "Lỗi khi hủy phiếu.", "error");
        } finally {
            this.cancelingId = null;
        }
    },
    // -----------------------------

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        this.showSnackbar("Chỉ chấp nhận file ảnh (JPG, PNG).", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.showSnackbar("Dung lượng ảnh phải nhỏ hơn 2MB.", "error");
        return;
      }

      this.isUploading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", this.CLOUDINARY_PRESET);
        formData.append("folder", `${this.CLOUDINARY_FOLDER}/avatar`);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_NAME}/image/upload`,
          formData
        );

        const imageUrl = res.data.secure_url;

        await ReaderService.updateReader(this.userData._id, {
          HinhAnh: imageUrl,
        });

        this.userData.HinhAnh = imageUrl;
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const newUser = { ...currentUser, HinhAnh: imageUrl };
        localStorage.setItem("user", JSON.stringify(newUser));

        this.showSnackbar("Cập nhật ảnh đại diện thành công!", "success");
      } catch (error) {
        console.error(error);
        this.showSnackbar("Lỗi khi upload ảnh.", "error");
      } finally {
        this.isUploading = false;
        event.target.value = null;
      }
    },

    openEditDialog() {
      if (!this.userData || !this.userData._id) return;
      this.editingData = { ...this.userData };
      this.formKey++;
      this.dialogEdit = true;
    },

    async submitUpdateInfo(values) {
      this.isLoading = true;
      try {
        const updateData = {
          HoLot: values.HoLot,
          Ten: values.Ten,
          Phai: values.Phai,
          DienThoai: values.DienThoai,
        };
        await ReaderService.updateReader(this.userData._id, updateData);

        const newUser = { ...this.userData, ...updateData };
        localStorage.setItem("user", JSON.stringify(newUser));
        this.userData = newUser;

        this.showSnackbar("Cập nhật thông tin thành công!", "success");
        this.dialogEdit = false;
      } catch (error) {
        this.showSnackbar(
          error.response?.data?.message || "Lỗi cập nhật.",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    async submitChangePassword(values, { resetForm }) {
      this.isLoading = true;
      this.pwdError = "";
      try {
        await ReaderService.updateReader(this.userData._id, {
          OldPassword: values.currentPassword,
          Password: values.newPassword,
        });
        this.showSnackbar(
          "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
          "success"
        );
        this.dialogPassword = false;
        resetForm();
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        this.pwdError =
          error.response?.data?.message || "Đổi mật khẩu thất bại.";
      } finally {
        this.isLoading = false;
      }
    },

    showSnackbar(msg, color) {
      this.snackbar.message = msg;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
  created() {
    this.loadUser();
    this.fetchHistory(); // Gọi API lấy lịch sử khi vào trang
  },
};
</script>

<style scoped>
.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid white !important;
  z-index: 10;
  background-color: #5865f2 !important;
}
.position-relative {
  position: relative;
  display: inline-block;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-4 {
  gap: 1rem;
}
</style>
