import { addDays, getDaysDiff } from "./cycleCalculator.js";

export function calculatePhases(
  cycleStartStr,
  cycleEndStr,
  avgCycleLength = 28,
) {
  const periodDuration = getDaysDiff(cycleStartStr, cycleEndStr) + 1;
  const nextPeriodStart = addDays(cycleStartStr, avgCycleLength);

  const menstrual = {
    start: cycleStartStr,
    end: cycleEndStr,
    duration: periodDuration,
  };

  const ovulationPeak = addDays(nextPeriodStart, -14);
  const ovulationStart = addDays(ovulationPeak, -1);
  const ovulationEnd = addDays(ovulationPeak, 1);
  const ovulation = {
    start: ovulationStart,
    peak: ovulationPeak,
    end: ovulationEnd,
    duration: 3,
  };

  const follicularStart = addDays(cycleEndStr, 1);
  const follicularEnd = addDays(ovulationStart, -1);
  const follicular = {
    start: follicularStart,
    end: follicularEnd,
    duration: getDaysDiff(follicularStart, follicularEnd) + 1,
  };

  const lutealStart = addDays(ovulationEnd, 1);
  const lutealEnd = addDays(nextPeriodStart, -1);
  const luteal = {
    start: lutealStart,
    end: lutealEnd,
    duration: getDaysDiff(lutealStart, lutealEnd) + 1,
  };

  return { menstrual, follicular, ovulation, luteal };
}

export function getPhaseForDate(targetDateStr, cycles, avgCycleLength = 28) {
  if (!cycles || cycles.length === 0) {
    return { phase: "unrecorded", dayInCycle: 1, phases: null };
  }

  // Gunakan waktu lokal agar akurat dengan jam HP/PC pengguna
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate),
  );

  // ATURAN 4: Cegah render mundur sebelum siklus pertama (Bug 1970)
  const oldestCycle = sortedCycles[sortedCycles.length - 1];
  if (targetDateStr < oldestCycle.startDate) {
    return { phase: "unrecorded", dayInCycle: 1, phases: null };
  }

  for (const cycle of sortedCycles) {
    const isOngoing = cycle.isOngoing || !cycle.endDate;

    // ATURAN 1 & 2: Handle fase Menstruasi yang masih berlangsung
    if (isOngoing) {
      // Hanya warnai merah jika tanggalnya >= hari mulai DAN <= hari ini
      if (targetDateStr >= cycle.startDate && targetDateStr <= todayStr) {
        const dayInCycle = getDaysDiff(cycle.startDate, targetDateStr) + 1;
        return { phase: "menstrual", dayInCycle, phases: null };
      }
      // Jika haid belum selesai, tanggal di masa depan dibiarkan kosong
      if (targetDateStr > todayStr && targetDateStr >= cycle.startDate) {
        return { phase: "unrecorded", dayInCycle: 1, phases: null };
      }
      continue; // Skip hitung fase lain (folikuler dll) karena haid belum usai
    }

    // Jika siklus sudah selesai, kalkulasi historis secara normal
    const phases = calculatePhases(
      cycle.startDate,
      cycle.endDate,
      avgCycleLength,
    );

    if (
      targetDateStr >= phases.menstrual.start &&
      targetDateStr <= phases.menstrual.end
    ) {
      return {
        phase: "menstrual",
        dayInCycle: getDaysDiff(cycle.startDate, targetDateStr) + 1,
        phases,
      };
    }
    if (
      targetDateStr >= phases.follicular.start &&
      targetDateStr <= phases.follicular.end
    ) {
      return {
        phase: "follicular",
        dayInCycle: getDaysDiff(cycle.startDate, targetDateStr) + 1,
        phases,
      };
    }
    if (
      targetDateStr >= phases.ovulation.start &&
      targetDateStr <= phases.ovulation.end
    ) {
      return {
        phase: "ovulation",
        dayInCycle: getDaysDiff(cycle.startDate, targetDateStr) + 1,
        phases,
      };
    }
    if (
      targetDateStr >= phases.luteal.start &&
      targetDateStr <= phases.luteal.end
    ) {
      return {
        phase: "luteal",
        dayInCycle: getDaysDiff(cycle.startDate, targetDateStr) + 1,
        phases,
      };
    }
  }

  // ATURAN 3: Prediksi Masa Depan (Maksimal HANYA 1 Siklus)
  const latestCycle = sortedCycles[0];
  const isLatestOngoing = latestCycle.isOngoing || !latestCycle.endDate;

  // Prediksi HANYA dilakukan jika siklus haid terakhir sudah tercatat selesainya
  if (!isLatestOngoing) {
    const projectedPhases = calculatePhases(
      latestCycle.startDate,
      latestCycle.endDate,
      avgCycleLength,
    );

    // Cegah render bablas: Jika targetDate melewati akhir Fase Luteal, kembalikan kosong (Batas 1 Siklus)
    if (targetDateStr > projectedPhases.luteal.end) {
      return { phase: "unrecorded", dayInCycle: 1, phases: null };
    }

    const daysFromLatest = getDaysDiff(latestCycle.startDate, targetDateStr);
    const dayInCycle = daysFromLatest + 1;

    if (targetDateStr <= projectedPhases.follicular.end) {
      return { phase: "follicular", dayInCycle, phases: projectedPhases };
    } else if (targetDateStr <= projectedPhases.ovulation.end) {
      return { phase: "ovulation", dayInCycle, phases: projectedPhases };
    } else if (targetDateStr <= projectedPhases.luteal.end) {
      return { phase: "luteal", dayInCycle, phases: projectedPhases };
    }
  }

  return { phase: "unrecorded", dayInCycle: 1, phases: null };
}
