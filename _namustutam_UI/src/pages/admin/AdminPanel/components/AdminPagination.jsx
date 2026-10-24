import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import '../AdminPanel.css';

export default function AdminPagination({
    currentPage = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    itemLabel = 'items',
    theme = 'dark'
}) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }
        if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const handlePageClick = (p) => {
        if (p === '...' || p === currentPage) return;
        if (p >= 1 && p <= totalPages) {
            onPageChange?.(p);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        onPageSizeChange?.(newSize);
        // Reset to page 1 to prevent out-of-range state
        onPageChange?.(1);
    };

    const isDark = theme === 'dark';

    return (
        <div className={`admin-pagination-bar ${isDark ? 'theme-dark' : 'theme-light'}`}>
            {/* Left side: Range Info & Page Size */}
            <div className="admin-pagination-info-wrap">
                <div className="admin-pagination-count">
                    Showing <span className="highlight">{startIndex}</span> to{' '}
                    <span className="highlight">{endIndex}</span> of{' '}
                    <span className="highlight">{totalItems}</span> {itemLabel}
                </div>

                {pageSizeOptions && pageSizeOptions.length > 1 && (
                    <div className="admin-pagination-size-selector">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="admin-pagination-select"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right side: Navigation Buttons */}
            {totalPages > 1 && (
                <div className="admin-pagination-nav">
                    {/* First Page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(1)}
                        disabled={currentPage === 1}
                        className="admin-page-nav-btn"
                        title="First Page"
                    >
                        <ChevronsLeft size={14} />
                    </button>

                    {/* Previous Page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="admin-page-nav-btn"
                        title="Previous Page"
                    >
                        <ChevronLeft size={14} />
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="admin-page-numbers-group">
                        {getPageNumbers().map((p, idx) => {
                            if (p === '...') {
                                return (
                                    <span key={`ellipsis-${idx}`} className="admin-page-ellipsis">
                                        …
                                    </span>
                                );
                            }
                            const isActive = p === currentPage;
                            return (
                                <button
                                    key={`page-${p}`}
                                    type="button"
                                    onClick={() => handlePageClick(p)}
                                    className={`admin-page-number-btn ${isActive ? 'active' : ''}`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="admin-page-nav-btn"
                        title="Next Page"
                    >
                        <ChevronRight size={14} />
                    </button>

                    {/* Last Page */}
                    <button
                        type="button"
                        onClick={() => handlePageClick(totalPages)}
                        disabled={currentPage === totalPages}
                        className="admin-page-nav-btn"
                        title="Last Page"
                    >
                        <ChevronsRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
