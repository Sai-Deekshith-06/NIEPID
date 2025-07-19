import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScrollToButton, Header, Footer } from '../../helpers/components';
// import flattenStudentData from '../helpers/flattenStudentData';

const useStyles = createUseStyles({
    registrationForm: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1100px',
        margin: 'auto',
        padding: '30px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
        '@media (min-width: 600px)': {
            width: '100%',
        },
        '@media (min-width: 900px)': {
            width: '100%',
        },
        '@media (min-width: 1200px)': {
            width: '100%',
        },
    },
    title: {
        fontSize: '40px',
        fontWeight: '600',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#444',
        background: '-webkit-linear-gradient(left, #007BFF, #0056b3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    label: {
        marginBottom: '25px',
        fontSize: '20px',
        fontWeight: '500',
        color: '#444',
    },
    textInput: {
        padding: '12px',
        marginTop: '5px',
        marginBottom: '20px',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '15px',
        color: '#333',
        backgroundColor: '#f9f9f9',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        '&:focus': {
            borderColor: '#007BFF',
            outline: 'none',
            boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)',
        },
    },
    button: {
        padding: '12px 25px',
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
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    tableContainer: {
        marginTop: '40px',
    },
    tableTitle: {
        fontSize: '30px',
        fontWeight: '600',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333',
        background: '-webkit-linear-gradient(left, #28a745, #218838)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    table: {
        width: '100%',
        marginTop: '10px',
        borderCollapse: 'collapse',
    },
    th: {
        border: '1px solid #ddd',
        padding: '14px',
        textAlign: 'left',
        backgroundColor: '#f8f9fa',
        fontWeight: '600',
        fontSize: '20px',
        color: '#333',
    },
    td: {
        border: '1px solid #ddd',
        padding: '14px',
        fontSize: '20px',
        color: '#555',
        backgroundColor: '#fff',
    },
    label: {
        alignSelf: "center",
        justifySelf: 'flex-end'
    },
    buttonContainer1: {
        display: 'flex',
        justifyContent: 'space-between',
        columnGap: '20px',
        // marginTop: '20px',
    },
    textArea: {
        padding: '12px',
        marginTop: '5px',
        marginBottom: '20px',
        width: '100%',
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
    },
});

const Occupational = () => {
    const classes = useStyles();
    const location = useLocation();
    const { pathname } = location;
    let username
    const [isEditing, setIsEditing] = useState(true);
    const [answer, setAnswer] = useState({});
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [percent, setPercent] = useState("");
    const [comments, setComments] = useState("")
    const [oldComments, setOldComments] = useState("")

    const section = localStorage.getItem("section")
    const term = localStorage.getItem("term")
    const year = localStorage.getItem("year")
    const currTerm = localStorage.getItem("currTerm")
    const currYear = localStorage.getItem("currYear")
    const currSection = localStorage.getItem("currSection")
    const id = localStorage.getItem("studentId")
    const name = localStorage.getItem("studentName")

    const navigate = useNavigate()

    useEffect(async () => {
        console.log(term, currTerm)
        console.log(year, currYear)
        console.log(section, currSection)
        const id = localStorage.getItem("studentId")
        console.log(id)
        const data = await axios.get("http://localhost:4000/teacher/evaluate/questions", {
            headers: {
                id: id,
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }, { withCredentials: true })
            .then(res => {
                // console.log(res)
                username = res.data.data.name
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
                const occupationalQuestions = res.data.data.section[k].yearReport[i].termReport[j].report.occupationalQA
                setQuestions(occupationalQuestions)
                const initialanswer = {}
                occupationalQuestions.forEach((question, index) => {
                    initialanswer[`s${index + 1}`] = question.answer;
                });
                setAnswer(initialanswer);
                if (res.data.data.section[k].yearReport[i].termReport[j].comment.occupationalComment.trim() !== "")
                    setOldComments(res.data.data.section[k].yearReport[i].termReport[j].comment.occupationalComment)
                else
                    setOldComments("Enter your comments")
            })
            .catch()
    }, [username]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAnswer({
            ...answer,
            [name]: value
        });
    };

    const handleNewQuestionChange = (event) => {
        setNewQuestion(event.target.value);
    };

    const handleNewAnswerChange = (event) => {
        setNewAnswer(event.target.value);
    };

    const handleAddRow = (event) => {
        event.preventDefault();
        if (!newQuestion.trim() || !newAnswer.trim()) {
            return;
        }

        const newEntry = { question: newQuestion, answer: newAnswer };
        const updatedQuestions = [...questions, newEntry];
        setQuestions(updatedQuestions);
        setAnswer({
            ...answer,
            [`s${updatedQuestions.length}`]: newAnswer
        });
        setNewQuestion("");
        setNewAnswer("");
        // console.log(answer)
    };

    const handleEvaluate = async (event) => {
        event.preventDefault();
        const submissionData = {
            username: username,
            questions: questions.map((question, index) => ({
                question: question.question,
                answer: answer[`s${index + 1}`] || question.answer
            }))
        };
        // console.log('Submitting data:', submissionData);
        const id = localStorage.getItem("studentId")
        await axios.post("http://localhost:4000/teacher/eval/form", {
            type: "occupationalQA",
            id: id,
            section: section,
            year: year,
            term: term,
            data: submissionData,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(res => {
                console.log(res.data.data)
            })
            .catch(err => {
                console.log(err.response)
            })

        axios.get("http://localhost:4000/teacher/evaluate", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                section: section,
                year: year,
                term: term,
                id: id,
                type: "occupationalQA"
            }
        })
            .then((res) => {
                console.log(res.data)
                const per = res.data.result
                setPercent(per)
            })
            .catch((err) => {
                console.log(err)
            })

        const commentsElements = document.getElementsByName("comments");
        commentsElements.forEach((element) => {
            element.disabled = false;
        });
    };

    const handleCommentsChange = (event) => {
        setComments(event.target.value);
        if (event.target.value)
            document.getElementById("submit").disabled = false
        else
            document.getElementById("submit").disabled = true
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/teacher/termTypeComment", {
            section: section,
            year: year,
            term: term,
            id: id,
            type: "occupationalQA",
            comments: comments
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,

            }
        })
            .then((res) => {
                console.log(res.data)
                toast.success("checklist submitted")
                navigate('/teacher/eval')
            })
            .catch((err) => {
                console.log(err.response)
            })
    }

    return (
        <>
            <Header id={id} name={name} backButtonPath={'/teacher/eval'} />
            <form className={classes.registrationForm} onSubmit={handleSubmit}>
                <div className={classes.title}>Functional Assessment Checklist For Programming</div>
                <div className={classes.title}>Occupational</div>
                <table className={classes.table}>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr key={index}>
                                <td className={classes.td}>{index + 1}</td>
                                <td className={classes.td}>{question.question}</td>
                                <td className={classes.td}>
                                    <select
                                        name={`s${index + 1}`}
                                        value={answer[`s${index + 1}`]}
                                        onChange={handleChange}
                                        //disabled={(term !== currTerm || year !== currYear || section !== currSection)}
                                        className={classes.textInput}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Yes" title='Yes'>+</option>
                                        {/* <option value="No">No</option> */}
                                        <option value="NA" title='Not Applicable' >NA</option>
                                        <option value="NE" title='No Exposure' >NE</option>
                                        <option value="C-P1" title='Verbal Prompting' >VP</option>
                                        <option value="C-P2" title='Physical Prompting' >PP</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className={classes.td}>{questions.length + 1}</td>
                            <td className={classes.td}>
                                <input
                                    type="text"
                                    name="newQuestion"
                                    value={newQuestion}
                                    onChange={handleNewQuestionChange}
                                    className={classes.textInput}
                                    placeholder="Enter new question"
                                />
                            </td>
                            <td className={classes.td}>
                                <select
                                    name="newAnswer"
                                    value={newAnswer}
                                    onChange={handleNewAnswerChange}
                                    className={classes.textInput}
                                >
                                    <option value="">Select an option</option>
                                    <option value="Yes">+</option>
                                    {/* <option value="No">No</option> */}
                                    <option value="NA">NA</option>
                                    <option value="NE">NE</option>
                                    <option value="C-P1">VP</option>
                                    <option value="C-P2">PP</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className={classes.buttonContainer}>
                    <button
                        className={classes.button}
                        onClick={handleAddRow}
                        disabled={!newQuestion.trim() || !newAnswer.trim()}
                    >
                        Add Question
                    </button>
                    <div className={classes.buttonContainer1}>
                        <label className={classes.label}>{"Percentage : " + percent + "%"}</label>
                        <button className={classes.button} onClick={handleEvaluate}>Evaluate</button>
                    </div>
                </div>
                <textarea
                    name="comments"
                    value={comments}
                    onChange={handleCommentsChange}
                    disabled={true}
                    className={classes.textArea}
                    placeholder={oldComments}
                />
                <button id="submit" className={classes.button} disabled={true} type="submit">Submit</button>
            </form>
            <Footer />
            <ScrollToButton />
        </>
    );
};

export default Occupational;
