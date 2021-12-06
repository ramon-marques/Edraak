import style from './programCard.module.scss';

const ProgramCard = (props) => {
  return (
    <div className={style.program}>
      <a href={`/programs/${props.program.id}`}>
        <img src={props.program.cover_image} alt="program"></img>
      </a>
      <h6 className="ml-2">{props.program.name_en}</h6>
    </div>
  );
};

export default ProgramCard;
