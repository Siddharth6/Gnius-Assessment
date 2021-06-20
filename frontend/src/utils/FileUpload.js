import React, { useState, useContext, Fragment } from 'react';
import { Grid, Button, TextField, LinearProgress } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import axios from "axios";

const FileUpload = (props) => {
    const { uploadTo, identifier, handleInput } = props;

    const [file, setFile] = useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const handleUpload = () => {
        console.log(file);
    };
    
    return (
        <Fragment>
            <Grid container item xs={12} direction="column" className={props.className}>
                <Grid container item xs={12} spacing={0}>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            component="label"
                            style={{ width: "100%", height: "100%" }}
                        >
                            Select File  {props.icon}
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(event) => {
                                    setUploadPercentage(0);
                                    setFile(event.target.files[0]);
                                }}
                            />
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label={props.label}
                            value={file ? file.name || "" : ""}
                            InputProps={{
                            readOnly: true,
                            }}
                            variant="outlined"
                            style={{ width: "100%" }}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ width: "100%", height: "100%" }}
                            onClick={() => handleUpload()}
                            disabled={file ? false : true}
                        >
                            Upload File <CloudUpload />
                        </Button>
                    </Grid>

                </Grid>
                {uploadPercentage !== 0 ? (
                    <Grid item xs={12} style={{ marginTop: "10px" }}>
                    <LinearProgress variant="determinate" value={uploadPercentage} />
                    </Grid>
                ) : null}
                </Grid>
        </Fragment>
    );
};

export default FileUpload;
