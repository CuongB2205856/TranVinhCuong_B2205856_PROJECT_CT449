<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="12" sm="10" md="8">
      <v-card class="pa-8 elevation-8">
        <v-card-title class="text-h5 mb-4">Xác Nhận Mượn Sách</v-card-title>
        
        <v-form>
          <v-alert type="info" border="left" class="mb-4">
            Bạn đang mượn: **Bí Mật Của Nước** (Tác giả A)
          </v-alert>

          <v-text-field label="Tên độc giả" model-value="Nguyễn Văn A" variant="outlined" readonly></v-text-field>
          <v-text-field label="Email" model-value="a@example.com" variant="outlined" readonly></v-text-field>

          <v-text-field 
            label="Ngày trả dự kiến" 
            model-value="2025-11-21" 
            type="date"
            variant="outlined"
            required
            hint="Thời gian mượn tối đa 14 ngày"
          ></v-text-field>

          <v-btn color="success" size="large" block class="mt-4">
            Hoàn Tất Mượn Sách
          </v-btn>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>