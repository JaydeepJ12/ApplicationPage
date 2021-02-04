import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
// styles
import useStyles from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader.js";
import CasePreview from "./case-preview.js";

export default function CaseList(props) {
  var classes = useStyles();

  const [caseList, setCaseList] = useState(props.caseListData);
  const [caseLoaded, setCaseLoaded] = useState(props.caseLoaded);
  const [componentLoader, setComponentLoader] = useState(props.componentLoader);
  const [firstCaseId, setFirstCaseId] = useState(props.firstCaseId);
  const [state, setState] = React.useState(0);

  const handleCasePreviewClick = (id, caseData) => {
    if (id > 0) {
      props.handleCasePreviewClick(id, caseData);
    }
  };

  useEffect(() => {
    setCaseList(props.caseListData);
    setCaseLoaded(props.caseLoaded);
    setComponentLoader(props.componentLoader);
    setFirstCaseId(props.firstCaseId);
  }, [
    props.caseListData,
    props.caseLoaded,
    props.componentLoader,
    props.firstCaseId,
  ]);

  return (
    <Box>
      {caseList.length ? (
        <>
          {(componentLoader
            ? Array.from(new Array(caseList.length))
            : caseList
          ).map((caseData, index) => (
            <Box key={index} width="100%">
              {caseData ? (
                <CasePreview
                  handleCasePreviewClick={handleCasePreviewClick}
                  caseId={caseData.caseID}
                  caseData={caseData}
                  caseLoaded={caseLoaded}
                  firstCaseId={firstCaseId}
                ></CasePreview>
              ) : (
                <ComponentLoader type="rect" />
              )}
            </Box>
          ))}
        </>
      ) : (
        <>
          {componentLoader ? (
            <>
              {(componentLoader ? Array.from(new Array(4)) : Array(2)).map(
                (item, index) => (
                  <Box key={index} width="100%" padding={0.5}>
                    {item ? (
                      <img
                        style={{ width: "100%", height: 118 }}
                        alt={item.title}
                        src={item.src}
                      />
                    ) : (
                      <ComponentLoader type="rect" />
                    )}
                  </Box>
                )
              )}
            </>
          ) : (
            <Typography variant="h6" center>
              No Data Found
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
