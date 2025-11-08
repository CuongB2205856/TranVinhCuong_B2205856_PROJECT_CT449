<template>
  <div>
    <h2>📚 Tất Cả Sách</h2>
    
    <v-row class="my-4">
      <v-col cols="12" md="8">
        <v-text-field
          label="Tìm kiếm sách, tác giả..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          label="Sắp xếp theo"
          :items="['Tên sách', 'Tác giả', 'Ngày phát hành']"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="book in books" :key="book.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto" elevation="4">
          <v-img
            :src="book.cover"
            height="200px"
            cover
            @click="$emit('view-detail', book.id)"
            style="cursor: pointer;"
          ></v-img>

          <v-card-title>{{ book.title }}</v-card-title>
          <v-card-subtitle>{{ book.author }}</v-card-subtitle>

          <v-card-actions>
            <v-chip :color="book.status === 'Còn hàng' ? 'success' : 'warning'" small>
              {{ book.status }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              variant="text" 
              @click="$emit('view-detail', book.id)"
            >
              Chi tiết
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
// Giả lập dữ liệu sách
const books = [
  { id: 1, title: 'Bí Mật Của Nước', author: 'Tác Giả A', cover: 'https://picsum.photos/200/300?random=1', status: 'Còn hàng' },
  { id: 2, title: 'Lịch Sử Loài Người', author: 'Tác Giả B', cover: 'https://picsum.photos/200/300?random=2', status: 'Đã mượn' },
  { id: 3, title: 'Vật Lý Lượng Tử', author: 'Tác Giả C', cover: 'https://picsum.photos/200/300?random=3', status: 'Còn hàng' },
  { id: 4, title: 'Công Nghệ Web', author: 'Tác Giả D', cover: 'https://picsum.photos/200/300?random=4', status: 'Còn hàng' },
];
</script>