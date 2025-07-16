const mongoose = require('mongoose');

const StudentReport = new mongoose.Schema({
    regNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    currYear: {//current year added
        type: String,
        required: true,
        enum: ["1", "2", "3", "passedOut"],
        default: "1"//added
    },
    currTerm: {//Not required can be exculed
        type: String,
        requirde: true,
        enum: ["Entry", "I", "II", "III"],
        default: "Entry"//added
    },
    currSection: {
        type: String,
        required: true,
    },
    classId: {
        type: String,
        required: true
    },
    section: [{
        status: {
            type: String,
            enum: ['pass', 'promoted', 'ongoing'],
            default: "ongoing"
        },
        sec: {
            type: String,
            required: true,
            enum: ['preprimary', 'primary1', 'primary2']
        },
        yearReport: [{
            year: {
                type: String,//changed from Number
                required: true,
                enum: ["1", "2", "3"],
                default: "1"
            },
            termReport: [{
                evaluated: {
                    personal: {
                        type: Boolean,
                        default: false
                    },
                    academic: {
                        type: Boolean,
                        default: false
                    },
                    social: {
                        type: Boolean,
                        default: false
                    },
                    occupational: {
                        type: Boolean,
                        default: false
                    },
                    recreational: {
                        type: Boolean,
                        default: false
                    },
                },
                term: {
                    type: String,//changed from Number
                    required: true,
                    enum: ["Entry", "I", "II", "III"],
                    default: "Entry"
                },
                report: {//Questions
                    personalQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["", "Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    socialQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["", "Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    academicQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["", "Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    occupationalQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["", "Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    recreationalQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["", "A", "B", "C", "D", "E"]
                        }
                    }],
                },
                percent: {//Term Performance
                    personalPercent: {
                        type: Number,
                        default: null
                    },
                    socialPercent: {
                        type: Number,
                        default: null
                    },
                    academicPercent: {
                        type: Number,
                        default: null
                    },
                    occupationalPercent: {
                        type: Number,
                        default: null
                    },
                    recreationalPercent: {
                        type: Number,
                        default: null
                    },
                    mode: {
                        type: String,
                        enum: ["", "A", "B", "C", "D", "E"],
                        default: ""
                    },
                },
                comment: {//Term Comments
                    termComment: {
                        type: String,
                        default: ""
                    },
                    personalComment: {
                        type: String,
                        default: ""
                    },
                    occupationalComment: {
                        type: String,
                        default: ""
                    },
                    recreationalComment: {
                        type: String,
                        default: ""
                    },
                    academicComment: {
                        type: String,
                        default: ""
                    },
                    socialComment: {
                        type: String,
                        default: ""
                    },
                }
            }],
            comment: {//Year Comments
                yearComment: {
                    type: String,
                    default: ""
                },
                yearPersonalComment: {
                    type: String,
                    default: ""
                },
                yearOccupationalComment: {
                    type: String,
                    default: ""
                },
                yearRecreationalComment: {
                    type: String,
                    default: ""
                },
                yearAcademicComment: {
                    type: String,
                    default: ""
                },
                yearSocialComment: {
                    type: String,
                    default: ""
                },
            },
            percent: {//Year Performance
                personalPercent: {
                    type: Number,
                    default: null
                },
                socialPercent: {
                    type: Number,
                    default: null
                },
                academicPercent: {
                    type: Number,
                    default: null
                },
                occupationalPercent: {
                    type: Number,
                    default: null
                },
                recreationalPercent: {
                    type: Number,
                    default: null
                },
                mode: {
                    type: String,
                    enum: ["", "A", "B", "C", "D", "E"],
                    default: ""
                },
                total: {
                    type: Number,
                    default: null
                }
            },
        }]
    }]
});

module.exports = mongoose.model('Student', StudentReport);
