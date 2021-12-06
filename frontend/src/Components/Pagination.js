import React, { useEffect, useState, useMemo } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import { Row, Col } from 'reactstrap';

const PaginationComponent = ({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  setItemsPerPage,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemsPerPage > 0)
      setTotalPages(Math.ceil(total / itemsPerPage));
  }, [total, itemsPerPage]);

  const paginationItems = useMemo(() => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pages;
  }, [totalPages, currentPage]);

  const onInputChange = (value) => {
    setItemsPerPage(value);
  };

  if (totalPages === 0) return null;

  return (
    <div className="panels">
      <Row className="pt-3">
        <Col>
          <h6>Total of {total} results</h6>
        </Col>
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {paginationItems}
            <Pagination.Next
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Col>
        <Col className="d-inline">
          Show
          <input
            className="mx-1"
            type="text"
            style={{ width: '40px' }}
            value={itemsPerPage}
            onChange={(e) => onInputChange(e.target.value)}
          ></input>
          results per page
        </Col>
      </Row>
    </div>
  );
};

export default PaginationComponent;
