import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const ApplicationRow = (props) => {
  const getInterviewEligible = (techGrade, englishGrade) => {
    if (techGrade < 50 || englishGrade < 50) {
      return 'Ineligible';
    }
    if ((techGrade + englishGrade) / 2 > 50) {
      return 'Eligible';
    } else return 'Ineligible';
  };

  const getTotalGrade = (activities) => {
    let sum = 0;
    for (let i = 0; i < activities.length; i++) {
      sum += activities[i].grade;
    }
    return (sum /= activities.length);
  };

  const getFullName = (firstName, lastName) => {
    return firstName + ' ' + lastName;
  };

  const getState = (state) => {
    console.log('STATEEE');
    console.log(state);
    if (state === 'in_progress') {
      console.log('ENTREI IN PROGRESS');
      return 'In Progress';
    } else if (state === 'pending_review') {
      return 'Pending Review';
    } else if (state === 'accepted') {
      return 'Accepted';
    } else if (state === 'rejected') {
      return 'Rejected';
    } else if (state === 'on_hold') {
      return 'On Hold';
    } else if (state === 'action_required') {
      return 'Action Required';
    } else return 'None';
  };

  const getInterviewGrade = (interviewGrade, eligible) => {
    if (eligible === 'Eligible' && interviewGrade == null) return 0;
    else if (interviewGrade > 0) return interviewGrade;
    else return 'NA';
  };

  const toggleCandidateVisiblity = (value) => {
    props.onShowCandidate(value);
  };

  props.applications.map(
    (app) => (
      (app.eligible = getInterviewEligible(app.english_exam, app.tech_exam)),
      (app.average = getTotalGrade(app.activities)),
      (app.fullName = getFullName(app.user.first_name, app.user.last_name)),
      (app.stateChanged = getState(app.state)),
      (app.interviewGrade = getInterviewGrade(
        app.interview_grade,
        app.eligible
      ))
    )
  );

  return props.applicationsSliced.map((d) => (
    <tr key={d.id}>
      <td>
        <input
          type="checkbox"
          checked={d.select}
          onChange={(e) => {
            let value = e.target.checked;
            props.setApplications(
              props.applications.map((sd) => {
                if (sd.id === d.id) {
                  sd.select = value;
                }
                return sd;
              })
            );
          }}
        />
      </td>
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => toggleCandidateVisiblity(d)}
      >
        {d.fullName}
      </td>
      {d.activities.map((activity) => (
        <td style={activity.grade > 50 ? { color: 'black' } : { color: 'red' }}>
          {activity.grade}%
        </td>
      ))}
      {d.average >= 0 ? <td>{d.average}%</td> : <td>-</td>}
      <td
        style={{
          color:
            d.stateChanged === 'Accepted'
              ? 'green'
              : d.stateChanged === 'Rejected'
              ? 'red'
              : 'orange',
        }}
      >
        {d.stateChanged}
      </td>
    </tr>
  ));
};

export default ApplicationRow;
