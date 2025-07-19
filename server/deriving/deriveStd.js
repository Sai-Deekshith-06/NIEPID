const findQAs = require('./deriveQAs')
const studentJsonGenerate = (data, v1) => {
    let ans = {}
    ans.regNo = data.formData.details.info.regNo
    ans.name = data.formData.details.info.name
    ans.classId = v1
    ans.currYear = 1
    ans.currTerm = "Entry"
    ans.currSection = data.formData.stdCred.section
    let section = {}
    ans.section = [
        {
            sec: data.formData.stdCred.section,
            yearReport: [{
                year: 1,
                termReport: [{
                    term: "Entry",
                    report: findQAs(data.formData.stdCred.section),
                    comment: {
                        termComment: "",
                        personalComment: "",
                        occupationalComment: "",
                        recreationalComment: "",
                        academicComment: "",
                        socialComment: ""
                    },
                    percent: {
                        personalPercent: null,
                        socialPercent: null,
                        academicPercent: null,
                        occupationalPercent: null,
                        recreationalPercent: null,
                        mode: ""
                    }
                }],
                comment: {
                    yearPersonalComment: "",
                    yearOccupationalComment: "",
                    yearRecreationalComment: "",
                    yearAcademicComment: "",
                    yearSocialComment: "",
                    yearComment: ""
                },
                percent: {
                    personalPercent: null,
                    socialPercent: null,
                    academicPercent: null,
                    occupationalPercent: null,
                    recreationalPercent: null,
                    mode: ""
                }
            }]
        }]
    return ans
}
module.exports = studentJsonGenerate