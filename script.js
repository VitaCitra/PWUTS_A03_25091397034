// ==========================================
// 1. KONFIGURASI DAN FUNGSI UMUM
// ==========================================

const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

const tanggalSekarang = () => {
    return new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const waktuSekarang = () => {
    return new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
};

function ambilData(kunci, dataAwal = []) {
    try {
        const data = localStorage.getItem(kunci);

        if (data === null) {
            return dataAwal;
        }

        const hasil = JSON.parse(data);

        return Array.isArray(hasil) ? hasil : dataAwal;
    } catch (error) {
        console.error("Gagal membaca data:", error);
        return dataAwal;
    }
}

function simpanData(kunci, data) {
    try {
        localStorage.setItem(kunci, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Gagal menyimpan data:", error);

        tampilkanNotifikasi(
            "Data gagal disimpan. Periksa penyimpanan browser."
        );

        return false;
    }
}

function tampilkanNotifikasi(pesan) {
    let notifikasi = document.getElementById("notifikasi");

    if (!notifikasi) {
        notifikasi = document.createElement("div");
        notifikasi.id = "notifikasi";
        document.body.appendChild(notifikasi);
    }

    notifikasi.textContent = pesan;
    notifikasi.classList.add("show");

    clearTimeout(window.timerNotifikasi);

    window.timerNotifikasi = setTimeout(() => {
        notifikasi.classList.remove("show");
    }, 2800);
}

function buatKodeReservasi() {
    return (
        "RSV-" +
        Date.now().toString().slice(-8)
    );
}

function escapeHTML(teks) {
    return String(teks).replace(/[&<>"']/g, karakter => {
        const karakterHTML = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return karakterHTML[karakter];
    });
}

function badgeStatus(status) {
    const kelas = {
        "Hadir": "badge-hadir",
        "Izin": "badge-izin",
        "Belum Hadir": "badge-belum-hadir",
        "Menunggu": "badge-menunggu",
        "Dikonfirmasi": "badge-dikonfirmasi",
        "Selesai": "badge-selesai",
        "Dibatalkan": "badge-dibatalkan"
    };

    return `
        <span class="badge ${kelas[status] || ""}">
            ${escapeHTML(status)}
        </span>
    `;
}


// ==========================================
// 2. DATA MENU RESTORAN
// ==========================================

const daftarMenu = [
    {
        id: 1,
        nama: "Nasi Goreng",
        deskripsi: "Nasi goreng spesial",
        harga: 25000
    },
    {
        id: 2,
        nama: "Mie Goreng",
        deskripsi: "Mie goreng restoran",
        harga: 22000
    },
    {
        id: 3,
        nama: "Ayam Bakar",
        deskripsi: "Ayam bakar dengan nasi",
        harga: 30000
    },
    {
        id: 4,
        nama: "Sate Ayam",
        deskripsi: "Sate ayam dengan bumbu kacang",
        harga: 28000
    },
    {
        id: 5,
        nama: "Es Teh",
        deskripsi: "Es teh manis",
        harga: 5000
    },
    {
        id: 6,
        nama: "Jus Jeruk",
        deskripsi: "Jus jeruk segar",
        harga: 12000
    },
    {
        id: 7,
        nama: "Air Mineral",
        deskripsi: "Air mineral botol",
        harga: 4000
    },
    {
        id: 8,
        nama: "Kopi Susu",
        deskripsi: "Kopi susu dingin",
        harga: 18000
    }
];


// ==========================================
// 3. DATA ABSENSI
// ==========================================

let dataAbsensi = ambilData("kasir_absensi", []);


// ==========================================
// 4. DATA RESERVASI
// ==========================================

let dataReservasi = ambilData("kasir_reservasi", []);


// ==========================================
// 5. INISIALISASI WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Menampilkan tanggal pada header.
    const elemenTanggal = document.getElementById(
        "tanggal-sekarang"
    );

    if (elemenTanggal) {
        elemenTanggal.textContent = tanggalSekarang();
    }

    // Menentukan halaman yang sedang dibuka.
    const halaman = document.body.dataset.page;

    if (halaman === "beranda") {
        inisialisasiBeranda();
    }

    if (halaman === "absensi") {
        inisialisasiAbsensi();
    }

    if (halaman === "reservasi") {
        inisialisasiReservasi();
    }
});


// ==========================================
// 6. HALAMAN BERANDA
// ==========================================

function inisialisasiBeranda() {
    perbaruiBeranda();
}

function perbaruiBeranda() {

    const elemenReservasi = document.getElementById(
        "total-reservasi"
    );

    const elemenHadir = document.getElementById(
        "total-hadir"
    );

    const elemenMenunggu = document.getElementById(
        "total-menunggu"
    );

    const elemenPendapatan = document.getElementById(
        "total-pendapatan"
    );

    if (elemenReservasi) {
        elemenReservasi.textContent = dataReservasi.length;
    }

    if (elemenHadir) {
        const jumlahHadir = dataAbsensi.filter(data => {
            return data.status === "Hadir";
        }).length;

        elemenHadir.textContent = jumlahHadir;
    }

    if (elemenMenunggu) {
        const jumlahMenunggu = dataReservasi.filter(data => {
            return data.status === "Menunggu";
        }).length;

        elemenMenunggu.textContent = jumlahMenunggu;
    }

    if (elemenPendapatan) {
        const pendapatan = dataReservasi
            .filter(data => data.status === "Selesai")
            .reduce((total, data) => {
                return total + Number(data.total || 0);
            }, 0);

        elemenPendapatan.textContent = formatRupiah(pendapatan);
    }

    tampilkanReservasiTerbaru();
}

function tampilkanReservasiTerbaru() {

    const tabel = document.getElementById(
        "beranda-reservasi"
    );

    if (!tabel) return;

    if (dataReservasi.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Belum ada data reservasi.
                </td>
            </tr>
        `;

        return;
    }

    const dataTerbaru = [...dataReservasi]
        .reverse()
        .slice(0, 5);

    tabel.innerHTML = dataTerbaru.map(data => {

        return `
            <tr>
                <td>
                    <strong>${escapeHTML(data.kode)}</strong>
                </td>

                <td>${escapeHTML(data.nama)}</td>

                <td>${escapeHTML(data.meja)}</td>

                <td>
                    <strong>
                        ${formatRupiah(Number(data.total || 0))}
                    </strong>
                </td>

                <td>
                    ${badgeStatus(data.status)}
                </td>
            </tr>
        `;

    }).join("");
}


// ==========================================
// 7. HALAMAN ABSENSI
// ==========================================

function inisialisasiAbsensi() {

    const form = document.getElementById("form-absensi");

    const pencarian = document.getElementById(
        "cari-karyawan"
    );

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        tambahAbsensi();
    });

    pencarian.addEventListener("input", function () {

        tampilkanAbsensi();
    });

    tampilkanAbsensi();
}

function tambahAbsensi() {

    const nama = document.getElementById(
        "nama-karyawan"
    ).value.trim();

    const jabatan = document.getElementById(
        "jabatan-karyawan"
    ).value;

    const status = document.getElementById(
        "status-absensi"
    ).value;

    if (!nama || !jabatan || !status) {
        tampilkanNotifikasi(
            "Lengkapi semua data absensi."
        );

        return;
    }

    // Mencegah nama yang sama dicatat dua kali
    // pada tanggal yang sama.
    const sudahAda = dataAbsensi.some(data => {

        return (
            data.nama.toLowerCase() === nama.toLowerCase() &&
            data.tanggal === tanggalSekarang()
        );

    });

    if (sudahAda) {
        tampilkanNotifikasi(
            "Karyawan sudah tercatat pada tanggal ini."
        );

        return;
    }

    const dataBaru = {
        id: Date.now(),
        nama: nama,
        jabatan: jabatan,
        tanggal: tanggalSekarang(),
        jamMasuk: status === "Hadir"
            ? waktuSekarang()
            : "-",
        status: status
    };

    dataAbsensi.push(dataBaru);

    if (!simpanData("kasir_absensi", dataAbsensi)) {
        dataAbsensi.pop();
        return;
    }

    document.getElementById("form-absensi").reset();

    tampilkanAbsensi();

    tampilkanNotifikasi(
        "Data absensi berhasil ditambahkan."
    );
}

function tampilkanAbsensi() {

    const tabel = document.getElementById(
        "tabel-absensi"
    );

    if (!tabel) return;

    const pencarian = document.getElementById(
        "cari-karyawan"
    ).value.toLowerCase();

    const dataTampil = dataAbsensi.filter(data => {

        return (
            data.nama.toLowerCase().includes(pencarian) ||
            data.jabatan.toLowerCase().includes(pencarian)
        );

    });

    if (dataTampil.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    Data absensi tidak ditemukan.
                </td>
            </tr>
        `;

    } else {

        tabel.innerHTML = dataTampil.map((data, index) => {

            return `
                <tr>
                    <td>${index + 1}</td>

                    <td>
                        <strong>
                            ${escapeHTML(data.nama)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(data.jabatan)}
                    </td>

                    <td>
                        ${escapeHTML(data.tanggal)}
                    </td>

                    <td>
                        ${escapeHTML(data.jamMasuk)}
                    </td>

                    <td>
                        ${badgeStatus(data.status)}
                    </td>

                    <td>
                        <div class="action-group">

                            <button
                                class="btn-small"
                                style="background:#eeeeff;color:#5b5ce2"
                                onclick="ubahAbsensi(${data.id})"
                            >
                                Ubah
                            </button>

                            <button
                                class="btn-small"
                                style="background:#fff0f1;color:#d74755"
                                onclick="hapusAbsensi(${data.id})"
                            >
                                Hapus
                            </button>

                        </div>
                    </td>
                </tr>
            `;

        }).join("");
    }

    perbaruiStatistikAbsensi();
}

function perbaruiStatistikAbsensi() {

    const total = dataAbsensi.length;

    const hadir = dataAbsensi.filter(data => {
        return data.status === "Hadir";
    }).length;

    const izin = dataAbsensi.filter(data => {
        return data.status === "Izin";
    }).length;

    const belum = dataAbsensi.filter(data => {
        return data.status === "Belum Hadir";
    }).length;

    document.getElementById(
        "absensi-total-karyawan"
    ).textContent = total;

    document.getElementById(
        "absensi-hadir"
    ).textContent = hadir;

    document.getElementById(
        "absensi-izin"
    ).textContent = izin;

    document.getElementById(
        "absensi-belum"
    ).textContent = belum;
}

function ubahAbsensi(id) {

    const data = dataAbsensi.find(item => {
        return item.id === id;
    });

    if (!data) return;

    const pilihan = prompt(
        "Ubah status absensi:\n" +
        "1. Hadir\n" +
        "2. Izin\n" +
        "3. Belum Hadir\n\n" +
        "Masukkan angka 1, 2, atau 3."
    );

    if (pilihan === null) return;

    const pilihanStatus = {
        "1": "Hadir",
        "2": "Izin",
        "3": "Belum Hadir"
    };

    if (!pilihanStatus[pilihan]) {

        tampilkanNotifikasi(
            "Pilihan status tidak valid."
        );

        return;
    }

    const statusLama = data.status;
    const jamLama = data.jamMasuk;

    data.status = pilihanStatus[pilihan];

    if (data.status === "Hadir" && jamLama === "-") {
        data.jamMasuk = waktuSekarang();
    }

    if (data.status !== "Hadir") {
        data.jamMasuk = "-";
    }

    if (!simpanData("kasir_absensi", dataAbsensi)) {
        data.status = statusLama;
        data.jamMasuk = jamLama;
        return;
    }

    tampilkanAbsensi();

    tampilkanNotifikasi(
        "Status absensi berhasil diubah."
    );
}

function hapusAbsensi(id) {

    const setuju = confirm(
        "Apakah kamu yakin ingin menghapus data absensi ini?"
    );

    if (!setuju) return;

    const dataLama = [...dataAbsensi];

    dataAbsensi = dataAbsensi.filter(data => {
        return data.id !== id;
    });

    if (!simpanData("kasir_absensi", dataAbsensi)) {
        dataAbsensi = dataLama;
        return;
    }

    tampilkanAbsensi();

    tampilkanNotifikasi(
        "Data absensi berhasil dihapus."
    );
}


// ==========================================
// 8. HALAMAN RESERVASI
// ==========================================

function inisialisasiReservasi() {

    const form = document.getElementById(
        "form-reservasi"
    );

    const pencarian = document.getElementById(
        "cari-reservasi"
    );

    const inputTanggal = document.getElementById(
        "tanggal-reservasi"
    );

    // Tanggal awal adalah hari ini.
    const sekarang = new Date();

    const tahun = sekarang.getFullYear();

    const bulan = String(
        sekarang.getMonth() + 1
    ).padStart(2, "0");

    const hari = String(
        sekarang.getDate()
    ).padStart(2, "0");

    inputTanggal.value = `${tahun}-${bulan}-${hari}`;

    tampilkanMenu();

    hitungTotal();

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        tambahReservasi();
    });

    pencarian.addEventListener("input", function () {

        tampilkanReservasi();
    });

    document.getElementById(
        "reset-reservasi"
    ).addEventListener("click", function () {

        setTimeout(() => {
            hitungTotal();
        }, 0);
    });

    tampilkanReservasi();

    perbaruiStatistikReservasi();
}


// ==========================================
// 9. MENAMPILKAN MENU DAN HARGA
// ==========================================

function tampilkanMenu() {

    const tabel = document.getElementById(
        "daftar-menu"
    );

    if (!tabel) return;

    tabel.innerHTML = daftarMenu.map(menu => {

        return `
            <tr>
                <td>
                    <div class="menu-name">
                        ${escapeHTML(menu.nama)}
                    </div>

                    <div class="menu-description">
                        ${escapeHTML(menu.deskripsi)}
                    </div>
                </td>

                <td>
                    ${formatRupiah(menu.harga)}
                </td>

                <td>
                    <input
                        type="number"
                        class="menu-quantity"
                        id="menu-${menu.id}"
                        data-menu-id="${menu.id}"
                        min="0"
                        max="999"
                        step="1"
                        value="0"
                        aria-label="Jumlah ${escapeHTML(menu.nama)}"
                    >
                </td>

                <td>
                    <strong id="subtotal-${menu.id}">
                        Rp0
                    </strong>
                </td>
            </tr>
        `;

    }).join("");

    // Perhitungan berubah otomatis saat jumlah menu diubah.
    document.querySelectorAll(".menu-quantity").forEach(input => {

        input.addEventListener("input", function () {

            // Jumlah yang kosong dianggap nol.
            if (input.value !== "") {
                input.value = Math.max(
                    0,
                    Math.min(999, Math.floor(Number(input.value) || 0))
                );
            }

            hitungTotal();
        });

    });
}


// ==========================================
// 10. MENGHITUNG TOTAL PEMBAYARAN
// ==========================================

function ambilPesanan() {

    const pesanan = [];

    daftarMenu.forEach(menu => {

        const input = document.getElementById(
            `menu-${menu.id}`
        );

        if (!input) return;

        const jumlah = Math.max(
            0,
            Math.min(999, Math.floor(Number(input.value) || 0))
        );

        if (jumlah > 0) {

            pesanan.push({
                id: menu.id,
                nama: menu.nama,
                harga: menu.harga,
                jumlah: jumlah,
                subtotal: menu.harga * jumlah
            });

        }

    });

    return pesanan;
}

function hitungTotal() {

    const pesanan = ambilPesanan();

    let totalItem = 0;
    let totalHarga = 0;

    pesanan.forEach(item => {

        totalItem += item.jumlah;
        totalHarga += item.subtotal;

        const elemenSubtotal = document.getElementById(
            `subtotal-${item.id}`
        );

        if (elemenSubtotal) {
            elemenSubtotal.textContent = formatRupiah(
                item.subtotal
            );
        }

    });

    // Menu yang tidak dipilih tetap menampilkan Rp0.
    daftarMenu.forEach(menu => {

        const dipilih = pesanan.some(item => {
            return item.id === menu.id;
        });

        if (!dipilih) {

            const elemenSubtotal = document.getElementById(
                `subtotal-${menu.id}`
            );

            if (elemenSubtotal) {
                elemenSubtotal.textContent = "Rp0";
            }

        }

    });

    document.getElementById(
        "jumlah-item"
    ).textContent = `${totalItem} item`;

    document.getElementById(
        "total-pembayaran"
    ).textContent = formatRupiah(totalHarga);

    return {
        pesanan,
        totalItem,
        totalHarga
    };
}


// ==========================================
// 11. MENYIMPAN RESERVASI BARU
// ==========================================

function tambahReservasi() {

    const nama = document.getElementById(
        "nama-pelanggan"
    ).value.trim();

    const meja = document.getElementById(
        "nomor-meja"
    ).value;

    const jumlahPelanggan = Number(
        document.getElementById(
            "jumlah-pelanggan"
        ).value
    );

    const tanggal = document.getElementById(
        "tanggal-reservasi"
    ).value;

    const hasil = hitungTotal();

    if (!nama || !meja || !tanggal) {

        tampilkanNotifikasi(
            "Lengkapi data pelanggan terlebih dahulu."
        );

        return;
    }

    if (
        !Number.isInteger(jumlahPelanggan) ||
        jumlahPelanggan < 1
    ) {

        tampilkanNotifikasi(
            "Jumlah pelanggan minimal 1 orang."
        );

        return;
    }

    if (hasil.pesanan.length === 0) {

        tampilkanNotifikasi(
            "Pilih setidaknya satu menu."
        );

        return;
    }

    // Memastikan meja tidak dipakai oleh reservasi aktif
    // pada tanggal yang sama.
    const mejaTerpakai = dataReservasi.some(data => {

        return (
            data.meja === meja &&
            data.tanggal === tanggal &&
            data.status !== "Dibatalkan" &&
            data.status !== "Selesai"
        );

    });

    if (mejaTerpakai) {

        tampilkanNotifikasi(
            "Meja tersebut sudah memiliki reservasi aktif pada tanggal itu."
        );

        return;
    }

    const dataBaru = {
        kode: buatKodeReservasi(),
        nama: nama,
        meja: meja,
        jumlahPelanggan: jumlahPelanggan,
        tanggal: tanggal,
        menu: hasil.pesanan,
        totalItem: hasil.totalItem,
        total: hasil.totalHarga,
        status: "Menunggu"
    };

    dataReservasi.push(dataBaru);

    if (!simpanData("kasir_reservasi", dataReservasi)) {
        dataReservasi.pop();
        return;
    }

    // Reset formulir setelah berhasil disimpan.
    document.getElementById(
        "form-reservasi"
    ).reset();

    // Kembalikan tanggal ke hari ini.
    const sekarang = new Date();

    const tahun = sekarang.getFullYear();

    const bulan = String(
        sekarang.getMonth() + 1
    ).padStart(2, "0");

    const hari = String(
        sekarang.getDate()
    ).padStart(2, "0");

    document.getElementById(
        "tanggal-reservasi"
    ).value = `${tahun}-${bulan}-${hari}`;

    hitungTotal();

    tampilkanReservasi();

    perbaruiStatistikReservasi();

    tampilkanNotifikasi(
        `Reservasi berhasil dibuat. Kode: ${dataBaru.kode}`
    );
}


// ==========================================
// 12. MENAMPILKAN DAFTAR RESERVASI
// ==========================================

function tampilkanReservasi() {

    const tabel = document.getElementById(
        "tabel-reservasi"
    );

    if (!tabel) return;

    const pencarian = document.getElementById(
        "cari-reservasi"
    ).value.toLowerCase();

    const dataTampil = dataReservasi.filter(data => {

        const nama = data.nama.toLowerCase();

        const meja = data.meja.toLowerCase();

        const kode = data.kode.toLowerCase();

        return (
            nama.includes(pencarian) ||
            meja.includes(pencarian) ||
            kode.includes(pencarian)
        );

    });

    if (dataTampil.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    Data reservasi tidak ditemukan.
                </td>
            </tr>
        `;

        return;
    }

    tabel.innerHTML = dataTampil.map(data => {

        const daftarNamaMenu = data.menu.map(item => {

            return `
                <div>
                    ${escapeHTML(item.nama)}
                    × ${item.jumlah}
                    <br>
                    <small style="color:#858ba0">
                        ${formatRupiah(item.subtotal)}
                    </small>
                </div>
            `;

        }).join("<br>");

        let tombolAksi = "";

        if (data.status === "Menunggu") {

            tombolAksi = `
                <div class="action-group">

                    <button
                        class="btn-small"
                        style="background:#e4f8ee;color:#15966b"
                        onclick="ubahStatusReservasi(
                            '${data.kode}',
                            'Dikonfirmasi'
                        )"
                    >
                        Konfirmasi
                    </button>

                    <button
                        class="btn-small"
                        style="background:#fff0f1;color:#d74755"
                        onclick="ubahStatusReservasi(
                            '${data.kode}',
                            'Dibatalkan'
                        )"
                    >
                        Batal
                    </button>

                </div>
            `;

        } else if (data.status === "Dikonfirmasi") {

            tombolAksi = `
                <div class="action-group">

                    <button
                        class="btn-small"
                        style="background:#eeeeff;color:#5b5ce2"
                        onclick="ubahStatusReservasi(
                            '${data.kode}',
                            'Selesai'
                        )"
                    >
                        Selesaikan
                    </button>

                    <button
                        class="btn-small"
                        style="background:#fff0f1;color:#d74755"
                        onclick="ubahStatusReservasi(
                            '${data.kode}',
                            'Dibatalkan'
                        )"
                    >
                        Batal
                    </button>

                </div>
            `;

        } else {

            tombolAksi = `
                <span style="color:#858ba0">
                    Tidak ada aksi
                </span>
            `;
        }

        return `
            <tr>

                <td>
                    <strong>
                        ${escapeHTML(data.kode)}
                    </strong>
                </td>

                <td>
                    <strong>
                        ${escapeHTML(data.nama)}
                    </strong>

                    <br>

                    <small style="color:#858ba0">
                        ${data.jumlahPelanggan} orang
                    </small>
                </td>

                <td>
                    ${escapeHTML(data.meja)}
                    <br>
                    <small style="color:#858ba0">
                        ${escapeHTML(data.tanggal)}
                    </small>
                </td>

                <td>
                    ${daftarNamaMenu}
                </td>

                <td>
                    <strong>
                        ${formatRupiah(data.total)}
                    </strong>
                </td>

                <td>
                    ${badgeStatus(data.status)}
                </td>

                <td>
                    ${tombolAksi}
                </td>

            </tr>
        `;

    }).join("");
}


// ==========================================
// 13. MENGUBAH STATUS RESERVASI
// ==========================================

function ubahStatusReservasi(kode, statusBaru) {

    const data = dataReservasi.find(item => {
        return item.kode === kode;
    });

    if (!data) {

        tampilkanNotifikasi(
            "Data reservasi tidak ditemukan."
        );

        return;
    }

    if (
        data.status === "Selesai" ||
        data.status === "Dibatalkan"
    ) {

        tampilkanNotifikasi(
            "Reservasi ini sudah berstatus final."
        );

        return;
    }

    const statusDiizinkan = [
        "Dikonfirmasi",
        "Selesai",
        "Dibatalkan"
    ];

    if (!statusDiizinkan.includes(statusBaru)) {

        tampilkanNotifikasi(
            "Status reservasi tidak valid."
        );

        return;
    }

    const statusLama = data.status;

    data.status = statusBaru;

    if (!simpanData("kasir_reservasi", dataReservasi)) {
        data.status = statusLama;
        return;
    }

    tampilkanReservasi();

    perbaruiStatistikReservasi();

    tampilkanNotifikasi(
        `Status reservasi diperbarui menjadi ${statusBaru}.`
    );
}


// ==========================================
// 14. STATISTIK RESERVASI
// ==========================================

function perbaruiStatistikReservasi() {

    const total = dataReservasi.length;

    const menunggu = dataReservasi.filter(data => {
        return data.status === "Menunggu";
    }).length;

    const dikonfirmasi = dataReservasi.filter(data => {
        return data.status === "Dikonfirmasi";
    }).length;

    const pendapatan = dataReservasi
        .filter(data => data.status === "Selesai")
        .reduce((total, data) => {

            return total + Number(data.total || 0);

        }, 0);

    document.getElementById(
        "reservasi-jumlah"
    ).textContent = total;

    document.getElementById(
        "reservasi-menunggu"
    ).textContent = menunggu;

    document.getElementById(
        "reservasi-konfirmasi"
    ).textContent = dikonfirmasi;

    document.getElementById(
        "reservasi-pendapatan"
    ).textContent = formatRupiah(pendapatan);
}