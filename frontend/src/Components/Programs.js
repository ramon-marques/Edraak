import { useEffect, useState } from 'react';
import style from './programs.module.scss';
import ProgramCard from './ProgramCard';
import { api } from '../services/api';

const Programs = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get('/programs');
      setPrograms(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <section className="App-header">
        <h1 className="text-white">Continuous Learning Educational Programs</h1>
      </section>
      <div className="container">
        <div className={style.programs}>
          <div className="row">
            {programs.map((program) => (
              <div>
                <ProgramCard program={program} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
