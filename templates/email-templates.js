const Mailgen = require('mailgen');
const moment = require('moment');

const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
        // Header & footer of e-mails
        name: 'gnius Talent Solution',
        link: '<Website Link>',
        logo: '<Website Logo Link>',
        logoHeight: '200px',
        copyright: 'Copyright © 2021 gnius Talent Solution. All rights reserved.',
    },
});

// Assessment Link
const assessmentLink = (name, link, start, end, duration) => {
    const sendtestlinkemail = {
        body: {
            name: name,
            intro: 'Assessment Link. Please click the button to start the assessment.',
            action: {
                instructions: 'You have been successfully registered for the test. Click on the link below given to take test',
                button: {
                    color: '#33b5e5',
                    text: 'Assessment Link',
                    link: link,
                },
            },
            table: {
                data: [
                    {
                        key: 'Start Time',
                        description: 'Assessment Start Time',
                        date: moment(start).format('MMMM Do YYYY, h:mm:ss a')
                    },
                    {
                        key: 'End Time',
                        description: 'Assessment End Time. After this time, the assessment will stop taking response',
                        date:  moment(end).format('MMMM Do YYYY, h:mm:ss a')
                    }
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        key: '20%',
                        date: '15%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        date: 'right'
                    }
                }
            },
            outro: `Assessment time - ${duration} Mins. `
        },
    };
      
    const sendtestlinkemailTemplate = mailGenerator.generate(sendtestlinkemail);
    return sendtestlinkemailTemplate;
};

module.exports = {
    assessmentLink
};