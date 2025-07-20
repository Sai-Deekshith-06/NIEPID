function areAllAnswersSelected(answers) {
    let answer = ""
    for (const index of Object.keys(answers)) {
        answer = answers[index]
        if (!answer || answer.length === 0) {
            return { status: false, at: index };
        }
    }
    return { status: true };
}

export default areAllAnswersSelected