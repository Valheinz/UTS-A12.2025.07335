// ===== 1. Filter produk berdasarkan kategori =====
const tombolFilter = document.querySelectorAll(".filter-btn");
const semuaKartu = document.querySelectorAll(".kartu");

tombolFilter.forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    const kategori = tombol.dataset.filter;

    tombolFilter.forEach(function (t) { t.classList.remove("active"); });
    tombol.classList.add("active");

    semuaKartu.forEach(function (kartu) {
      if (kategori === "semua" || kartu.dataset.kategori === kategori) {
        kartu.classList.remove("sembunyi");
      } else {
        kartu.classList.add("sembunyi");
      }
    });
  });
});

// ===== 2. Keranjang belanja =====
const daftarKeranjang = [];   // array untuk menyimpan produk yang dipilih
const elDaftar = document.getElementById("daftar-keranjang");
const elKosong = document.getElementById("keranjang-kosong");
const elTotal = document.getElementById("total-harga");
const elBadge = document.getElementById("badge-keranjang");

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Menampilkan isi array ke halaman
function tampilkanKeranjang() {
  elDaftar.innerHTML = "";   // kosongkan daftar dulu
  let total = 0;

  daftarKeranjang.forEach(function (produk) {
    const li = document.createElement("li");
    li.textContent = produk.nama + " - " + formatRupiah(produk.harga);
    elDaftar.appendChild(li);
    total += produk.harga;
  });

  elTotal.textContent = formatRupiah(total);
  elBadge.textContent = daftarKeranjang.length;

  // tampilkan tulisan "kosong" hanya kalau array kosong
  elKosong.style.display = daftarKeranjang.length === 0 ? "block" : "none";
}

document.querySelectorAll(".tombol-beli").forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    daftarKeranjang.push({
      nama: tombol.dataset.nama,
      harga: Number(tombol.dataset.harga)   // ubah teks jadi angka
    });
    tampilkanKeranjang();
  });
});

document.getElementById("kosongkan").addEventListener("click", function () {
  daftarKeranjang.length = 0;   // kosongkan array
  tampilkanKeranjang();
});

// Tombol Beli Sekarang
document.getElementById("beli").addEventListener("click", function () {
  const elPesan = document.getElementById("pesan-beli");

  if (daftarKeranjang.length === 0) {
    elPesan.textContent = "Keranjang masih kosong, pilih produk dulu.";
    elPesan.className = "pesan-beli gagal";
    return;
  }

  const jumlah = daftarKeranjang.length;
  const totalTeks = elTotal.textContent;

  const yakin = confirm("Total belanja " + totalTeks + ". Lanjutkan pembelian?");

  if (yakin) {
    elPesan.textContent = "Terima kasih! Pembelian " + jumlah + " barang dengan total " + totalTeks + " berhasil.";
    elPesan.className = "pesan-beli ok";
    daftarKeranjang.length = 0;
    tampilkanKeranjang();
  }
});

tampilkanKeranjang();

// ===== 3. Validasi form booking =====
const form = document.getElementById("form-booking");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const hp = document.getElementById("hp").value.trim();
  const hewan = document.getElementById("hewan").value;
  const tanggal = document.getElementById("tanggal").value;

  // bersihkan pesan lama
  ["nama", "hp", "hewan", "tanggal"].forEach(function (id) {
    document.getElementById("error-" + id).textContent = "";
  });
  document.getElementById("sukses").textContent = "";

  // tanggal hari ini dalam format yyyy-mm-dd
  const sekarang = new Date();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");
  const hariIni = sekarang.getFullYear() + "-" + bulan + "-" + hari;

  let valid = true;

  if (nama === "") {
    document.getElementById("error-nama").textContent = "Nama wajib diisi.";
    valid = false;
  }

  // hanya angka, panjang 10-13 digit
  if (!/^[0-9]{10,13}$/.test(hp)) {
    document.getElementById("error-hp").textContent = "No. HP harus 10-13 digit angka.";
    valid = false;
  }

  if (hewan === "") {
    document.getElementById("error-hewan").textContent = "Pilih jenis hewan.";
    valid = false;
  }

  if (tanggal === "") {
    document.getElementById("error-tanggal").textContent = "Tanggal wajib dipilih.";
    valid = false;
  } else if (tanggal < hariIni) {
    document.getElementById("error-tanggal").textContent = "Tanggal tidak boleh sebelum hari ini.";
    valid = false;
  }

  if (valid) {
    document.getElementById("sukses").textContent =
      "Terima kasih, " + nama + "! Booking grooming " + hewan + " pada " + tanggal + " berhasil.";
    form.reset();
  }
});
