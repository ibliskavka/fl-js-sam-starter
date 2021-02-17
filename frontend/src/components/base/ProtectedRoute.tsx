import React from "react";
import AppContext, { IAppContext } from "../../contexts/AppContext";
import AmplifyService from "../../services/AmplifyService";

interface IProps {
  context: IAppContext;
  [name: string]: any
}
class ProtectedRouteComponent extends React.Component<IProps, {}> {
  render() {
    const Component = this.props.component;

    if (!this.props.context.authenticated) {
      AmplifyService.federatedLogin();
      return null;
    }

    return <Component />;
  }
}

const ProtectedRoute = React.forwardRef((props: any, ref: any) => (
  <AppContext.Consumer>
    {(context) => <ProtectedRouteComponent {...props} context={context} ref={ref} />}
  </AppContext.Consumer>
));
ProtectedRoute.displayName = "ProtectedRoute";
export default ProtectedRoute;