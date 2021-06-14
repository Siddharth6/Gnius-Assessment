Given a **formula** below
$$
s = ut + \frac{1}{2}at^{2}
$$
Calculate the value of $s$ when $u = 10\frac{m}{s}$ and $a = 2\frac{m}{s^{2}}$ at $t = 1s$


setGlobals({...globals, verdict: null})
createSubmission(questionId, question)
    .then(data => {
        if (data.error) {
            setQuestion({ ...question, error: data.error, evaluating: false })
        }
    })
    .catch(err => {
        setQuestion({ ...question, evaluating: false, error: "Please Check Your Internet Connection" })
    })