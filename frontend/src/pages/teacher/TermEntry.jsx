import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Footer, Header } from '../../components/components';

const Front = () => {
    const navigate = useNavigate();

    const id = localStorage.getItem("studentId");
    const year = localStorage.getItem("year");
    const section = localStorage.getItem("section");
    const name = localStorage.getItem("studentName")

    const [oldyearComment, setoldYearComment] = useState('')
    const [oldYearPersonalComment, setoldYearPersonalComment] = useState('')
    const [oldYearSocialComment, setoldYearSocialComment] = useState('')
    const [oldYearAcademicComment, setoldYearAcademicComment] = useState('')
    const [oldYearOccupationalComment, setoldYearOccupationalComment] = useState('')
    const [oldYearRecreationalComment, setoldYearRecreationalComment] = useState('')

    const [percent, setPercent] = useState({
        personalPercent: '',
        socialPercent: '',
        academicPercent: '',
        occupationalPercent: '',
        recreationalPercent: ''
    })

    // const [termEvaluated, setTermEvaluated] = useState(false);

    const [comments, setComments] = useState(["", "", "", "", "", ""]);
    const [terms, setTerms] = useState([]);

    const [evaluationComplete, setEvaluationComplete] = useState(false);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:4000/teacher/getStudentbyId", {
                    headers: {
                        id: id,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = res.data;
                const sectionData = data.section.find(s => s.sec === section);
                const yearData = sectionData.yearReport.find(y => y.year === year);
                // const termData = yearData.termReport.find(t => t.term === term);
                console.log(yearData)

                if (yearData.termReport.length === 4) {
                    if (yearData.termReport[3].evaluated.personal)
                        if (yearData.termReport[3].evaluated.social)
                            if (yearData.termReport[3].evaluated.academic)
                                if (yearData.termReport[3].evaluated.occupational)
                                    if (yearData.termReport[3].evaluated.recreational)
                                        setEvaluationComplete(true);
                }

                const t = []
                yearData.termReport.forEach(term => {
                    t.push(term.term)
                })
                console.log(
                    "personalPercent" + yearData.percent.personalPercent,
                    "\nsocialPercent" + yearData.percent.socialPercent,
                    "\nacademicPercent" + yearData.percent.academicPercent,
                    "\noccupationalPercent" + yearData.percent.occupationalPercent,
                    "\nrecreationalMode" + yearData.percent.mode
                )
                setPercent({
                    personalPercent: yearData.percent.personalPercent,
                    socialPercent: yearData.percent.socialPercent,
                    academicPercent: yearData.percent.academicPercent,
                    occupationalPercent: yearData.percent.occupationalPercent,
                    recreationalMode: yearData.percent.mode
                })

                setoldYearComment(yearData.comment.yearComment)
                setoldYearPersonalComment(yearData.comment.yearPersonalComment)
                setoldYearSocialComment(yearData.comment.yearSocialComment)
                setoldYearAcademicComment(yearData.comment.yearAcademicComment)
                setoldYearOccupationalComment(yearData.comment.yearOccupationalComment)
                setoldYearRecreationalComment(yearData.comment.yearRecreationalComment)

                console.log(t)
                setTerms(t)

            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, section, year]);

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:4000/teacher/yearTypeComment", {
                id: id,
                section: section,
                year: year,
                comments: comments
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(res => {
                    toast.success("Comments saved successfully..!")
                    console.log(res.data)
                }).catch(err => {
                    console.log(err)
                    toast.error(`Error saving comments: ${err.response.data.msg}`)
                })
        } catch (err) {
            console.log(err.response);
        }
    };

    const handleCommentsChange = (index) => (event) => {
        const newComments = [...comments];
        newComments[index] = event.target.value;
        setComments(newComments);
    };
    return (
        <div style={styles.pageContainer}>
            <Header id={id} name={name} backButtonPath={'/teacher/term'} />
            <main style={styles.main}>
                <h1 style={styles.heading}>Functional Assessment Checklist for Programming</h1>
                <h1 style={styles.subHeading}>{replacePrimaryLabels(section)} -- Year {year}</h1>
                <div style={styles.buttonContainer}>
                    {
                        terms.map(term => (
                            <button key={term} onClick={() => {
                                localStorage.setItem("term", term)
                                navigate('/teacher/eval')
                            }} style={styles.termButton}>Term {term}</button>
                        ))
                    }
                </div>
            </main>

            {/* <label style={{alignSelf:'center',fontSize:'35px',fontFamily:'cursive',fontWeight:'bold'}}>{(percent.personalPercent + percent.academicPercent + percent.occupationalPercent + percent.socialPercent)/4 > 80 ? "Pass" : "Fail"}</label>
            <br/> */}
            <div style={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Enter your comments for Year</label>
                    <label>Year Percent : {((percent.personalPercent + percent.academicPercent + percent.occupationalPercent + percent.socialPercent) / 4.00).toFixed(2)}</label>
                </div>
                <textarea
                    name="comments1"
                    value={comments[0]}
                    onChange={handleCommentsChange(0)}
                    style={styles.textArea}
                    placeholder={oldyearComment.trim() === "" ? "Enter your year comment" : oldyearComment}
                    disabled={!evaluationComplete}
                />
            </div>

            <div style={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Enter your comments for personal</label>
                    <label>Personal Percent : {percent.personalPercent}</label>
                </div>
                <textarea
                    name="comments2"
                    value={comments[1]}
                    onChange={handleCommentsChange(1)}
                    style={styles.textArea}
                    placeholder={oldYearPersonalComment.trim() === "" ? "Enter your year personal comment" : oldYearPersonalComment}
                    disabled={!evaluationComplete}
                />
            </div>
            <div style={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Enter your comments for occupational</label>
                    <label>Occupational Percent : {percent.occupationalPercent}</label>
                </div>
                <textarea
                    name="comments3"
                    value={comments[2]}
                    onChange={handleCommentsChange(2)}
                    style={styles.textArea}
                    placeholder={oldYearOccupationalComment.trim() === "" ? "Enter your year personal comment" : oldYearOccupationalComment}
                    disabled={!evaluationComplete}
                />
            </div>
            <div style={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Enter your comments for academic</label>
                    <label>Academic Percent : {percent.academicPercent}</label>
                </div>
                <textarea
                    name="comments4"
                    value={comments[3]}
                    onChange={handleCommentsChange(3)}
                    style={styles.textArea}
                    placeholder={oldYearAcademicComment.trim() === "" ? "Enter your year academic comment" : oldYearAcademicComment}
                    disabled={!evaluationComplete}
                />
            </div>
            <div style={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Enter your comments for social</label>
                    <label>Social Percent : {percent.socialPercent}</label>
                </div>
                <textarea
                    name="comments5"
                    value={comments[4]}
                    onChange={handleCommentsChange(4)}
                    style={styles.textArea}
                    placeholder={oldYearSocialComment.trim() === "" ? "Enter your year social comment" : oldYearSocialComment}
                    disabled={!evaluationComplete}
                />
            </div>
            <div style={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Enter your comments for recreational</label>
                    <label>Recreational Mode : {percent.recreationalMode}</label>
                </div>
                <textarea
                    name="comments6"
                    value={comments[5]}
                    onChange={handleCommentsChange(5)}
                    style={styles.textArea}
                    placeholder={oldYearRecreationalComment.trim() === "" ? "Enter your year Recreational comment" : oldYearRecreationalComment}
                    disabled={!evaluationComplete}
                />
            </div>
            <button id="submit" style={styles.submitButton} onClick={handleSubmit} disabled={!evaluationComplete}>
                Submit
            </button>

            <Footer />
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
    main: {
        flex: '1',
        padding: '2rem',
        textAlign: 'center',
    },
    termButton: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
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
    textArea: {
        width: '100%',
        height: '100px',
        margin: '10px auto',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    box: {
        display: 'flex',
        width: '80%',
        alignSelf: 'center',
        flexDirection: 'column'
    },
};

export default Front;