# Gnius Assessment Solution



Gnius Assessment is a free to use Flagship product of Gnius Talent Solution. **Gnius Assessment** which is a hiring platform where you can assess candidates. We hope using this you can grow your team faster and better. Almost HackerEarth

Demo - [Demo Link](assessment.gnius.in)

**For Any Help contact us at contact@gnius.in**

*(Gnius a Product of NetDevGuru Infotech)*

#### <u>Features</u>

1. Create assessments automatically and manually with our huge question library.

2. Coding Platform and Online Judge Platform.

3. Integrated Candidate Referral System. 
   1. Import and Export Candidates. 
   2. Invite Candidates.

4. View detailed reports and in-depth analysis of each candidate’s performance.
   1. Analyze results using graphs.
   2. Exports Results as excel sheet
5. Automatically Send Assessment Link to Candidates.
6. Candidate Feedback Management System
7. User and Permission Management

#### <u>Credit</u>

I will like to thank [@kiranonline](https://github.com/kiranonline) for his wonderful project **[ Online-Examination-System](https://github.com/kiranonline/Online-Examination-System)** . I took this project as a reference since it is a open source project it helped us a lot. **Gnius Assessment** can be said as a modified version of this one.

#### <u>Tech Stack</u>

![Template Image](https://res.cloudinary.com/gniusedu/image/upload/v1635680069/Assessment_kwmqnu.png)



React JS

Node JS

Express JS

Mongo Db

Ant Design

Redux

**AWS**

**Cloudinary**

Heroku

#### <u>Screenshots</u>

Home Screen

![](https://res.cloudinary.com/gniusedu/image/upload/v1635705492/01_ttq1yp.png)

**Dashboard Screen**

![](https://res.cloudinary.com/gniusedu/image/upload/v1635705493/05_bkrogf.png)

**List of Question**

![](https://res.cloudinary.com/gniusedu/image/upload/v1635705493/05_bkrogf.png)



#### <u>Installation Guides</u>

```bash
# Clone the Project
git clone https://github.com/gnius-edu/Gnius-Assessment.git

cd Gnius-Assessment

# Install Node Modules using npm version 10 or above
npm i

# Create a new .env file and change its values
cp .env.example .env

# Fill the Admin Details in the tool.js file inside services folder

# Now run the backend part
npm start

# To Run the Frontend Part
cd frontend

# Install Node Modules using npm version 10 or above
yarn install

# Now run the frontend part
yarn start
```

### Guide to Install Judge0

https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure

#### Note

After you install Judge0 successfully please replace the judge0 details

```js
exports.JudgeApi = '<Enter Judge0 API URL>';

// Exaample - http://<IP ADDRESS OF YOUR SERVER>:2358
```

  

### Subject Default Photo (Optional)

Replace with your own image url inside the subject.js file under models folder 

models > subject.js

```js
status:{
        type: String,
        default: "https://localhost/ink-quill_vvjno3.png"
        // Replace With your own image details
    }
```

