# TỬ VI YULAN — Website tĩnh

Website giới thiệu Tử Vi Yulan, giao diện responsive màu xanh ngọc đậm và vàng cổ điển.

## Có gì trong bản này?
- Trang chủ, triết lý Yulan, thư viện kiến thức, dịch vụ, liên hệ.
- Biểu mẫu nhập thông tin sinh để minh họa trải nghiệm.
- Responsive cho máy tính, tablet và điện thoại.
- Không cần framework, build step hay backend.

## Giới hạn quan trọng
Đây là **bản giao diện MVP**, chưa phải hệ thống lập lá số Tử Vi thật. Form hiện chỉ kiểm tra dữ liệu trong trình duyệt và hiển thị thông báo; không tính Can Chi, lịch âm, an cung, an sao, vận hạn, không lưu dữ liệu và không nhận thanh toán. Không dùng kết quả demo để luận đoán.

Bản nâng cấp này chưa gắn email hoặc kênh mạng xã hội giả định. Hãy bổ sung thông tin liên hệ thật khi bạn sẵn sàng công bố.

## Xem thử trên Mac
1. Giải nén file ZIP.
2. Mở thư mục `tuviyulan-website`.
3. Nhấp đúp `index.html` để xem bằng trình duyệt.

## Đưa lên GitHub Pages miễn phí
1. Tạo tài khoản tại https://github.com/ nếu chưa có.
2. Đăng nhập GitHub, bấm dấu `+` góc trên bên phải → **New repository**.
3. Đặt tên repository: `tuviyulan` (chọn **Public**) → **Create repository**.
4. Trong repository mới, bấm **Add file** → **Upload files**.
5. Mở thư mục đã giải nén trên Mac, kéo thả 4 file `index.html`, `styles.css`, `script.js` và `README.md` vào vùng upload trên GitHub. Nếu trình duyệt không nhận kéo thả nhiều file, tải từng file bằng **choose your files**.
6. Bấm **Commit changes**.
7. Vào tab **Settings** của repository.
8. Ở thanh bên trái, chọn **Pages**.
9. Trong **Build and deployment**, chọn **Deploy from a branch**.
10. Ở **Branch**, chọn `main`, thư mục `/ (root)`, bấm **Save**.
11. Chờ GitHub hoàn tất triển khai. Tải lại trang Settings → Pages; địa chỉ website sẽ hiển thị ở phần trên, thường có dạng `https://TEN-TAI-KHOAN.github.io/tuviyulan/`.

## Chỉnh nội dung
- Nội dung, menu, tiêu đề: `index.html`
- Màu sắc và bố cục: `styles.css`
- Hành vi menu và form demo: `script.js`

## Bảo mật và quyền riêng tư
Bản demo không gửi thông tin ngày sinh lên máy chủ. Nếu phát triển lưu hồ sơ, tài khoản hoặc thanh toán trong tương lai, cần bổ sung backend, chính sách quyền riêng tư, bảo mật, đồng ý xử lý dữ liệu và quy trình xóa dữ liệu phù hợp.


## Bản nâng cấp biểu mẫu v3

- Hỗ trợ chọn ngày sinh dương lịch hoặc âm lịch.
- Biểu mẫu âm lịch có ngày, tháng, năm và tùy chọn tháng nhuận.
- Giờ sinh được lưu theo 12 địa chi.
- Bổ sung giới tính và nơi sinh.
- Kiểm tra dữ liệu bắt buộc và hiển thị tóm tắt trên trình duyệt.
- **Chưa** thực hiện chuyển đổi âm dương lịch hoặc tính toán lá số; các chức năng này cần được xây dựng và kiểm chứng riêng.


## Bản nâng cấp bộ chuyển đổi lịch v4

- Chuyển đổi hai chiều ngày Dương lịch ⇄ Âm lịch Việt Nam theo múi giờ UTC+7, dựa trên thuật toán Hồ Ngọc Đức.
- Tự xác định ngày Sóc, tháng 11 âm lịch và tháng nhuận theo Trung khí.
- Kiểm tra ngày dương lịch thực tế; kiểm tra ngày/tháng âm lịch, năm trong phạm vi 1800–2199 và cờ tháng nhuận bằng phép chuyển đổi ngược.
- Khi gửi biểu mẫu, hiển thị cặp ngày dương – âm đã đối chiếu để người dùng xác nhận.
- Chưa tính Can Chi, Mệnh/Thân, 12 cung, chính tinh, phụ tinh hoặc vận hạn.

**Lưu ý về dữ liệu lịch sử:** bản v4 dùng quy ước lịch Việt Nam UTC+7 xuyên suốt phạm vi hỗ trợ; các giai đoạn lịch sử từng dùng múi giờ khác có thể cần cấu hình lịch pháp lịch sử riêng. Kết quả hiện tại là bước chuẩn hóa ngày sinh, chưa phải lá số Tử Vi hoàn chỉnh.
