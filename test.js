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

// 2 - Update Question
exports.updateQuestion = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something wrong with form")
        }

        codingQuestion.findById({ _id: req.params.questionId },(err, ques) => {
            if (err || !ques) {
                return ers(res, 404, "Question Not Found")
            }

            if (fields.name)
                ques.name = fields.name;

            ques.save((err, question) => {
                if (err || !question) {
                    return ers(400, "Fail to update");
                }
                return res.json(question);
            });
        });
    });
};

exports.createTestCase = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something Wrong with form");
        }

        if (!file.input || !file.output) {
            return ers(res, 400, "Both I/P and O/P files are required !")
        }

        let testcase = new codingTestCase(fields);
        testcase.question = req.params.questionId;

        testcase.input = `testcases/${testcase.question}/${testcase._id}/input.txt`;
        testcase.output = `testcases/${testcase.question}/${testcase._id}/output.txt`

        if (file.input && file.output) {
            testcase.save((err, testcase) => {
                if (err || !testcase) {
                    // console.log(err);
                    return ers(res, 400, "Failed to save testcase");
                }

                S3.saveFile(file.input.path, testcase.input);
                S3.saveFile(file.output.path, testcase.output);
                
                return res.status(200).json({
                    success: true,
                    message: 'Test Case Added Successfully',
                    testcase: testcase
                });
            });
        } else {
            return ers(res, 400, "Both I/P and O/P files are required !")
        }
    });
};

// ------------------------

Promise.all(getTokens)
                .then(tokens => {
                    setTimeout(() => {
                        Promise.all(tokens.map(token => request(`${JudgeApi}/submissions/${token}`)
                        .then(res => JSON.parse(res))))
                        .then(data => {
                            get_result(data, sourcecode, submission.id)
                        })
                    }, 10000);
                });

                var new_submission = new codingSubmission({
                    testid: testId,
                    lang: language_id,
                    user: traineeId,
                    sourcecode: source_code,
                    submit_time: new Date(),
                    question: que_id,
                    in_queue: true
                });
    
                new_submission.save(function(err, submission) {
                    if (err) console.log(err);
    
                    const getTokens = options.map(opt => request(opt).then(res => res.token));
                    
                    return res.status(200).json({
                        "success": true,
                        "data": getTokens
                    });
    
                    // ...
    
                });


                #include <stdio.h>
                int main() {    
                
                    int number1, number2, sum;
                    int T;
                
                    scanf("%d", &T);
                
                    while(T--){
                        scanf("%d %d", &number1, &number2);
                        sum = number1 + number2;
                        printf("%d",sum);
                    }
                    return 0;
                }
                
                