<template>
  <div
    class="h-auto min-h-[90vh] flex justify-center items-center bg-white my-10"
  >
    <v-card
      class="mx-auto pa-6 rounded-xl shadow-md border border-gray-200 bg-white"
      elevation="4"
      max-width="400"
      width="100%"
    >
      <div class="text-center mb-6 mt-2">
        <v-icon size="40" class="text-black mb-2">mdi-shield-account</v-icon>
        <h2 class="text-xl font-bold text-black">Đăng nhập Quản trị</h2>
        <v-alert
          v-if="serverError"
          type="error"
          dense
          variant="tonal"
          class="mt-4 text-left text-sm"
          closable
        >
          {{ serverError }}
        </v-alert>
      </div>

      <Form @submit="submitLogin" :validation-schema="schema" class="space-y-4">
        <Field name="msnv" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            label="Mã số Nhân viên"
            prepend-inner-icon="mdi-card-account-details-outline"
            variant="outlined"
            density="comfortable"
            color="black"
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
            density="comfortable"
            color="black"
            :error-messages="errors"
          />
        </Field>

        <v-btn
          block
          type="submit"
          color="black"
          class="text-white w-full mt-2 font-bold"
          variant="elevated"
          size="large"
          :loading="isLoading"
        >
          Đăng nhập
        </v-btn>
      </Form>

      <p class="text-sm text-gray-600 text-center mt-6">
        <router-link to="/" class="text-black font-weight-bold hover:underline">
          Quay về Trang chủ
        </router-link>
      </p>
    </v-card>
  </div>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/Auth.service";

export default {
  name: "AdminLoginPage",
  components: { Form, Field },
  data() {
    return {
      showPassword: false,
      serverError: "",
      isLoading: false,
      schema: yup.object({
        msnv: yup.string().required("Mã số NV không được để trống"),
        password: yup.string().required("Mật khẩu không được để trống"),
      }),
    };
  },
  methods: {
    async submitLogin(values) {
      this.isLoading = true;
      this.serverError = "";
      try {
        const { token, data } = await AuthService.loginStaff(
          values.msnv,
          values.password
        );
        const user = data.user;

        if (!user.Chucvu && !user.Position) {
          this.serverError = "Không có quyền truy cập.";
          return;
        }

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        this.$router.push("/admin/dashboard");
      } catch (error) {
        this.serverError =
          error.response?.data?.message || "Đăng nhập thất bại.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
