import { Router, Route } from "@solidjs/router";
import { Suspense } from "solid-js";
import Layout from "~/components/Layout";
import TilHomepage from "~/routes/index";
import TilPage from "~/routes/til/[slug]";
import NotFound from "~/routes/[...404]";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <Layout>
          <Suspense>{props.children}</Suspense>
        </Layout>
      )}
    >
      <Route path="/" component={TilHomepage} />
      <Route path="/til/:slug" component={TilPage} />
      <Route path="*tag" component={NotFound} />
    </Router>
  );
}
