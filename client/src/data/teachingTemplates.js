// Teaching slot templates and helpers
export const UNIQUE_CLASS_TEMPLATES = [
    { id: '10cb_lt1', className: '10 Basic Long Thượng 1', originalCode: '10CB LT 1', timeRange: '17:00 – 18:30', startTime: '17:00', endTime: '18:30', grade: 10, location: 'Long Thượng', shift: 'Afternoon' },
    { id: '12nc_lt2', className: '12 Advanced Long Thượng 2', originalCode: '12NC LT 2', timeRange: '18:45 – 20:15', startTime: '18:45', endTime: '20:15', grade: 12, location: 'Long Thượng', shift: 'Evening' },
    { id: '10_ml1', className: '10 Mỹ Lộc 1', originalCode: '10 ML 1', timeRange: '17:00 – 18:30', startTime: '17:00', endTime: '18:30', grade: 10, location: 'Mỹ Lộc', shift: 'Afternoon' },
    { id: '12cb_lt1', className: '12 Basic Long Thượng 1', originalCode: '12CB LT 1', timeRange: '18:45 – 20:15', startTime: '18:45', endTime: '20:15', grade: 12, location: 'Long Thượng', shift: 'Evening' },
    { id: '11_ml_cb', className: '11 Mỹ Lộc Basic', originalCode: '11 ML CB', timeRange: '17:00 – 18:30', startTime: '17:00', endTime: '18:30', grade: 11, location: 'Mỹ Lộc', shift: 'Afternoon' },
    { id: '12nc_ml', className: '12 Advanced Mỹ Lộc', originalCode: '12NC ML', timeRange: '18:45 – 20:15', startTime: '18:45', endTime: '20:15', grade: 12, location: 'Mỹ Lộc', shift: 'Evening' },
    { id: '10cb_lt2', className: '10 Basic Long Thượng 2', originalCode: '10CB LT 2', timeRange: '17:00 – 18:30', startTime: '17:00', endTime: '18:30', grade: 10, location: 'Long Thượng', shift: 'Afternoon' },
    { id: '12nc_lt1', className: '12 Advanced Long Thượng 1', originalCode: '12NC LT 1', timeRange: '18:45 – 20:15', startTime: '18:45', endTime: '20:15', grade: 12, location: 'Long Thượng', shift: 'Evening' },
    { id: '12cb_ml', className: '12 Basic Mỹ Lộc', originalCode: '12CB ML', timeRange: '16:45 – 18:15', startTime: '16:45', endTime: '18:15', grade: 12, location: 'Mỹ Lộc', shift: 'Afternoon' },
    { id: '11cb_lt2', className: '11 Basic Long Thượng 2', originalCode: '11CB LT 2', timeRange: '18:45 – 20:15', startTime: '18:45', endTime: '20:15', grade: 12, location: 'Long Thượng', shift: 'Evening' },
    { id: '12nc_cb_lt', className: '12 Adv & Basic Long Thượng', originalCode: '12 NC CB LT', timeRange: '07:00 – 08:30', startTime: '07:00', endTime: '08:30', grade: 12, location: 'Long Thượng', shift: 'Morning' },
    { id: 'extra_class', className: 'Make-up / Extra Session', originalCode: 'MAKE-UP', timeRange: '17:00 – 18:30', startTime: '17:00', endTime: '18:30', grade: 12, location: 'Long Thượng', shift: 'Afternoon' }
];

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WEEK_DAYS_HEADER = [
    { key: 'Mon', vi: 'Mon', en: 'Mon', label: 'Monday', isWeekend: false },
    { key: 'Tue', vi: 'Tue', en: 'Tue', label: 'Tuesday', isWeekend: false },
    { key: 'Wed', vi: 'Wed', en: 'Wed', label: 'Wednesday', isWeekend: false },
    { key: 'Thu', vi: 'Thu', en: 'Thu', label: 'Thursday', isWeekend: false },
    { key: 'Fri', vi: 'Fri', en: 'Fri', label: 'Friday', isWeekend: false },
    { key: 'Sat', vi: 'Sat', en: 'Sat', label: 'Saturday', isWeekend: true },
    { key: 'Sun', vi: 'Sun', en: 'Sun', label: 'Sunday', isWeekend: true },
];
