import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { JsonToTable } from "react-json-to-table";
import exportFromJSON from 'export-from-json';

const JobApplications = (props) => {
  const data = props.conduct.registeredCandidates; 
  const fileName = 'download';
  const exportType = 'csv';

  const ExportToExcel = () => {  
    exportFromJSON({ data, fileName, exportType })  
  };

  return (
        <Fragment>
          <div className="container">
            <div className="row">
              <div className="col-lg-6"></div>

              <div className="col-lg-6">
                <button type="button" onClick={ExportToExcel}>Export To CSV</button>  
              </div>
            </div>
          </div>

          <br />

          <div className="container">
            <div className="row">
              <div className="col-lg-12"  style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                <JsonToTable json={props.conduct.registeredCandidates} />
              </div>
            </div>
          </div>
        </Fragment>
  );

};

const mapStateToProps = state => ({
  conduct: state.conduct
});

export default connect(mapStateToProps, null)(JobApplications);