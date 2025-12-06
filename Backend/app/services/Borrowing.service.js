// backend/app/services/Borrowing.service.js
const Borrowing = require("../models/Borrowing.model");
const Reader = require("../models/Reader.model");
const Book = require("../models/Book.model");

class BorrowingService {
  // [GET] Lấy tất cả phiếu (Giữ nguyên)
  async getAllBorrowings() {
    return Borrowing.find()
      .populate("MaDocGia", "HoLot Ten DienThoai SoLanViPham TrangThai") // Populate thêm để Admin thấy vi phạm
      .populate("MaSach", "TenSach AnhBia")
      .sort({ NgayMuon: -1 });
  }

  // [POST] Giai đoạn 1: Tạo yêu cầu (Cập nhật logic kiểm tra khóa)
  async createBorrowing(data) {
    const { ReaderId, BookId } = data;

    // 1. Kiểm tra Độc giả có bị khóa không
    const reader = await Reader.findById(ReaderId);
    if (!reader) throw new Error("Độc giả không tồn tại.");

    if (reader.TrangThai === "Blocked") {
      throw new Error(
        `Tài khoản đã bị khóa.`
      );
    }

    const borrowingCount = await Borrowing.countDocuments({
      MaDocGia: ReaderId,
      TrangThai: { $in: ["cho_xac_nhan", "dang_muon"] },
    });
    if (borrowingCount >= 3) {
      throw new Error(
        "Bạn chỉ được mượn tối đa 3 cuốn sách cùng lúc. Vui lòng trả sách cũ trước khi mượn tiếp."
      );
    }

    // 2. Kiểm tra sách
    const book = await Book.findById(BookId);
    if (!book) throw new Error("Sách không tồn tại.");
    if (book.SoQuyen <= 0) throw new Error("Sách đã hết hàng.");

    // 3. Trừ kho và Tạo phiếu (Giữ nguyên)
    await Book.findByIdAndUpdate(BookId, { $inc: { SoQuyen: -1 } });

    return await Borrowing.create({
      MaDocGia: ReaderId,
      MaSach: BookId,
      TrangThai: "cho_xac_nhan",
      NgayMuon: new Date(),
    });
  }

  // [PUT] Giai đoạn 2: Admin Duyệt (Giữ nguyên)
  async approveBorrowing(id) {
    const record = await Borrowing.findById(id);
    if (!record) throw new Error("Phiếu mượn không tồn tại.");

    if (record.TrangThai !== "cho_xac_nhan") {
      throw new Error("Phiếu này không ở trạng thái chờ xác nhận.");
    }

    record.TrangThai = "dang_muon";
    // Cập nhật lại ngày mượn thành thời điểm duyệt để tính 10 ngày từ lúc nhận sách (Optional)
    record.NgayMuon = new Date();
    return await record.save();
  }

  // [PUT] Admin từ chối cho mượn
  async rejectBorrowing(id) {
    const record = await Borrowing.findById(id);
    if (!record) throw new Error("Phiếu mượn không tồn tại.");

    if (record.TrangThai !== "cho_xac_nhan") {
      throw new Error("Không thể từ chối phiếu không ở trạng thái chờ.");
    }

    // QUAN TRỌNG: Vì lúc tạo phiếu đã trừ kho (createBorrowing),
    // nên khi từ chối phải cộng lại kho sách.
    await Book.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: 1 } });

    record.TrangThai = "da_tu_choi";
    return await record.save();
  }

  // [GET] Lấy lịch sử mượn của riêng độc giả
  async getBorrowingsByReader(readerId) {
    return Borrowing.find({ MaDocGia: readerId })
      .populate("MaSach", "TenSach AnhBia")
      .sort({ NgayMuon: -1 });
  }

  // [PUT] Giai đoạn 3: Trả sách (Cập nhật logic tính phạt)
  async returnBook(id) {
    const record = await Borrowing.findById(id);
    if (!record) throw new Error("Phiếu mượn không tồn tại.");

    if (record.TrangThai === "da_tra") {
      throw new Error("Sách này đã được trả.");
    }

    // 1. Cộng lại kho sách
    await Book.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: 1 } });

    // 2. Tính toán quá hạn
    const ngayTraThucTe = new Date();
    const ngayMuon = new Date(record.NgayMuon);

    // Hạn trả = Ngày mượn + 10 ngày
    const hanTra = new Date(ngayMuon);
    hanTra.setDate(hanTra.getDate() + 10);

    let message = "Trả sách thành công.";

    // Nếu ngày trả thực tế > hạn trả
    if (ngayTraThucTe > hanTra) {
      const reader = await Reader.findById(record.MaDocGia);

      // Tăng số lần vi phạm
      reader.SoLanViPham = (reader.SoLanViPham || 0) + 1;

      if (reader.SoLanViPham >= 3) {
        reader.TrangThai = "Blocked"; // Khóa tài khoản
        message = `Quá hạn! Tài khoản bị khóa do vi phạm 3 lần.`;
      } else {
        message = `Quá hạn! Cảnh báo lần ${reader.SoLanViPham}/3.`;
      }

      await reader.save();
    }

    // 3. Cập nhật phiếu mượn
    record.TrangThai = "da_tra";
    record.NgayTra = ngayTraThucTe;
    await record.save();

    return {
      message: message,
      data: record,
    };
  }
  // [PUT] Người dùng tự hủy yêu cầu
  async cancelBorrowing(id, userId) {
    const record = await Borrowing.findById(id);
    if (!record) throw new Error("Phiếu mượn không tồn tại.");

    // 1. Kiểm tra chính chủ (Bảo mật)
    if (record.MaDocGia.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền hủy phiếu này.");
    }

    // 2. Chỉ được hủy khi đang chờ xác nhận
    if (record.TrangThai !== "cho_xac_nhan") {
      throw new Error(
        "Không thể hủy phiếu khi sách đã được duyệt hoặc đã trả."
      );
    }

    // 3. Hoàn lại số lượng sách vào kho (QUAN TRỌNG)
    await Book.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: 1 } });

    // 4. Cập nhật trạng thái
    record.TrangThai = "da_huy";
    return await record.save();
  }
}
module.exports = new BorrowingService();
