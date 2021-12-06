import { useEffect, useState, useMemo } from 'react';

import { api } from '../services/api';
import { CSVLink } from 'react-csv';
import ApplicationRow from './ApplicationRow';
import Search from './Search';
import PaginationComponent from './Pagination';
import TableHeader from './TableHeader';
import ShowCandidate from './ShowCandidate';
import Select from 'react-select';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';

const Program = (props) => {
  const [applications, setApplications] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState({ field: '', order: '' });
  const [programName, setProgramName] = useState('');
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [candidateVisibility, setCandidateVisibility] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('');
  const [emailOptions, setEmailOptions] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [activities, setActivities] = useState([]);
  const [autoHeaders, setAutoHeaders] = useState([]);
  const [emailTemplateTitle, setEmailTemplateTitle] = useState('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const setEmailTemplateOptions = () => {
    let optionsList = [];
    emailTemplates.forEach((elemento) => {
      optionsList.push({ value: elemento, label: elemento.title });
    });
    setEmailOptions(optionsList);
  };

  const setHeadersColumns = () => {
    let optionsList = [
      { name: 'Candidate', field: 'fullName', sortable: true },
    ];
    activities.forEach((activity) => {
      optionsList.push({
        name: activity.title,
        field: activity.title.replace(/\s/g, ''),
        sortable: true,
      });
    });
    optionsList.push({ name: 'Average', field: 'average', sortable: true });
    optionsList.push({ name: 'State', field: 'state', sortable: true });
    setAutoHeaders(optionsList);
  };

  /*********Export CSV Handler ***************/
  const exportHeaders = autoHeaders.map((header) => ({
    label: header.name,
    key: header.field,
  }));

  const exportData = selectedApplications.map((item) => ({
    fullName: item.fullName,
    average: item.average,
    activities: item.activities,
    state: item.state,
  }));

  exportData.forEach((data) => {
    data.activities.forEach((activity) => {
      data[activity.name.replace(/\s/g, '')] = activity.grade;
    });
  });

  const csvReport = {
    filename: `${programName}-Report.csv`,
    headers: exportHeaders,
    data: exportData,
  };

  /***********End of export CSV Handler ********/

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  /************ Fetching data from backend ***************/
  useEffect(() => {
    const fetchApplications = async () => {
      const { data } = await api.get(
        `/programs/${props.match.params.id}/applications`
      );
      setApplications(data);
    };

    const fetchActivities = async () => {
      const { data } = await api.get(
        `/programs/${props.match.params.id}/activities`
      );
      setActivities(data);
    };

    const fetchProgramName = async () => {
      const { data } = await api.get(`/programs/${props.match.params.id}/`);
      setProgramName(data.name_en);
    };

    const fetchEmailTemplates = async () => {
      const { data } = await api.get(
        `/programs/${props.match.params.id}/templates`
      );
      setEmailTemplates(data);
    };

    fetchApplications();
    fetchActivities();
    fetchProgramName();
    fetchEmailTemplates();
  }, []);

  /***********Email Handler **********/
  const sendCandidateEmail = () => {
    setAlertVisible(true);

    if (selectedApplications.length == 0) {
      setMessage('Please select at least one candidate');
      setMessageType('error');
    } else if (selectedEmailTemplate.length == 0) {
      setMessage('Please select the email template option');
      setMessageType('error');
    } else {
      const payload = {
        candidates: selectedApplications,
        emailTemplate: {
          title: selectedEmailTemplate.title,
          message: selectedEmailTemplate.message,
        },
      };

      api
        .post('/applications/sendemail', payload)
        .then(function (response) {
          console.log(response);
          setMessage('The e-mail has been succesfully sent');
          setMessageType('success');
          setAlertVisible(true);
        })
        .catch(function (error) {
          setMessage('The e-mail has not been succesfully sent');
          setMessageType('error');
          console.log(error);
        });
    }
  };

  const saveTemplate = () => {
    const payload = {
      title: emailTemplateTitle,
      message: editorState.getCurrentContent().getPlainText('\u0001'),
    };

    api
      .post('/programs/savetemplate', payload)
      .then(function (response) {
        console.log(response);
        setMessage('The template has been succesfully saved');
        setMessageType('success');
        setAlertVisible(true);
      })
      .catch(function (error) {
        setMessage('The template has not been succesfully saved');
        setMessageType('error');
        console.log(error);
      });
  };

  const createTemplate = () => {
    setShowResults(!showResults);
  };

  const titleChangeHandler = (event) => {
    setEmailTemplateTitle(event.target.value);
  };

  const paginationChangeHandler = (pageNumber) => {
    setItemsPerPage(pageNumber);
  };

  const showCandidate = (application) => {
    setSelectedUser(application);
    setCandidateVisibility((visibility) => !visibility);
    return 1;
  };

  const applicationsData = useMemo(() => {
    setEmailTemplateOptions();
    setHeadersColumns();

    let computedApplications = applications;

    if (search) {
      computedApplications = computedApplications.filter(
        (application) =>
          application.fullName.toLowerCase().includes(search.toLowerCase()) ||
          application.eligible.toLowerCase().includes(search.toLowerCase()) ||
          application.stateChanged.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedApplications.length);

    //Sorting applications
    if (sorting.field) {
      const reversed = sorting.order === 'asc' ? 1 : -1;
      computedApplications = computedApplications.sort((a, b) =>
        a[sorting.field] > b[sorting.field]
          ? reversed * 1
          : b[sorting.field] > a[sorting.field]
          ? reversed * -1
          : 0
      );
    }

    setSelectedApplications(
      applications.filter((application) => application.select === true)
    );

    return computedApplications.slice(
      (currentPage - 1) * itemsPerPage,
      (currentPage - 1) * itemsPerPage + itemsPerPage
    );
  }, [applications, currentPage, search, sorting, itemsPerPage]);

  return (
    <div>
      <Snackbar
        open={alertVisible}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Alert severity={messageType}>{message}</Alert>
      </Snackbar>
      <div className="App-header">
        <h1 className="text-white">{programName}</h1>
      </div>
      <div className="container">
        {showResults && (
          <div className="panel my-5">
            <div className="actions-header">
              <Search
                onSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
              <Select
                className="select-email"
                defaultValue={{ label: 'Select Email', value: 0 }}
                options={emailOptions}
                onChange={(e) => setSelectedEmailTemplate(e.value)}
              />
              <button
                className="btn btn-outline-info"
                onClick={sendCandidateEmail}
              >
                Email Selected
              </button>
              <button className="btn btn-outline-success">
                <CSVLink
                  style={{ textDecoration: 'none', color: 'green' }}
                  {...csvReport}
                >
                  Export Selected
                </CSVLink>
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={createTemplate}
              >
                Create Template
              </button>
            </div>
            <table className="table table-hover m-3">
              <TableHeader
                headers={autoHeaders}
                onSorting={(field, order) => setSorting({ field, order })}
                applications={applications}
                setApplications={setApplications}
              />
              <tbody>
                <ApplicationRow
                  applications={applications}
                  applicationsSliced={applicationsData}
                  setApplications={setApplications}
                  onShowCandidate={showCandidate}
                />
              </tbody>
            </table>
            <PaginationComponent
              total={totalItems}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={paginationChangeHandler}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
            <div className="emailSelection"></div>
            <div className="panel-buttons"></div>
          </div>
        )}
        {candidateVisibility && (
          <ShowCandidate onClose={showCandidate} application={selectedUser} />
        )}
        {!showResults && (
          <div className="container">
            <div className="panel my-5">
              <div className="actions-header">
                <input
                  type="text"
                  className="form-control mb-3 w-100"
                  placeholder="Email Title"
                  value={emailTemplateTitle}
                  onChange={titleChangeHandler}
                />
              </div>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbarClassName="toolbar-class"
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
              />
              <div className="d-flex justify-content-center my-2">
                <button
                  className="btn btn-outline-danger mr-2"
                  onClick={createTemplate}
                >
                  View Applications
                </button>
                <button
                  className=" btn btn-outline-info"
                  onClick={saveTemplate}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Program;
