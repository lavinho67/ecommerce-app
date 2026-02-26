// Format angka ke format rupiah dengan titik
export const formatRupiah = (angka) => {
  if (!angka) return '0'
  
  // Ubah ke string dan hapus semua titik yang sudah ada
  const numberString = angka.toString().replace(/[^,\d]/g, '')
  
  // Pisahkan bagian integer
  const split = numberString.split(',')
  const sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi)
  
  if (ribuan) {
    const separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }
  
  // Tambahkan koma untuk desimal jika ada
  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  
  return rupiah
}

// Format ke rupiah dengan prefix Rp
export const formatRupiahWithPrefix = (angka) => {
  if (!angka) return 'Rp 0'
  return `Rp ${formatRupiah(angka)}`
}

// Parse dari format rupiah ke number
export const parseRupiah = (rupiah) => {
  if (!rupiah) return 0
  // Hapus 'Rp ' dan titik, lalu parse ke integer
  const number = parseInt(rupiah.toString().replace(/[^0-9]/g, ''))
  return isNaN(number) ? 0 : number
}