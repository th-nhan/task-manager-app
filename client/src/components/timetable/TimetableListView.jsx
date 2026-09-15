import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, MapPin, PlusCircle, Edit, Trash2, ChevronRight } from 'lucide-react';
import { GRADE_CONFIG, LOCATION_CONFIG, LEVEL_CONFIG } from '../../data/timetableData';

export const TimetableListView = ({
    timetableItems = [],
    onSelectClass,
    onConvertToTask,
    onEdit,
    onDelete
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGrade, setFilterGrade] = useState('ALL');
    const [filterLocation, setFilterLocation] = useState('ALL');
    const [filterDay, setFilterDay] = useState('ALL');
    const [sortBy, setSortBy] = useState('id'); // 'id' | 'day' | 'time' | 'grade'

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        return timetableItems
            .filter(item => {
                // Search
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    const matchName = item.className.toLowerCase().includes(query);
                    const matchCode = item.originalCode.toLowerCase().includes(query);
                    const matchDay = item.dayOfWeek.toLowerCase().includes(query);
                    const matchLoc = item.location.toLowerCase().includes(query);
                    if (!matchName && !matchCode && !matchDay && !matchLoc) return false;
                }
                // Grade
                if (filterGrade !== 'ALL' && item.grade !== Number(filterGrade)) return false;
                // Location
                if (filterLocation !== 'ALL' && item.location !== filterLocation) return false;
                // Day
                if (filterDay !== 'ALL' && item.dayOfWeek !== filterDay) return false;

                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'id') return a.id - b.id;
                if (sortBy === 'day') return a.dayIndex - b.dayIndex;
                if (sortBy === 'grade') return a.grade - b.grade;
                if (sortBy === 'time') return a.startTime.localeCompare(b.startTime);
                return 0;
            });
    }, [timetableItems, searchQuery, filterGrade, filterLocation, filterDay, sortBy]);

    const handleDelete = (item) => {
        if (window.confirm(`Are you sure you want to delete class session "${item.className}" (${item.dayOfWeek})?`)) {
            onDelete(item.id);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden space-y-4">
            {/* Filter Toolbar */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-pink-50/60 via-white to-pink-50/40 border-b border-pink-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            📋 Detailed Schedule List ({timetableItems.length} Slots)
                        </h2>
                        <p className="text-xs text-gray-500">
                            Search, edit, delete, and manage schedule flexibly
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search class, code (e.g. 12NC, My Loc)..."
                            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-2xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="font-semibold text-gray-600 flex items-center gap-1 mr-1">
                        <Filter className="w-3.5 h-3.5 text-pink-500" /> Filter:
                    </span>

                    {/* Grade Filter */}
                    <select
                        value={filterGrade}
                        onChange={e => setFilterGrade(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">All Grades</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                    </select>

                    {/* Location Filter */}
                    <select
                        value={filterLocation}
                        onChange={e => setFilterLocation(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">All Locations</option>
                        <option value="Long Thượng">Long Thượng</option>
                        <option value="Mỹ Lộc">Mỹ Lộc</option>
                    </select>

                    {/* Day Filter */}
                    <select
                        value={filterDay}
                        onChange={e => setFilterDay(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">All Days</option>
                        <option value="Thứ 2">Monday</option>
                        <option value="Thứ 3">Tuesday</option>
                        <option value="Thứ 4">Wednesday</option>
                        <option value="Thứ 5">Thursday</option>
                        <option value="Thứ 6">Friday</option>
                        <option value="Thứ 7">Saturday</option>
                        <option value="Chủ nhật">Sunday</option>
                    </select>

                    {/* Sort Filter */}
                    <div className="ml-auto flex items-center gap-1">
                        <span className="text-gray-400">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-pink-200 bg-white font-medium text-gray-700 focus:outline-none cursor-pointer"
                        >
                            <option value="id">By Index</option>
                            <option value="day">By Day of Week</option>
                            <option value="time">By Time</option>
                            <option value="grade">By Grade</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-4 md:px-6 pb-6">
                <table className="w-full border-collapse text-left min-w-[760px]">
                    <thead>
                        <tr className="border-b border-pink-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                            <th className="py-3 px-3 w-12 text-center">No.</th>
                            <th className="py-3 px-4">Day & Shift</th>
                            <th className="py-3 px-4">Time Slot</th>
                            <th className="py-3 px-4">Class (Full Name)</th>
                            <th className="py-3 px-3">Original Code</th>
                            <th className="py-3 px-3">Grade</th>
                            <th className="py-3 px-3">Location</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100/60 text-xs">
                        {filteredAndSortedItems.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-12 text-center text-gray-400">
                                    No classes match the filter criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedItems.map((item, index) => {
                                const gradeStyle = GRADE_CONFIG[item.grade] || GRADE_CONFIG[10];

                                return (
                                    <tr
                                        key={item.id}
                                        onClick={() => onSelectClass && onSelectClass(item)}
                                        className="hover:bg-pink-50/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="py-3.5 px-3 text-center font-mono font-bold text-gray-400 group-hover:text-pink-600">
                                            {index + 1}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                                            <div className="flex items-center gap-1.5">
                                                <span>{item.dayOfWeek}</span>
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-100 text-pink-700 font-normal">
                                                    {item.shift}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-gray-700">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-pink-400" />
                                                <span>{item.timeRange}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                                            {item.className}
                                        </td>
                                        <td className="py-3.5 px-3 font-mono font-bold text-pink-600">
                                            <span className="bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                                                {item.originalCode}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${gradeStyle.badgeBg} ${gradeStyle.badgeText}`}>
                                                Grade {item.grade}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="inline-flex items-center gap-1 text-gray-600 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                {item.location}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3 text-right">
                                            <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        title="Edit class slot"
                                                        className="p-1.5 rounded-lg hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors cursor-pointer"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        title="Delete class slot"
                                                        className="p-1.5 rounded-lg hover:bg-rose-100 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onConvertToTask && (
                                                    <button
                                                        onClick={() => onConvertToTask(item)}
                                                        title="Create task from this slot"
                                                        className="p-1.5 rounded-lg hover:bg-pink-100 text-pink-500 hover:text-pink-700 transition-colors cursor-pointer"
                                                    >
                                                        <PlusCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimetableListView;
