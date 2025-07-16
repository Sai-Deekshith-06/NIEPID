import axios from 'axios';
import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import image from './th.jpeg';
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';

const useStyles = createUseStyles({
    registrationForm: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        margin: 'auto',
        padding: '28px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            // transform: 'translateY(-5px)',
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
    requiredlabel: {
        marginBottom: '25px',
        fontSize: '20px',
        fontWeight: '500',
        color: '#f00',
    },
    textInput: {
        padding: '8px 0px 8px 8px',
        marginTop: '5px',
        marginBottom: '20px',
        marginRight: '24px',
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
    requiredtextInput: {
        padding: '8px 0px 8px 8px',
        marginTop: '5px',
        marginBottom: '20px',
        marginRight: '24px',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #f00',
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
        marginTop: '5px',
        marginBottom: '20px',
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
    },
    buttonNav: {
        display: 'flex',
        justifyContent: 'space-between', // Or 'space-around'
        marginTop: '20px', // Adjust as needed
    },
    tableContainer: {
        marginTop: '40px',
        marginRight: '30px',
        padding: '10px'
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
});

function AddStudents() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const username = pathname.split("/")[pathname.split("/").length - 1];

    const [isEditing, setIsEditing] = useState(true);

    const currentDate = new Date()
    const day = String(currentDate.getDate()).padStart(2, '0'); // Adds leading zero if necessary
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    // console.log(formattedDate)

    const initialInfo = {
        regNo: '',
        regDate: '',
        dob: '',
        name: '',
        sex: '',
        information: '',
        education: '',
        refBy: '',
        occupation: '',
        aadharNo: '',
        paymentType: '',
        mobileNo: '',
        purposeVisit: '',
        previousConsultationAndTreatement: false,
        isYesNatureOfConsultations: '',
        treatmentUnderGone: false,
        typeOfTreatment: '',
        therapeutic: '',
        historyOfPresentCondition: [''],
    };

    const initialPresentingComplaints = {
        hasDysmorphicFeatures: '',
        hasDysmorphicFeaturesDuration: '',
        smallSizedHead: '',
        smallSizedHeadDuration: '',
        ableToWalkAndRun: '',
        ableToWalkAndRunDuration: '',
        noAgeAppropriateComprehensionAndSpeechDevelopment: '',
        noAgeAppropriateComprehensionAndSpeechDevelopmentDuration: '',
        reachesGraspsAndManipulatesObjects: '',
        reachesGraspsAndManipulatesObjectsDuration: '',
        emotionallyAttachedToParentsAndRecognisesAllFamilyMembers: '',
        emotionallyAttachedToParentsAndRecognisesAllFamilyMembersDuration: '',
        hasAdequateEyeContactAndSocialSmile: '',
        hasAdequateEyeContactAndSocialSmileDuration: '',
        eatsSelf: '',
        eatsSelfDuration: '',
        indicatesToiletNeeds: '',
        indicatesToiletNeedsDuration: '',
    };

    const initialHistory = {
        chromosomalAberrations: '',
        rhIncompatibility: '',
        geneticAberrations: '',
        consanguinity: '',
        threatenedAbortion: '',
        potentiallyHarmfulMedication: '',
        antenatalCheckUps: '',
        significantAccidentsInjury: '',
        infections1: '',
        pregnancy: '',
        attemptedAbortion: '',
        nutrition: '',
        psychologicalTrauma: '',
        amnioticFluid: '',
        irradiation: '',
        nicotine: '',
        alcohol: '',
        ageAtConception: '',
        hypertension: '',
        diabetes: '',
        jaundice1: '',
        fetalMovement: '',
        bleedingDuringLatePregnancy: '',
        labourDuration: '',
        prolapsedCord: '',
        cordAroundNeck: '',
        multiplePregnancies: '',
        feedingProblem: '',
        convulsions1: '',
        colorOfTheBaby: '',
        significantInjury: '',
        deliveryPlace: '',
        term: '',
        deliveryType: '',
        abnormalPresentation: '',
        respiratoryDistress: '',
        jaundice2: '',
        deliveryConductedBy: '',
        labourInduction: '',
        birthCry: '',
        infections2: '',
        separationFromMotherImmediatelyAfterDelivery: '',
        jaundice3: '',
        thyroidDysfunctions: '',
        nutritionalDisorders: '',
        convulsions2: '',
        infections3: '',
        significantHeadInjury: '',
    };

    const initialFamilyHistory = {
        typeOfFamily: '',
        mentalRetardation: '',
        genogran: '',
        consanguinity: '',
        seizuresOrConvulsions: '',
        hearingProblems: '',
        speechProblems: '',
        mentalIllness: '',
        autismOrSpectrumDisorder: '',
        visualProblem: '',
        locomotorProblem: '',
        anyFamilyHistoryOfDelayDisabilityDisorderDiseaseDeficiency: '',
        learningDisabilities: '',
        familyInvolvementIn: '',
        positiveIssuesWithNeighborhoodBecauseOfTheClient: '',
        neighbourhoodParticipation: '',
        personalNeedsOfTheClient: '',
        visitsToTheFamilyByOthers: '',
        familysVisitsOutside: '',
        playAndLeisureTimeActivities: '',
        educationalActivities: '',
        supportOfExtendedFamily: '',
        negativeIssuesWithNeighborhoodBecauseOfTheClient: '',
        discontinuedSchool: '',
        educationalHistory: '',
        teacherReport: '',
        overallPerformance: '',
        typeOfSchooling: '',
        ifYesReasonForDiscontinuingSchooling: '',
        ageOfAdmissionintoSchoolInYears: '',
        involvementInPlay: '',
        observesOthersPlaying: '',
        playBehaviour: '',
        periodicity: '',
        ageofAttainmentOfMenarche: '',
        attainedMenarche: '',
        menstrualHistory: '',
        anySignificantDetails: '',
        vocationalTraining: '',
        occupationalHistory: '',
        employment: '',
    };

    const initialDevelopmentHistory = {
        headControl3To5Months: '',
        rolling3To5Months: '',
        independentSitting6To8Months: '',
        crawling6To8Months: '',
        walking11To14Months: '',
        bilateralHoldingOfToys3To6Months: '',
        holdingSmallItemsWithFingerAndThumb6To9Months: '',
        scribblingWithACrayon12To18Months: '',
        babbling4To8Months: '',
        firstWords11To12Months: '',
        twoWordsPhrases18To24Months: '',
        sentences2To3Months: '',
        smilesAtOthers3To4Months: '',
        respondsToName7To12Months: '',
        feedsSelf3To4Years: '',
        cognitive: '',
        motor: '',
        speechAndLanguage: '',
        social: '',
        significantMedicalIllness: '',
        significantSurgicalIllness: '',
        significantPsycologicalIllness: '',
        anyNegativeReactions: '',
    };

    const initialStdCred = {
        class: '',
        year: '1',
    };

    const classes = useStyles();
    const [formData, setFormData] = useState({
        details: {
            info: initialInfo,
            presentingComplaints: initialPresentingComplaints,
            history: initialHistory,
            familyHistory: initialFamilyHistory,
            developmentHistory: initialDevelopmentHistory,
        },
        stdCred: initialStdCred,
    });

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 50) { // Adjust this value based on when you want the opacity change to occur
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    const styles = {
        header: {
            // position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#007bff',
            position: 'sticky',
            color: '#ffffff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem',
            opacity: isScrolled ? 0.9 : 1, // Change opacity based on scroll state
            transition: 'opacity 0.3s ease', // Smooth transition for opacity change
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
        print: {
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => {
            if (name === "sex") {
                return {
                    ...prevFormData,
                    details: {
                        ...prevFormData.details,
                        info: {
                            ...prevFormData.details.info,
                            [name]: value
                        }
                    }
                };
            }
            return {
                ...prevFormData,
                stdCred: {
                    ...prevFormData.stdCred,
                    [name]: type === 'checkbox' ? checked : value
                }
            };
        });
    };


    const handleCheckbox = (section, e) => {
        const { name, checked } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            details: {
                ...prevFormData.details,
                [section]: {
                    ...prevFormData.details[section],
                    [name]: checked
                }
            }
        }));
    }

    const handleSectionChange = (section, e) => {
        const { name, value } = e.target;

        if (name === 'dob') {
            const selectedDate = new Date(value);
            const currDate = new Date()
            currDate.setDate(currDate.getDate() - 1);

            if (selectedDate >= currDate) {
                toast.error("Date of birth must be earlier than today.");
                return; // Prevent further processing
            }
        }
        if (name === 'regDate') {
            const selectedDate = new Date(value);
            const currDate = new Date()
            currDate.setDate(currDate.getDate() - 1);

            if (selectedDate > currDate) {
                toast.error("Registration must be earlier than today.")
                return; // Prevent further processing
            }
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            details: {
                ...prevFormData.details,
                [section]: {
                    ...prevFormData.details[section],
                    [name]: value
                }
            }
        }));
    };

    const handleConditionChange = (index, e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const newConditions = prevFormData.details.info.historyOfPresentCondition.slice();
            newConditions[index] = { ...newConditions[index], [name]: value };
            return {
                ...prevFormData,
                details: {
                    ...prevFormData.details,
                    info: {
                        ...prevFormData.details.info,
                        historyOfPresentCondition: newConditions
                    }
                }
            };
        });
    };

    const addConditionRow = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            details: {
                ...prevFormData.details,
                info: {
                    ...prevFormData.details.info,
                    historyOfPresentCondition: [
                        ...prevFormData.details.info.historyOfPresentCondition,
                        { description: '' }
                    ]
                }
            }
        }));
    };

    const areAllFieldsFilled = (obj) => {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                for (const item of obj[key]) {
                    if (!areAllFieldsFilled(item)) return false;
                }
            } else if (typeof obj[key] === 'object') {
                if (!areAllFieldsFilled(obj[key])) return false;
            } else {
                if (obj[key] === '') return false;
            }
        }
        return true;
    };


    const [response, setResponse] = useState(false)
    const handleSubmit = async () => {
        // e.preventDefault();

        // if (!areAllFieldsFilled(formData)) {
        //     toast.error("Please fill in all fields.");
        //     return;
        // }

        // const aadharNo = formData.details.info.aadharNo;
        // const mobileNo = formData.details.info.mobileNo;
        const { regNo, regDate, dob, name, sex, aadharNo, mobileNo } = formData.details.info;
        const classid = formData.stdCred.class;
        console.log(mobileNo);
        // Final validation check for Aadhar number
        if (aadharNo.length !== 12 || !/^[0-9]{12}$/.test(aadharNo)) {
            toast.error("Aadhar number must be exactly 12 digits and numeric.");
            return; // Prevent form submission
        }
        if (mobileNo.length !== 10 || !/^[0-9]{10}$/.test(mobileNo)) {
            toast.error("Mobile No. must be 10 digits");
            return; // Prevent form submission
        }

        const registeredDate = formData.details.info.regDate;
        const bodDate = formData.details.info.dob;
        //const currDate = new Date()
        //currDate.setDate(currDate.getDate() - 1);

        if (registeredDate < bodDate) {
            toast.error("Registration must be greater than Date of Birth.");
            return; // Prevent further processing
        }
        // console.log(regNo, regDate, dob, name, sex, aadharNo, mobileNo, classid);
        if (!(regNo.trim() && regDate.trim() && dob.trim() && name.trim() && sex.trim() && aadharNo.trim() && mobileNo.trim())) {
            toast.error("Enter all required fields (Fields in RED)");
            return; // Prevent further processing
        }

        // const response = window.confirm("are you sure you want to submit ?");
        confirmAlert({
            title: 'confirm to submit',
            message: 'Are you sure you want to submit ?',
            buttons: [
                {
                    label: 'No',
                    onClick: () => { }
                },
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.post('http://localhost:4000/admin/registerStudent', { formData }, {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }, { withCredentials: true })
                                .then(() => {
                                    setFormData({
                                        details: {
                                            info: initialInfo,
                                            presentingComplaints: initialPresentingComplaints,
                                            history: initialHistory,
                                            familyHistory: initialFamilyHistory,
                                            developmentHistory: initialDevelopmentHistory,
                                        },
                                        stdCred: initialStdCred,
                                    });
                                    toast.success(`${initialInfo.regNo} registered successfully`)
                                    navigate('/admin/viewstudents')
                                })
                                .catch(err => {
                                    toast.error("Error: " + err.response.data);
                                    console.log(err.response)
                                    return;
                                })
                            // console.log("success");
                            // console.log(formData);
                            // console.log("Form reset:", formData);
                            // navigate("/admin");
                        } catch (err) {
                            console.error(err);
                            console.log(formData);
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            ]
        })
    };

    // useEffect(() => {
    //     console.log(formData);
    // }, [formData]);

    const handleNavigate = () => {
        navigate("/admin");
    }

    const Header = () => (
        <header style={styles.header}>
            <div style={styles.logo}>
                <img src={image} alt="Logo" style={styles.logoImage} />
                <span style={styles.logoLabel}>NIEPID</span>
            </div>
            <nav style={styles.navLinks}>
                <button onClick={() => { handleNavigate() }} style={styles.backButton}>
                    Back
                </button>
            </nav>
        </header>
    );

    const [activeTab, setActiveTab] = useState(1);
    const endTab = 2
    const handleButton = (e) => {
        const name = e.target.name
        if (name === "back") {
            setActiveTab(activeTab - 1)
        } else if (name === "next") {
            if (activeTab >= endTab)
                handleSubmit()
            else
                setActiveTab(activeTab + 1)
        }
    }

    return (
        <>
            <Header />
            <form onSubmit={handleSubmit} className={classes.registrationForm}>
                <div className={classes.title} id='title'>Student Details Form</div>
                {activeTab !== 1 ? (
                    <button
                        className={classes.button}
                        type='button'
                        name='back'
                        onClick={(e) => handleButton(e)}
                        style={{ width: '100px', margin: 0, marginBottom: '20px' }}
                    >Back</button>) : (<></>)}
                {activeTab === 1 ? (
                    <div>
                        <label className={classes.requiredlabel}>
                            Registration Number:
                            <input
                                type="text"
                                name="regNo"
                                value={formData.details.info.regNo}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.requiredtextInput}
                            />
                        </label>
                        <label className={classes.requiredlabel}>
                            Registration Date:
                            <input
                                type="date"
                                name="regDate"
                                value={formData.details.info.regDate}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.requiredtextInput}

                            />
                        </label>
                        <label className={classes.requiredlabel}>
                            DOB:
                            <input
                                type="date"
                                name="dob"
                                value={formData.details.info.dob}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.requiredtextInput}
                            />
                        </label>
                        <label className={classes.requiredlabel}>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.details.info.name}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.requiredtextInput}
                            />
                        </label>
                        <label className={classes.requiredlabel}>
                            Sex:
                            <select
                                name="sex"
                                value={formData.details.info.sex}
                                onChange={handleChange}
                                className={classes.requiredtextInput}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label className={classes.requiredlabel}>
                            Aadhar No:
                            <input
                                type="text"
                                name="aadharNo"
                                value={formData.details.info.aadharNo}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.requiredtextInput}
                            />
                        </label>
                        <label className={classes.requiredlabel}>
                            Mobile No:
                            <input
                                type="text"
                                name="mobileNo"
                                value={formData.details.info.mobileNo}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.requiredtextInput}
                            />
                        </label>
                    </div>
                ) : (
                    <div>
                        <label className={classes.label}>
                            Informant:
                            <input
                                type="text"
                                name="information"
                                value={formData.details.info.information}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Education:
                            <input
                                type="text"
                                name="education"
                                value={formData.details.info.education}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Referred by:
                            <input
                                type="text"
                                name="refBy"
                                value={formData.details.info.refBy}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Occupation:
                            <input
                                type="text"
                                name="occupation"
                                value={formData.details.info.occupation}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Payment Type:
                            <input
                                type="text"
                                name="paymentType"
                                value={formData.details.info.paymentType}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Purpose Visit:
                            <input
                                type="text"
                                name="purposeVisit"
                                value={formData.details.info.purposeVisit}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Previous Consultations and treatment:
                            <input
                                type="checkbox"
                                name="previousConsultationAndTreatement"
                                checked={formData.details.info.previousConsultationAndTreatement}
                                onChange={(e) => handleCheckbox('info', e)}
                                className={classes.checkboxInput}
                            />
                        </label>
                        <label className={classes.label}>
                            if Yes, Nature of consultations:
                            <input
                                type="text"
                                name="isYesNatureOfConsultations"
                                value={formData.details.info.isYesNatureOfConsultations}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Treatment UnderGone:
                            <input
                                type="checkbox"
                                name="treatmentUnderGone"
                                checked={formData.details.info.treatmentUnderGone}
                                onChange={(e) => handleCheckbox('info', e)}
                                className={classes.checkboxInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Type of treatment:
                            <input
                                type="text"
                                name="typeOfTreatment"
                                value={formData.details.info.typeOfTreatment}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            Therapculic:
                            <input
                                type="text"
                                name="therapeutic"
                                value={formData.details.info.therapeutic}
                                onChange={(e) => handleSectionChange('info', e)}
                                className={classes.textInput}
                            />
                        </label>
                        <label className={classes.label}>
                            HISTORY OF PRESENTATION CONDITION:
                        </label>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.details.info.historyOfPresentCondition.map((condition, index) => (
                                    <tr key={index}>
                                        <td className={classes.td}>{index + 1}</td>
                                        <td className={classes.td}>
                                            <input
                                                type="text"
                                                name="description"
                                                value={condition.description}
                                                onChange={(e) => handleConditionChange(index, e)}
                                                className={classes.textInput}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addConditionRow} className={classes.button}>Add More</button>

                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>Record Verbtim</th>
                                    <th className={classes.th}>On Set</th>
                                    <th className={classes.th}>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>Has dysmorphic features</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="hasDysmorphicFeatures"
                                            value={formData.details.presentingComplaints.hasDysmorphicFeatures}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="hasDysmorphicFeaturesDuration"
                                            value={formData.details.presentingComplaints.hasDysmorphicFeaturesDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Small sized head</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="smallSizedHead"
                                            value={formData.details.presentingComplaints.smallSizedHead}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="smallSizedHeadDuration"
                                            value={formData.details.presentingComplaints.smallSizedHeadDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Able to walk and run</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="ableToWalkAndRun"
                                            value={formData.details.presentingComplaints.ableToWalkAndRun}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="ableToWalkAndRunDuration"
                                            value={formData.details.presentingComplaints.ableToWalkAndRunDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>No age appropriate comprehension and speech development</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="noAgeAppropriateComprehensionAndSpeechDevelopment"
                                            value={formData.details.presentingComplaints.noAgeAppropriateComprehensionAndSpeechDevelopment}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="noAgeAppropriateComprehensionAndSpeechDevelopmentDuration"
                                            value={formData.details.presentingComplaints.noAgeAppropriateComprehensionAndSpeechDevelopmentDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Reaches, grasps and manipulates the objects</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="reachesGraspsAndManipulatesObjects"
                                            value={formData.details.presentingComplaints.reachesGraspsAndManipulatesObjects}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="reachesGraspsAndManipulatesObjectsDuration"
                                            value={formData.details.presentingComplaints.reachesGraspsAndManipulatesObjectsDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Emotionally attached to parents and recognises all family members</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="emotionallyAttachedToParentsAndRecognisesAllFamilyMembers"
                                            value={formData.details.presentingComplaints.emotionallyAttachedToParentsAndRecognisesAllFamilyMembers}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="emotionallyAttachedToParentsAndRecognisesAllFamilyMembersDuration"
                                            value={formData.details.presentingComplaints.emotionallyAttachedToParentsAndRecognisesAllFamilyMembersDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Has adequate eye contact and social smile</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="hasAdequateEyeContactAndSocialSmile"
                                            value={formData.details.presentingComplaints.hasAdequateEyeContactAndSocialSmile}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="hasAdequateEyeContactAndSocialSmileDuration"
                                            value={formData.details.presentingComplaints.hasAdequateEyeContactAndSocialSmileDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Eats self</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="eatsSelf"
                                            value={formData.details.presentingComplaints.eatsSelf}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="eatsSelfDuration"
                                            value={formData.details.presentingComplaints.eatsSelfDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>Indicates the toilet needs</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="indicatesToiletNeeds"
                                            value={formData.details.presentingComplaints.indicatesToiletNeeds}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="indicatesToiletNeedsDuration"
                                            value={formData.details.presentingComplaints.indicatesToiletNeedsDuration}
                                            onChange={(e) => handleSectionChange('presentingComplaints', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Chromosomal Aberrations</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="chromosomalAberrations"
                                            value={formData.details.history.chromosomalAberrations}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Rh incompatibility</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="rhIncompatibility"
                                            value={formData.details.history.rhIncompatibility}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Genetic Aberrations</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="geneticAberrations"
                                            value={formData.details.history.geneticAberrations}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Consanguinity</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="consanguinity"
                                            value={formData.details.history.consanguinity}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Threatened abortion</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="threatenedAbortion"
                                            value={formData.details.history.threatenedAbortion}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Potentially harmful medication</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="potentiallyHarmfulMedication"
                                            value={formData.details.history.potentiallyHarmfulMedication}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Antenatal Check Ups</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="antenatalCheckUps"
                                            value={formData.details.history.antenatalCheckUps}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Significant Accidents/Injury</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="significantAccidentsInjury"
                                            value={formData.details.history.significantAccidentsInjury}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Infections</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="infections1"
                                            value={formData.details.history.infections1}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>Pregnancy</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="pregnancy"
                                            value={formData.details.history.pregnancy}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>7</td>
                                    <td className={classes.td}>Attempted abortion</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="attemptedAbortion"
                                            value={formData.details.history.attemptedAbortion}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>8</td>
                                    <td className={classes.td}>Nutrition</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="nutrition"
                                            value={formData.details.history.nutrition}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>9</td>
                                    <td className={classes.td}>Psychological Trauma</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="psychologicalTrauma"
                                            value={formData.details.history.psychologicalTrauma}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>10</td>
                                    <td className={classes.td}>Amniotic Fluid</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="amnioticFluid"
                                            value={formData.details.history.amnioticFluid}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>11</td>
                                    <td className={classes.td}>Irradiation</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="irradiation"
                                            value={formData.details.history.irradiation}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>12</td>
                                    <td className={classes.td}>Nicotine</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="nicotine"
                                            value={formData.details.history.nicotine}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>13</td>
                                    <td className={classes.td}>Alcohol</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="alcohol"
                                            value={formData.details.history.alcohol}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>14</td>
                                    <td className={classes.td}>Age at conception</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="ageAtConception"
                                            value={formData.details.history.ageAtConception}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>15</td>
                                    <td className={classes.td}>Hypertension</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="hypertension"
                                            value={formData.details.history.hypertension}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>16</td>
                                    <td className={classes.td}>Diabetes</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="diabetes"
                                            value={formData.details.history.diabetes}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>17</td>
                                    <td className={classes.td}>Jaundice</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="jaundice1"
                                            value={formData.details.history.jaundice1}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>18</td>
                                    <td className={classes.td}>Fetal movements</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="fetalMovement"
                                            value={formData.details.history.fetalMovement}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>19</td>
                                    <td className={classes.td}>Bleeding during late Pregnancy</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="bleedingDuringLatePregnancy"
                                            value={formData.details.history.bleedingDuringLatePregnancy}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Labour Duration</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="labourDuration"
                                            value={formData.details.history.labourDuration}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Prolapsed cord</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="prolapsedCord"
                                            value={formData.details.history.prolapsedCord}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Cord Around Neck</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="cordAroundNeck"
                                            value={formData.details.history.cordAroundNeck}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Multiple Pregnancies</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="multiplePregnancies"
                                            value={formData.details.history.multiplePregnancies}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Feeding problems</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="feedingProblem"
                                            value={formData.details.history.feedingProblem}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>Convulsions</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="convulsions1"
                                            value={formData.details.history.convulsions1}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>7</td>
                                    <td className={classes.td}>Color of the baby</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="colorOfTheBaby"
                                            value={formData.details.history.colorOfTheBaby}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>8</td>
                                    <td className={classes.td}>Significant Injury</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="significantInjury"
                                            value={formData.details.history.significantInjury}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>9</td>
                                    <td className={classes.td}>Delivery place</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="deliveryPlace"
                                            value={formData.details.history.deliveryPlace}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>10</td>
                                    <td className={classes.td}>Term</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="term"
                                            value={formData.details.history.term}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>11</td>
                                    <td className={classes.td}>Delivery type</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="deliveryType"
                                            value={formData.details.history.deliveryType}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>12</td>
                                    <td className={classes.td}>Abnormal Presentation</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="abnormalPresentation"
                                            value={formData.details.history.abnormalPresentation}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>13</td>
                                    <td className={classes.td}>Respiratory distress</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="respiratoryDistress"
                                            value={formData.details.history.respiratoryDistress}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>14</td>
                                    <td className={classes.td}>Jaundice</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="jaundice2"
                                            value={formData.details.history.jaundice2}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>15</td>
                                    <td className={classes.td}>Delivery Conducted By</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="deliveryConductedBy"
                                            value={formData.details.history.deliveryConductedBy}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>16</td>
                                    <td className={classes.td}>Labour induction</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="labourInduction"
                                            value={formData.details.history.labourInduction}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>17</td>
                                    <td className={classes.td}>Birth cry</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="birthCry"
                                            value={formData.details.history.birthCry}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>18</td>
                                    <td className={classes.td}>Infections</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="infections2"
                                            value={formData.details.history.infections2}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>19</td>
                                    <td className={classes.td}>Seperation from Mother immediately after delivery</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="separationFromMotherImmediatelyAfterDelivery"
                                            value={formData.details.history.separationFromMotherImmediatelyAfterDelivery}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Jaundice</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="jaundice3"
                                            value={formData.details.history.jaundice3}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Thyroid Dysfunctions</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="thyroidDysfunctions"
                                            value={formData.details.history.thyroidDysfunctions}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Nutritional disorders</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="nutritionalDisorders"
                                            value={formData.details.history.nutritionalDisorders}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Convulsions</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="convulsions2"
                                            value={formData.details.history.convulsions2}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Infections</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="infections3"
                                            value={formData.details.history.infections3}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>Significant head injury</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="significantHeadInjury"
                                            value={formData.details.history.significantHeadInjury}
                                            onChange={(e) => handleSectionChange('history', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Type of Family</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="typeOfFamily"
                                            value={formData.details.familyHistory.typeOfFamily}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Mental retardation</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="mentalRetardation"
                                            value={formData.details.familyHistory.mentalRetardation}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Genogram</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="genogran"
                                            value={formData.details.familyHistory.genogran}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Consanguinity</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="consanguinity"
                                            value={formData.details.familyHistory.consanguinity}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Seizures Or Convulsions</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="seizuresOrConvulsions"
                                            value={formData.details.familyHistory.seizuresOrConvulsions}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>Hearing problems</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="hearingProblems"
                                            value={formData.details.familyHistory.hearingProblems}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>7</td>
                                    <td className={classes.td}>Speech problems</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="speechProblems"
                                            value={formData.details.familyHistory.speechProblems}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>8</td>
                                    <td className={classes.td}>Mental Illness</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="mentalIllness"
                                            value={formData.details.familyHistory.mentalIllness}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>9</td>
                                    <td className={classes.td}>Autism Or Spectrum Disorder</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="autismOrSpectrumDisorder"
                                            value={formData.details.familyHistory.autismOrSpectrumDisorder}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>10</td>
                                    <td className={classes.td}>Visual problems</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="visualProblem"
                                            value={formData.details.familyHistory.visualProblem}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>11</td>
                                    <td className={classes.td}>Locomotor problem</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="locomotorProblem"
                                            value={formData.details.familyHistory.locomotorProblem}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>12</td>
                                    <td className={classes.td}>Any Family history of delay/disability/disorder/disease/deficiency</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="anyFamilyHistoryOfDelayDisabilityDisorderDiseaseDeficiency"
                                            value={formData.details.familyHistory.anyFamilyHistoryOfDelayDisabilityDisorderDiseaseDeficiency}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>13</td>
                                    <td className={classes.td}>Learning disabilities</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="learningDisabilities"
                                            value={formData.details.familyHistory.learningDisabilities}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Family Involvement in</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="familyInvolvementIn"
                                            value={formData.details.familyHistory.familyInvolvementIn}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Positive Issues with neighborhood because of the client</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="positiveIssuesWithNeighborhoodBecauseOfTheClient"
                                            value={formData.details.familyHistory.positiveIssuesWithNeighborhoodBecauseOfTheClient}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Neighbourhood Participation</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="neighbourhoodParticipation"
                                            value={formData.details.familyHistory.neighbourhoodParticipation}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Personal needs of the client</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="personalNeedsOfTheClient"
                                            value={formData.details.familyHistory.personalNeedsOfTheClient}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Visits to the family by others</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="visitsToTheFamilyByOthers"
                                            value={formData.details.familyHistory.visitsToTheFamilyByOthers}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>Family's visits outside</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="familysVisitsOutside"
                                            value={formData.details.familyHistory.familysVisitsOutside}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>7</td>
                                    <td className={classes.td}>Play and Leisure Time Activities</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="playAndLeisureTimeActivities"
                                            value={formData.details.familyHistory.playAndLeisureTimeActivities}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>8</td>
                                    <td className={classes.td}>Educational activities</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="educationalActivities"
                                            value={formData.details.familyHistory.educationalActivities}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>9</td>
                                    <td className={classes.td}>Support of extended family</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="supportOfExtendedFamily"
                                            value={formData.details.familyHistory.supportOfExtendedFamily}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>10</td>
                                    <td className={classes.td}>Negative Issues with neighbourhood because of the Client</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="negativeIssuesWithNeighborhoodBecauseOfTheClient"
                                            value={formData.details.familyHistory.negativeIssuesWithNeighborhoodBecauseOfTheClient}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Discontinued School</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="discontinuedSchool"
                                            value={formData.details.familyHistory.discontinuedSchool}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Educational History</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="educationalHistory"
                                            value={formData.details.familyHistory.educationalHistory}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Teachers report/School report(in case of non avail)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="teacherReport"
                                            value={formData.details.familyHistory.teacherReport}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Overall performance</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="overallPerformance"
                                            value={formData.details.familyHistory.overallPerformance}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Type Of Schooling</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="typeOfSchooling"
                                            value={formData.details.familyHistory.typeOfSchooling}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>If Yes Reason for discontinuing Schooling</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="ifYesReasonForDiscontinuingSchooling"
                                            value={formData.details.familyHistory.ifYesReasonForDiscontinuingSchooling}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>7</td>
                                    <td className={classes.td}>Age Of Admission into school(in Years)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="ageOfAdmissionintoSchoolInYears"
                                            value={formData.details.familyHistory.ageOfAdmissionintoSchoolInYears}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Involvement in Play</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="involvementInPlay"
                                            value={formData.details.familyHistory.involvementInPlay}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Observes others playing</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="observesOthersPlaying"
                                            value={formData.details.familyHistory.observesOthersPlaying}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Play Behaviour</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="playBehaviour"
                                            value={formData.details.familyHistory.playBehaviour}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Periodicity</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="periodicity"
                                            value={formData.details.familyHistory.periodicity}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Age of Attainment of menarche</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="ageofAttainmentOfMenarche"
                                            value={formData.details.familyHistory.ageofAttainmentOfMenarche}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Attained Menarche</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="attainedMenarche"
                                            value={formData.details.familyHistory.attainedMenarche}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Menstrual History</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="menstrualHistory"
                                            value={formData.details.familyHistory.menstrualHistory}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Any Significant Details</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="anySignificantDetails"
                                            value={formData.details.familyHistory.anySignificantDetails}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Vocational training</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="vocationalTraining"
                                            value={formData.details.familyHistory.vocationalTraining}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Occupational History(Client)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="occupationalHistory"
                                            value={formData.details.familyHistory.occupationalHistory}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Employment</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="employment"
                                            value={formData.details.familyHistory.employment}
                                            onChange={(e) => handleSectionChange('familyHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Head Control:(3-5 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="headControl3To5Months"
                                            value={formData.details.developmentHistory.headControl3To5Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Rolling:(3-5 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="rolling3To5Months"
                                            value={formData.details.developmentHistory.rolling3To5Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Independent Sitting:(6-8 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="independentSitting6To8Months"
                                            value={formData.details.developmentHistory.independentSitting6To8Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Crawling:(6-8 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="crawling6To8Months"
                                            value={formData.details.developmentHistory.crawling6To8Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Walking:(11-14 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="walking11To14Months"
                                            value={formData.details.developmentHistory.walking11To14Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Bilateral Holding Of Toys(3-6 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="bilateralHoldingOfToys3To6Months"
                                            value={formData.details.developmentHistory.bilateralHoldingOfToys3To6Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Holding small items with finger and thumb(6-9 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="holdingSmallItemsWithFingerAndThumb6To9Months"
                                            value={formData.details.developmentHistory.holdingSmallItemsWithFingerAndThumb6To9Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Scribbling with a crayon(12-18 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="scribblingWithACrayon12To18Months"
                                            value={formData.details.developmentHistory.scribblingWithACrayon12To18Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Babbling(4-8 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="babbling4To8Months"
                                            value={formData.details.developmentHistory.babbling4To8Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>First Words(11-12 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="firstWords11To12Months"
                                            value={formData.details.developmentHistory.firstWords11To12Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Two words phrases(18-24 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="twoWordsPhrases18To24Months"
                                            value={formData.details.developmentHistory.twoWordsPhrases18To24Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Sentences(2yrs 6 months-3 years)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="sentences2To3Months"
                                            value={formData.details.developmentHistory.sentences2To3Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Smiles at others(2-4 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="smilesAtOthers3To4Months"
                                            value={formData.details.developmentHistory.smilesAtOthers3To4Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Responds to Name(7-12 Months)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="respondsToName7To12Months"
                                            value={formData.details.developmentHistory.respondsToName7To12Months}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Feeds Self(3-4 Years)</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="feedsSelf3To4Years"
                                            value={formData.details.developmentHistory.feedsSelf3To4Years}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th className={classes.th}>S.No</th>
                                    <th className={classes.th}>Sub Profile Name</th>
                                    <th className={classes.th}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={classes.td}>1</td>
                                    <td className={classes.td}>Cognitive</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="cognitive"
                                            value={formData.details.developmentHistory.cognitive}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>2</td>
                                    <td className={classes.td}>Motor</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="motor"
                                            value={formData.details.developmentHistory.motor}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>3</td>
                                    <td className={classes.td}>Speech And Language</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="speechAndLanguage"
                                            value={formData.details.developmentHistory.speechAndLanguage}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>4</td>
                                    <td className={classes.td}>Social</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="social"
                                            value={formData.details.developmentHistory.social}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>5</td>
                                    <td className={classes.td}>Significant Medical illness</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="significantMedicalIllness"
                                            value={formData.details.developmentHistory.significantMedicalIllness}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>6</td>
                                    <td className={classes.td}>Significant Surgical illness</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="significantSurgicalIllness"
                                            value={formData.details.developmentHistory.significantSurgicalIllness}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>7</td>
                                    <td className={classes.td}>Significant Psycological illness</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="significantPsycologicalIllness"
                                            value={formData.details.developmentHistory.significantPsycologicalIllness}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={classes.td}>8</td>
                                    <td className={classes.td}>Any negative reactions/allergy to medication?</td>
                                    <td className={classes.td}>
                                        <input
                                            type="text"
                                            name="anyNegativeReactions"
                                            value={formData.details.developmentHistory.anyNegativeReactions}
                                            onChange={(e) => handleSectionChange('developmentHistory', e)}
                                            className={classes.textInput}
                                        />
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <label className={classes.requiredlabel}>
                            Class:
                            <select
                                name="section"
                                value={formData.stdCred.section}
                                onChange={handleChange}
                                className={classes.requiredtextInput}
                            >
                                <option value="">Select Class</option>
                                <option value="preprimary">Preprimary</option>
                                <option value="primary1">Primary-I</option>
                                <option value="primary2">Primary-II</option>
                            </select>
                        </label>
                        <label className={classes.requiredlabel}>
                            Year:
                            <select
                                name="year"
                                value={formData.stdCred.year}
                                onChange={handleChange}
                                className={classes.requiredtextInput}
                            >
                                <option value="1">1</option>
                            </select>
                        </label>

                        {/* <button type="submit" className={classes.button} onClick={handleSubmit}>Submit</button> */}
                    </div>
                )}
                <div className={classes.buttonNav}>
                    {activeTab !== 1 ? (
                        <button
                            className={classes.button}
                            type='button'
                            name='back'
                            onClick={(e) => handleButton(e)}
                            style={{ width: '100px', margin: 0, marginBottom: '20px' }}
                        >Back</button>) : (<> <button disabled={true} style={{ border: 'none', backgroundColor: 'White' }}></button></>)}
                    {console.log("activeTab:", activeTab, "endTab:", endTab)}
                    {/* {activeTab === endTab ?
                        (<button type="submit"
                            name='submit'
                            className={classes.button}
                        >
                            Submit
                        </button>
                        ) :
                        (<button
                            className={classes.button}
                            style={{ justifyContent: 'flex-end' }}
                            type='button'
                            name='next'
                            onClick={(e) => handleButton(e)}>
                            {activeTab === endTab - 1 ? "Submit" : "Next"}
                            Next
                        </button>)
                    } */}
                    <button
                        className={classes.button}
                        style={{ justifyContent: 'flex-end' }}
                        type='button'
                        name='next'
                        onClick={(e) => handleButton(e)}>
                        Next
                    </button>
                </div>
            </form >
        </>
    );
}

export default AddStudents;
