# Panduan Integrasi Google Sheets

Karena aplikasi DanaTani berjalan 100% di browser pengguna pengguna (tanpa database pusat), kita bisa menggunakan Google Apps Script sebagai "Webhook" untuk menerima data dari aplikasi dan menyimpannya di Google Sheet Anda.

## Langkah 1: Buat Google Sheet
1. Buka [Google Sheets](https://sheets.new)
2. Buat kolom di baris pertama (A-H):
   - A1: `Waktu`
   - B1: `Nama PT`
   - C1: `Modal Awal`
   - D1: `Total Pemasukan`
   - E1: `Total Pengeluaran`
   - F1: `Laba/Rugi`
   - G1: `Biaya Aplikasi`
   - H1: `Saldo Akhir`

## Langkah 2: Tambahkan Script
1. Di menu Google Sheet, klik **Ekstensi** > **Apps Script**
2. Hapus semua kode yang ada, lalu tempel kode berikut:

\`\`\`javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date(),
      data.companyName || "",
      data.totalCapital || 0,
      data.totalIncome || 0,
      data.totalExpense || 0,
      data.profitLoss || 0,
      data.appFee || 0,
      data.balance || 0
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

## Langkah 3: Deploy Web App
1. Klik tombol **Terapkan** (Deploy) > **Deployment baru** di kanan atas.
2. Pilih jenis **Aplikasi Web** (Web app).
3. Isi deskripsi (contoh: "Webhook DanaTani").
4. Pada bagian "Akses aplikasi", pilih **Semua orang** (Anyone).
5. Klik **Terapkan** (Deploy). Anda akan diminta memberikan izin (Authorize).
6. Copy **URL Aplikasi Web** yang diberikan.

## Langkah 4: Masukkan URL ke Aplikasi
1. Buka file `.env` di project DanaTani ini.
2. Tambahkan/Ubah baris `VITE_GOOGLE_SHEETS_WEBHOOK_URL` sesuai dengan URL yang Anda copy tadi:
   \`VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"\`
3. Restart server aplikasi.

Sekarang, setiap kali pengguna membuka aplikasi DanaTani mereka, aplikasi secara otomatis akan mengirim data ringkasan ke Google Sheet Anda!
