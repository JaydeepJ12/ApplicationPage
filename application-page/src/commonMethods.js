// import { useDispatch, useSelector } from "react-redux";
// const reducerState = useSelector((state) => state);
export function appNameBy(Id, applicationList) {
  if (applicationList.length) {
    let application = applicationList.find((app) => app.id == Id);
    if (application) {
      return application.name;
    } else {
      return "page not found";
    }
  }
}

export function appIdBy(name, applicationList) {
  name = name.replace(/%20/g, " ");
  if (applicationList.length) {
    let application = applicationList.find((app) => app.name == name);
    if (application) {
      return application.id;
    } else {
      return "page not found";
    }
  }
}
