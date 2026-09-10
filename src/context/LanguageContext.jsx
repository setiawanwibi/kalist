import { createContext, useContext, useEffect, useState } from 'react'

import { readStorage, writeStorage } from '../utils/storage'

const LANGUAGE_STORAGE_KEY = 'language'

const LanguageContext = createContext(null)

const translations = {

  en: {

    greeting: { morning: 'Good morning.', afternoon: 'Good afternoon.', evening: 'Good evening.' },

    today: { subtitle: 'A small, clear step is enough to begin.', progress: 'Daily progress', of: 'of', completed: 'completed', tasks: 'Tasks', completedMetric: 'Completed', remainingMetric: 'Remaining', focus: 'Today\'s focus', upcomingEmpty: 'No future tasks on the horizon.', clearTitle: 'Clear schedule', clearDescription: 'No tasks planned for today. Add one small step to get moving.' },

    nav: { workspace: 'Workspace', today: 'Today', tasks: 'Tasks', watchlist: 'Watchlist', search: 'Search', settings: 'Settings', personal: 'Personal space', light: 'Light mode', dark: 'Dark mode', footer: '© 2026 Muhammad Setiawan Wibisono' },

    common: { cancel: 'Cancel', save: 'Save', close: 'Close', retry: 'Try again', backSearch: 'Back to search', movie: 'Movie', tv: 'TV show', watched: 'Watched', unwatch: 'Unwatch', saved: 'Saved', remove: 'Remove', open: 'Open details for' },

    tasks: { added: 'Task added', updated: 'Task updated', completed: 'Task completed!', completedFilter: 'Completed', incomplete: 'Task restored', deleted: 'Task deleted', nice: 'Nice work. Keep the momentum going.', dayCompleted: 'Day completed!', dayMessage: 'You finished all your tasks for today. Great work.', validation: 'Give this task a title first.', newTask: 'New task', editTask: 'Edit task', titlePrompt: 'What needs your attention?', editPrompt: 'Shape the details.', add: 'Add a task', title: 'Title', description: 'Description', date: 'Date', time: 'Time', priority: 'Priority', category: 'Category', low: 'Low', medium: 'Medium', high: 'High priority', work: 'Work', personal: 'Personal', study: 'Study', project: 'Project', other: 'Other', focus: 'Focus now', todayTasks: "Today's tasks", upcoming: 'Upcoming', nothing: 'Nothing planned for today.', clear: "You're clear for today.", empty: 'Add the first thing you want to make room for.', remaining: 'remaining', library: 'Task library', libraryTitle: 'Everything in one place.', librarySub: 'Make the list visible. Make the next step obvious.', allTasks: 'All tasks', yourList: 'Your list', quiet: 'Your list is quiet.', noMatch: 'No matching tasks.', tryFilter: 'Try a different search or filter.', addRemember: 'Add something you want to remember.', search: 'Search tasks', allCategories: 'All categories', nearest: 'Nearest first', dateSort: 'Date', prioritySort: 'Priority', created: 'Created time', status: 'Completion status', all: 'All tasks' },

    rating: { myRating: 'My rating', noRating: 'Not rated', remove: 'Remove rating', save: 'Rating saved', removed: 'Rating removed', half: 'half star', full: 'star' },

    media: { discover: 'Discover', searchTitle: 'Find something worth watching.', searchSub: 'Search movies and shows, then save the ones you want to remember.', searchPlaceholder: 'Search movies or TV shows', start: 'Start exploring', question: 'What would you like to watch?', searchHint: 'Search by title to see real TMDB results.', unavailable: 'Search unavailable', noResults: 'No titles found.', noResultsHint: 'Try a different spelling or a broader search.', savedLater: 'Saved for later', watchlist: 'Watchlist', watchlistSub: 'Keep the movies and shows you want to make time for.', emptyWatchlist: 'Your watchlist is empty.', emptyWatchlistHint: 'Save movies and shows you want to watch later.', find: 'Find something', movies: 'Movies', tvShows: 'TV shows', all: 'All', watched: 'Watched', unwatched: 'Unwatched', saved: 'Saved', rated: 'Rated', titles: 'titles', results: 'Results', searchUnavailable: 'Search unavailable', configHint: 'Check your configuration or connection, then try again.', movie: 'Movie', tv: 'TV show', save: 'Save', savedAction: 'Saved', unwatch: 'Unwatch', watch: 'Watched', remove: 'Remove', noView: 'No titles in this view.', tryView: 'Try another filter to see more of your saved titles.', back: 'Back', detailsError: 'Unable to load', titleNotFound: 'Title not found.', detailsHint: 'Check the title ID or your TMDB configuration, then try again.', yearUnknown: 'Year unknown', runtimeUnknown: 'Runtime unknown', seasons: 'seasons', noOverview: 'No overview is available for this title yet.', watchTrailer: 'Watch trailer', people: 'The people', cast: 'Cast', castUnavailable: 'Cast information is not available.', chapters: 'The chapters', episodes: 'episodes', dateUnknown: 'Date unknown', trailer: 'trailer' },

    settings: { preferences: 'Preferences', title: 'Make it yours.', sub: 'A few quiet choices for the way KALIST feels and behaves.', appearance: 'Appearance', theme: 'Theme', themeHint: 'Choose the atmosphere that suits the moment.', language: 'Language', languageHint: 'Choose the language for KALIST interface text.', tasks: 'Tasks', clearCompleted: 'Clear completed', clearCompletedHint: 'completed tasks will be removed.', clearTasks: 'Clear tasks', watchlist: 'Watchlist', clearSaved: 'Clear saved titles', clearSavedHint: 'saved titles will be removed.', clearWatchlist: 'Clear watchlist', reset: 'Reset', resetTitle: 'Reset all local data', resetHint: 'Remove every task and saved title from this browser.', resetData: 'Reset data', attribution: 'This product uses the TMDB API but is not endorsed or certified by TMDB.', about: 'About KALIST', aboutHint: 'A calm place for daily focus and saved stories.', confirmReset: 'Reset all tasks and watchlist data? This cannot be undone.', confirmCompleted: 'Remove all completed tasks?', confirmSaved: 'Remove every saved title from your watchlist?', dark: 'Dark', light: 'Light', english: 'English', indonesian: 'Bahasa Indonesia', themeSelection: 'Theme selection' },

  },

  id: {

    greeting: { morning: 'Selamat pagi.', afternoon: 'Selamat siang.', evening: 'Selamat malam.' },

    today: { subtitle: 'Satu langkah kecil yang jelas cukup untuk memulai.', progress: 'Kemajuan harian', of: 'dari', completed: 'selesai', tasks: 'Tugas', completedMetric: 'Selesai', remainingMetric: 'Tersisa', focus: 'Fokus hari ini', upcomingEmpty: 'Belum ada tugas mendatang.', clearTitle: 'Jadwal lega', clearDescription: 'Belum ada tugas hari ini. Tambahkan satu langkah kecil untuk mulai.' },

    nav: { workspace: 'Ruang kerja', today: 'Hari ini', tasks: 'Tugas', watchlist: 'Watchlist', search: 'Cari', settings: 'Pengaturan', personal: 'Ruang pribadi', light: 'Mode terang', dark: 'Mode gelap', footer: '© 2026 Muhammad Setiawan Wibisono' },

    common: { cancel: 'Batal', save: 'Simpan', close: 'Tutup', retry: 'Coba lagi', backSearch: 'Kembali ke pencarian', movie: 'Film', tv: 'Serial TV', watched: 'Sudah ditonton', unwatch: 'Belum ditonton', saved: 'Tersimpan', remove: 'Hapus', open: 'Buka detail' },

    tasks: { added: 'Tugas ditambahkan', updated: 'Tugas diperbarui', completed: 'Tugas selesai!', completedFilter: 'Selesai', incomplete: 'Tugas dikembalikan', deleted: 'Tugas dihapus', nice: 'Mantap. Lanjutkan momentum kamu.', dayCompleted: 'Hari selesai!', dayMessage: 'Semua tugas hari ini sudah selesai. Kerja bagus.', validation: 'Beri judul tugas terlebih dahulu.', newTask: 'Tugas baru', editTask: 'Edit tugas', titlePrompt: 'Apa yang perlu kamu lakukan?', editPrompt: 'Atur detailnya.', add: 'Tambah tugas', title: 'Judul', description: 'Deskripsi', date: 'Tanggal', time: 'Waktu', priority: 'Prioritas', category: 'Kategori', low: 'Rendah', medium: 'Sedang', high: 'Prioritas tinggi', work: 'Kerja', personal: 'Pribadi', study: 'Belajar', project: 'Proyek', other: 'Lainnya', focus: 'Fokus sekarang', todayTasks: 'Tugas hari ini', upcoming: 'Berikutnya', nothing: 'Belum ada rencana hari ini.', clear: 'Hari ini sudah selesai.', empty: 'Tambahkan hal pertama yang ingin kamu selesaikan.', remaining: 'tersisa', library: 'Pustaka tugas', libraryTitle: 'Semua di satu tempat.', librarySub: 'Buat daftar terlihat. Jadikan langkah berikutnya jelas.', allTasks: 'Semua tugas', yourList: 'Daftar kamu', quiet: 'Daftar kamu masih tenang.', noMatch: 'Tidak ada tugas yang cocok.', tryFilter: 'Coba pencarian atau filter lain.', addRemember: 'Tambahkan sesuatu yang ingin kamu ingat.', search: 'Cari tugas', allCategories: 'Semua kategori', nearest: 'Terdekat dulu', dateSort: 'Tanggal', prioritySort: 'Prioritas', created: 'Waktu dibuat', status: 'Status selesai', all: 'Semua tugas' },

    rating: { myRating: 'Rating saya', noRating: 'Belum dinilai', remove: 'Hapus rating', save: 'Rating disimpan', removed: 'Rating dihapus', half: 'setengah bintang', full: 'bintang' },

    media: { discover: 'Temukan', searchTitle: 'Cari tontonan berikutnya.', searchSub: 'Cari film dan serial, lalu simpan yang ingin kamu ingat.', searchPlaceholder: 'Cari film atau serial TV', start: 'Mulai menjelajah', question: 'Apa yang ingin kamu tonton?', searchHint: 'Cari berdasarkan judul untuk melihat hasil TMDB.', unavailable: 'Pencarian tidak tersedia', noResults: 'Tidak ada judul ditemukan.', noResultsHint: 'Coba ejaan lain atau pencarian yang lebih umum.', savedLater: 'Disimpan untuk nanti', watchlist: 'Watchlist', watchlistSub: 'Simpan film dan serial yang ingin kamu tonton.', emptyWatchlist: 'Watchlist kamu masih kosong.', emptyWatchlistHint: 'Simpan film dan serial yang ingin kamu tonton nanti.', find: 'Cari tontonan', movies: 'Film', tvShows: 'Serial TV', all: 'Semua', watched: 'Sudah ditonton', unwatched: 'Belum ditonton', saved: 'Tersimpan', rated: 'Dinilai', titles: 'judul', results: 'Hasil', searchUnavailable: 'Pencarian tidak tersedia', configHint: 'Periksa konfigurasi atau koneksi, lalu coba lagi.', movie: 'Film', tv: 'Serial TV', save: 'Simpan', savedAction: 'Tersimpan', unwatch: 'Belum ditonton', watch: 'Sudah ditonton', remove: 'Hapus', noView: 'Tidak ada judul di tampilan ini.', tryView: 'Coba filter lain untuk melihat judul tersimpan.', back: 'Kembali', detailsError: 'Gagal memuat', titleNotFound: 'Judul tidak ditemukan.', detailsHint: 'Periksa ID judul atau konfigurasi TMDB, lalu coba lagi.', yearUnknown: 'Tahun tidak diketahui', runtimeUnknown: 'Durasi tidak diketahui', seasons: 'musim', noOverview: 'Belum ada ringkasan untuk judul ini.', watchTrailer: 'Tonton trailer', people: 'Para pemeran', cast: 'Pemeran', castUnavailable: 'Informasi pemeran tidak tersedia.', chapters: 'Bab cerita', episodes: 'episode', dateUnknown: 'Tanggal tidak diketahui', trailer: 'trailer' },

    settings: { preferences: 'Preferensi', title: 'Jadikan milikmu.', sub: 'Beberapa pilihan untuk membuat KALIST terasa sesuai denganmu.', appearance: 'Tampilan', theme: 'Tema', themeHint: 'Pilih suasana yang sesuai dengan momennya.', language: 'Bahasa', languageHint: 'Pilih bahasa untuk teks antarmuka KALIST.', tasks: 'Tugas', clearCompleted: 'Hapus yang selesai', clearCompletedHint: 'tugas selesai akan dihapus.', clearTasks: 'Hapus tugas', watchlist: 'Watchlist', clearSaved: 'Hapus judul tersimpan', clearSavedHint: 'judul tersimpan akan dihapus.', clearWatchlist: 'Hapus watchlist', reset: 'Reset', resetTitle: 'Reset semua data lokal', resetHint: 'Hapus semua tugas dan judul tersimpan dari browser ini.', resetData: 'Reset data', attribution: 'Produk ini menggunakan TMDB API tetapi tidak didukung atau disertifikasi oleh TMDB.', about: 'Tentang KALIST', aboutHint: 'Tempat tenang untuk fokus harian dan cerita tersimpan.', confirmReset: 'Reset semua tugas dan watchlist? Tindakan ini tidak dapat dibatalkan.', confirmCompleted: 'Hapus semua tugas yang selesai?', confirmSaved: 'Hapus semua judul tersimpan dari watchlist?', dark: 'Gelap', light: 'Terang', english: 'English', indonesian: 'Bahasa Indonesia', themeSelection: 'Pilihan tema' },

  },

}

function getValue(source, path) {
  return path.split('.').reduce((value, key) => value?.[key], source) ?? path
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => readStorage(LANGUAGE_STORAGE_KEY, 'en') === 'id' ? 'id' : 'en')

  useEffect(() => writeStorage(LANGUAGE_STORAGE_KEY, language), [language])

  const t = (path) => getValue(translations[language], path)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}