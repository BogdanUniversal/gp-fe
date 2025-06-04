import "./about.css";

const About = () => {
  return (
    <div className="about">
      <h1 className="about__title">About</h1>
      <div className="about__paragraph">University Babeș-Bolyai</div>
      <div className="about__paragraph">
        Faculty of Mathematics and Computer Science
      </div>
      <div className="about__paragraph">
        Master's Program: Data Science for Industry and Society
      </div>
      <div className="about__paragraph last">
        <div className="about__paragraph__sub">Universal Bogdan-Mihai</div>
        <div className="about__paragraph__sub">Coordinating teacher: Dr. Ioan Bădărînză</div>
      </div>
    </div>
  );
};

export default About;
