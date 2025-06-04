import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from './th.jpeg';
import axios from 'axios';
import { toast } from 'react-toastify';

const Front = () => {
  const navigate = useNavigate();

  const id = localStorage.getItem("studentId")
  const term = localStorage.getItem("term")
  const year = localStorage.getItem("year")
  const section = localStorage.getItem("section")

  const [oldComments, setOldComments] = useState("")
  const [comments, setComments] = useState("")
  const [personalPercent, setPersonalPercent] = useState(0)
  const [socialPercent, setSocialPercent] = useState(0)
  const [academicPercent, setAcademicPercent] = useState(0)
  const [occupationalPercent, setOccupationalPercent] = useState(0)
  const [recreationalPercent, setRecreationalPercent] = useState(0)
  const [mode, setMode] = useState('')


  const navigateTo = (path) => {
    navigate(path);
  };

  const replacePrimaryLabels = (text) => {
    console.log(text)
    if (!text) return '';

    return text
      .replace(/preprimary_1/gi, 'Preprimary-1')
      .replace(/preprimary_2/gi, 'Preprimary-2')
      .replace(/preprimary_3/gi, 'Preprimary-3')
      .replace(/primary1_1/gi, 'Primary-I-1')
      .replace(/primary1_2/gi, 'Primary-I-2')
      .replace(/primary1_3/gi, 'Primary-I-3')
      .replace(/primary2_1/gi, 'Primary-II-1')
      .replace(/primary2_2/gi, 'Primary-II-2')
      .replace(/primary2_3/gi, 'Primary-II-3')
      .replace(/preprimary/gi, 'Preprimary')
      .replace(/primary1/gi, 'Primary-I')
      .replace(/primary2/gi, 'Primary-II')

  };

  const Header = () => (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src={image} alt="Logo" style={styles.logoImage} />
        <span style={styles.logoLabel}>NIEPID</span>
      </div>
      <nav style={styles.navLinks}>
        <button onClick={() => navigateTo('/teacher/term/termEntry')} style={styles.backButton}>
          Back
        </button>
      </nav>
    </header>
  );

  useEffect(async () => {
    const data = await axios.get("http://localhost:4000/teacher/evaluate/questions", {
      headers: {
        id: id,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }, { withCredentials: true })
      .then(res => {
        var i = 0, j = 0, k = 0;
        res.data.data.section.map((s, index) => {
          if (s.sec === section)
            k = index
        })
        res.data.data.section[k].yearReport.map((y, index) => {
          if (y.year === year)
            i = index
        })
        res.data.data.section[k].yearReport[i].termReport.map((t, index) => {
          if (t.term === term)
            j = index
        })
        if (res.data.data.section[k].yearReport[i].termReport[j].comment.termComment.trim() !== "")
          setOldComments(res.data.data.section[k].yearReport[i].termReport[j].comment.termComment)
        else
          setOldComments("Enter your comments")

        // console.log(res.data.data.section[k].yearReport[i].termReport[j].percent.personalPercent)
        if (res.data.data.section[k].yearReport[i].termReport[j].percent.personalPercent)
          setPersonalPercent(res.data.data.section[k].yearReport[i].termReport[j].percent.personalPercent)
        else
          setPersonalPercent(0)

        if (res.data.data.section[k].yearReport[i].termReport[j].percent.socialPercent)
          setSocialPercent(res.data.data.section[k].yearReport[i].termReport[j].percent.socialPercent)
        else
          setSocialPercent(0)

        if (res.data.data.section[k].yearReport[i].termReport[j].percent.academicPercent)
          setAcademicPercent(res.data.data.section[k].yearReport[i].termReport[j].percent.academicPercent)
        else
          setAcademicPercent(0)

        if (res.data.data.section[k].yearReport[i].termReport[j].percent.occupationalPercent)
          setOccupationalPercent(res.data.data.section[k].yearReport[i].termReport[j].percent.occupationalPercent)
        else
          setOccupationalPercent(0)

        if (res.data.data.section[k].yearReport[i].termReport[j].percent.recreationalPercent)
          setRecreationalPercent(res.data.data.section[k].yearReport[i].termReport[j].percent.recreationalPercent)
        else
          setRecreationalPercent(0)

        if (res.data.data.section[k].yearReport[i].termReport[j].percent.mode.trim())
          setMode(res.data.data.section[k].yearReport[i].termReport[j].percent.mode)
        else
          setMode("")

        // console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  })

  const handleSubmit = async () => {
    await axios.post("http://localhost:4000/teacher/termTypeComment", {
      id: id,
      section: section,
      year: year,
      term: term,
      type: 'termComment',
      comments: comments,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(res => {
        console.log(res.data)
        toast.success("Term evaluated")
        navigateTo('/teacher/term/termEntry')
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
    if (event.target.value)
      document.getElementById("submit").disabled = false
    else
      document.getElementById("submit").disabled = true
  }

  return (
    <div style={styles.pageContainer}>
      <Header />
      <main style={styles.main}>
        <h1 style={styles.heading}>Functional Assessment Checklist for Programming</h1>
        <h1 style={styles.subHeading}>{replacePrimaryLabels(section)} -- Year {year} -- Term {term}</h1>
        <div style={styles.buttonContainer}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button style={styles.button} onClick={() => navigateTo('/teacher/term/termEntry/eval/personal')}>Personal</button>
            <label style={{ fontSize: '13px' }}>{personalPercent !== 0 ? "Percentage : " + personalPercent + "%" : ""}</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button style={styles.button} onClick={() => navigateTo('/teacher/term/termEntry/eval/social')}>Social</button>
            <label style={{ fontSize: '13px' }}>{socialPercent !== 0 ? "Percentage : " + socialPercent + "%" : ""}</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button style={styles.button} onClick={() => navigateTo('/teacher/term/termEntry/eval/occupational')}>Occupational</button>
            <label style={{ fontSize: '13px' }}>{occupationalPercent !== 0 ? "Percentage : " + occupationalPercent + "%" : ""}</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button style={styles.button} onClick={() => navigateTo('/teacher/term/termEntry/eval/academic')}>Academic</button>
            <label style={{ fontSize: '13px' }}>{academicPercent !== 0 ? "Percentage : " + academicPercent + "%" : ""}</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button style={styles.button} onClick={() => navigateTo('/teacher/term/termEntry/eval/recreational')}>Recreational</button>
            {/* <label style={{ fontSize: '13px' }}>{"Percentage : " + recreationalPercent + "%"}</label> */}
            <label style={{ fontSize: '13px' }}>{mode ? "Mode : " + mode : ""}</label>
          </div>
        </div>
      </main>

      <textarea
        name="comments"
        value={comments}
        onChange={handleCommentsChange}
        // disabled={handleDisable}
        style={styles.textArea}
        placeholder={oldComments}
      />
      <button id="submit" style={styles.submitButton} onClick={handleSubmit}>Submit</button>

      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; 2024 Functional Assessment. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#007bff',
    color: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    width: '40px',
    height: '40px',
    marginRight: '0.5rem',
  },
  logoLabel: {
    fontSize: '1.5rem',
  },
  main: {
    flex: '1',
    padding: '2rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '28px',
    margin: '0',
    marginBottom: '1rem',
  },
  subHeading: {
    fontSize: '18px',
    margin: '0',
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  buttonContainer1: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: '50px',
    // marginTop: '20px',
  },
  label: {
    alignSelf: "center",
    justifySelf: 'flex-end'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  submitButton: {
    padding: '12px 25px',
    marginBottom: '10px',
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-3px)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
  footer: {
    textAlign: 'center',
    padding: '14px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  backButton: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.3s",
  },
  textArea: {
    padding: '12px',
    marginTop: '5px',
    marginBottom: '20px',
    width: '90%',
    alignSelf: 'center',
    height: '100px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '15px',
    color: '#333',
    backgroundColor: '#f9f9f9',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    resize: 'vertical',
    '&:focus': {
      borderColor: '#007BFF',
      outline: 'none',
      boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)',
    },
  }
};

export default Front;
