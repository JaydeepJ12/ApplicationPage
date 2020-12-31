import { Button, Card, Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";

export default function OverView(props) {
  const [loaded, setLoaded] = useState(false);

  //create function that just take sthe url and sets a json blob
  const apps = () => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  };

  useEffect(() => {
    apps();
  }, []);

  const handleClick = (props) => {
    props.navigate("/case-select");
  };

  return (
    <div>
      {loaded ? (
        <form>
          <Card>
            <Container maxWidth="sm">
              <div style={{ marginTop: "11px" }}> OverView Works....!!!</div>
              <div
                className="create-button"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleClick(props);
                }}
              >
                <Button className="">+ Create</Button>
              </div>
            </Container>
          </Card>
        </form>
      ) : (
        <Card>
          <Container maxWidth="sm">
            <div className=""> Loading Please Wait....!!!</div>
          </Container>
        </Card>
      )}
    </div>
  );
}
