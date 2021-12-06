import React from 'react';
import Modal from 'react-bootstrap/Modal';
import style from './showCandidate.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faBirthdayCake,
  faGlobeEurope,
} from '@fortawesome/free-solid-svg-icons';

const ShowContact = (props) => {
  return (
    <Modal show={true} onHide={props.onClose}>
      <Modal.Header closeButton>
        <h3>
          {props.application.user.first_name} {props.application.user.last_name}
        </h3>
      </Modal.Header>
      <Modal.Body closeButton>
        <div className={style.modelbody}>
          <img
            className={style.modalimg}
            src={props.application.img_url}
            alt="program"
          ></img>
          <div>
            <h6>
              <FontAwesomeIcon className="mx-2" icon={faGlobeEurope} />
              Amman - JO
            </h6>
            <h6>
              <FontAwesomeIcon className="mx-2" icon={faEnvelope} />
              {props.application.user.email}
            </h6>
            <h6>
              <FontAwesomeIcon className="mx-2" icon={faBirthdayCake} />
              1982-03-15
            </h6>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShowContact;
