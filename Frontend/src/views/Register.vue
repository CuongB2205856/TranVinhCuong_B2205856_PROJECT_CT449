<template>
  <v-container class="d-flex justify-center align-center h-100vh">
    <v-card
      class="pa-8 rounded-xl shadow-lg w-full"
      max-width="500"
      elevation="10"
    >
      <div class="text-center mb-6">
        <h2 class="text-3xl font-weight-bold text-success mt-2">
          Đăng Ký Tài Khoản Độc Giả
        </h2>
        <v-alert v-if="serverError" type="error" dense text class="mt-3">
          {{ serverError }}
        </v-alert>
      </div>

      <Form
        @submit="submitRegister"
        :validation-schema="schema"
        class="space-y-5"
      >
        <v-row>
          <v-col cols="6" class="py-0">
            <Field name="hoLot" v-slot="{ field, errors }">
              <v-text-field
                v-bind="field"
                label="Họ lót"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                color="primary"
                :error-messages="errors"
              />
            </Field>
          </v-col>
          <v-col cols="6" class="py-0">
            <Field name="ten" v-slot="{ field, errors }">
              <v-text-field
                v-bind="field"
                label="Tên"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                color="primary"
                :error-messages="errors"
              />
            </Field>
          </v-col>
        </v-row>
        <Field name="phai" v-slot="{ field, errors }">
          <v-select
            v-bind="field"
            label="Giới tính"
            prepend-inner-icon="mdi-gender-male-female"
            :items="['Nam', 'Nữ', 'Khác']"
            variant="outlined"
            color="primary"
            :error-messages="errors"
          />
        </Field>
        <Field name="dienThoai" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            label="Số điện thoại (Dùng làm tài khoản)"
            prepend-inner-icon="mdi-phone-outline"
            variant="outlined"
            color="primary"
            :error-messages="errors"
          />
        </Field>

        <Field name="password" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            :type="showPassword ? 'text' : 'password'"
            label="Mật khẩu"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            :error-messages="errors"
          />
        </Field>

        <Field name="confirmPassword" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            :type="showPassword ? 'text' : 'password'"
            label="Nhập lại mật khẩu"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            :error-messages="errors"
          />
        </Field>

        <v-btn
          type="submit"
          color="success"
          class="w-full py-6 font-weight-bold text-lg"
          depressed
          block
        >
          Đăng Ký Tài Khoản
        </v-btn>
      </Form>

      <p class="text-sm text-center mt-4">
        Đã có tài khoản?
        <router-link to="/login" class="text-primary font-weight-medium"
          >Đăng nhập</router-link
        >
      </p>
    </v-card>
  </v-container>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import api from "@/services/api.service"; // Sử dụng Axios Instance

export default {
  name: "Register",
  components: { Form, Field },
  data() {
    return {
      showPassword: false,
      serverError: "",
      // Định nghĩa Validation Schema
      schema: yup.object({
        hoLot: yup.string().required("Họ lót không được để trống"),
        ten: yup.string().required("Tên không được để trống"),
        dienThoai: yup
          .string()
          .required("Số điện thoại không được để trống")
          .matches(
            /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
            "Số điện thoại không hợp lệ."
          ),
        password: yup
          .string()
          .required("Mật khẩu không được để trống")
          .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password")], "Mật khẩu không khớp")
          .required("Vui lòng nhập lại mật khẩu"),
      }),
    };
  },
  methods: {
    // Hàm tạo MaDocGia tự động (sử dụng thời gian và 4 số cuối SĐT)
    generateMaDocGia(dienThoai) {
      const timestampSuffix = Date.now().toString().slice(-4);
      const lastFourDigits = dienThoai.slice(-4);
      return "DG" + lastFourDigits + timestampSuffix;
    },

    async submitRegister(values) {
      this.serverError = "";
      try {
        // 1. Tạo MaDocGia tự động (DGXXXX)
        const maDocGia = this.generateMaDocGia(values.dienThoai);

        // 2. GỌI API ĐĂNG KÝ
        // Endpoint: POST /api/docgia
        const response = await api.post("/api/docgia", {
          // DỮ LIỆU ĐƯỢC MAP THEO BACKEND MODEL
          _id: maDocGia,
          HoLot: values.hoLot,
          Ten: values.ten,
          DienThoai: values.dienThoai,
          Password: values.password, // Mật khẩu sẽ được hash trong Model
          Phai: "Khác", // Giá trị mặc định
          // NgaySinh: new Date().toISOString() // Có thể thêm nếu cần
        });

        alert(
          `Đăng ký thành công! Mã số Độc giả của bạn là: ${maDocGia}. Vui lòng đăng nhập.`
        );
        this.$router.push("/login");
      } catch (error) {
        console.error("Lỗi đăng ký:", error.response?.data);
        // Xử lý lỗi trùng lặp (E11000) hoặc lỗi validation
        this.serverError =
          error.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng kiểm tra SĐT/dữ liệu.";
      }
    },
  },
};
</script>

<style scoped>
.h-100vh {
  height: 100vh;
}
.py-0 {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
