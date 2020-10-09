import "./styles/index.css";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { useMutation } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Affix, Layout, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  Stripe,
  User,
} from "./sections";
import * as serviceWorker from "./serviceWorker";

const httpLink = new HttpLink({ uri: "/api", credentials: "same-origin" });

const tokenLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("token");

  return {
    headers: {
      ...headers,
      "X-CSRF-TOKEN": token || "",
    },
  };
});

const client = new ApolloClient({
  link: tokenLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const stripePromise = loadStripe(
  process.env.REACT_APP_S_PUBLISHABLE_KEY as string,
);

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching House" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/host">
            <Host viewer={viewer} />
          </Route>
          <Route exact path="/listing/:id">
            <Elements stripe={stripePromise}>
              <Listing viewer={viewer} />
            </Elements>
          </Route>
          <Route exact path="/listings/:location?">
            <Listings />
          </Route>
          <Route exact path="/login">
            <Login setViewer={setViewer} />
          </Route>
          <Route exact path="/stripe">
            <Stripe viewer={viewer} setViewer={setViewer} />
          </Route>
          <Route exact path="/user/:id">
            <User viewer={viewer} setViewer={setViewer} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
