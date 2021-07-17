Given a **formula** below
$$
s = ut + \frac{1}{2}at^{2}
$$
Calculate the value of $s$ when $u = 10\frac{m}{s}$ and $a = 2\frac{m}{s^{2}}$ at $t = 1s$

//////////

<h2><b>Admin Instructions</b></h2>
      <h3>1. All Trainers</h3>
      <h4>   List of existing trainers.</h4>
      <ul>
        <li>Add New - Create new trainer account.</li>
        <li>Action - <br /> <p style={{ marginBottom: '2px' }}><Button size='small' type="primary" shape="circle" icon="edit" /> Edit trainer details.</p><Button size='small' type="primary" shape="circle" icon="delete" /> Delete trainer account.</li>
      </ul>
      <h3>2. All Courses</h3>
      <h4>   List of existing courses.</h4>
      <ul>
        <li>Add New - Create new course </li>
        <li>Action - <br /><Button size='small' type="primary" shape="circle" icon="edit" /> Edit course name.</li>
      </ul>
      <br />
      
      <h2><b>Trainer Instructions</b></h2>
      <h3>1. All Questions</h3>
      <h4>   List of existing questions.</h4>
      <ul>
        <li>Add New - Create new question.</li>
        <li>Action - <br /> <p style={{ marginBottom: '2px' }}><Button size='small' type="primary" shape="circle" icon="info" />  Question details & body.</p><Button size='small' type="primary" shape="circle" icon="delete" /> Delete question.</li>
      </ul>
      <h3>2. All Tests</h3>
      <h4>   List of existing tests</h4>
      <ul>
        <li>Action - <Button size='small' type="primary" shape="circle" icon="info" /> <ul>
          <li>Test Details</li>
          <li>Test Questions</li>
          <li>Trainees - List of Registered Candidates</li>
          <li>Statistics - <ul>
            <li>Download excel sheet of results</li>
            <li>Graphical representation of results</li>
          </ul></li>
        </ul></li>
      </ul>
      <h3>3. New Tests</h3>
      <ul>
        <li>Create new test</li>
        <ol>
          <li>Enter basic test details</li>
          <li>Select Questions</li><ul>
            <li>Questions - Random > Enter number of questions to be selected automatically and click Generate Test Paper. Click Next to proceed.</li>
            <li>Questions - Manually > Select Questions manually . Click Next to proceed.</li>
          </ul>
        </ol>
        <li>Basic test info</li>
        <ul>
          <li>Registration link - The link for Registration of trainee for the test.</li>
          <li>Stop Registration - Click to disable Registration Link.</li>
          <li>Reload - Click to get the list of registered candidates.</li>
          <li>Start Test - Click to begin test.</li>
          <li>End Test - Click to end test.</li>
        </ul>
        <p><b>NOTE-</b>A link for this test has been sent to the email id of registered trainees. Click on the link to take test.</p>
      </ul>


PHP Developer - SDE- 2


Description
We are an IT company and our most famous product is MSG91 which is in core PHP. We are extending our team and looking for developers who are open to work on any language product demands whether it is java, python or php.



Translate application storyboards and use-cases into functional applications
Design, build, and maintain efficient, reusable and reliable codes
Ensure the best possible performance, quality, and responsiveness of the applications
Identify bottlenecks/bugs and devise solutions to these problems
Suggest ideas
Requirements
Min 2-8 years of development experience in core PHP
Hands on with REST API & MySQL
Familiarity with Version Control GIT
Practical knowledge of OOPS Concepts and Design Patterns
Good To Have

Redis, and MongoDB in NoSQL
Familiarity/ experience on Rabbit, AWS & Nginx.
Benefits
In-house product development with a chance to try hands on research and development.
New technology, chance to execute your ideas, Working on future products.
Ample opportunity to learn and grow
Attractive employee benefits and amazing work culture.
GROWTH

Starting with PHP, you can try hands-on python, Java, Linux.
You can join the team for architecture planning, Microservices and try hands-on AWS, GCP.
Also, you can take complete ownership of modules once you are familiar with the product.
you can participate in task planning, & code review


CULTURE



At Walkover, we do what motivates us to do, and more importantly, for everything that we do, we ask ourselves WHY.We don't hire people for work that can be done by machines. We believe in outsourcing; we believe in tools and software; we believe in automation.

The happiness of our team is our priority. No hierarchy; nothing is forced. And, we try to add our bit in making this world better by producing and consuming things in an environmentally sustainable manner.

Information Needed
Please Answer this Questions

How many years of experience do you have ?

How many years of experience do you have in php?

TestPaperModel.aggregate([
  {
      "$lookup": {
          "from": "traineeentermodels",
          "localField": "_id",
          "foreignField": "testid",
          "as": "count"
      }
  }
])
.exec(function(err, docs){
  if (err) throw err;
  res.json({
      status: "success",
      message: "successfully done",
      data: docs
  });
});






// profile picture
router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
    .then(() => {
      res.send({
        message: "Profile image uploaded successfully",
        url: `/host/profile/${filename}`,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Error while uploading",
      });
    });
  }
});


router.post('/', upload.single('file'), (req, res, next) => {
  const {
    file
  } = req;

  if (file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = Date.now() + '-' + file.originalName;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/uploads/${filename}`)
    );

    res.json({
      success: true,
      message: 'File uploaded successfully',
      link: `uploads/${filename}`
    });
  }
});


mimetype: 'application/pdf',