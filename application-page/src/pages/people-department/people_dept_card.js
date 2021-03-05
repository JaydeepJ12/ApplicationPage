import { Avatar, Box, Card, CardHeader } from "@material-ui/core";
import React,{useEffect} from "react";
import { default as useStyles } from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";
import CommonAvatar from "../../components/common/avatar";
function PeopleCard(props) {
  var classes = useStyles();

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };


  return (
    <div className="page" id="people-card">
      {props.peopleData.length ? (
        <>
          {(props.componentLoader
            ? Array.from(new Array(props.peopleData.length))
            : props.peopleData
          ).map((people, index) => (
            <Box key={index} width="100%" classes={classes.CommonHoverColor}>
              {people ? (
                <Card
                  padding={0.5}
                  style={{ cursor: "pointer" }}
                  className={
                    props.peopleData.length > 1
                      ? "card-user-case " + classes.mb_one
                      : "card-user-case"
                  }
                  onClick={() => {
                    if (people.EMPLOYEE_ID !== props.peopleInfo.EMPLOYEE_ID) {
                      props.handlePeopleInfo(people.EMPLOYEE_ID);
                    }
                  }}
                >
                  <CardHeader
                    avatar={  <CommonAvatar name={people.Display_name} sizeClass={classes.avt_small} />}
                    title={people.Display_name}
                    subheader={people.SubDepartment}
                  />
                </Card>
              ) : (
                <>
                  {props.noDataFound ? (
                    <div>No Peoples Found </div>
                  ) : (
                    <ComponentLoader type="rect" />
                  )}
                </>
              )}
            </Box>
          ))}
        </>
      ) : (
        <>
          {props.componentLoader ? (
            <>
              {(props.componentLoader
                ? Array.from(new Array(4))
                : Array(2)
              ).map((item, index) => (
                <Box key={index} width="100%" padding={0.5}>
                  {item ? (
                    <img
                      style={{ width: "100%", height: 100 }}
                      alt={item.title}
                      src={item.src}
                    />
                  ) : (
                    <ComponentLoader type="rect" />
                  )}
                </Box>
              ))}
            </>
          ) : (
            <div>No Peoples Found </div>
          )}
        </>
      )}
    </div>
  );
}
export default PeopleCard;
