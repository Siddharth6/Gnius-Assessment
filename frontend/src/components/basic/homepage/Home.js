import React, { Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
// import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Col, Row, Icon } from 'antd';

import './home.css';
import logo from '../../../assets/gnius.png';
import Features from './Features';

const data = [
    {
        title: '100 Users',
        description: 'Maximum 100 Users can take asssessments'
    },
    {
        title: 'MCQ / MSQ and Coding Question Library Available',
        description: 'Assess Candidates through MCQ, MSQ, Programming Questions'
    },
    {
        title: 'Remote based hiring using AI and ML',
        description: 'View detailed reports and in-depth analysis of each candidates performance'
    },
    {
        title: 'Other Features',
        description: 'Import and Export Candidates. Invite candidates, Create tests automatically and manually with our huge question library, Support via phone and email and much more.'
    },
];
  

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
                <b>gnius Talent Solution</b>
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        backgroundColor: '#ffe3fe',
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor: '#fdbaf8'
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

const tiers = [
    {
        title: 'MCQ Assessment',
        price: '200',
        description: [
            'Single User can take assessments',
            'Access MCQ/MSQ Questions only',
            'Remote based hiring using AI and ML',
            'View detailed reports and in-depth analysis of each candidates performance',
            'Email and Phone support'
        ],
        buttonText: 'Contact us',
        buttonVariant: 'outlined',
    },
    {
        title: 'Coding & MCQ Assessment',
        subheader: 'Most popular',
        price: '450',
        description: [
            'Single User can take assessments',
            'Access both MCQ/MSQ and programming(CodePlayer) Questions',
            'Remote based hiring using AI and ML',
            'View detailed reports and in-depth analysis of each candidates performance',
            'Email and Phone support'
        ],
        buttonText: 'Contact us',
        buttonVariant: 'contained',
    },
    {
        title: 'Coding Assessment',
        price: '300',
        description: [
            'Single User can take assessments',
            'Access Programming Questions(Codeplayer) only',
            'Remote based hiring using AI and ML',
            'View detailed reports and in-depth analysis of each candidates performance',
            'Email and Phone support'
        ],
        buttonText: 'Contact us',
        buttonVariant: 'outlined',
    },
];

const footers = [
    {
        title: 'Company',
        description: ['Team', 'Contact us', 'Location'],
    },
    {
        title: 'Features',
        description: ['Blog', 'Developer stuff'],
    },
    {
        title: 'Resources',
        description: ['Guide', 'Handbook', 'Knowledge Base'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use', 'Refund Policy'],
    },
];

export default function Pricing() {
  const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        <img src={logo} alt="company logo" className="logo" />
                    </Typography>
                    <Button href="/auth/login" color="primary" variant="outlined" className={classes.link}>
                        <Icon type="lock" /> {'   '}Recruiter Login
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Features
                </Typography>
                
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    An auto proctored assessment system and can be availed by the companies to help them
                    in their end to end recruitment and to select the right candidate based on their skill.
                </Typography>
            </Container>

            <Features />

            {/* Hero unit */}
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Single User Pricing
                </Typography>
                
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    <b>If you are not constantly hiring, then you should check these plans.</b>
                    We've prepared pricing plans for all budgets so you can get started right away.
                    They're great for startups and large organizations
                </Typography>
            </Container>

            {/* End hero unit */}

            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map((tier) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
                            <Card>
                                <CardHeader
                                    title={tier.title}
                                    subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardPricing}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            &#8377;{tier.price}
                                        </Typography>
                                        <Typography variant="h6" color="textSecondary">
                                            /user
                                        </Typography>
                                    </div>
                                    <div className={classes.cardPricing}>
                                        <Typography component="h5" variant="h5" color="textSecondary">
                                           Plan Includes :
                                        </Typography>
                                    </div>
                                    <ul>
                                        {tier.description.map((line) => (
                                            <Typography component="li" variant="subtitle1" align="left" key={line}>
                                                <Icon type="check-circle" /> {'  '}{line}
                                            </Typography>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardActions>
                                    <Button fullWidth variant={tier.buttonVariant} color="primary">
                                        {tier.buttonText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Monthly Pricing
                </Typography>
                
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    <b>If you are constantly hiring, then you should check this plan.</b>
                </Typography>
            </Container>

            <Row type="flex" justify="center">
                <Col span={24}>
                    <Card style={{padding: '0 20px', borderRadius: '10px'}}>
                        <CardHeader
                            title={<h1>Plans starting @ &#8377; 14,000</h1>}
                            titleTypographyProps={{ align: 'center' }}
                            subheaderTypographyProps={{ align: 'center' }}
                            className={classes.cardHeader}
                        />
                        
                        <CardContent>
                            <ul>
                                {data.map((item) => (
                                    <Fragment>
                                        <Typography component="li" variant="subtitle1" align="left" key={item}>
                                            <Icon type="check-circle" /> {'  '}
                                            <b>{item.title}</b>
                                        </Typography>
                                    
                                        <Typography component="li" variant="subtitle1" align="left" key={item}>
                                            {item.description}
                                        </Typography>
                                    </Fragment>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
            
            
            {/* Footer */}
            <Container maxWidth="md" component="footer" className={classes.footer}>
                <Grid container spacing={4} justify="space-evenly">
                    {footers.map((footer) => (
                        <Grid item xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                {footer.title}
                            </Typography>
                            <ul>
                                {footer.description.map((item) => (
                                    <li key={item}>
                                        <Link href="#" variant="subtitle1" color="textSecondary">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
            {/* End footer */}
        </React.Fragment>
    );
};