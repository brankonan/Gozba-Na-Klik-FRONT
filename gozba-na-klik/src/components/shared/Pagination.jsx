import React from "react";
import "../../styles/Pagination.scss";

const Pagination = ({ page, pageSize, totalCount, onPageChange, onPageSizeChange, }) => {

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const canPrev = page > 1;
    const canNext = page < totalPages;


    
    return (
        <div className="pagination">
            <button 
            className="pagination__btn"
            disabled={!canPrev}
             onClick={() => onPageChange(1)}>
                « Prva
            </button>

            <button 
            className="pagination__btn"
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}>
                ‹ Prethodna
            </button>

            <span className="pagination__info">
                Strana {page} / {totalPages}
            </span>

            <button 
            className="pagination__btn"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}>
                Sledeća ›
            </button>

            <button 
            className="pagination__btn"
            disabled={!canNext} 
            onClick={() => onPageChange(totalPages)}>
                Poslednja »
            </button>

            <select
                className="pagination__select"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
                {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                        {size} po strani
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Pagination;
