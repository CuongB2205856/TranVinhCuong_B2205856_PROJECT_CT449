<template>
  <v-container class="d-flex justify-center align-center h-100vh">
    <v-card
      class="pa-8 rounded-xl shadow-lg w-full"
      max-width="450"
      elevation="10"
    >
      <div class="text-center mb-6">
        <v-icon size="50" color="red-darken-3">mdi-security</v-icon>
        <h2 class="text-3xl font-weight-bold text-red-darken-3 mt-2">
          Đăng Nhập Nhân viên
        </h2>
        <v-alert v-if="serverError" type="error" dense text class="mt-3">
          {{ serverError }}
        </v-alert>
      </div>

      <Form @submit="submitLogin" :validation-schema="schema" class="space-y-5">
        <Field name="msnv" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            label="Mã số Nhân viên (MSNV)"
            prepend-inner-icon="mdi-account-key-outline"
            variant="outlined"
            color="red-darken-3"
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
            color="red-darken-3"
            :error-messages="errors"
          />
        </Field>

        <v-btn
          type="submit"
          color="red-darken-3"
          class="w-full py-6 font-weight-bold text-lg"
          block
          depressed
        >
          Đăng nhập
        </v-btn>
      </Form>
    </v-card>
  </v-container>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import api from "@/services/api.service";
import AuthService from "@/services/Auth.service";

export default {
  name: "AdminLoginPage",
  components: { Form, Field },
  data() {
    return {
      showPassword: false,
      serverError: "",
      schema: yup.object({
        msnv: yup.string().required("Mã số NV không được để trống"),
        password: yup.string().required("Mật khẩu không được để trống"),
      }),
    };
  },
  methods: {
    async submitLogin(values) {
      this.serverError = "";
      try {
        // SỬA: Gọi loginStaff
        const { token, data } = await AuthService.loginStaff(values.msnv, values.password);
        const user = data.user;

        // Backend trả về user, kiểm tra Chucvu (hoặc Position nếu đã đổi trong Model)
        // Lưu ý: Model Staff giữ nguyên field 'Chucvu'
        if (!user.Chucvu && !user.Position) {
          this.serverError = "Không có quyền truy cập.";
          return;
        }

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        this.$router.push("/admin/dashboard");
      } catch (error) {
        this.serverError = error.response?.data?.message || "Đăng nhập thất bại.";
      }
    },
  },
};
</script>
