import { getPhaseForDate } from "../core/algorithms/phaseEngine.js";

const PHASE_STYLES = {
  menstrual: {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    text: "text-rose-700",
  },
  follicular: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  ovulation: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  luteal: {
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    text: "text-purple-700",
  },
};

// Mapping Ikon FontAwesome berdasarkan ID/Key Mood
const MOOD_ICONS = {
  // Sedih
  sedih: "fa-regular fa-face-frown text-sky-500",
  sad: "fa-regular fa-face-frown text-sky-500",
  "😢": "fa-regular fa-face-frown text-sky-500",
  "😭": "fa-regular fa-face-frown text-sky-500",

  // Senang
  senang: "fa-regular fa-face-smile text-amber-500",
  happy: "fa-regular fa-face-smile text-amber-500",
  "😊": "fa-regular fa-face-smile text-amber-500",

  // Biasa
  biasa: "fa-regular fa-face-meh text-slate-500",
  neutral: "fa-regular fa-face-meh text-slate-500",
  "😐": "fa-regular fa-face-meh text-slate-500",

  // Marah
  marah: "fa-regular fa-face-angry text-rose-500",
  angry: "fa-regular fa-face-angry text-rose-500",
  "😡": "fa-regular fa-face-angry text-rose-500",

  // Malas / Lelah
  malas: "fa-regular fa-face-tired text-purple-500",
  lelah: "fa-regular fa-face-tired text-purple-500",
  tired: "fa-regular fa-face-tired text-purple-500",
  lazy: "fa-regular fa-face-tired text-purple-500",
  sloth: "fa-regular fa-face-tired text-purple-500",
  "😫": "fa-regular fa-face-tired text-purple-500",
  "😴": "fa-regular fa-face-tired text-purple-500",
};

export class CalendarComponent {
  constructor(containerId, onDateClick) {
    this.containerId = containerId;
    this.onDateClick = onDateClick;
    this.currentDate = new Date();
  }

  goToCurrentMonth() {
    this.currentDate = new Date();
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }

  render(cycles = [], moodEntries = [], avgCycle = 28) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const monthYearEl = document.getElementById("calendar-month-year");
    if (monthYearEl) {
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      monthYearEl.innerText = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    container.innerHTML = "";

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Petak Kosong Awal Bulan
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "h-12 sm:h-16 rounded-2xl bg-slate-100/40";
      container.appendChild(emptyCell);
    }

    // Perulangan Hari Bulan Ini
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      // 1. Hitung Fase Hormonal
      let phaseKey = null;
      if (
        cycles &&
        cycles.length > 0 &&
        typeof getPhaseForDate === "function"
      ) {
        const phaseInfo = getPhaseForDate(dateStr, cycles, avgCycle);
        if (phaseInfo && phaseInfo.phase && phaseInfo.phase !== "unrecorded") {
          phaseKey = phaseInfo.phase;
        }
      }

      // 2. Ambil & Cocokkan Catatan Mood untuk Tanggal Ini
      const moodEntry = Array.isArray(moodEntries)
        ? moodEntries.find((m) => m.date === dateStr)
        : null;

      let moodIconClass = null;
      if (moodEntry) {
        const rawMood = String(
          moodEntry.mood ||
            moodEntry.moodId ||
            moodEntry.type ||
            moodEntry.emoji ||
            "",
        )
          .toLowerCase()
          .trim();

        if (rawMood && MOOD_ICONS[rawMood]) {
          moodIconClass = MOOD_ICONS[rawMood];
        } else if (rawMood) {
          moodIconClass = "fa-regular fa-note-sticky text-purple-400";
        }
      }

      const style = phaseKey ? PHASE_STYLES[phaseKey] : null;
      const cell = document.createElement("div");

      let baseClasses =
        "h-12 sm:h-16 rounded-2xl p-1.5 sm:p-2 border transition-all cursor-pointer flex flex-col justify-between shadow-sm";

      if (style) {
        baseClasses += ` ${style.badge}`;
      } else {
        baseClasses += " border-slate-100 bg-white hover:border-rose-300";
      }

      if (dateStr === todayStr) {
        baseClasses += " ring-2 ring-rose-500";
      }

      cell.className = baseClasses;

      // Render elemen sel
      cell.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold ${dateStr === todayStr ? "text-rose-600" : style ? style.text : "text-slate-700"}">${day}</span>
          ${style ? `<span class="w-2.5 h-2.5 rounded-full ${style.dot} shadow-sm"></span>` : ""}
        </div>
        <div class="flex items-center justify-end">
          ${moodIconClass ? `<i class="${moodIconClass} text-base sm:text-lg"></i>` : ""}
        </div>
      `;

      cell.addEventListener("click", () => {
        if (typeof this.onDateClick === "function") {
          this.onDateClick(dateStr);
        }
      });

      container.appendChild(cell);
    }
  }
}
